"use client";
import { useAppStore } from "@/store/useAppStore";
import { useToast } from "@/components/ui/Toast";
import { fmt, ymk, currentYM, isExpRutinActive } from "@/lib/helpers";
import Card from "@/components/ui/Card";
import { Bell, Check } from "lucide-react";

interface PendingItem {
  type: "income_routine" | "expense_routine" | "income_extra" | "expense_extra";
  id: string;
  nama: string;
  jumlah: number;
  isIncome: boolean;
}

export default function RealizationNotif() {
  const pendapatanRutin = useAppStore((s) => s.pendapatanRutin);
  const expRutin = useAppStore((s) => s.expRutin);
  const incEx = useAppStore((s) => s.incEx);
  const expEx = useAppStore((s) => s.expEx);
  const realizationLog = useAppStore((s) => s.realizationLog);
  const realizeRoutine = useAppStore((s) => s.realizeRoutine);
  const realizeExtra = useAppStore((s) => s.realizeExtra);
  const toast = useToast();

  const { y, m } = currentYM();
  const curBk = ymk(y, m);
  const logKeys = new Set(realizationLog.map((r) => `${r.sourceType}:${r.sourceId}:${r.bk}`));

  const pending: PendingItem[] = [];

  for (const pr of pendapatanRutin) {
    if (!pr.aktif || pr.realisasi !== "manual") continue;
    if (!isExpRutinActive(pr.mulaiY, pr.mulaiM, pr.selesaiY, pr.selesaiM, y, m)) continue;
    if (logKeys.has(`income_routine:${pr.id}:${curBk}`)) continue;
    pending.push({ type: "income_routine", id: pr.id, nama: pr.nama, jumlah: pr.jumlah, isIncome: true });
  }

  for (const er of expRutin) {
    if (er.realisasi !== "manual") continue;
    if (!isExpRutinActive(er.mulaiY, er.mulaiM, er.selesaiY, er.selesaiM, y, m)) continue;
    if (logKeys.has(`expense_routine:${er.id}:${curBk}`)) continue;
    pending.push({ type: "expense_routine", id: er.id, nama: er.nama, jumlah: er.jumlah, isIncome: false });
  }

  for (const x of incEx) {
    if (x.status !== "belum" || x.realisasi !== "manual") continue;
    if (x.bk !== curBk) continue;
    pending.push({ type: "income_extra", id: x.id, nama: x.desc, jumlah: x.jumlah, isIncome: true });
  }

  for (const x of expEx) {
    if (x.status !== "belum" || x.realisasi !== "manual") continue;
    if (x.bk !== curBk) continue;
    pending.push({ type: "expense_extra", id: x.id, nama: x.desc, jumlah: x.jumlah, isIncome: false });
  }

  if (pending.length === 0) return null;

  const handleRealize = async (item: PendingItem) => {
    if (item.type === "income_routine" || item.type === "expense_routine") {
      await realizeRoutine(item.isIncome ? "income" : "expense", item.id, curBk);
    } else {
      await realizeExtra(item.isIncome ? "income" : "expense", item.id);
    }
    toast.add(`${item.nama} berhasil direalisasi`, "success");
  };

  return (
    <Card className="border-amber-200/60 bg-amber-50/30">
      <div className="flex items-center gap-2 mb-3">
        <Bell size={16} className="text-amber-500" />
        <h3 className="text-sm font-semibold text-amber-700">Transaksi Perlu Realisasi</h3>
        <span className="text-[10px] px-1.5 py-0.5 bg-amber-100 text-amber-600 rounded-full font-bold">{pending.length}</span>
      </div>
      <div className="space-y-2">
        {pending.map((item) => (
          <div key={`${item.type}-${item.id}`} className="flex items-center justify-between p-2.5 bg-white/80 border border-amber-100/60 rounded-xl">
            <div>
              <p className="text-sm font-medium text-slate-700">{item.nama}</p>
              <p className="text-xs text-slate-400">
                {item.isIncome ? "Pemasukan" : "Pengeluaran"} · {item.type.includes("routine") ? "Rutin" : "Extra"}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className={`text-sm font-bold ${item.isIncome ? "text-emerald-600" : "text-red-500"}`}>
                {item.isIncome ? "+" : "-"}{fmt(item.jumlah)}
              </span>
              <button
                onClick={() => handleRealize(item)}
                className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors"
              >
                <Check size={12} /> Realisasi
              </button>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
