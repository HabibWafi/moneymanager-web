"use client";
import { ReactNode } from "react";

const colors: Record<string, string> = {
  indigo: "bg-indigo-50 text-indigo-600 border-indigo-100",
  emerald: "bg-emerald-50 text-emerald-600 border-emerald-100",
  red: "bg-red-50 text-red-600 border-red-100",
  amber: "bg-amber-50 text-amber-600 border-amber-100",
  violet: "bg-violet-50 text-violet-600 border-violet-100",
  cyan: "bg-cyan-50 text-cyan-600 border-cyan-100",
  slate: "bg-slate-100 text-slate-600 border-slate-200",
};

export default function Badge({
  children,
  color = "indigo",
}: {
  children: ReactNode;
  color?: string;
}) {
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${colors[color] || colors.indigo}`}>
      {children}
    </span>
  );
}
