"use client";
import { useAppStore } from "@/store/useAppStore";
import { fmt, ghk, kym } from "@/lib/helpers";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import { Plus, Trash2 } from "lucide-react";

export default function PendapatanPanel({ onAddExtra }: { onAddExtra: () => void }) {
  const selB = useAppStore((s) => s.selB);
  const pendapatanRutin = useAppStore((s) => s.pendapatanRutin);
  const incEx = useAppStore((s) => s.incEx);
  const delIncEx = useAppStore((s) => s.delIncEx);
  const cuti = useAppStore((s) => s.cuti);

  const { y, m } = kym(selB);
  const hk = ghk(y, m, cuti);

  const rutinItems = pendapatanRutin.filter((p) => p.aktif);
  const extraItems = incEx.filter((x) => x.bk === selB);

  const totalRutin = rutinItems.reduce((a, p) => {
    return a + (p.tipe === "tetap" ? p.jumlah : p.jumlah * hk);
  }, 0);
  const totalExtra = extraItems.reduce((a, x) => a + x.jumlah, 0);

  return (
    <Card>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-slate-700">Pendapatan</h3>
        <Badge color="emerald">{fmt(totalRutin + totalExtra)}</Badge>
      </div>

      {/* Rutin */}
      <p className="text-xs font-medium text-slate-400 mb-2">Rutin</p>
      {rutinItems.length === 0 ? (
        <p className="text-xs text-slate-400 mb-3">Belum ada. Atur di Pengaturan.</p>
      ) : (
        <div className="space-y-2 mb-4">
          {rutinItems.map((p) => (
            <div key={p.id} className="flex items-center justify-between p-3 bg-emerald-50/80 border border-emerald-100/60 rounded-xl">
              <div>
                <p className="text-sm font-medium text-slate-700">{p.nama}</p>
                <p className="text-xs text-slate-400">{p.kat} · {p.tipe === "tetap" ? "Bulanan" : `Harian (${hk} HK)`}</p>
              </div>
              <span className="text-sm font-bold text-emerald-600">
                +{fmt(p.tipe === "tetap" ? p.jumlah : p.jumlah * hk)}
              </span>
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
