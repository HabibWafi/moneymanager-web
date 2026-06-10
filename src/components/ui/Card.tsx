"use client";
import { ReactNode } from "react";

export default function Card({
  children,
  className = "",
  onClick,
}: {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
}) {
  return (
    <div
      onClick={onClick}
      className={`bg-white/80 backdrop-blur-sm rounded-2xl border border-white/60 shadow-card p-5 ${className}`}
    >
      {children}
    </div>
  );
}
