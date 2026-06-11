"use client";
import { ReactNode, useEffect } from "react";
import Sidebar from "./Sidebar";
import BottomNav from "./BottomNav";
import { useAppStore } from "@/store/useAppStore";
import { useAuth } from "@/components/auth/AuthProvider";

export default function AppShell({ children }: { children: ReactNode }) {
  const init = useAppStore((s) => s.init);
  const loaded = useAppStore((s) => s.loaded);
  const loadError = useAppStore((s) => s.loadError);
  const { user, loading: authLoading } = useAuth();

  useEffect(() => {
    if (!authLoading && user) {
      init(user.id);
    }
  }, [init, authLoading, user?.id]);

  // While the session is being resolved, show a brief spinner.
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50/80 via-indigo-50/30 to-violet-50/50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-indigo-300 border-t-indigo-600 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-500 text-sm font-medium">Memuat data...</p>
        </div>
      </div>
    );
  }

  // No session → public pages (login, unauthorized, callback) render standalone.
  if (!user) {
    return <>{children}</>;
  }

  if (loadError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50/80 via-indigo-50/30 to-violet-50/50 flex items-center justify-center p-6">
        <div className="text-center max-w-sm">
          <p className="text-slate-700 text-sm font-semibold mb-1">Terjadi Kesalahan</p>
          <p className="text-slate-500 text-sm mb-5">{loadError}</p>
          <button
            onClick={() => user && init(user.id)}
            className="px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-violet-600 text-white text-sm font-semibold rounded-xl shadow-md shadow-indigo-200/50 hover:from-indigo-700 hover:to-violet-700 transition-all active:scale-[0.98]"
          >
            Coba Lagi
          </button>
        </div>
      </div>
    );
  }

  if (!loaded) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50/80 via-indigo-50/30 to-violet-50/50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-indigo-300 border-t-indigo-600 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-500 text-sm font-medium">Memuat data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Sidebar />
      <main className="md:ml-[240px] pb-24 md:pb-8">
        {children}
      </main>
      <BottomNav />
    </div>
  );
}
