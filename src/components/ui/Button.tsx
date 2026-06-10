"use client";
import { ReactNode, ButtonHTMLAttributes } from "react";

const variants: Record<string, string> = {
  primary: "bg-gradient-to-r from-indigo-600 to-violet-600 text-white hover:from-indigo-700 hover:to-violet-700 shadow-md shadow-indigo-200/50",
  secondary: "bg-white/80 backdrop-blur-sm text-slate-700 border border-slate-200/60 hover:bg-white hover:border-indigo-200 hover:text-indigo-600",
  danger: "bg-gradient-to-r from-red-500 to-rose-500 text-white hover:from-red-600 hover:to-rose-600 shadow-md shadow-red-200/50",
  ghost: "text-slate-600 hover:bg-indigo-50 hover:text-indigo-600",
  outline: "border-2 border-indigo-200 text-indigo-600 hover:bg-indigo-50 hover:border-indigo-300",
  success: "bg-gradient-to-r from-emerald-500 to-teal-500 text-white hover:from-emerald-600 hover:to-teal-600 shadow-md shadow-emerald-200/50",
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
