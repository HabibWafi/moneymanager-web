import type { Bank, Investasi, Hutang, PendapatanRutin, IncomeExtra, ExpRutin, ExpExtra, MonthlySnapshot } from "@/lib/types";

export function fmt(n: number, currency: "IDR" | "USD" = "IDR"): string {
  if (currency === "USD") return fmtUsd(n);
  return "Rp " + n.toLocaleString("id-ID", { maximumFractionDigits: 2 });
}

export function fmtUsd(n: number): string {
  return "$" + n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export function fmtS(n: number, currency: "IDR" | "USD" = "IDR"): string {
  const prefix = currency === "USD" ? "$" : "Rp ";
  if (Math.abs(n) >= 1e12) return prefix + (n / 1e12).toFixed(1) + "T";
  if (Math.abs(n) >= 1e9) return prefix + (n / 1e9).toFixed(1) + "B";
  if (Math.abs(n) >= 1e6) return prefix + (n / 1e6).toFixed(1) + "M";
  if (Math.abs(n) >= 1e3) return prefix + (n / 1e3).toFixed(0) + "K";
  return prefix + n.toString();
}

export function gc(i: number): string {
  const colors = [
    "#4F46E5", "#7C3AED", "#2563EB", "#0891B2", "#059669",
    "#D97706", "#DC2626", "#DB2777", "#4338CA", "#0D9488",
    "#6366F1", "#8B5CF6", "#3B82F6", "#06B6D4", "#10B981",
  ];
  return colors[i % colors.length];
}

export function ymk(y: number, m: number): string {
  return `${y}-${String(m).padStart(2, "0")}`;
}

export function kym(k: string): { y: number; m: number } {
  const [y, m] = k.split("-").map(Number);
  return { y, m };
}

export function mOpts(count = 12): { label: string; value: string }[] {
  const now = new Date();
  const opts = [];
  for (let i = 0; i < count; i++) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const y = d.getFullYear();
    const m = d.getMonth() + 1;
    const label = d.toLocaleDateString("en-US", { month: "long", year: "numeric" });
    opts.push({ label, value: ymk(y, m) });
  }
  return opts;
}

export function ghk(y: number, m: number, cuti: Record<string, number[]>): number {
  const daysInMonth = new Date(y, m, 0).getDate();
  let hk = 0;
  for (let d = 1; d <= daysInMonth; d++) {
    const day = new Date(y, m - 1, d).getDay();
    if (day !== 0 && day !== 6) hk++;
  }
  const cutiKey = ymk(y, m);
  const cutiDays = cuti[cutiKey] || [];
  return hk - cutiDays.length;
}

export function currentYM(): { y: number; m: number } {
  const now = new Date();
  return { y: now.getFullYear(), m: now.getMonth() + 1 };
}

export function isExpRutinActive(
  mulaiY: number, mulaiM: number,
  selesaiY: number | undefined, selesaiM: number | undefined,
  y: number, m: number
): boolean {
  const start = mulaiY * 12 + mulaiM;
  const cur = y * 12 + m;
  if (cur < start) return false;
  if (selesaiY && selesaiM) {
    const end = selesaiY * 12 + selesaiM;
    if (cur > end) return false;
  }
  return true;
}

export function pctColor(pct: number): string {
  if (pct >= 90) return "bg-red-500";
  if (pct >= 70) return "bg-amber-500";
  return "bg-indigo-500";
}

// ---------------------------------------------------------------------------
// Finance computations (shared across home, projection, snapshot, history)
// ---------------------------------------------------------------------------

export function calcInvValue(inv: Investasi[]): number {
  return inv.reduce((a, item) => {
    if (item.tipe === "saham" && item.lot && item.hargaSkrg) return a + item.lot * 100 * item.hargaSkrg;
    if (item.tipe === "emas" && item.gram && item.hargaSkrg) return a + item.gram * item.hargaSkrg;
    if (item.tipe === "kripto" && item.jml && item.hargaSkrg) return a + item.jml * item.hargaSkrg;
    if (item.tipe === "obligasi" && item.nominal) return a + item.nominal;
    if (item.tipe === "deposito" && item.pokok) return a + item.pokok;
    if (item.tipe === "reksadana" && item.unit && item.nabSkrg) return a + item.unit * item.nabSkrg;
    return a;
  }, 0);
}

export function computeNetWorth(s: { banks: Bank[]; inv: Investasi[]; hutang: Hutang[] }): number {
  const bankTotal = s.banks.reduce((a, b) => a + b.saldo, 0);
  const invTotal = calcInvValue(s.inv);
  const hutangTotal = s.hutang.reduce((a, h) => a + Math.max(h.pokok - h.sudah, 0), 0);
  return bankTotal + invTotal - hutangTotal;
}

