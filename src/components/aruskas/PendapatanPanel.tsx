"use client";
import { useAppStore } from "@/store/useAppStore";
import { fmt, ghk, kym } from "@/lib/helpers";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import { Plus, Trash2, ToggleLeft, ToggleRight } from "lucide-react";

interface Props {
  onAddExtra: () => void;
  onAddRutin: () => void;
}

export default function PendapatanPanel({ onAddExtra, onAddRutin }: Props) {
  const selB = useAppStore((s) => s.selB);
  const pendapatanRutin = useAppStore((s) => s.pendapatanRutin);
  const savePR = useAppStore((s) => s.savePR);
  const incEx = useAppStore((s) => s.incEx);
  const delIncEx = useAppStore((s) => s.delIncEx);
  const cuti = useAppStore((s) => s.cuti);

  const { y, m } = kym(selB);
  const hk = ghk(y, m, cuti);

  const rutinItems = pendapatanRutin;
  const activeRutin = rutinItems.filter((p) => p.aktif);
  const extraItems = incEx.filter((x) => x.bk === selB);

  const totalRutin = activeRutin.reduce((a, p) => {
    return a + (p.tipe === "tetap" ? p.jumlah : p.jumlah * hk);
  }, 0);
  const totalExtra = extraItems.reduce((a, x) => a + x.jumlah, 0);

  const togglePR = (id: string) => savePR(pendapatanRutin.map((p) => p.id === id ? { ...p, aktif: !p.aktif } : p));
  const deletePR = (id: string) => savePR(pendapatanRutin.filter((p) => p.id !== id));

  return (
    <Card>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-slate-700">Pendapatan</h3>
        <Badge color="emerald">{fmt(totalRutin + totalExtra)}</Badge>
      </div>

      {/* Rutin */}
      <div className="flex items-center justify-between mb-2">
        <p className="text-xs font-medium text-slate-400">Rutin</p>
        <Button size="sm" variant="ghost" onClick={onAddRutin}>
          <Plus size={14} /> Tambah
        </Button>
      </div>
      {rutinItems.length === 0 ? (
        <p className="text-xs text-slate-400 mb-3">Belum ada pendapatan rutin</p>
      ) : (
        <div className="space-y-2 mb-4">
          {rutinItems.map((p) => (
            <div key={p.id} className="flex items-center justify-between p-3 bg-emerald-50/80 border border-emerald-100/60 rounded-xl group">
              <div className="flex items-center gap-2.5">
                <button onClick={() => togglePR(p.id)} className="text-slate-400 hover:text-indigo-500 transition-colors flex-shrink-0">
                  {p.aktif ? <ToggleRight size={18} className="text-emerald-500" /> : <ToggleLeft size={18} />}
                </button>
                <div>
                  <p className={`text-sm font-medium ${p.aktif ? "text-slate-700" : "text-slate-400 line-through"}`}>{p.nama}</p>
                  <p className="text-xs text-slate-400">{p.kat} · {p.tipe === "tetap" ? "Bulanan" : `Harian (${hk} HK)`}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className={`text-sm font-bold ${p.aktif ? "text-emerald-600" : "text-slate-400"}`}>
                  +{fmt(p.tipe === "tetap" ? p.jumlah : p.jumlah * hk)}
                </span>
                <button onClick={() => deletePR(p.id)} className="p-1 rounded-lg opacity-0 group-hover:opacity-100 hover:bg-red-50 text-slate-400 hover:text-red-500 transition-all">
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Extra */}
      <div className="flex items-center justify-between mb-2">
        <p className="text-xs font-medium text-slate-400">Extra / Satu Kali</p>
        <Button size="sm" variant="ghost" onClick={onAddExtra}>
          <Plus size={14} /> Tambah
        </Button>
      </div>
      {extraItems.length === 0 ? (
        <p className="text-xs text-slate-400">Belum ada pendapatan extra bulan ini</p>
      ) : (
        <div className="space-y-2">
          {extraItems.map((x) => (
            <div key={x.id} className="flex items-center justify-between p-3 bg-slate-50/80 border border-slate-100/60 rounded-xl group">
              <div>
                <p className="text-sm font-medium text-slate-700">{x.desc}</p>
                <p className="text-xs text-slate-400">{x.kat}</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-emerald-600">+{fmt(x.jumlah)}</span>
                <button onClick={() => delIncEx(x.id)} className="p-1 rounded-lg opacity-0 group-hover:opacity-100 hover:bg-red-50 text-slate-400 hover:text-red-500 transition-all">
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}
