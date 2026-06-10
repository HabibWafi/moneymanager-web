"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, ArrowLeftRight, CreditCard, TrendingUp, BarChart3, Settings, Wallet } from "lucide-react";
import UserMenu from "@/components/auth/UserMenu";

const NAV = [
  { href: "/", label: "Home", icon: Home },
  { href: "/aruskas", label: "Cash Flow", icon: ArrowLeftRight },
  { href: "/hutang", label: "Debts", icon: CreditCard },
  { href: "/investasi", label: "Investments", icon: TrendingUp },
  { href: "/analitik", label: "Analytics", icon: BarChart3 },
  { href: "/pengaturan", label: "Settings", icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden md:flex flex-col w-[240px] h-screen fixed left-0 top-0 bg-white/70 backdrop-blur-xl border-r border-white/60 z-40">
      <div className="flex items-center gap-3 px-6 h-16 border-b border-indigo-50">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-600 to-violet-600 shadow-md shadow-indigo-200/50 flex items-center justify-center">
          <Wallet size={18} className="text-white" />
        </div>
        <span className="font-bold text-lg bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">MoneyManager</span>
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
                  ? "bg-indigo-100 text-indigo-700 shadow-sm shadow-indigo-100"
                  : "text-slate-500 hover:bg-indigo-50/60 hover:text-indigo-600"
              }`}
            >
              <item.icon size={20} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
      <div className="px-4 py-4 border-t border-indigo-50">
        <UserMenu />
      </div>
    </aside>
  );
}
