"use client";
import { useAppStore } from "@/store/useAppStore";
import { fmt, ymk, ghk, isExpRutinActive } from "@/lib/helpers";
import Card from "@/components/ui/Card";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

export default function BarMonthly() {
  const pendapatanRutin = useAppStore((s) => s.pendapatanRutin);
  const incEx = useAppStore((s) => s.incEx);
  const expRutin = useAppStore((s) => s.expRutin);
  const expEx = useAppStore((s) => s.expEx);
  const cuti = useAppStore((s) => s.cuti);

  const now = new Date();
  const data: { name: string; Pemasukan: number; Pengeluaran: number }[] = [];

  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const y = d.getFullYear();
    const m = d.getMonth() + 1;
    const bk = ymk(y, m);
    const hk = ghk(y, m, cuti);
    const label = d.toLocaleDateString("id-ID", { month: "short" });

    const income = pendapatanRutin.filter((p) => p.aktif).reduce((a, p) => {
      return a + (p.tipe === "tetap" ? p.jumlah : p.jumlah * hk);
    }, 0) + incEx.filter((x) => x.bk === bk).reduce((a, x) => a + x.jumlah, 0);

    const expense = expRutin.filter((e) => isExpRutinActive(e.mulaiY, e.mulaiM, e.selesaiY, e.selesaiM, y, m)).reduce((a, e) => a + e.jumlah, 0)
      + expEx.filter((x) => x.bk === bk).reduce((a, x) => a + x.jumlah, 0);

    data.push({ name: label, Pemasukan: income, Pengeluaran: expense });
  }

  return (
    <Card>
      <h3 className="text-sm font-semibold text-slate-700 mb-3">Tren 6 Bulan</h3>
      <div className="h-[280px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#94a3b8" }} />
            <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} tickFormatter={(v) => (v / 1e6).toFixed(0) + "jt"} />
            <Tooltip formatter={(value) => fmt(Number(value))} contentStyle={{ background: "white", border: "1px solid #e2e8f0", borderRadius: "12px", fontSize: "12px" }} />
            <Bar dataKey="Pemasukan" fill="#10B981" radius={[4, 4, 0, 0]} />
            <Bar dataKey="Pengeluaran" fill="#EF4444" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
