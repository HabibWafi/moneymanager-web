"use client";
import { ReactNode, useEffect } from "react";
import Sidebar from "./Sidebar";
import BottomNav from "./BottomNav";
import { useAppStore } from "@/store/useAppStore";

export default function AppShell({ children }: { children: ReactNode }) {
  const init = useAppStore((s) => s.init);
  const loaded = useAppStore((s) => s.loaded);

  useEffect(() => {
    init();
  }, [init]);

  if (!loaded) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-400 text-sm font-medium">Memuat data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar />
      <main className="md:ml-[240px] pb-24 md:pb-8">
        {children}
      </main>
      <BottomNav />
    </div>
  );
}
