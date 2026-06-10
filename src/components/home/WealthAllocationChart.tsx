"use client";
import { useAppStore } from "@/store/useAppStore";
import { fmt } from "@/lib/helpers";
import { INV_TIPE_COLORS } from "@/lib/constants";
import Card from "@/components/ui/Card";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

export default function WealthAllocationChart() {
  const banks = useAppStore((s) => s.banks);
  const inv = useAppStore((s) => s.inv);

  const data: { name: string; value: number; color: string }[] = [];

  banks.forEach((b) => {
    if (b.saldo > 0) data.push({ name: b.nama, value: b.saldo, color: b.warna });
  });

  const invByType: Record<string, number> = {};
  inv.forEach((item) => {
    let val = 0;
    if (item.tipe === "saham" && item.lot && item.hargaSkrg) val = item.lot * 100 * item.hargaSkrg;
    else if (item.tipe === "emas" && item.gram && item.hargaSkrg) val = item.gram * item.hargaSkrg;
    else if (item.tipe === "kripto" && item.jml && item.hargaSkrg) val = item.jml * item.hargaSkrg;
    else if (item.tipe === "obligasi" && item.nominal) val = item.nominal;
    else if (item.tipe === "deposito" && item.pokok) val = item.pokok;
    else if (item.tipe === "reksadana" && item.unit && item.nabSkrg) val = item.unit * item.nabSkrg;
    if (val > 0) invByType[item.tipe] = (invByType[item.tipe] || 0) + val;
  });

  Object.entries(invByType).forEach(([tipe, value]) => {
    data.push({ name: tipe.charAt(0).toUpperCase() + tipe.slice(1), value, color: INV_TIPE_COLORS[tipe] || "#6366F1" });
  });

  if (data.length === 0) {
    return (
      <Card>
        <h3 className="text-sm font-semibold text-slate-700 mb-3">Alokasi Kekayaan</h3>
        <p className="text-xs text-slate-400 text-center py-8">Belum ada data</p>
      </Card>
    );
  }

  return (
    <Card>
      <h3 className="text-sm font-semibold text-slate-700 mb-3">Alokasi Kekayaan</h3>
      <div className="h-[200px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={data} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" paddingAngle={2}>
              {data.map((entry, i) => (
                <Cell key={i} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value) => fmt(Number(value))}
              contentStyle={{ background: "rgba(255,255,255,0.9)", backdropFilter: "blur(8px)", border: "1px solid rgba(226,232,240,0.6)", borderRadius: "12px", fontSize: "12px" }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="grid grid-cols-2 gap-2 mt-2">
        {data.map((d) => (
          <div key={d.name} className="flex items-center gap-2 text-xs">
            <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: d.color }} />
            <span className="text-slate-500 truncate">{d.name}</span>
          </div>
        ))}
      </div>
    </Card>
  );
}
