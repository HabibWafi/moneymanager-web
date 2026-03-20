"use client";
import { useAppStore } from "@/store/useAppStore";
import { mOpts, fmt, kym, ghk, isExpRutinActive } from "@/lib/helpers";
import PieExpense from "@/components/analitik/PieExpense";
import BarMonthly from "@/components/analitik/BarMonthly";
import Card from "@/components/ui/Card";

export default function AnalitikPage() {
  const selB = useAppStore((s) => s.selB);
  const setSelB = useAppStore((s) => s.setSelB);
  const pendapatanRutin = useAppStore((s) => s.pendapatanRutin);
  const incEx = useAppStore((s) => s.incEx);
  const expRutin = useAppStore((s) => s.expRutin);
  const expEx = useAppStore((s) => s.expEx);
  const cuti = useAppStore((s) => s.cuti);
  const opts = mOpts();

  const { y, m } = kym(selB);
  const hk = ghk(y, m, cuti);

  const totalIncome = pendapatanRutin.filter((p) => p.aktif).reduce((a, p) => a + (p.tipe === "tetap" ? p.jumlah : p.jumlah * hk), 0)
    + incEx.filter((x) => x.bk === selB).reduce((a, x) => a + x.jumlah, 0);

  const totalExpense = expRutin.filter((e) => isExpRutinActive(e.mulaiY, e.mulaiM, e.selesaiY, e.selesaiM, y, m)).reduce((a, e) => a + e.jumlah, 0)
    + expEx.filter((x) => x.bk === selB).reduce((a, x) => a + x.jumlah, 0);

  const sisa = totalIncome - totalExpense;
  const savRatio = totalIncome > 0 ? Math.round((sisa / totalIncome) * 100) : 0;

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-slate-800">Analitik</h1>
        <select value={selB} onChange={(e) => setSelB(e.target.value)}
          className="text-sm bg-white border border-slate-200 rounded-xl px-3 py-2 text-slate-600 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400">
          {opts.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-3 gap-3">
        <Card className="text-center">
          <p className="text-xs text-slate-400 mb-1">Pemasukan</p>
          <p className="text-lg font-bold text-emerald-600">{fmt(totalIncome)}</p>
        </Card>
        <Card className="text-center">
          <p className="text-xs text-slate-400 mb-1">Pengeluaran</p>
          <p className="text-lg font-bold text-red-500">{fmt(totalExpense)}</p>
        </Card>
        <Card className="text-center">
          <p className="text-xs text-slate-400 mb-1">Rasio Tabungan</p>
          <p className={`text-lg font-bold ${savRatio >= 20 ? "text-emerald-600" : savRatio >= 0 ? "text-amber-500" : "text-red-500"}`}>{savRatio}%</p>
        </Card>
      </div>

      <PieExpense />
      <BarMonthly />
    </div>
  );
}
