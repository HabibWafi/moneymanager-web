"use client";
import { useAppStore } from "@/store/useAppStore";
import { fmt, fmtS, kym, currentYM, firstDataMonth, computeMonthView } from "@/lib/helpers";
import Card from "@/components/ui/Card";
import { History } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

export default function RiwayatSection() {
  const banks = useAppStore((s) => s.banks);
  const inv = useAppStore((s) => s.inv);
  const hutang = useAppStore((s) => s.hutang);
  const pendapatanRutin = useAppStore((s) => s.pendapatanRutin);
  const incEx = useAppStore((s) => s.incEx);
  const expRutin = useAppStore((s) => s.expRutin);
  const expEx = useAppStore((s) => s.expEx);
  const snapshots = useAppStore((s) => s.snapshots);
  const cuti = useAppStore((s) => s.cuti);

  const state = { banks, inv, hutang, pendapatanRutin, incEx, expRutin, expEx, snapshots, cuti };

  const firstBk = firstDataMonth(state);
  const { y: fy, m: fm } = kym(firstBk);
  const firstIdx = fy * 12 + fm;
  const { y: cy, m: cm } = currentYM();
  const curIdx = cy * 12 + cm;

  // Oldest → newest for the chart; table rendered newest first.
  const rows: { bk: string; label: string; income: number; expense: number; sisa: number; netWorth: number }[] = [];
  for (let idx = firstIdx; idx <= curIdx; idx++) {
    const y = Math.floor((idx - 1) / 12);
    const m = ((idx - 1) % 12) + 1;
    const bk = `${y}-${String(m).padStart(2, "0")}`;
    const label = new Date(y, m - 1, 1).toLocaleDateString("id-ID", { month: "short", year: "2-digit" });
    const view = computeMonthView(state, bk);
    rows.push({ bk, label, income: view.income, expense: view.expense, sisa: view.sisa, netWorth: view.netWorth });
  }

  const hasData = rows.some((r) => r.income !== 0 || r.expense !== 0);

  if (!hasData) {
    return (
      <Card>
        <h3 className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
          <History size={16} className="text-indigo-500" /> Riwayat Keuangan
        </h3>
        <p className="text-xs text-slate-400 text-center py-6">Belum ada riwayat. Mulai catat transaksi untuk membangun track record.</p>
      </Card>
    );
  }

  const tableRows = [...rows].reverse();

  return (
    <Card>
      <h3 className="text-sm font-semibold text-slate-700 mb-4 flex items-center gap-2">
        <History size={16} className="text-indigo-500" /> Riwayat Keuangan
      </h3>

      {/* Net worth trend */}
      <div className="mb-5">
        <p className="text-xs font-semibold text-slate-500 mb-2">Tren Kekayaan Bersih</p>
        <div className="h-[170px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={rows} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="riwayatNwGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#4F46E5" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#4F46E5" stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <XAxis dataKey="label" tick={{ fontSize: 10, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: "#94a3b8" }} axisLine={false} tickLine={false} tickFormatter={(v) => fmtS(v)} width={55} />
              <Tooltip
                formatter={(value) => [fmt(Number(value)), "Kekayaan"]}
                contentStyle={{ background: "rgba(255,255,255,0.95)", backdropFilter: "blur(8px)", border: "1px solid rgba(226,232,240,0.6)", borderRadius: "12px", fontSize: "11px" }}
              />
              <Area type="monotone" dataKey="netWorth" stroke="#4F46E5" strokeWidth={2.5} fill="url(#riwayatNwGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Monthly table */}
      <div className="space-y-2">
        {tableRows.map((r) => {
          const rasio = r.income > 0 ? Math.round((r.sisa / r.income) * 100) : 0;
          return (
            <div key={r.bk} className="p-3 rounded-xl bg-slate-50/70 border border-slate-100/60">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-bold text-slate-600">{r.label}</span>
                <span className={`text-[10px] font-semibold ${rasio >= 20 ? "text-emerald-600" : rasio >= 0 ? "text-amber-500" : "text-red-500"}`}>
                  Tabungan {rasio}%
                </span>
              </div>
              <div className="grid grid-cols-2 gap-x-3 gap-y-1 text-xs">
                <div className="flex justify-between gap-1">
                  <span className="text-slate-400">Pemasukan</span>
                  <span className="font-semibold text-emerald-600 tabular-nums">{fmt(r.income)}</span>
                </div>
                <div className="flex justify-between gap-1">
                  <span className="text-slate-400">Sisa</span>
                  <span className={`font-semibold tabular-nums ${r.sisa >= 0 ? "text-indigo-600" : "text-red-600"}`}>{fmt(r.sisa)}</span>
                </div>
                <div className="flex justify-between gap-1">
                  <span className="text-slate-400">Pengeluaran</span>
                  <span className="font-semibold text-red-500 tabular-nums">{fmt(r.expense)}</span>
                </div>
                <div className="flex justify-between gap-1">
                  <span className="text-slate-400">Kekayaan</span>
                  <span className={`font-semibold tabular-nums ${r.netWorth >= 0 ? "text-violet-600" : "text-red-600"}`}>{fmt(r.netWorth)}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
