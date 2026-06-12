"use client";
import { useState } from "react";
import { Hutang } from "@/lib/types";
import { fmt, ymk, currentYM } from "@/lib/helpers";
import { useAppStore } from "@/store/useAppStore";
import { useToast } from "@/components/ui/Toast";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import { Trash2, Banknote, CalendarClock, ChevronDown, ChevronUp, Check, Undo2 } from "lucide-react";

interface Props {
  item: Hutang;
  onDelete: () => void;
  onBayar: () => void;
}

function getDueStatus(tglBayar: number): { label: string; color: string } {
  const today = new Date().getDate();
  if (today < tglBayar) return { label: "Mendatang", color: "cyan" };
  if (today === tglBayar) return { label: "Jatuh Tempo Hari Ini", color: "amber" };
  return { label: "Terlambat", color: "red" };
}

export default function HutangCard({ item, onDelete, onBayar }: Props) {
  const debtPayments = useAppStore((s) => s.debtPayments);
  const undoBayarHutang = useAppStore((s) => s.undoBayarHutang);
  const banks = useAppStore((s) => s.banks);
  const toast = useToast();

  const [showHistory, setShowHistory] = useState(false);

  const pct = item.pokok > 0 ? Math.min((item.sudah / item.pokok) * 100, 100) : 0;
  const sisa = item.pokok - item.sudah;
  const lunas = sisa <= 0;

  const now = new Date();
  const { y: cy, m: cm } = currentYM();
  const curBk = ymk(cy, cm);
  const curMonth = now.getFullYear() * 12 + (now.getMonth() + 1);
  const start = item.mulaiY * 12 + item.mulaiM;
  const end = item.selesaiY * 12 + item.selesaiM;
  const isActiveMonth = curMonth >= start && curMonth <= end;

  const showDueStatus = item.htipe === "cicilan" && item.tglBayar && !lunas && isActiveMonth;
  const dueStatus = showDueStatus ? getDueStatus(item.tglBayar!) : null;

  const payments = debtPayments
    .filter((d) => d.hutangId === item.id)
    .sort((a, b) => a.bk.localeCompare(b.bk));

  const handleUndo = (bk: string) => {
    undoBayarHutang(item.id, bk);
    toast.add("Pembayaran dibatalkan", "info");
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <div>
          <h4 className="text-sm font-semibold text-slate-700">{item.nama}</h4>
          <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
            <Badge color={item.htipe === "cicilan" ? "amber" : "red"}>
              {item.htipe === "cicilan" ? "Cicilan" : "Hutang"}
            </Badge>
            {lunas && <Badge color="emerald">Lunas</Badge>}
            {dueStatus && <Badge color={dueStatus.color}>{dueStatus.label}</Badge>}
          </div>
        </div>
        <button onClick={onDelete} className="p-1.5 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-500 transition-all">
          <Trash2 size={14} />
        </button>
      </div>

      <div className="space-y-2 mb-3">
        <div className="flex justify-between text-xs">
          <span className="text-slate-400">Pokok</span>
          <span className="font-semibold text-slate-600">{fmt(item.pokok)}</span>
        </div>
        <div className="flex justify-between text-xs">
          <span className="text-slate-400">Sudah Dibayar</span>
          <span className="font-semibold text-emerald-600">{fmt(item.sudah)}</span>
        </div>
        <div className="flex justify-between text-xs">
          <span className="text-slate-400">Sisa</span>
          <span className="font-semibold text-red-500">{fmt(Math.max(sisa, 0))}</span>
        </div>
        {item.htipe === "cicilan" && item.cicilan > 0 && (
          <div className="flex justify-between text-xs">
            <span className="text-slate-400">Cicilan/Bulan</span>
            <span className="font-semibold text-indigo-600">{fmt(item.cicilan)}</span>
          </div>
        )}
        {item.htipe === "cicilan" && item.tglBayar && (
          <div className="flex justify-between text-xs">
            <span className="text-slate-400 flex items-center gap-1"><CalendarClock size={12} /> Tanggal Bayar</span>
            <span className="font-semibold text-slate-600">Tanggal {item.tglBayar}</span>
          </div>
        )}
      </div>

      <div className="h-2 bg-slate-200/60 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ${pct >= 100 ? "bg-emerald-500" : pct >= 70 ? "bg-amber-500" : "bg-indigo-500"}`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <div className="flex justify-between mt-1.5">
        <span className="text-[10px] text-slate-400">
          {item.mulaiM}/{item.mulaiY} — {item.selesaiM}/{item.selesaiY}
        </span>
        <span className="text-[10px] font-semibold text-slate-500">{Math.round(pct)}%</span>
      </div>

      {payments.length > 0 && (
        <div className="mt-3 pt-3 border-t border-slate-100">
          <button
            onClick={() => setShowHistory(!showHistory)}
            className="flex items-center gap-1 text-xs font-medium text-slate-500 hover:text-indigo-600 transition-colors w-full justify-between"
          >
            <span>Riwayat Pembayaran ({payments.length})</span>
            {showHistory ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>
          {showHistory && (
            <div className="mt-2 space-y-1.5 max-h-40 overflow-y-auto">
              {payments.map((dp) => {
                const canUndo = dp.bk === curBk;
                const bankNm = banks.find((b) => b.id === dp.bankId)?.nama || "-";
                const [py, pm] = dp.bk.split("-").map(Number);
                const label = new Date(py, pm - 1, 1).toLocaleDateString("id-ID", { month: "short", year: "numeric" });
                return (
                  <div key={dp.id} className="flex items-center justify-between p-2 bg-emerald-50/80 border border-emerald-100/60 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Check size={12} className="text-emerald-500" />
                      <div>
                        <p className="text-xs font-medium text-slate-700">{label}</p>
                        <p className="text-[10px] text-slate-400">{bankNm}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-emerald-600">{fmt(dp.jumlah)}</span>
                      {canUndo && (
                        <button
                          onClick={() => handleUndo(dp.bk)}
                          className="p-1 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-500 transition-all"
                          title="Batalkan pembayaran bulan ini"
                        >
                          <Undo2 size={12} />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {!lunas && (
        <div className="mt-3 pt-3 border-t border-slate-100">
          <Button
            size="sm"
            variant={item.htipe === "cicilan" ? "primary" : "success"}
            fullWidth
            onClick={onBayar}
          >
            <Banknote size={14} />
            {item.htipe === "cicilan" ? `Bayar Cicilan ${fmt(item.cicilan)}` : "Bayar Hutang"}
          </Button>
        </div>
      )}
    </Card>
  );
}
