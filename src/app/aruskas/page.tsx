"use client";
import { useState } from "react";
import { useAppStore } from "@/store/useAppStore";
import { mOpts } from "@/lib/helpers";
import PendapatanPanel from "@/components/aruskas/PendapatanPanel";
import PengeluaranPanel from "@/components/aruskas/PengeluaranPanel";
import TransferPanel from "@/components/aruskas/TransferPanel";
import AddIncomeExtraModal from "@/components/modals/AddIncomeExtraModal";
import AddExpenseExtraModal from "@/components/modals/AddExpenseExtraModal";
import TransferModal from "@/components/modals/TransferModal";

export default function ArusKasPage() {
  const selB = useAppStore((s) => s.selB);
  const setSelB = useAppStore((s) => s.setSelB);
  const opts = mOpts();

  const [showAddInc, setShowAddInc] = useState(false);
  const [showAddExp, setShowAddExp] = useState(false);
  const [showTransfer, setShowTransfer] = useState(false);

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-slate-900">Arus Kas</h1>
        <select
          value={selB}
          onChange={(e) => setSelB(e.target.value)}
          className="text-sm bg-white/80 backdrop-blur-sm border border-slate-200/60 rounded-xl px-3 py-2 text-slate-600 font-medium hover:border-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 transition-colors"
        >
          {opts.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
      </div>

      <PendapatanPanel onAddExtra={() => setShowAddInc(true)} />
      <PengeluaranPanel onAddExtra={() => setShowAddExp(true)} />
      <TransferPanel onTransfer={() => setShowTransfer(true)} />

      <AddIncomeExtraModal open={showAddInc} onClose={() => setShowAddInc(false)} />
      <AddExpenseExtraModal open={showAddExp} onClose={() => setShowAddExp(false)} />
      <TransferModal open={showTransfer} onClose={() => setShowTransfer(false)} />
    </div>
  );
}
