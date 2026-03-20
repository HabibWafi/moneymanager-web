"use client";
import { ReactNode, ButtonHTMLAttributes } from "react";

const variants: Record<string, string> = {
  primary: "bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm shadow-indigo-200",
  secondary: "bg-slate-100 text-slate-700 hover:bg-slate-200",
  danger: "bg-red-500 text-white hover:bg-red-600 shadow-sm shadow-red-200",
  ghost: "text-slate-600 hover:bg-slate-100",
  outline: "border-2 border-slate-200 text-slate-700 hover:bg-slate-50",
  success: "bg-emerald-500 text-white hover:bg-emerald-600 shadow-sm shadow-emerald-200",
};

export default function Button({
  children,
  variant = "primary",
  className = "",
  fullWidth = false,
  size = "md",
  ...props
}: {
  children: ReactNode;
  variant?: keyof typeof variants;
  className?: string;
  fullWidth?: boolean;
  size?: "sm" | "md" | "lg";
} & ButtonHTMLAttributes<HTMLButtonElement>) {
  const sizeClass = size === "sm" ? "px-3 py-1.5 text-xs" : size === "lg" ? "px-6 py-3 text-base" : "px-4 py-2.5 text-sm";
  return (
    <button
      className={`inline-flex items-center justify-center gap-2 font-semibold rounded-xl transition-all duration-200 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed ${variants[variant] || variants.primary} ${sizeClass} ${fullWidth ? "w-full" : ""} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
