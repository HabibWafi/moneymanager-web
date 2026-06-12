import { create } from "zustand";
import { Bank, BankTransfer, PendapatanRutin, IncomeExtra, ExpRutin, ExpExtra, Hutang, Investasi, Budget, MonthlySnapshot, RealizationLog, DebtPayment, AppData } from "@/lib/types";
import { createClient } from "@/lib/supabase/client";
import { fetchCryptoPrices, fetchStockPrices } from "@/lib/api";
import { ymk, kym, currentYM, computeMonthTotals, computeNetWorth, calcInvValue, firstDataMonth, isExpRutinActive } from "@/lib/helpers";
import {
  dbToBank, bankToDb,
  dbToBankTransfer, bankTransferToDb,
  dbToPendapatanRutin, pendapatanRutinToDb,
  dbToIncomeExtra, incomeExtraToDb,
  dbToExpRutin, expRutinToDb,
  dbToExpExtra, expExtraToDb,
  dbToHutang, hutangToDb,
  dbToInvestasi, investasiToDb,
  dbToHoliday, holidayToDb,
  dbToBudget, budgetToDb,
  dbToSnapshot, snapshotToDb,
  dbToRealizationLog, realizationLogToDb,
  dbToDebtPayment, debtPaymentToDb,
} from "@/lib/supabase/mappers";

function getSupabase() {
  return createClient();
}

interface AppStore {
  loaded: boolean;
  loadError: string;
  banks: Bank[];
  bankTrf: BankTransfer[];
  pendapatanRutin: PendapatanRutin[];
  incEx: IncomeExtra[];
  expRutin: ExpRutin[];
  expEx: ExpExtra[];
  hutang: Hutang[];
  inv: Investasi[];
  budgets: Budget[];
  snapshots: MonthlySnapshot[];
  realizationLog: RealizationLog[];
  debtPayments: DebtPayment[];
  cuti: Record<string, number[]>;
  selB: string;
  cryptoLoading: boolean;
  cryptoErr: string;
  userId: string | null;

  init: (uid: string) => Promise<void>;
  captureSnapshots: () => Promise<void>;
  autoRealize: () => Promise<void>;
  setSelB: (v: string) => void;

  saveBanks: (banks: Bank[]) => void;
  savePR: (pr: PendapatanRutin[]) => void;
  saveIncEx: (items: IncomeExtra[]) => void;
  addIncEx: (item: IncomeExtra) => void;
  delIncEx: (id: string) => void;
  saveER: (er: ExpRutin[]) => void;
  saveExpEx: (items: ExpExtra[]) => void;
  addExpEx: (item: ExpExtra) => void;
  delExpEx: (id: string) => void;
  saveHutang: (h: Hutang[]) => void;
  addHutang: (h: Hutang) => void;
  updHutang: (id: string, partial: Partial<Hutang>) => void;
  delHutang: (id: string) => void;
  bayarHutang: (hutangId: string, jumlah: number, bankId: string, bk: string) => void;
  undoBayarHutang: (hutangId: string, bk: string) => void;
  saveInv: (items: Investasi[]) => void;
  addInv: (item: Investasi) => void;
  updInv: (id: string, partial: Partial<Investasi>) => void;
  delInv: (id: string) => void;
  saveBudgets: (items: Budget[]) => void;
  addBudget: (item: Budget) => void;
  updBudget: (id: string, partial: Partial<Budget>) => void;
  delBudget: (id: string) => void;
  saveCuti: (c: Record<string, number[]>) => void;

  realizeRoutine: (type: "income" | "expense", sourceId: string, bk: string) => Promise<void>;
  unrealizeRoutine: (type: "income" | "expense", sourceId: string, bk: string) => Promise<void>;
  realizeExtra: (type: "income" | "expense", itemId: string) => Promise<void>;
  maybeRealizeNew: (type: "income" | "expense", item: PendapatanRutin | ExpRutin) => Promise<void>;

  doBankTransfer: (t: BankTransfer) => void;
  loadCryptoPrices: () => Promise<void>;
  loadStockPrices: () => Promise<void>;

  exportData: () => AppData;
  importData: (data: AppData) => Promise<void>;
}

