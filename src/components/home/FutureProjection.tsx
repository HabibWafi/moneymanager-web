"use client";
import { useAppStore } from "@/store/useAppStore";
import { fmt, fmtS, computeMonthTotals, computeNetWorth } from "@/lib/helpers";
import Card from "@/components/ui/Card";
import { Calendar } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

export default function FutureProjection() {
  const pendapatanRutin = useAppStore((s) => s.pendapatanRutin);
  const expRutin = useAppStore((s) => s.expRutin);
  const hutang = useAppStore((s) => s.hutang);
  const cuti = useAppStore((s) => s.cuti);
  const banks = useAppStore((s) => s.banks);
  const inv = useAppStore((s) => s.inv);
  const incEx = useAppStore((s) => s.incEx);
  const expEx = useAppStore((s) => s.expEx);
  const snapshots = useAppStore((s) => s.snapshots);

  const state = { banks, inv, hutang, pendapatanRutin, incEx, expRutin, expEx, snapshots, cuti };
  const baseNetWorth = computeNetWorth(state);

  const now = new Date();
  let cumulativeSisa = 0;

  const months: { label: string; income: number; expense: number; sisa: number; netWorth: number }[] = [];

  for (let i = 0; i < 6; i++) {
    const d = new Date(now.getFullYear(), now.getMonth() + i, 1);
    const y = d.getFullYear();
    const m = d.getMonth() + 1;
    const label = d.toLocaleDateString("id-ID", { month: "short", year: "2-digit" });

    // Forward view: routine + installments only (no extras yet for future months).
    const { income, expense, sisa } = computeMonthTotals(state, y, m, i === 0);
    cumulativeSisa += sisa;
    const netWorth = baseNetWorth + cumulativeSisa;

    months.push({ label, income, expense, sisa, netWorth });
  }

  if (pendapatanRutin.length === 0 && expRutin.length === 0 && hutang.length === 0) {
    return (
      <Card>
        <h3 className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
          <Calendar size={16} className="text-indigo-500" /> Proyeksi 6 Bulan
        </h3>
        <p className="text-xs text-slate-400 text-center py-6">Tambahkan pendapatan & pengeluaran rutin untuk melihat proyeksi</p>
      </Card>
    );
  }

  return (
    <Card>
      <h3 className="text-sm font-semibold text-slate-700 mb-4 flex items-center gap-2">
        <Calendar size={16} className="text-indigo-500" /> Proyeksi 6 Bulan
      </h3>

      {/* Table: 2 rows x 2 cols per month so full numbers fit */}
      <div className="space-y-2 mb-5">
        {months.map((mo, i) => (
          <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-indigo-50/40 hover:bg-indigo-100/50 transition-colors">
            <span className="text-xs font-semibold text-slate-500 w-12 flex-shrink-0">{mo.label}</span>
            <div className="flex-1 grid grid-cols-2 gap-x-3 gap-y-1.5 text-xs">
              <div className="flex justify-between gap-1">
                <span className="text-slate-400">Masuk</span>
                <span className="font-semibold text-emerald-600 tabular-nums">{fmt(mo.income)}</span>
              </div>
              <div className="flex justify-between gap-1">
                <span className="text-slate-400">Sisa</span>
                <span className={`font-semibold tabular-nums ${mo.sisa >= 0 ? "text-indigo-600" : "text-red-600"}`}>{fmt(mo.sisa)}</span>
              </div>
              <div className="flex justify-between gap-1">
                <span className="text-slate-400">Keluar</span>
                <span className="font-semibold text-red-500 tabular-nums">{fmt(mo.expense)}</span>
              </div>
              <div className="flex justify-between gap-1">
                <span className="text-slate-400">Kekayaan</span>
                <span className={`font-semibold tabular-nums ${mo.netWorth >= 0 ? "text-violet-600" : "text-red-600"}`}>{fmt(mo.netWorth)}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Chart */}
      <div>
        <p className="text-xs font-semibold text-slate-500 mb-2">Pertumbuhan Kekayaan</p>
        <div className="h-[180px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={months} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="netWorthGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#7C3AED" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#7C3AED" stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <XAxis dataKey="label" tick={{ fontSize: 10, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: "#94a3b8" }} axisLine={false} tickLine={false} tickFormatter={(v) => fmtS(v)} width={55} />
              <Tooltip
                formatter={(value) => [fmt(Number(value)), "Kekayaan"]}
                contentStyle={{ background: "rgba(255,255,255,0.95)", backdropFilter: "blur(8px)", border: "1px solid rgba(226,232,240,0.6)", borderRadius: "12px", fontSize: "11px" }}
              />
              <Area type="monotone" dataKey="netWorth" stroke="#7C3AED" strokeWidth={2.5} fill="url(#netWorthGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </Card>
  );
}
