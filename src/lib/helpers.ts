export function fmt(n: number, currency: "IDR" | "USD" = "IDR"): string {
  if (currency === "USD") return fmtUsd(n);
  return "Rp " + n.toLocaleString("id-ID");
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
