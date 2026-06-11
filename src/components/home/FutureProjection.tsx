"use client";
import { useAppStore } from "@/store/useAppStore";
import { fmt, fmtS, ghk, isExpRutinActive } from "@/lib/helpers";
import Card from "@/components/ui/Card";
import { Calendar } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

function calcInvValue(inv: any[]): number {
  return inv.reduce((a: number, item: any) => {
    if (item.tipe === "saham" && item.lot && item.hargaSkrg) return a + item.lot * 100 * item.hargaSkrg;
    if (item.tipe === "emas" && item.gram && item.hargaSkrg) return a + item.gram * item.hargaSkrg;
    if (item.tipe === "kripto" && item.jml && item.hargaSkrg) return a + item.jml * item.hargaSkrg;
    if (item.tipe === "obligasi" && item.nominal) return a + item.nominal;
    if (item.tipe === "deposito" && item.pokok) return a + item.pokok;
    if (item.tipe === "reksadana" && item.unit && item.nabSkrg) return a + item.unit * item.nabSkrg;
    return a;
  }, 0);
}

export default function FutureProjection() {
  const pendapatanRutin = useAppStore((s) => s.pendapatanRutin);
  const expRutin = useAppStore((s) => s.expRutin);
  const hutang = useAppStore((s) => s.hutang);
  const cuti = useAppStore((s) => s.cuti);
  const banks = useAppStore((s) => s.banks);
  const inv = useAppStore((s) => s.inv);

  const totalBank = banks.reduce((a, b) => a + b.saldo, 0);
  const totalInv = calcInvValue(inv);
  const totalHutang = hutang.reduce((a, h) => a + Math.max(h.pokok - h.sudah, 0), 0);
  const baseNetWorth = totalBank + totalInv - totalHutang;

  const now = new Date();
  let cumulativeSisa = 0;

  const months: { label: string; income: number; expense: number; sisa: number; netWorth: number }[] = [];

  for (let i = 0; i < 6; i++) {
    const d = new Date(now.getFullYear(), now.getMonth() + i, 1);
    const y = d.getFullYear();
    const m = d.getMonth() + 1;
    const label = d.toLocaleDateString("id-ID", { month: "short", year: "2-digit" });
    const hk = ghk(y, m, cuti);

    const income = pendapatanRutin.filter((p) => p.aktif).reduce((a, p) => {
      if (p.tipe === "tetap") return a + p.jumlah;
      return a + p.jumlah * hk;
    }, 0);

    const rutinExpense = expRutin.filter((e) => isExpRutinActive(e.mulaiY, e.mulaiM, e.selesaiY, e.selesaiM, y, m)).reduce((a, e) => a + e.jumlah, 0);

    const cicilanExpense = hutang.filter((h) => {
      if (h.htipe !== "cicilan") return false;
      const start = h.mulaiY * 12 + h.mulaiM;
      const end = h.selesaiY * 12 + h.selesaiM;
      const cur = y * 12 + m;
      return cur >= start && cur <= end;
    }).reduce((a, h) => a + h.cicilan, 0);

    const expense = rutinExpense + cicilanExpense;
    const sisa = income - expense;
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

      {/* Table */}
      <div className="space-y-2 mb-5">
        {months.map((mo, i) => (
          <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-indigo-50/40 hover:bg-indigo-100/50 transition-colors">
            <span className="text-xs font-semibold text-slate-500 w-16 flex-shrink-0">{mo.label}</span>
            <div className="flex-1 grid grid-cols-4 gap-2 text-xs">
              <div>
                <p className="text-slate-400">Masuk</p>
                <p className="font-semibold text-emerald-600">{fmtS(mo.income)}</p>
              </div>
              <div>
                <p className="text-slate-400">Keluar</p>
                <p className="font-semibold text-red-500">{fmtS(mo.expense)}</p>
              </div>
              <div>
                <p className="text-slate-400">Sisa</p>
                <p className={`font-semibold ${mo.sisa >= 0 ? "text-indigo-600" : "text-red-600"}`}>{fmtS(mo.sisa)}</p>
              </div>
              <div>
                <p className="text-slate-400">Kekayaan</p>
                <p className={`font-semibold ${mo.netWorth >= 0 ? "text-violet-600" : "text-red-600"}`}>{fmtS(mo.netWorth)}</p>
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
