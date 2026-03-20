"use client";
import { Investasi } from "@/lib/types";
import { fmt } from "@/lib/helpers";
import { INV_TIPE_LABEL, INV_TIPE_COLORS } from "@/lib/constants";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import { Trash2, TrendingUp, TrendingDown } from "lucide-react";

function getInvValue(item: Investasi): { current: number; cost: number } {
  switch (item.tipe) {
    case "saham": return { current: (item.lot || 0) * 100 * (item.hargaSkrg || 0), cost: (item.lot || 0) * 100 * (item.hargaBeli || 0) };
    case "emas": return { current: (item.gram || 0) * (item.hargaSkrg || 0), cost: (item.gram || 0) * (item.hargaBeli || 0) };
    case "kripto": return { current: (item.jml || 0) * (item.hargaSkrg || 0), cost: (item.jml || 0) * (item.hargaBeli || 0) };
    case "reksadana": return { current: (item.unit || 0) * (item.nabSkrg || 0), cost: (item.unit || 0) * (item.nabBeli || 0) };
    case "obligasi": return { current: item.nominal || 0, cost: item.nominal || 0 };
    case "deposito": return { current: item.pokok || 0, cost: item.pokok || 0 };
    default: return { current: 0, cost: 0 };
  }
}

function getLabel(item: Investasi): string {
  if (item.nama) return item.nama;
  if (item.sym) return item.sym;
  if (item.kode) return item.kode;
  return INV_TIPE_LABEL[item.tipe] || item.tipe;
}

export default function InvCard({ item, onDelete }: { item: Investasi; onDelete: () => void }) {
  const { current, cost } = getInvValue(item);
  const gain = current - cost;
  const pct = cost > 0 ? ((gain / cost) * 100) : 0;
  const isPos = gain >= 0;

  const badgeColorMap: Record<string, string> = {
    saham: "indigo", emas: "amber", kripto: "violet",
    obligasi: "emerald", deposito: "cyan", reksadana: "red",
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <div>
          <h4 className="text-sm font-semibold text-slate-700">{getLabel(item)}</h4>
          <Badge color={badgeColorMap[item.tipe] || "slate"}>{INV_TIPE_LABEL[item.tipe]}</Badge>
        </div>
        <button onClick={onDelete} className="p-1.5 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-500 transition-all">
          <Trash2 size={14} />
        </button>
      </div>

      <div className="flex items-end justify-between">
        <div>
          <p className="text-xs text-slate-400 mb-0.5">Nilai Saat Ini</p>
          <p className="text-lg font-bold text-slate-700">{fmt(current)}</p>
        </div>
        {cost > 0 && (
          <div className={`flex items-center gap-1 text-xs font-semibold ${isPos ? "text-emerald-500" : "text-red-500"}`}>
            {isPos ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
            <span>{isPos ? "+" : ""}{pct.toFixed(1)}%</span>
          </div>
        )}
      </div>

      {cost > 0 && cost !== current && (
        <div className="mt-2 pt-2 border-t border-slate-100 flex justify-between text-xs text-slate-400">
          <span>Modal: {fmt(cost)}</span>
          <span className={isPos ? "text-emerald-500" : "text-red-500"}>{isPos ? "+" : ""}{fmt(gain)}</span>
        </div>
      )}
    </Card>
  );
}
