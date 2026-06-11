"use client";
import { create } from "zustand";
import { useEffect } from "react";
import { CheckCircle, XCircle, Info, X } from "lucide-react";

type ToastType = "success" | "error" | "info";

interface Toast {
  id: string;
  msg: string;
  type: ToastType;
}

interface ToastStore {
  toasts: Toast[];
  add: (msg: string, type?: ToastType) => void;
  remove: (id: string) => void;
}

export const useToast = create<ToastStore>((set) => ({
  toasts: [],
  add: (msg, type = "success") => {
    const id = Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
    set((s) => ({ toasts: [...s.toasts, { id, msg, type }] }));
    setTimeout(() => {
      set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) }));
    }, 3000);
  },
  remove: (id) => set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),
}));

const icons = {
  success: CheckCircle,
  error: XCircle,
  info: Info,
};

const colors = {
  success: "bg-emerald-50 border-emerald-200 text-emerald-700",
  error: "bg-red-50 border-red-200 text-red-700",
  info: "bg-indigo-50 border-indigo-200 text-indigo-700",
};

const iconColors = {
  success: "text-emerald-500",
  error: "text-red-500",
  info: "text-indigo-500",
};

function ToastItem({ toast }: { toast: Toast }) {
  const remove = useToast((s) => s.remove);
  const Icon = icons[toast.type];

  return (
    <div className={`flex items-center gap-2.5 px-4 py-3 rounded-xl border shadow-lg backdrop-blur-sm animate-slide-in-right ${colors[toast.type]}`}>
      <Icon size={18} className={`flex-shrink-0 ${iconColors[toast.type]}`} />
      <span className="text-sm font-medium flex-1">{toast.msg}</span>
      <button onClick={() => remove(toast.id)} className="p-0.5 rounded-lg hover:bg-black/5 transition-colors flex-shrink-0">
        <X size={14} />
      </button>
    </div>
  );
}

export function ToastContainer() {
  const toasts = useToast((s) => s.toasts);

  useEffect(() => {
    const style = document.getElementById("toast-animations");
    if (!style) {
      const el = document.createElement("style");
      el.id = "toast-animations";
      el.textContent = `
        @keyframes slide-in-right {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        .animate-slide-in-right {
          animation: slide-in-right 0.3s ease-out;
        }
      `;
      document.head.appendChild(el);
    }
  }, []);

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-[9999] space-y-2 max-w-sm">
      {toasts.map((t) => (
        <ToastItem key={t.id} toast={t} />
      ))}
    </div>
  );
}
