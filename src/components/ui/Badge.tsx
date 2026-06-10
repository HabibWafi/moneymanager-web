"use client";
import { ReactNode } from "react";

const colors: Record<string, string> = {
  indigo: "bg-indigo-100 text-indigo-700 border-indigo-200",
  emerald: "bg-emerald-100 text-emerald-700 border-emerald-200",
  red: "bg-red-100 text-red-700 border-red-200",
  amber: "bg-amber-100 text-amber-700 border-amber-200",
  violet: "bg-violet-100 text-violet-700 border-violet-200",
  cyan: "bg-cyan-100 text-cyan-700 border-cyan-200",
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
