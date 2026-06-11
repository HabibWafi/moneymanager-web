"use client";
import { useState } from "react";
import { nanoid } from "nanoid";
import { useAppStore } from "@/store/useAppStore";
import { useToast } from "@/components/ui/Toast";
import { fmt, kym, isExpRutinActive } from "@/lib/helpers";
import { KE } from "@/lib/constants";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import NumericInput from "@/components/ui/NumericInput";
import { Target, Plus, Trash2, Pencil, X, Check } from "lucide-react";

export default function BudgetSection() {
  const selB = useAppStore((s) => s.selB);
  const budgets = useAppStore((s) => s.budgets);
  const addBudget = useAppStore((s) => s.addBudget);
  const updBudget = useAppStore((s) => s.updBudget);
  const delBudget = useAppStore((s) => s.delBudget);
  const expRutin = useAppStore((s) => s.expRutin);
  const expEx = useAppStore((s) => s.expEx);
  const hutang = useAppStore((s) => s.hutang);
  const toast = useToast();

  const { y, m } = kym(selB);

  const [addMode, setAddMode] = useState(false);
  const [newKat, setNewKat] = useState("");
  const [newJumlah, setNewJumlah] = useState("");
  const [editId, setEditId] = useState<string | null>(null);
  const [editJumlah, setEditJumlah] = useState("");

  const usedKats = new Set(budgets.map((b) => b.kat));
  const availableKats = KE.filter((k) => !usedKats.has(k));

  const getRealisasi = (kat: string): number => {
    const rutinTotal = expRutin
      .filter((e) => e.kat === kat && isExpRutinActive(e.mulaiY, e.mulaiM, e.selesaiY, e.selesaiM, y, m))
      .reduce((a, e) => a + e.jumlah, 0);

    const extraTotal = expEx
      .filter((x) => x.bk === selB && x.kat === kat)
      .reduce((a, x) => a + x.jumlah, 0);

    let cicilanTotal = 0;
    if (kat === "Installment") {
      cicilanTotal = hutang.filter((h) => {
        if (h.htipe !== "cicilan") return false;
        const start = h.mulaiY * 12 + h.mulaiM;
        const end = h.selesaiY * 12 + h.selesaiM;
        const cur = y * 12 + m;
        return cur >= start && cur <= end && h.sudah < h.pokok;
      }).reduce((a, h) => a + h.cicilan, 0);
    }

    return rutinTotal + extraTotal + cicilanTotal;
  };

  const handleAdd = () => {
    if (!newKat || !newJumlah || Number(newJumlah) <= 0) return;
    addBudget({ id: nanoid(), kat: newKat, jumlah: Number(newJumlah) });
    toast.add("Budget berhasil ditambahkan", "success");
    setNewKat("");
    setNewJumlah("");
    setAddMode(false);
  };

  const handleEdit = (id: string) => {
    if (!editJumlah || Number(editJumlah) <= 0) return;
    updBudget(id, { jumlah: Number(editJumlah) });
    toast.add("Budget diperbarui", "success");
    setEditId(null);
    setEditJumlah("");
  };

  const handleDelete = (id: string) => {
    delBudget(id);
    toast.add("Budget dihapus", "success");
  };

  const inputCls = "w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400";

  return (
    <Card>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-slate-700 flex items-center gap-2">
          <Target size={16} className="text-indigo-500" /> Budget vs Realisasi
        </h3>
        {availableKats.length > 0 && !addMode && (
          <Button size="sm" variant="ghost" onClick={() => { setAddMode(true); setNewKat(availableKats[0]); }}>
            <Plus size={14} /> Set Budget
          </Button>
        )}
      </div>

      {addMode && (
        <div className="bg-indigo-50/60 rounded-xl p-3 mb-4 space-y-2">
          <select value={newKat} onChange={(e) => setNewKat(e.target.value)} className={inputCls}>
            {availableKats.map((k) => <option key={k} value={k}>{k}</option>)}
          </select>
          <div className="flex gap-2">
            <NumericInput value={newJumlah} onChange={setNewJumlah} className={inputCls} placeholder="Target budget (Rp)" />
            <button onClick={handleAdd} className="p-2 rounded-xl bg-indigo-500 text-white hover:bg-indigo-600 transition-colors flex-shrink-0">
              <Check size={16} />
            </button>
            <button onClick={() => setAddMode(false)} className="p-2 rounded-xl bg-slate-200 text-slate-500 hover:bg-slate-300 transition-colors flex-shrink-0">
              <X size={16} />
            </button>
          </div>
        </div>
      )}

      {budgets.length === 0 && !addMode ? (
        <p className="text-xs text-slate-400 text-center py-6">
          Belum ada budget. Tambahkan target budget per kategori pengeluaran untuk evaluasi.
        </p>
      ) : (
        <div className="space-y-3">
          {budgets.map((b) => {
            const real = getRealisasi(b.kat);
            const pct = b.jumlah > 0 ? Math.round((real / b.jumlah) * 100) : 0;
            const barColor = pct >= 90 ? "bg-red-500" : pct >= 70 ? "bg-amber-500" : "bg-emerald-500";
            const isEditing = editId === b.id;

            return (
              <div key={b.id} className="group">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-medium text-slate-600">{b.kat}</span>
                  <div className="flex items-center gap-1.5">
                    {isEditing ? (
                      <div className="flex items-center gap-1">
                        <NumericInput value={editJumlah} onChange={setEditJumlah} className="w-28 bg-white border border-indigo-200 rounded-lg px-2 py-1 text-xs text-slate-700 focus:outline-none focus:ring-1 focus:ring-indigo-300" />
                        <button onClick={() => handleEdit(b.id)} className="p-1 rounded-lg hover:bg-emerald-50 text-emerald-500">
                          <Check size={12} />
                        </button>
                        <button onClick={() => setEditId(null)} className="p-1 rounded-lg hover:bg-slate-100 text-slate-400">
                          <X size={12} />
                        </button>
                      </div>
                    ) : (
                      <>
                        <span className="text-xs text-slate-400">
                          {fmt(real)} / {fmt(b.jumlah)}
                        </span>
                        <span className={`text-xs font-bold ${pct >= 90 ? "text-red-500" : pct >= 70 ? "text-amber-500" : "text-emerald-600"}`}>
                          {pct}%
                        </span>
                        <button
                          onClick={() => { setEditId(b.id); setEditJumlah(String(b.jumlah)); }}
                          className="p-1 rounded-lg opacity-0 group-hover:opacity-100 hover:bg-indigo-50 text-slate-400 hover:text-indigo-500 transition-all"
                        >
                          <Pencil size={11} />
                        </button>
                        <button onClick={() => handleDelete(b.id)} className="p-1 rounded-lg opacity-0 group-hover:opacity-100 hover:bg-red-50 text-slate-400 hover:text-red-500 transition-all">
                          <Trash2 size={11} />
                        </button>
                      </>
                    )}
                  </div>
                </div>
                <div className="h-2 bg-slate-200/60 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${barColor}`}
                    style={{ width: `${Math.min(pct, 100)}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </Card>
  );
}
