"use client";
import { Plus, ArrowLeftRight, CreditCard, TrendingUp } from "lucide-react";
import Link from "next/link";

const actions = [
  { href: "/aruskas", label: "Arus Kas", icon: Plus, bg: "bg-emerald-50", color: "text-emerald-600" },
  { href: "/aruskas", label: "Transfer", icon: ArrowLeftRight, bg: "bg-indigo-50", color: "text-indigo-600" },
  { href: "/hutang", label: "Hutang", icon: CreditCard, bg: "bg-amber-50", color: "text-amber-600" },
  { href: "/investasi", label: "Investasi", icon: TrendingUp, bg: "bg-violet-50", color: "text-violet-600" },
];

export default function QuickActions() {
  return (
    <div className="grid grid-cols-4 gap-3">
      {actions.map((a) => (
        <Link key={a.label} href={a.href} className="group">
          <div className={`${a.bg} rounded-2xl p-4 flex flex-col items-center gap-2 transition-all duration-200 group-hover:shadow-md group-hover:scale-[1.02]`}>
            <a.icon size={22} className={a.color} />
            <span className="text-xs font-medium text-slate-600">{a.label}</span>
          </div>
        </Link>
      ))}
    </div>
  );
}