interface FinanceState {
  banks: Bank[];
  inv: Investasi[];
  hutang: Hutang[];
  pendapatanRutin: PendapatanRutin[];
  incEx: IncomeExtra[];
  expRutin: ExpRutin[];
  expEx: ExpExtra[];
  cuti: Record<string, number[]>;
  snapshots: MonthlySnapshot[];
}

// Income/expense/sisa for one month. `includeExtra` off → projection (rutin + cicilan only).
export function computeMonthTotals(
  s: FinanceState,
  y: number,
  m: number,
  includeExtra = true
): { income: number; expense: number; sisa: number } {
  const hk = ghk(y, m, s.cuti);
  const bk = ymk(y, m);
  const cur = y * 12 + m;

  let income = s.pendapatanRutin.filter((p) => p.aktif).reduce((a, p) => {
    return a + (p.tipe === "tetap" ? p.jumlah : p.jumlah * hk);
  }, 0);
  if (includeExtra) {
    income += s.incEx.filter((x) => x.bk === bk).reduce((a, x) => a + x.jumlah, 0);
  }

  let expense = s.expRutin
    .filter((e) => isExpRutinActive(e.mulaiY, e.mulaiM, e.selesaiY, e.selesaiM, y, m))
    .reduce((a, e) => a + e.jumlah, 0);
  expense += s.hutang.filter((h) => {
    if (h.htipe !== "cicilan") return false;
    const start = h.mulaiY * 12 + h.mulaiM;
    const end = h.selesaiY * 12 + h.selesaiM;
    return cur >= start && cur <= end && h.sudah < h.pokok;
  }).reduce((a, h) => a + h.cicilan, 0);
  if (includeExtra) {
    expense += s.expEx.filter((x) => x.bk === bk).reduce((a, x) => a + x.jumlah, 0);
  }

  return { income, expense, sisa: income - expense };
}

export type MonthStatus = "riwayat" | "berjalan" | "proyeksi";

export interface MonthView {
  income: number;
  expense: number;
  sisa: number;
  netWorth: number;
  status: MonthStatus;
}

// Unified per-month view for any bk: frozen snapshot (past), live (current), or projection (future).
export function computeMonthView(s: FinanceState, bk: string): MonthView {
  const { y, m } = kym(bk);
  const target = y * 12 + m;
  const { y: cy, m: cm } = currentYM();
  const curIdx = cy * 12 + cm;

  if (target < curIdx) {
    // Past — prefer frozen snapshot
    const snap = s.snapshots.find((x) => x.bk === bk);
    if (snap) {
      return { income: snap.income, expense: snap.expense, sisa: snap.sisa, netWorth: snap.netWorth, status: "riwayat" };
    }
    const t = computeMonthTotals(s, y, m, true);
    return { ...t, netWorth: computeNetWorth(s), status: "riwayat" };
  }

  if (target === curIdx) {
    const t = computeMonthTotals(s, y, m, true);
    return { ...t, netWorth: computeNetWorth(s), status: "berjalan" };
  }

  // Future — projection. Net worth = current + sum of projected sisa from next month..target
  const t = computeMonthTotals(s, y, m, false);
  let nw = computeNetWorth(s);
  for (let idx = curIdx + 1; idx <= target; idx++) {
    const yy = Math.floor((idx - 1) / 12);
    const mm = ((idx - 1) % 12) + 1;
    nw += computeMonthTotals(s, yy, mm, false).sisa;
  }
  return { ...t, netWorth: nw, status: "proyeksi" };
}

// Earliest month with data (incEx/expEx/snapshots), fallback current month.
export function firstDataMonth(s: { incEx: IncomeExtra[]; expEx: ExpExtra[]; snapshots: MonthlySnapshot[] }): string {
  const keys = [
    ...s.incEx.map((x) => x.bk),
    ...s.expEx.map((x) => x.bk),
    ...s.snapshots.map((x) => x.bk),
  ].filter(Boolean);
  if (keys.length === 0) {
    const { y, m } = currentYM();
    return ymk(y, m);
  }
  return keys.sort()[0];
}

// Month options from firstBk through current + futureCount, descending.
export function monthOptionsRange(firstBk: string, futureCount = 0): { label: string; value: string }[] {
  const { y: fy, m: fm } = kym(firstBk);
  const firstIdx = fy * 12 + fm;
  const { y: cy, m: cm } = currentYM();
  const lastIdx = cy * 12 + cm + futureCount;

  const opts: { label: string; value: string }[] = [];
  for (let idx = lastIdx; idx >= firstIdx; idx--) {
    const y = Math.floor((idx - 1) / 12);
    const m = ((idx - 1) % 12) + 1;
    const d = new Date(y, m - 1, 1);
    const label = d.toLocaleDateString("en-US", { month: "long", year: "numeric" });
    opts.push({ label, value: ymk(y, m) });
  }
  return opts;
}
