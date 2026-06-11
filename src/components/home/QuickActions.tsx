"use client";
import { useState } from "react";
import { ArrowDownLeft, ArrowUpRight, CreditCard, TrendingUp } from "lucide-react";
import Link from "next/link";
import AddIncomeExtraModal from "@/components/modals/AddIncomeExtraModal";
import AddExpenseExtraModal from "@/components/modals/AddExpenseExtraModal";
import AddHutangModal from "@/components/modals/AddHutangModal";

export default function QuickActions() {
  const [showIncome, setShowIncome] = useState(false);
  const [showExpense, setShowExpense] = useState(false);
  const [showHutang, setShowHutang] = useState(false);

  return (
    <>
      <div className="grid grid-cols-4 gap-3">
        <button onClick={() => setShowIncome(true)} className="group">
          <div className="bg-emerald-100 border border-emerald-200/60 rounded-2xl p-4 flex flex-col items-center gap-2 transition-all duration-200 group-hover:shadow-lg group-hover:-translate-y-0.5">
            <ArrowDownLeft size={22} className="text-emerald-600" />
            <span className="text-xs font-medium text-slate-600">Pemasukan</span>
          </div>
        </button>
        <button onClick={() => setShowExpense(true)} className="group">
          <div className="bg-red-100 border border-red-200/60 rounded-2xl p-4 flex flex-col items-center gap-2 transition-all duration-200 group-hover:shadow-lg group-hover:-translate-y-0.5">
            <ArrowUpRight size={22} className="text-red-600" />
            <span className="text-xs font-medium text-slate-600">Pengeluaran</span>
          </div>
        </button>
        <button onClick={() => setShowHutang(true)} className="group">
          <div className="bg-amber-100 border border-amber-200/60 rounded-2xl p-4 flex flex-col items-center gap-2 transition-all duration-200 group-hover:shadow-lg group-hover:-translate-y-0.5">
            <CreditCard size={22} className="text-amber-600" />
            <span className="text-xs font-medium text-slate-600">Hutang</span>
          </div>
        </button>
        <Link href="/investasi" className="group">
          <div className="bg-violet-100 border border-violet-200/60 rounded-2xl p-4 flex flex-col items-center gap-2 transition-all duration-200 group-hover:shadow-lg group-hover:-translate-y-0.5">
            <TrendingUp size={22} className="text-violet-600" />
            <span className="text-xs font-medium text-slate-600">Investasi</span>
          </div>
        </Link>
      </div>

      <AddIncomeExtraModal open={showIncome} onClose={() => setShowIncome(false)} />
      <AddExpenseExtraModal open={showExpense} onClose={() => setShowExpense(false)} />
      <AddHutangModal open={showHutang} onClose={() => setShowHutang(false)} />
    </>
  );
}
