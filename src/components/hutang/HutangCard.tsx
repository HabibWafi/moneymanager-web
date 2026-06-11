"use client";
import { Hutang } from "@/lib/types";
import { fmt } from "@/lib/helpers";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import { Trash2, Banknote } from "lucide-react";

interface Props {
  item: Hutang;
  onDelete: () => void;
  onBayar: () => void;
}

export default function HutangCard({ item, onDelete, onBayar }: Props) {
  const pct = item.pokok > 0 ? Math.min((item.sudah / item.pokok) * 100, 100) : 0;
  const sisa = item.pokok - item.sudah;
  const lunas = sisa <= 0;

  return (
    <Card className="hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <div>
          <h4 className="text-sm font-semibold text-slate-700">{item.nama}</h4>
          <div className="flex items-center gap-1.5 mt-0.5">
            <Badge color={item.htipe === "cicilan" ? "amber" : "red"}>
              {item.htipe === "cicilan" ? "Cicilan" : "Hutang"}
            </Badge>
            {lunas && <Badge color="emerald">Lunas</Badge>}
          </div>
        </div>
        <button onClick={onDelete} className="p-1.5 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-500 transition-all">
          <Trash2 size={14} />
        </button>
      </div>

      <div className="space-y-2 mb-3">
        <div className="flex justify-between text-xs">
          <span className="text-slate-400">Pokok</span>
          <span className="font-semibold text-slate-600">{fmt(item.pokok)}</span>
        </div>
        <div className="flex justify-between text-xs">
          <span className="text-slate-400">Sudah Dibayar</span>
          <span className="font-semibold text-emerald-600">{fmt(item.sudah)}</span>
        </div>
        <div className="flex justify-between text-xs">
          <span className="text-slate-400">Sisa</span>
          <span className="font-semibold text-red-500">{fmt(Math.max(sisa, 0))}</span>
        </div>
        {item.htipe === "cicilan" && item.cicilan > 0 && (
          <div className="flex justify-between text-xs">
            <span className="text-slate-400">Cicilan/Bulan</span>
            <span className="font-semibold text-indigo-600">{fmt(item.cicilan)}</span>
          </div>
        )}
      </div>

      <div className="h-2 bg-slate-200/60 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ${pct >= 100 ? "bg-emerald-500" : pct >= 70 ? "bg-amber-500" : "bg-indigo-500"}`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <div className="flex justify-between mt-1.5">
        <span className="text-[10px] text-slate-400">
          {item.mulaiM}/{item.mulaiY} — {item.selesaiM}/{item.selesaiY}
        </span>
        <span className="text-[10px] font-semibold text-slate-500">{Math.round(pct)}%</span>
      </div>

      {!lunas && (
        <div className="mt-3 pt-3 border-t border-slate-100">
          <Button
            size="sm"
            variant={item.htipe === "cicilan" ? "primary" : "success"}
            fullWidth
            onClick={onBayar}
          >
            <Banknote size={14} />
            {item.htipe === "cicilan" ? `Bayar Cicilan ${fmt(item.cicilan)}` : "Bayar Hutang"}
          </Button>
        </div>
      )}
    </Card>
  );
}
