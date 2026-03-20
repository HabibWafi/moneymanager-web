"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, ArrowLeftRight, CreditCard, TrendingUp, BarChart3, Settings, Wallet } from "lucide-react";

const NAV = [
  { href: "/", label: "Beranda", icon: Home },
  { href: "/aruskas", label: "Arus Kas", icon: ArrowLeftRight },
  { href: "/hutang", label: "Hutang", icon: CreditCard },
  { href: "/investasi", label: "Investasi", icon: TrendingUp },
  { href: "/analitik", label: "Analitik", icon: BarChart3 },
  { href: "/pengaturan", label: "Pengaturan", icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden md:flex flex-col w-[240px] h-screen fixed left-0 top-0 bg-white border-r border-slate-200 z-40">
      <div className="flex items-center gap-3 px-6 h-16 border-b border-slate-100">
        <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center">
          <Wallet size={18} className="text-white" />
        </div>
        <span className="font-bold text-lg text-indigo-600">MoneyManager</span>
      </div>
      <nav className="flex-1 py-4 px-3 space-y-1">
        {NAV.map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                active
                  ? "bg-indigo-50 text-indigo-600 shadow-sm"
                  : "text-slate-500 hover:bg-slate-50 hover:text-slate-700"
              }`}
            >
              <item.icon size={20} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
      <div className="px-4 py-4 border-t border-slate-100">
        <div className="bg-gradient-to-br from-indigo-50 to-violet-50 rounded-xl p-4 text-center">
          <p className="text-xs text-slate-500 mb-1">Money Manager</p>
          <p className="text-xs font-medium text-indigo-600">v1.0 — Bright Theme</p>
        </div>
      </div>
    </aside>
  );
}
