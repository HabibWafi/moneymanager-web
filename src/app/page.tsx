"use client";
import { useAppStore } from "@/store/useAppStore";
import { mOpts } from "@/lib/helpers";
import TotalAsetHero from "@/components/home/TotalAsetHero";
import SummaryCards from "@/components/home/SummaryCards";
import PortfolioBar from "@/components/home/PortfolioBar";
import QuickActions from "@/components/home/QuickActions";
import WealthAllocationChart from "@/components/home/WealthAllocationChart";
import IncomeExpensePie from "@/components/home/IncomeExpensePie";
import FutureProjection from "@/components/home/FutureProjection";

export default function HomePage() {
  const selB = useAppStore((s) => s.selB);
  const setSelB = useAppStore((s) => s.setSelB);
  const opts = mOpts();

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 space-y-5">
      {/* Month Selector */}
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-slate-800">Beranda</h1>
        <select
          value={selB}
          onChange={(e) => setSelB(e.target.value)}
          className="text-sm bg-white border border-slate-200 rounded-xl px-3 py-2 text-slate-600 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400"
        >
          {opts.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
      </div>

      <TotalAsetHero />
      <QuickActions />
      <SummaryCards />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <PortfolioBar />
        <WealthAllocationChart />
      </div>
      <IncomeExpensePie />
      <FutureProjection />
    </div>
  );
}
