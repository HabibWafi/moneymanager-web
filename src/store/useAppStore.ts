import { create } from "zustand";
import { Bank, BankTransfer, PendapatanRutin, IncomeExtra, ExpRutin, ExpExtra, Hutang, Investasi, AppData } from "@/lib/types";
import { loadAllData, saveField, saveAllData } from "@/lib/storage";
import { fetchCryptoPrices } from "@/lib/api";
import { ymk, currentYM } from "@/lib/helpers";

interface AppStore {
  loaded: boolean;
  banks: Bank[];
  bankTrf: BankTransfer[];
  pendapatanRutin: PendapatanRutin[];
  incEx: IncomeExtra[];
  expRutin: ExpRutin[];
  expEx: ExpExtra[];
  hutang: Hutang[];
  inv: Investasi[];
  cuti: Record<string, number[]>;
  cryptoCache: Record<string, { price: number; ts: number }>;
  selB: string;
  cryptoLoading: boolean;
  cryptoErr: string;

  init: () => Promise<void>;
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
  delHutang: (id: string) => void;
  saveInv: (items: Investasi[]) => void;
  addInv: (item: Investasi) => void;
  updInv: (id: string, partial: Partial<Investasi>) => void;
  delInv: (id: string) => void;
  saveCuti: (c: Record<string, number[]>) => void;

  doBankTransfer: (t: BankTransfer) => void;
  loadCryptoPrices: () => Promise<void>;

  exportData: () => AppData;
  importData: (data: AppData) => void;
}

export const useAppStore = create<AppStore>((set, get) => ({
  loaded: false,
  banks: [],
  bankTrf: [],
  pendapatanRutin: [],
  incEx: [],
  expRutin: [],
  expEx: [],
  hutang: [],
  inv: [],
  cuti: {},
  cryptoCache: {},
  selB: (() => { const { y, m } = currentYM(); return ymk(y, m); })(),
  cryptoLoading: false,
  cryptoErr: "",

  init: async () => {
    const data = await loadAllData();
    set({ ...data, loaded: true });
  },

  setSelB: (v) => set({ selB: v }),

  saveBanks: (banks) => {
    set({ banks });
    saveField("banks", banks);
  },

  savePR: (pr) => {
    set({ pendapatanRutin: pr });
    saveField("pendapatanRutin", pr);
  },

  saveIncEx: (items) => {
    set({ incEx: items });
    saveField("incEx", items);
  },
  addIncEx: (item) => {
    const items = [...get().incEx, item];
    set({ incEx: items });
    saveField("incEx", items);
  },
  delIncEx: (id) => {
    const items = get().incEx.filter((x) => x.id !== id);
    set({ incEx: items });
    saveField("incEx", items);
  },

  saveER: (er) => {
    set({ expRutin: er });
    saveField("expRutin", er);
  },

  saveExpEx: (items) => {
    set({ expEx: items });
    saveField("expEx", items);
  },
  addExpEx: (item) => {
    const items = [...get().expEx, item];
    set({ expEx: items });
    saveField("expEx", items);
  },
  delExpEx: (id) => {
    const items = get().expEx.filter((x) => x.id !== id);
    set({ expEx: items });
    saveField("expEx", items);
  },

  saveHutang: (h) => {
    set({ hutang: h });
    saveField("hutang", h);
  },
  addHutang: (h) => {
    const items = [...get().hutang, h];
    set({ hutang: items });
    saveField("hutang", items);
  },
  delHutang: (id) => {
    const items = get().hutang.filter((x) => x.id !== id);
    set({ hutang: items });
    saveField("hutang", items);
  },

  saveInv: (items) => {
    set({ inv: items });
    saveField("inv", items);
  },
  addInv: (item) => {
    const items = [...get().inv, item];
    set({ inv: items });
    saveField("inv", items);
  },
  updInv: (id, partial) => {
    const items = get().inv.map((x) => (x.id === id ? { ...x, ...partial } : x));
    set({ inv: items });
    saveField("inv", items);
  },
  delInv: (id) => {
    const items = get().inv.filter((x) => x.id !== id);
    set({ inv: items });
    saveField("inv", items);
  },

  saveCuti: (c) => {
    set({ cuti: c });
    saveField("cuti", c);
  },

  doBankTransfer: (t) => {
    const banks = get().banks.map((b) => {
      if (b.id === t.dari) return { ...b, saldo: b.saldo - t.jumlah };
      if (b.id === t.ke) return { ...b, saldo: b.saldo + t.jumlah };
      return b;
    });
    const bankTrf = [...get().bankTrf, t];
    set({ banks, bankTrf });
    saveField("banks", banks);
    saveField("bankTrf", bankTrf);
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
      const cache: Record<string, { price: number; ts: number }> = {};
      const now = Date.now();
      for (const [id, price] of Object.entries(prices)) {
        cache[id] = { price, ts: now };
      }
      const updatedInv = get().inv.map((x) => {
        if (x.tipe === "kripto" && x.coinId && cache[x.coinId]) {
          return { ...x, hargaSkrg: cache[x.coinId].price };
        }
        return x;
      });
      set({ cryptoCache: { ...get().cryptoCache, ...cache }, inv: updatedInv, cryptoLoading: false });
      saveField("cryptoCache", { ...get().cryptoCache, ...cache });
      saveField("inv", updatedInv);
    } catch {
      set({ cryptoLoading: false, cryptoErr: "Gagal memuat harga kripto" });
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
      cuti: s.cuti,
      cryptoCache: s.cryptoCache,
    };
  },

  importData: (data) => {
    set({ ...data });
    saveAllData(data);
  },
}));
