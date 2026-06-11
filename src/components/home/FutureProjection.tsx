"use client";
import { useAppStore } from "@/store/useAppStore";
import { fmt, ghk, isExpRutinActive } from "@/lib/helpers";
import Card from "@/components/ui/Card";
import { Calendar } from "lucide-react";

export default function FutureProjection() {
  const pendapatanRutin = useAppStore((s) => s.pendapatanRutin);
  const expRutin = useAppStore((s) => s.expRutin);
  const hutang = useAppStore((s) => s.hutang);
  const cuti = useAppStore((s) => s.cuti);

  const now = new Date();
  const months: { label: string; y: number; m: number; income: number; expense: number; sisa: number }[] = [];

  for (let i = 0; i < 6; i++) {
    const d = new Date(now.getFullYear(), now.getMonth() + i, 1);
    const y = d.getFullYear();
    const m = d.getMonth() + 1;
    const label = d.toLocaleDateString("id-ID", { month: "short", year: "numeric" });
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
    months.push({ label, y, m, income, expense, sisa: income - expense });
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
      <div className="space-y-2">
        {months.map((mo, i) => (
          <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-indigo-50/40 hover:bg-indigo-100/50 transition-colors">
            <span className="text-xs font-semibold text-slate-500 w-20">{mo.label}</span>
            <div className="flex-1 grid grid-cols-3 gap-2 text-xs">
              <div>
                <p className="text-slate-400">Masuk</p>
                <p className="font-semibold text-emerald-600">{fmt(mo.income)}</p>
              </div>
              <div>
                <p className="text-slate-400">Keluar</p>
                <p className="font-semibold text-red-500">{fmt(mo.expense)}</p>
              </div>
              <div>
                <p className="text-slate-400">Sisa</p>
                <p className={`font-semibold ${mo.sisa >= 0 ? "text-indigo-600" : "text-red-600"}`}>{fmt(mo.sisa)}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
