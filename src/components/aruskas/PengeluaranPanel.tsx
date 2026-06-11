"use client";
import { useAppStore } from "@/store/useAppStore";
import { fmt, kym, isExpRutinActive } from "@/lib/helpers";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import { Plus, Trash2 } from "lucide-react";

interface Props {
  onAddExtra: () => void;
  onAddRutin: () => void;
}

export default function PengeluaranPanel({ onAddExtra, onAddRutin }: Props) {
  const selB = useAppStore((s) => s.selB);
  const expRutin = useAppStore((s) => s.expRutin);
  const saveER = useAppStore((s) => s.saveER);
  const expEx = useAppStore((s) => s.expEx);
  const delExpEx = useAppStore((s) => s.delExpEx);
  const hutang = useAppStore((s) => s.hutang);

  const { y, m } = kym(selB);

  const rutinItems = expRutin.filter((e) => isExpRutinActive(e.mulaiY, e.mulaiM, e.selesaiY, e.selesaiM, y, m));
  const extraItems = expEx.filter((x) => x.bk === selB);

  const cicilanItems = hutang.filter((h) => {
    if (h.htipe !== "cicilan") return false;
    const start = h.mulaiY * 12 + h.mulaiM;
    const end = h.selesaiY * 12 + h.selesaiM;
    const cur = y * 12 + m;
    return cur >= start && cur <= end && h.sudah < h.pokok;
  });

  const totalRutin = rutinItems.reduce((a, e) => a + e.jumlah, 0);
  const totalExtra = extraItems.reduce((a, x) => a + x.jumlah, 0);
  const totalCicilan = cicilanItems.reduce((a, h) => a + h.cicilan, 0);

  const deleteER = (id: string) => saveER(expRutin.filter((e) => e.id !== id));

  return (
    <Card>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-slate-700">Pengeluaran</h3>
        <Badge color="red">{fmt(totalRutin + totalExtra + totalCicilan)}</Badge>
      </div>

      {/* Rutin */}
      <div className="flex items-center justify-between mb-2">
        <p className="text-xs font-medium text-slate-400">Rutin</p>
        <Button size="sm" variant="ghost" onClick={onAddRutin}>
          <Plus size={14} /> Tambah
        </Button>
      </div>
      {rutinItems.length === 0 ? (
        <p className="text-xs text-slate-400 mb-3">Belum ada pengeluaran rutin</p>
      ) : (
        <div className="space-y-2 mb-4">
          {rutinItems.map((e) => (
            <div key={e.id} className="flex items-center justify-between p-3 bg-red-50/80 border border-red-100/60 rounded-xl group">
              <div>
                <p className="text-sm font-medium text-slate-700">{e.nama}</p>
                <p className="text-xs text-slate-400">{e.kat} · {e.tipe === "tetap" ? "Tetap" : "Cicilan"}</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-red-500">-{fmt(e.jumlah)}</span>
                <button onClick={() => deleteER(e.id)} className="p-1 rounded-lg opacity-0 group-hover:opacity-100 hover:bg-red-50 text-slate-400 hover:text-red-500 transition-all">
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Cicilan Hutang */}
      {cicilanItems.length > 0 && (
        <>
          <p className="text-xs font-medium text-slate-400 mb-2">Cicilan Hutang</p>
          <div className="space-y-2 mb-4">
            {cicilanItems.map((h) => (
              <div key={h.id} className="flex items-center justify-between p-3 bg-amber-50/80 border border-amber-100/60 rounded-xl">
                <div>
                  <p className="text-sm font-medium text-slate-700">{h.nama}</p>
                  <p className="text-xs text-slate-400">Cicilan otomatis</p>
                </div>
                <span className="text-sm font-bold text-amber-600">-{fmt(h.cicilan)}</span>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Extra */}
      <div className="flex items-center justify-between mb-2">
        <p className="text-xs font-medium text-slate-400">Extra / Satu Kali</p>
        <Button size="sm" variant="ghost" onClick={onAddExtra}>
          <Plus size={14} /> Tambah
        </Button>
      </div>
      {extraItems.length === 0 ? (
        <p className="text-xs text-slate-400">Belum ada pengeluaran extra bulan ini</p>
      ) : (
        <div className="space-y-2">
          {extraItems.map((x) => (
            <div key={x.id} className="flex items-center justify-between p-3 bg-slate-50/80 border border-slate-100/60 rounded-xl group">
              <div>
                <p className="text-sm font-medium text-slate-700">{x.desc}</p>
                <p className="text-xs text-slate-400">{x.kat}</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-red-500">-{fmt(x.jumlah)}</span>
                <button onClick={() => delExpEx(x.id)} className="p-1 rounded-lg opacity-0 group-hover:opacity-100 hover:bg-red-50 text-slate-400 hover:text-red-500 transition-all">
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
