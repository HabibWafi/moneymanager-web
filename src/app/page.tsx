"use client";
import { useAppStore } from "@/store/useAppStore";
import { monthOptionsRange, firstDataMonth } from "@/lib/helpers";
import TotalAsetHero from "@/components/home/TotalAsetHero";
import SummaryCards from "@/components/home/SummaryCards";
import PortfolioBar from "@/components/home/PortfolioBar";
import QuickActions from "@/components/home/QuickActions";
import WealthAllocationChart from "@/components/home/WealthAllocationChart";
import IncomeExpensePie from "@/components/home/IncomeExpensePie";
import FutureProjection from "@/components/home/FutureProjection";
import RealizationNotif from "@/components/home/RealizationNotif";

export default function HomePage() {
  const selB = useAppStore((s) => s.selB);
  const setSelB = useAppStore((s) => s.setSelB);
  const incEx = useAppStore((s) => s.incEx);
  const expEx = useAppStore((s) => s.expEx);
  const snapshots = useAppStore((s) => s.snapshots);
  const opts = monthOptionsRange(firstDataMonth({ incEx, expEx, snapshots }), 6);

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 space-y-5">
      {/* Month Selector */}
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-slate-900">Beranda</h1>
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

      <TotalAsetHero />
      <QuickActions />
      <SummaryCards />
      <RealizationNotif />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <PortfolioBar />
        <WealthAllocationChart />
      </div>
      <IncomeExpensePie />
      <FutureProjection />
    </div>
  );
}
