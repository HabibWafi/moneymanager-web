"use client";
import { useAppStore } from "@/store/useAppStore";
import { useToast } from "@/components/ui/Toast";
import { fmt, ghk, kym, isExpRutinActive } from "@/lib/helpers";
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
  const banks = useAppStore((s) => s.banks);
  const realizationLog = useAppStore((s) => s.realizationLog);
  const toast = useToast();

  const { y, m } = kym(selB);
  const hk = ghk(y, m, cuti);
  const bankName = (id?: string) => banks.find((b) => b.id === id)?.nama;

  const rutinItems = pendapatanRutin.filter((p) => isExpRutinActive(p.mulaiY, p.mulaiM, p.selesaiY, p.selesaiM, y, m));
  const activeRutin = rutinItems.filter((p) => p.aktif);
  const extraItems = incEx.filter((x) => x.bk === selB);

  const totalRutin = activeRutin.reduce((a, p) => {
    return a + (p.tipe === "tetap" ? p.jumlah : p.jumlah * hk);
  }, 0);
  const totalExtra = extraItems.reduce((a, x) => a + x.jumlah, 0);

  const isRealized = (prId: string) =>
    realizationLog.some((r) => r.sourceType === "income_routine" && r.sourceId === prId && r.bk === selB);

  const togglePR = (id: string) => {
    const item = pendapatanRutin.find((p) => p.id === id);
    savePR(pendapatanRutin.map((p) => p.id === id ? { ...p, aktif: !p.aktif } : p));
    toast.add(item?.aktif ? "Pendapatan dinonaktifkan" : "Pendapatan diaktifkan", "info");
  };
  const deletePR = (id: string) => {
    savePR(pendapatanRutin.filter((p) => p.id !== id));
    toast.add("Pendapatan rutin dihapus", "success");
  };

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
                  <div className="flex flex-wrap items-center gap-1 mt-0.5">
                    <span className="text-xs text-slate-400">{p.kat} · {p.tipe === "tetap" ? "Bulanan" : `Harian (${hk} HK)`}</span>
                    {bankName(p.bankId) && (
                      <span className="text-[10px] px-1.5 py-0.5 bg-indigo-50 text-indigo-500 rounded-md">{bankName(p.bankId)}</span>
                    )}
                    {p.tglBayar && (
                      <span className="text-[10px] px-1.5 py-0.5 bg-slate-100 text-slate-500 rounded-md">Tgl {p.tglBayar}</span>
                    )}
                    {p.realisasi === "manual" && (
                      <span className={`text-[10px] px-1.5 py-0.5 rounded-md ${isRealized(p.id) ? "bg-emerald-50 text-emerald-600" : "bg-amber-50 text-amber-600"}`}>
                        {isRealized(p.id) ? "Terealisasi" : "Manual"}
                      </span>
                    )}
                  </div>
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
                <div className="flex flex-wrap items-center gap-1 mt-0.5">
                  <span className="text-xs text-slate-400">{x.kat}</span>
                  {x.tgl && <span className="text-[10px] px-1.5 py-0.5 bg-slate-100 text-slate-500 rounded-md">{x.tgl}</span>}
                  {x.status === "belum" && (
                    <span className="text-[10px] px-1.5 py-0.5 bg-amber-50 text-amber-600 rounded-md">Belum Terealisasi</span>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-emerald-600">+{fmt(x.jumlah)}</span>
                <button onClick={() => { delIncEx(x.id); toast.add("Pemasukan extra dihapus", "success"); }} className="p-1 rounded-lg opacity-0 group-hover:opacity-100 hover:bg-red-50 text-slate-400 hover:text-red-500 transition-all">
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