export const useAppStore = create<AppStore>((set, get) => ({
  loaded: false,
  loadError: "",
  banks: [],
  bankTrf: [],
  pendapatanRutin: [],
  incEx: [],
  expRutin: [],
  expEx: [],
  hutang: [],
  inv: [],
  budgets: [],
  snapshots: [],
  realizationLog: [],
  debtPayments: [],
  cuti: {},
  selB: (() => { const { y, m } = currentYM(); return ymk(y, m); })(),
  cryptoLoading: false,
  cryptoErr: "",
  userId: null,

  init: async (uid: string) => {
    set({ loadError: "" });
    const sb = getSupabase();

    try {
      const [
        { data: banks, error: e1 },
        { data: bankTrf, error: e2 },
        { data: incomeRoutine, error: e3 },
        { data: incomeExtra, error: e4 },
        { data: expenseRoutine, error: e5 },
        { data: expenseExtra, error: e6 },
        { data: debts, error: e7 },
        { data: investments, error: e8 },
        { data: holidays, error: e9 },
        { data: budgetsData, error: e10 },
        { data: snapshotsData, error: e11 },
        { data: realizationData, error: e12 },
        { data: debtPaymentsData, error: e13 },
      ] = await Promise.all([
        sb.from("banks").select("*"),
        sb.from("bank_transfers").select("*"),
        sb.from("income_routine").select("*"),
        sb.from("income_extra").select("*"),
        sb.from("expense_routine").select("*"),
        sb.from("expense_extra").select("*"),
        sb.from("debts").select("*"),
        sb.from("investments").select("*"),
        sb.from("holidays").select("*"),
        sb.from("budgets").select("*"),
        sb.from("monthly_snapshots").select("*"),
        sb.from("realization_log").select("*"),
        sb.from("debt_payments").select("*"),
      ]);

      const errors = [e1, e2, e3, e4, e5, e6, e7, e8, e9, e10, e11, e12, e13].filter(Boolean);
      if (errors.length) {
        console.error("Supabase load errors:", errors);
      }

      const cutiMap: Record<string, number[]> = {};
      (holidays ?? []).forEach((h: any) => {
        const hol = dbToHoliday(h);
        cutiMap[hol.bk] = hol.days;
      });

      set({
        banks: (banks ?? []).map(dbToBank),
        bankTrf: (bankTrf ?? []).map(dbToBankTransfer),
        pendapatanRutin: (incomeRoutine ?? []).map(dbToPendapatanRutin),
        incEx: (incomeExtra ?? []).map(dbToIncomeExtra),
        expRutin: (expenseRoutine ?? []).map(dbToExpRutin),
        expEx: (expenseExtra ?? []).map(dbToExpExtra),
        hutang: (debts ?? []).map(dbToHutang),
        inv: (investments ?? []).map(dbToInvestasi),
        budgets: (budgetsData ?? []).map(dbToBudget),
        snapshots: (snapshotsData ?? []).map(dbToSnapshot),
        realizationLog: (realizationData ?? []).map(dbToRealizationLog),
        debtPayments: (debtPaymentsData ?? []).map(dbToDebtPayment),
        cuti: cutiMap,
        userId: uid,
      });

      // Freeze completed months & refresh current-month snapshot (non-blocking).
      get().captureSnapshots();
      // Auto-realize transactions that are due (non-blocking).
      get().autoRealize();
    } catch (err) {
      console.error("Failed to load data:", err);
      set({ userId: uid, loadError: "Gagal memuat data. Periksa koneksi internet Anda." });
    } finally {
      set({ loaded: true });
    }
  },

  captureSnapshots: async () => {
    const s = get();
    const uid = s.userId;
    if (!uid) return;

    const { y: cy, m: cm } = currentYM();
    const curIdx = cy * 12 + cm;
    const firstBk = firstDataMonth(s);
    const { y: fy, m: fm } = kym(firstBk);
    const firstIdx = fy * 12 + fm;

    const existing = new Map(s.snapshots.map((x) => [x.bk, x]));
    const bankTotal = s.banks.reduce((a, b) => a + b.saldo, 0);
    const invTotal = calcInvValue(s.inv);
    const hutangTotal = s.hutang.reduce((a, h) => a + Math.max(h.pokok - h.sudah, 0), 0);
    const curNetWorth = computeNetWorth(s);

    const toUpsert: MonthlySnapshot[] = [];
    let prevNetWorth = 0;

    for (let idx = firstIdx; idx <= curIdx; idx++) {
      const y = Math.floor((idx - 1) / 12);
      const m = ((idx - 1) % 12) + 1;
      const bk = ymk(y, m);
      const isCurrent = idx === curIdx;
      const prior = existing.get(bk);

      if (!isCurrent && prior) {
        // Past month already frozen — keep as-is.
        prevNetWorth = prior.netWorth;
        continue;
      }

      const totals = computeMonthTotals(s, y, m, true);
      const netWorth = isCurrent ? curNetWorth : prevNetWorth + totals.sisa;
      prevNetWorth = netWorth;

      const snap: MonthlySnapshot = {
        id: `${uid}_${bk}`,
        bk,
        income: totals.income,
        expense: totals.expense,
        sisa: totals.sisa,
        netWorth,
        bankTotal: isCurrent ? bankTotal : 0,
        invTotal: isCurrent ? invTotal : 0,
        hutangTotal: isCurrent ? hutangTotal : 0,
      };
      toUpsert.push(snap);
    }

    if (toUpsert.length === 0) return;

    const merged = [...s.snapshots.filter((x) => !toUpsert.some((u) => u.bk === x.bk)), ...toUpsert];
    set({ snapshots: merged });

    const sb = getSupabase();
    await sb.from("monthly_snapshots").upsert(toUpsert.map((x) => snapshotToDb(x, uid)));
  },

  autoRealize: async () => {
    const s = get();
    const uid = s.userId;
    if (!uid) return;

    const today = new Date();
    const todayDay = today.getDate();
    const { y: cy, m: cm } = currentYM();
    const curBk = ymk(cy, cm);
    const sb = getSupabase();
    const existingKeys = new Set(s.realizationLog.map((r) => `${r.sourceType}:${r.sourceId}:${r.bk}`));
    const newLogs: RealizationLog[] = [];
    let banks = [...s.banks];

    // Auto-realize routine income
    for (const pr of s.pendapatanRutin) {
      if (!pr.aktif || pr.realisasi !== "otomatis") continue;
      if (!isExpRutinActive(pr.mulaiY, pr.mulaiM, pr.selesaiY, pr.selesaiM, cy, cm)) continue;
      const key = `income_routine:${pr.id}:${curBk}`;
      if (existingKeys.has(key)) continue;
      if (pr.tglBayar != null && pr.tglBayar > todayDay) continue;

      const amt = pr.jumlah;
      if (pr.bankId) {
        banks = banks.map((b) => b.id === pr.bankId ? { ...b, saldo: b.saldo + amt } : b);
      }
      const log: RealizationLog = { id: `${uid}_ir_${pr.id}_${curBk}`, sourceType: "income_routine", sourceId: pr.id, bk: curBk, jumlah: amt, bankId: pr.bankId };
      newLogs.push(log);
      existingKeys.add(key);
    }

    // Auto-realize routine expenses
    for (const er of s.expRutin) {
      if (er.realisasi !== "otomatis") continue;
      if (!isExpRutinActive(er.mulaiY, er.mulaiM, er.selesaiY, er.selesaiM, cy, cm)) continue;
      const key = `expense_routine:${er.id}:${curBk}`;
      if (existingKeys.has(key)) continue;
      if (er.tglBayar != null && er.tglBayar > todayDay) continue;

      const erAmt = er.jumlah;
      if (er.bankId) {
        banks = banks.map((b) => b.id === er.bankId ? { ...b, saldo: b.saldo - erAmt } : b);
      }
      const log: RealizationLog = { id: `${uid}_er_${er.id}_${curBk}`, sourceType: "expense_routine", sourceId: er.id, bk: curBk, jumlah: erAmt, bankId: er.bankId };
      newLogs.push(log);
      existingKeys.add(key);
    }

    // Auto-realize extra income with status "belum" and realisasi "otomatis"
    let incExUpdated = [...s.incEx];
    for (let i = 0; i < incExUpdated.length; i++) {
      const x = incExUpdated[i];
      if (x.status !== "belum" || x.realisasi !== "otomatis") continue;
      const shouldRealize = x.tgl ? x.tgl <= today.toISOString().slice(0, 10) : x.bk <= curBk;
      if (!shouldRealize) continue;

      incExUpdated[i] = { ...x, status: "terjadi" };
      if (x.sumber) {
        banks = banks.map((b) => b.id === x.sumber ? { ...b, saldo: b.saldo + x.jumlah } : b);
      }
      await sb.from("income_extra").update({ status: "terjadi" }).eq("id", x.id);
    }

    // Auto-realize extra expenses with status "belum" and realisasi "otomatis"
    let expExUpdated = [...s.expEx];
    for (let i = 0; i < expExUpdated.length; i++) {
      const x = expExUpdated[i];
      if (x.status !== "belum" || x.realisasi !== "otomatis") continue;
      const shouldRealize = x.tgl ? x.tgl <= today.toISOString().slice(0, 10) : x.bk <= curBk;
      if (!shouldRealize) continue;

      expExUpdated[i] = { ...x, status: "terjadi" };
      if (x.sumber) {
        banks = banks.map((b) => b.id === x.sumber ? { ...b, saldo: b.saldo - x.jumlah } : b);
      }
      await sb.from("expense_extra").update({ status: "terjadi" }).eq("id", x.id);
    }

    if (newLogs.length > 0 || incExUpdated !== s.incEx || expExUpdated !== s.expEx) {
      const allLogs = [...s.realizationLog, ...newLogs];
      set({ realizationLog: allLogs, banks, incEx: incExUpdated, expEx: expExUpdated });

      if (newLogs.length > 0) {
        await sb.from("realization_log").upsert(newLogs.map((r) => realizationLogToDb(r, uid)));
      }
      // Update bank saldos
      for (const b of banks) {
        const orig = s.banks.find((ob) => ob.id === b.id);
        if (orig && orig.saldo !== b.saldo) {
          await sb.from("banks").update({ saldo: b.saldo }).eq("id", b.id);
        }
      }
    }
  },

  setSelB: (v) => set({ selB: v }),

  saveBanks: async (banks) => {
    set({ banks });
    const uid = get().userId;
    if (!uid) return;
    const sb = getSupabase();
    const existing = get().banks;
    const newIds = new Set(banks.map((b) => b.id));
    const deletedIds = existing.filter((b) => !newIds.has(b.id)).map((b) => b.id);
    if (deletedIds.length) {
      await sb.from("banks").delete().in("id", deletedIds);
    }
    if (banks.length) {
      await sb.from("banks").upsert(banks.map((b) => bankToDb(b, uid)));
    }
  },

  savePR: async (pr) => {
    set({ pendapatanRutin: pr });
    const uid = get().userId;
    if (!uid) return;
    const sb = getSupabase();
    if (pr.length) {
      await sb.from("income_routine").upsert(pr.map((p) => pendapatanRutinToDb(p, uid)));
    }
  },

  saveIncEx: async (items) => {
    set({ incEx: items });
  },

  addIncEx: async (item) => {
    set({ incEx: [...get().incEx, item] });
    const uid = get().userId;
    if (!uid) return;
    const sb = getSupabase();
    await sb.from("income_extra").insert(incomeExtraToDb(item, uid));
  },

  delIncEx: async (id) => {
    set({ incEx: get().incEx.filter((x) => x.id !== id) });
    const sb = getSupabase();
    await sb.from("income_extra").delete().eq("id", id);
  },

  saveER: async (er) => {
    set({ expRutin: er });
    const uid = get().userId;
    if (!uid) return;
    const sb = getSupabase();
    if (er.length) {
      await sb.from("expense_routine").upsert(er.map((e) => expRutinToDb(e, uid)));
    }
  },

  saveExpEx: async (items) => {
    set({ expEx: items });
  },

  addExpEx: async (item) => {
    set({ expEx: [...get().expEx, item] });
    const uid = get().userId;
    if (!uid) return;
    const sb = getSupabase();
    await sb.from("expense_extra").insert(expExtraToDb(item, uid));
  },

  delExpEx: async (id) => {
    set({ expEx: get().expEx.filter((x) => x.id !== id) });
    const sb = getSupabase();
    await sb.from("expense_extra").delete().eq("id", id);
  },

  saveHutang: async (h) => {
    set({ hutang: h });
    const uid = get().userId;
    if (!uid) return;
    const sb = getSupabase();
    for (const item of h) {
      await sb.from("debts").upsert(hutangToDb(item, uid));
    }
  },

  addHutang: async (h) => {
    set({ hutang: [...get().hutang, h] });
    const uid = get().userId;
    if (!uid) return;
    const sb = getSupabase();
    await sb.from("debts").insert(hutangToDb(h, uid));
  },

  updHutang: async (id, partial) => {
    const items = get().hutang.map((x) => (x.id === id ? { ...x, ...partial } : x));
    set({ hutang: items });
    const uid = get().userId;
    if (!uid) return;
    const sb = getSupabase();
    const updated = items.find((x) => x.id === id);
    if (updated) {
      await sb.from("debts").upsert(hutangToDb(updated, uid));
    }
  },

  delHutang: async (id) => {
    set({ hutang: get().hutang.filter((x) => x.id !== id) });
    const sb = getSupabase();
    await sb.from("debts").delete().eq("id", id);
  },

  bayarHutang: async (hutangId, jumlah, bankId, bk) => {
    const s = get();
    const uid = s.userId;

    const hutang = s.hutang.map((h) =>
      h.id === hutangId ? { ...h, sudah: h.sudah + jumlah } : h
    );
    const banks = s.banks.map((b) =>
      b.id === bankId ? { ...b, saldo: b.saldo - jumlah } : b
    );

    const dp: DebtPayment = {
      id: `${uid}_dp_${hutangId}_${bk}`,
      hutangId,
      bk,
      jumlah,
      bankId,
    };

    set({ hutang, banks, debtPayments: [...s.debtPayments, dp] });

    if (!uid) return;
    const sb = getSupabase();
    const updatedH = hutang.find((h) => h.id === hutangId);
    if (updatedH) {
      await sb.from("debts").update({ sudah: updatedH.sudah }).eq("id", hutangId);
    }
    const updatedB = banks.find((b) => b.id === bankId);
    if (updatedB) {
      await sb.from("banks").update({ saldo: updatedB.saldo }).eq("id", bankId);
    }
    await sb.from("debt_payments").upsert(debtPaymentToDb(dp, uid));
  },

  undoBayarHutang: async (hutangId, bk) => {
    const s = get();
    const uid = s.userId;

    const dp = s.debtPayments.find((d) => d.hutangId === hutangId && d.bk === bk);
    if (!dp) return;

    const hutang = s.hutang.map((h) =>
      h.id === hutangId ? { ...h, sudah: h.sudah - dp.jumlah } : h
    );
    const banks = s.banks.map((b) =>
      b.id === dp.bankId ? { ...b, saldo: b.saldo + dp.jumlah } : b
    );

    set({
      hutang,
      banks,
      debtPayments: s.debtPayments.filter((d) => d.id !== dp.id),
    });

    if (!uid) return;
    const sb = getSupabase();
    await sb.from("debt_payments").delete().eq("id", dp.id);
    const updatedH = hutang.find((h) => h.id === hutangId);
    if (updatedH) {
      await sb.from("debts").update({ sudah: updatedH.sudah }).eq("id", hutangId);
    }
    const updatedB = banks.find((b) => b.id === dp.bankId);
    if (updatedB) {
      await sb.from("banks").update({ saldo: updatedB.saldo }).eq("id", dp.bankId);
    }
  },

  saveInv: async (items) => {
    set({ inv: items });
    const uid = get().userId;
    if (!uid) return;
    const sb = getSupabase();
    if (items.length) {
      await sb.from("investments").upsert(items.map((item) => investasiToDb(item, uid)));
    }
  },

  addInv: async (item) => {
    set({ inv: [...get().inv, item] });
    const uid = get().userId;
    if (!uid) return;
    const sb = getSupabase();
    await sb.from("investments").insert(investasiToDb(item, uid));
  },

  updInv: async (id, partial) => {
    const items = get().inv.map((x) => (x.id === id ? { ...x, ...partial } : x));
    set({ inv: items });
    const uid = get().userId;
    if (!uid) return;
    const sb = getSupabase();
    const updated = items.find((x) => x.id === id);
    if (updated) {
      await sb.from("investments").upsert(investasiToDb(updated, uid));
    }
  },

  delInv: async (id) => {
    set({ inv: get().inv.filter((x) => x.id !== id) });
    const sb = getSupabase();
    await sb.from("investments").delete().eq("id", id);
  },

  saveBudgets: async (items) => {
    set({ budgets: items });
    const uid = get().userId;
    if (!uid) return;
    const sb = getSupabase();
    if (items.length) {
      await sb.from("budgets").upsert(items.map((b) => budgetToDb(b, uid)));
    }
  },

  addBudget: async (item) => {
    set({ budgets: [...get().budgets, item] });
    const uid = get().userId;
    if (!uid) return;
    const sb = getSupabase();
    await sb.from("budgets").insert(budgetToDb(item, uid));
  },

  updBudget: async (id, partial) => {
    const items = get().budgets.map((x) => (x.id === id ? { ...x, ...partial } : x));
    set({ budgets: items });
    const uid = get().userId;
    if (!uid) return;
    const sb = getSupabase();
    const updated = items.find((x) => x.id === id);
    if (updated) {
      await sb.from("budgets").upsert(budgetToDb(updated, uid));
    }
  },

  delBudget: async (id) => {
    set({ budgets: get().budgets.filter((x) => x.id !== id) });
    const sb = getSupabase();
    await sb.from("budgets").delete().eq("id", id);
  },

  saveCuti: async (c) => {
    set({ cuti: c });
    const uid = get().userId;
    if (!uid) return;
    const sb = getSupabase();
    for (const [bk, days] of Object.entries(c)) {
      await sb.from("holidays").upsert(holidayToDb(bk, days, uid), { onConflict: "user_id,bk" });
    }
  },

  realizeRoutine: async (type, sourceId, bk) => {
    const s = get();
    const uid = s.userId;
    if (!uid) return;

    const isIncome = type === "income";
    const item = isIncome
      ? s.pendapatanRutin.find((p) => p.id === sourceId)
      : s.expRutin.find((e) => e.id === sourceId);
    if (!item) return;

    const bankId = item.bankId;
    const amt = item.jumlah;
    let banks = s.banks;
    if (bankId) {
      banks = banks.map((b) =>
        b.id === bankId ? { ...b, saldo: b.saldo + (isIncome ? amt : -amt) } : b
      );
    }

    const log: RealizationLog = {
      id: `${uid}_${isIncome ? "ir" : "er"}_${sourceId}_${bk}`,
      sourceType: isIncome ? "income_routine" : "expense_routine",
      sourceId,
      bk,
      jumlah: amt,
      bankId,
    };

    set({ realizationLog: [...s.realizationLog, log], banks });

    const sb = getSupabase();
    await sb.from("realization_log").upsert(realizationLogToDb(log, uid));
    if (bankId) {
      const updatedBank = banks.find((b) => b.id === bankId);
      if (updatedBank) {
        await sb.from("banks").update({ saldo: updatedBank.saldo }).eq("id", bankId);
      }
    }
  },

  unrealizeRoutine: async (type, sourceId, bk) => {
    const s = get();
    const uid = s.userId;
    if (!uid) return;

    const isIncome = type === "income";
    const sourceType = isIncome ? "income_routine" : "expense_routine";
    const log = s.realizationLog.find((r) => r.sourceType === sourceType && r.sourceId === sourceId && r.bk === bk);
    if (!log) return;

    let banks = s.banks;
    if (log.bankId) {
      banks = banks.map((b) =>
        b.id === log.bankId ? { ...b, saldo: b.saldo + (isIncome ? -log.jumlah : log.jumlah) } : b
      );
    }

    set({
      realizationLog: s.realizationLog.filter((r) => r.id !== log.id),
      banks,
    });

    const sb = getSupabase();
    await sb.from("realization_log").delete().eq("id", log.id);
    if (log.bankId) {
      const updatedBank = banks.find((b) => b.id === log.bankId);
      if (updatedBank) {
        await sb.from("banks").update({ saldo: updatedBank.saldo }).eq("id", log.bankId);
      }
    }
  },

  realizeExtra: async (type, itemId) => {
    const s = get();
    const uid = s.userId;
    if (!uid) return;
    const sb = getSupabase();

    if (type === "income") {
      const item = s.incEx.find((x) => x.id === itemId);
      if (!item || item.status === "terjadi") return;

      const updated = { ...item, status: "terjadi" as const };
      let banks = s.banks;
      if (item.sumber) {
        banks = banks.map((b) => b.id === item.sumber ? { ...b, saldo: b.saldo + item.jumlah } : b);
      }
      set({ incEx: s.incEx.map((x) => x.id === itemId ? updated : x), banks });
      await sb.from("income_extra").update({ status: "terjadi" }).eq("id", itemId);
      if (item.sumber) {
        const updatedBank = banks.find((b) => b.id === item.sumber);
        if (updatedBank) await sb.from("banks").update({ saldo: updatedBank.saldo }).eq("id", item.sumber);
      }
    } else {
      const item = s.expEx.find((x) => x.id === itemId);
      if (!item || item.status === "terjadi") return;

      const updated = { ...item, status: "terjadi" as const };
      let banks = s.banks;
      if (item.sumber) {
        banks = banks.map((b) => b.id === item.sumber ? { ...b, saldo: b.saldo - item.jumlah } : b);
      }
      set({ expEx: s.expEx.map((x) => x.id === itemId ? updated : x), banks });
      await sb.from("expense_extra").update({ status: "terjadi" }).eq("id", itemId);
      if (item.sumber) {
        const updatedBank = banks.find((b) => b.id === item.sumber);
        if (updatedBank) await sb.from("banks").update({ saldo: updatedBank.saldo }).eq("id", item.sumber);
      }
    }
  },

  maybeRealizeNew: async (type, item) => {
    if (item.realisasi !== "otomatis") return;
    const { y: cy, m: cm } = currentYM();
    if (!isExpRutinActive(item.mulaiY, item.mulaiM, (item as any).selesaiY, (item as any).selesaiM, cy, cm)) return;
    const today = new Date().getDate();
    if (item.tglBayar != null && item.tglBayar > today) return;

    const s = get();
    const curBk = ymk(cy, cm);
    const sourceType = type === "income" ? "income_routine" : "expense_routine";
    const alreadyRealized = s.realizationLog.some((r) => r.sourceType === sourceType && r.sourceId === item.id && r.bk === curBk);
    if (alreadyRealized) return;

    await get().realizeRoutine(type, item.id, curBk);
  },

  doBankTransfer: async (t) => {
    const banks = get().banks.map((b) => {
      if (b.id === t.dari) return { ...b, saldo: b.saldo - t.jumlah };
      if (b.id === t.ke) return { ...b, saldo: b.saldo + t.jumlah };
      return b;
    });
    const bankTrf = [...get().bankTrf, t];
    set({ banks, bankTrf });

    const uid = get().userId;
    if (!uid) return;
    const sb = getSupabase();
    await sb.from("bank_transfers").insert(bankTransferToDb(t, uid));
    const dari = banks.find((b) => b.id === t.dari);
    const ke = banks.find((b) => b.id === t.ke);
    if (dari) await sb.from("banks").update({ saldo: dari.saldo }).eq("id", dari.id);
    if (ke) await sb.from("banks").update({ saldo: ke.saldo }).eq("id", ke.id);
  },

  loadCryptoPrices: async () => {
    set({ cryptoLoading: true, cryptoErr: "" });
    try {
      const invs = get().inv.filter((x) => x.tipe === "kripto" && x.coinId);
      const ids = [...new Set(invs.map((x) => x.coinId!))];
      if (ids.length === 0) {
        set({ cryptoLoading: false });
        return;
      }
      const prices = await fetchCryptoPrices(ids);
      const updatedInv = get().inv.map((x) => {
        if (x.tipe === "kripto" && x.coinId && prices[x.coinId]) {
          const cur = x.currency || "IDR";
          const price = cur === "USD" ? prices[x.coinId].usd : prices[x.coinId].idr;
          return { ...x, hargaSkrg: price };
        }
        return x;
      });
      set({ inv: updatedInv, cryptoLoading: false });

      const uid = get().userId;
      if (!uid) return;
      const sb = getSupabase();
      for (const inv of updatedInv) {
        if (inv.tipe === "kripto" && inv.coinId && prices[inv.coinId]) {
          await sb.from("investments").update({ harga_skrg: inv.hargaSkrg }).eq("id", inv.id);
        }
      }
    } catch {
      set({ cryptoLoading: false, cryptoErr: "Failed to load crypto prices" });
    }
  },

  loadStockPrices: async () => {
    try {
      const stockInvs = get().inv.filter((x) => x.tipe === "saham" && x.kode);
      if (stockInvs.length === 0) return;

      const symbols = [...new Set(stockInvs.map((x) => {
        const cur = x.currency || "IDR";
        return cur === "IDR" ? `${x.kode}.JK` : x.kode!;
      }))];

      const prices = await fetchStockPrices(symbols);
      const updatedInv = get().inv.map((x) => {
        if (x.tipe === "saham" && x.kode) {
          const cur = x.currency || "IDR";
          const sym = cur === "IDR" ? `${x.kode}.JK` : x.kode;
          const p = prices[sym];
          if (p) {
            const price = cur === "USD" ? p.usd : p.idr;
            if (price != null) return { ...x, hargaSkrg: price };
          }
        }
        return x;
      });
      set({ inv: updatedInv });

      const uid = get().userId;
      if (!uid) return;
      const sb = getSupabase();
      for (const inv of updatedInv) {
        if (inv.tipe === "saham" && inv.kode) {
          const cur = inv.currency || "IDR";
          const sym = cur === "IDR" ? `${inv.kode}.JK` : inv.kode;
          if (prices[sym]) {
            await sb.from("investments").update({ harga_skrg: inv.hargaSkrg }).eq("id", inv.id);
          }
        }
      }
    } catch {
      // silently fail for stocks
    }
  },

  exportData: () => {
    const s = get();
    return {
      banks: s.banks,
      bankTrf: s.bankTrf,
      pendapatanRutin: s.pendapatanRutin,
      incEx: s.incEx,
      expRutin: s.expRutin,
      expEx: s.expEx,
      hutang: s.hutang,
      inv: s.inv,
      budgets: s.budgets,
      snapshots: s.snapshots,
      realizationLog: s.realizationLog,
      debtPayments: s.debtPayments,
      cuti: s.cuti,
    };
  },

  importData: async (data) => {
    set({ ...data });
    const uid = get().userId;
    if (!uid) return;
    const sb = getSupabase();

    // Clear existing data first
    await Promise.all([
      sb.from("banks").delete().neq("id", ""),
      sb.from("bank_transfers").delete().neq("id", ""),
      sb.from("income_routine").delete().neq("id", ""),
      sb.from("income_extra").delete().neq("id", ""),
      sb.from("expense_routine").delete().neq("id", ""),
      sb.from("expense_extra").delete().neq("id", ""),
      sb.from("debts").delete().neq("id", ""),
      sb.from("investments").delete().neq("id", ""),
      sb.from("budgets").delete().neq("id", ""),
      sb.from("monthly_snapshots").delete().neq("id", ""),
      sb.from("holidays").delete().neq("id", "0"),
      sb.from("realization_log").delete().neq("id", ""),
      sb.from("debt_payments").delete().neq("id", ""),
    ]);

    // Insert all data
    if (data.banks.length) await sb.from("banks").insert(data.banks.map((b) => bankToDb(b, uid)));
    if (data.bankTrf.length) await sb.from("bank_transfers").insert(data.bankTrf.map((t) => bankTransferToDb(t, uid)));
    if (data.pendapatanRutin.length) await sb.from("income_routine").insert(data.pendapatanRutin.map((p) => pendapatanRutinToDb(p, uid)));
    if (data.incEx.length) await sb.from("income_extra").insert(data.incEx.map((x) => incomeExtraToDb(x, uid)));
    if (data.expRutin.length) await sb.from("expense_routine").insert(data.expRutin.map((e) => expRutinToDb(e, uid)));
    if (data.expEx.length) await sb.from("expense_extra").insert(data.expEx.map((x) => expExtraToDb(x, uid)));
    if (data.hutang.length) await sb.from("debts").insert(data.hutang.map((h) => hutangToDb(h, uid)));
    if (data.inv.length) await sb.from("investments").insert(data.inv.map((i) => investasiToDb(i, uid)));
    if (data.budgets?.length) await sb.from("budgets").insert(data.budgets.map((b) => budgetToDb(b, uid)));
    if (data.snapshots?.length) await sb.from("monthly_snapshots").insert(data.snapshots.map((x) => snapshotToDb(x, uid)));
    if (data.realizationLog?.length) await sb.from("realization_log").insert(data.realizationLog.map((r) => realizationLogToDb(r, uid)));
    if (data.debtPayments?.length) await sb.from("debt_payments").insert(data.debtPayments.map((d) => debtPaymentToDb(d, uid)));

    for (const [bk, days] of Object.entries(data.cuti)) {
      await sb.from("holidays").upsert(holidayToDb(bk, days, uid), { onConflict: "user_id,bk" });
    }
  },
}));
