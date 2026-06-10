"use client";
import { useAppStore } from "@/store/useAppStore";
import { fmt, kym, isExpRutinActive, gc } from "@/lib/helpers";
import Card from "@/components/ui/Card";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";

export default function PieExpense() {
  const selB = useAppStore((s) => s.selB);
  const expRutin = useAppStore((s) => s.expRutin);
  const expEx = useAppStore((s) => s.expEx);

  const { y, m } = kym(selB);

  const byCat: Record<string, number> = {};
  expRutin.filter((e) => isExpRutinActive(e.mulaiY, e.mulaiM, e.selesaiY, e.selesaiM, y, m)).forEach((e) => {
    byCat[e.kat] = (byCat[e.kat] || 0) + e.jumlah;
  });
  expEx.filter((x) => x.bk === selB).forEach((x) => {
    byCat[x.kat] = (byCat[x.kat] || 0) + x.jumlah;
  });

  const data = Object.entries(byCat).map(([name, value], i) => ({ name, value, color: gc(i) }));

  if (data.length === 0) {
    return (
      <Card>
        <h3 className="text-sm font-semibold text-slate-700 mb-3">Pengeluaran per Kategori</h3>
        <p className="text-xs text-slate-400 text-center py-8">Belum ada data pengeluaran</p>
      </Card>
    );
  }

  return (
    <Card>
      <h3 className="text-sm font-semibold text-slate-700 mb-3">Pengeluaran per Kategori</h3>
      <div className="h-[280px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={data} cx="50%" cy="50%" innerRadius={55} outerRadius={90} dataKey="value" paddingAngle={2} label={(props: any) => `${props.name || ''} ${((props.percent || 0) * 100).toFixed(0)}%`}>
              {data.map((entry, i) => (
                <Cell key={i} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip formatter={(value) => fmt(Number(value))} contentStyle={{ background: "rgba(255,255,255,0.9)", backdropFilter: "blur(8px)", border: "1px solid rgba(226,232,240,0.6)", borderRadius: "12px", fontSize: "12px" }} />
            <Legend iconSize={10} wrapperStyle={{ fontSize: "11px" }} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
