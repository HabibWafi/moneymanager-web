"use client";
import { useAppStore } from "@/store/useAppStore";
import { fmt, kym, ghk, isExpRutinActive } from "@/lib/helpers";
import { gc } from "@/lib/helpers";
import Card from "@/components/ui/Card";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

export default function IncomeExpensePie() {
  const selB = useAppStore((s) => s.selB);
  const pendapatanRutin = useAppStore((s) => s.pendapatanRutin);
  const incEx = useAppStore((s) => s.incEx);
  const expRutin = useAppStore((s) => s.expRutin);
  const expEx = useAppStore((s) => s.expEx);
  const hutang = useAppStore((s) => s.hutang);
  const cuti = useAppStore((s) => s.cuti);

  const { y, m } = kym(selB);
  const hk = ghk(y, m, cuti);

  const incByCat: Record<string, number> = {};
  pendapatanRutin.filter((p) => p.aktif).forEach((p) => {
    const val = p.tipe === "tetap" ? p.jumlah : p.jumlah * hk;
    incByCat[p.kat] = (incByCat[p.kat] || 0) + val;
  });
  incEx.filter((x) => x.bk === selB).forEach((x) => {
    incByCat[x.kat] = (incByCat[x.kat] || 0) + x.jumlah;
  });

  const expByCat: Record<string, number> = {};
  expRutin.filter((e) => isExpRutinActive(e.mulaiY, e.mulaiM, e.selesaiY, e.selesaiM, y, m)).forEach((e) => {
    expByCat[e.kat] = (expByCat[e.kat] || 0) + e.jumlah;
  });
  expEx.filter((x) => x.bk === selB).forEach((x) => {
    expByCat[x.kat] = (expByCat[x.kat] || 0) + x.jumlah;
  });

  hutang.filter((h) => {
    if (h.htipe !== "cicilan") return false;
    const start = h.mulaiY * 12 + h.mulaiM;
    const end = h.selesaiY * 12 + h.selesaiM;
    const cur = y * 12 + m;
    return cur >= start && cur <= end && h.sudah < h.pokok;
  }).forEach((h) => {
    expByCat["Installment"] = (expByCat["Installment"] || 0) + h.cicilan;
  });

  const incData = Object.entries(incByCat).map(([name, value], i) => ({ name, value, color: gc(i) }));
  const expData = Object.entries(expByCat).map(([name, value], i) => ({ name, value, color: gc(i + 5) }));

  const renderPie = (data: { name: string; value: number; color: string }[], title: string, emptyMsg: string) => (
    <div className="flex-1 min-w-0">
      <h4 className="text-xs font-semibold text-slate-500 mb-2 text-center">{title}</h4>
      {data.length === 0 ? (
        <p className="text-xs text-slate-400 text-center py-6">{emptyMsg}</p>
      ) : (
        <>
          <div className="h-[150px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={data} cx="50%" cy="50%" innerRadius={35} outerRadius={55} dataKey="value" paddingAngle={2}>
                  {data.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value) => fmt(Number(value))}
                  contentStyle={{ background: "rgba(255,255,255,0.9)", backdropFilter: "blur(8px)", border: "1px solid rgba(226,232,240,0.6)", borderRadius: "12px", fontSize: "11px" }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-1 mt-1">
            {data.slice(0, 4).map((d) => (
              <div key={d.name} className="flex items-center gap-1.5 text-[10px]">
                <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: d.color }} />
                <span className="text-slate-500 truncate flex-1">{d.name}</span>
                <span className="text-slate-600 font-medium">{fmt(d.value)}</span>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );

  return (
    <Card>
      <h3 className="text-sm font-semibold text-slate-700 mb-3">Ringkasan Bulan Ini</h3>
      <div className="flex gap-4">
        {renderPie(incData, "Pemasukan", "Belum ada")}
        {renderPie(expData, "Pengeluaran", "Belum ada")}
      </div>
    </Card>
  );
}
