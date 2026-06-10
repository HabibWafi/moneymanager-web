"use client";
import { Plus, ArrowLeftRight, CreditCard, TrendingUp } from "lucide-react";
import Link from "next/link";

const actions = [
  { href: "/aruskas", label: "Arus Kas", icon: Plus, bg: "bg-emerald-100", color: "text-emerald-600", border: "border border-emerald-200/60" },
  { href: "/aruskas", label: "Transfer", icon: ArrowLeftRight, bg: "bg-indigo-100", color: "text-indigo-600", border: "border border-indigo-200/60" },
  { href: "/hutang", label: "Hutang", icon: CreditCard, bg: "bg-amber-100", color: "text-amber-600", border: "border border-amber-200/60" },
  { href: "/investasi", label: "Investasi", icon: TrendingUp, bg: "bg-violet-100", color: "text-violet-600", border: "border border-violet-200/60" },
];

export default function QuickActions() {
  return (
    <div className="grid grid-cols-4 gap-3">
      {actions.map((a) => (
        <Link key={a.label} href={a.href} className="group">
          <div className={`${a.bg} ${a.border} rounded-2xl p-4 flex flex-col items-center gap-2 transition-all duration-200 group-hover:shadow-lg group-hover:-translate-y-0.5`}>
            <a.icon size={22} className={a.color} />
            <span className="text-xs font-medium text-slate-600">{a.label}</span>
          </div>
        </Link>
      ))}
    </div>
  );
}
