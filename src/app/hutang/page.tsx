"use client";
import { useState } from "react";
import { useAppStore } from "@/store/useAppStore";
import { useToast } from "@/components/ui/Toast";
import { fmt } from "@/lib/helpers";
import type { Hutang } from "@/lib/types";
import HutangCard from "@/components/hutang/HutangCard";
import AddHutangModal from "@/components/modals/AddHutangModal";
import BayarHutangModal from "@/components/modals/BayarHutangModal";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import { Plus, CreditCard } from "lucide-react";

export default function HutangPage() {
  const hutang = useAppStore((s) => s.hutang);
  const delHutang = useAppStore((s) => s.delHutang);
  const toast = useToast();
  const [showAdd, setShowAdd] = useState(false);
  const [bayarTarget, setBayarTarget] = useState<Hutang | null>(null);

  const totalPokok = hutang.reduce((a, h) => a + h.pokok, 0);
  const totalSudah = hutang.reduce((a, h) => a + h.sudah, 0);
  const totalSisa = totalPokok - totalSudah;
  const totalCicilan = hutang.filter((h) => h.htipe === "cicilan").reduce((a, h) => a + h.cicilan, 0);

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-slate-900">Hutang & Cicilan</h1>
        <Button size="sm" onClick={() => setShowAdd(true)}>
          <Plus size={16} /> Tambah
        </Button>
      </div>

      <Card className="bg-gradient-to-br from-amber-100 to-orange-100 border-amber-200/60">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 bg-amber-200 rounded-xl flex items-center justify-center">
            <CreditCard size={20} className="text-amber-600" />
          </div>
          <h3 className="text-sm font-semibold text-slate-700">Ringkasan Hutang</h3>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white/70 rounded-xl p-3">
            <p className="text-xs text-slate-400">Total Hutang</p>
            <p className="text-lg font-bold text-slate-700">{fmt(totalPokok)}</p>
          </div>
          <div className="bg-white/70 rounded-xl p-3">
            <p className="text-xs text-slate-400">Sisa Hutang</p>
            <p className="text-lg font-bold text-red-500">{fmt(Math.max(totalSisa, 0))}</p>
          </div>
          <div className="bg-white/70 rounded-xl p-3">
            <p className="text-xs text-slate-400">Sudah Dibayar</p>
            <p className="text-lg font-bold text-emerald-600">{fmt(totalSudah)}</p>
          </div>
          <div className="bg-white/70 rounded-xl p-3">
            <p className="text-xs text-slate-400">Cicilan/Bulan</p>
            <p className="text-lg font-bold text-indigo-600">{fmt(totalCicilan)}</p>
          </div>
        </div>
      </Card>

      {hutang.length === 0 ? (
        <Card>
          <p className="text-sm text-slate-400 text-center py-8">Belum ada hutang atau cicilan</p>
        </Card>
      ) : (
        <div className="space-y-3">
          {hutang.map((h) => (
            <HutangCard
              key={h.id}
              item={h}
              onDelete={() => { delHutang(h.id); toast.add("Hutang dihapus", "success"); }}
              onBayar={() => setBayarTarget(h)}
            />
          ))}
        </div>
      )}

      <AddHutangModal open={showAdd} onClose={() => setShowAdd(false)} />
      <BayarHutangModal open={!!bayarTarget} onClose={() => setBayarTarget(null)} hutang={bayarTarget} />
    </div>
  );
}
