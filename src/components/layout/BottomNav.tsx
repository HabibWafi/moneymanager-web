"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, ArrowLeftRight, CreditCard, TrendingUp, BarChart3, Settings } from "lucide-react";

const NAV = [
  { href: "/", label: "Home", icon: Home },
  { href: "/aruskas", label: "Cash Flow", icon: ArrowLeftRight },
  { href: "/hutang", label: "Debts", icon: CreditCard },
  { href: "/investasi", label: "Invest", icon: TrendingUp },
  { href: "/analitik", label: "Analytics", icon: BarChart3 },
  { href: "/pengaturan", label: "Settings", icon: Settings },
];

export default function BottomNav() {
  const pathname = usePathname();
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-xl border-t border-white/60 z-40 safe-bottom">
      <div className="flex items-center justify-around px-1 py-1.5">
        {NAV.map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center gap-0.5 px-2 py-1.5 rounded-xl min-w-[52px] transition-all duration-200 ${
                active ? "text-indigo-600 bg-indigo-50" : "text-slate-400"
              }`}
            >
              <item.icon size={20} />
              <span className="text-[10px] font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
