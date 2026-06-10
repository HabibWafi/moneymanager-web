"use client";
import { useAppStore } from "@/store/useAppStore";
import { fmt } from "@/lib/helpers";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { ArrowLeftRight } from "lucide-react";

export default function TransferPanel({ onTransfer }: { onTransfer: () => void }) {
  const banks = useAppStore((s) => s.banks);
  const bankTrf = useAppStore((s) => s.bankTrf);

  const recent = [...bankTrf].reverse().slice(0, 5);

  return (
    <Card>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-slate-700">Transfer Antar Rekening</h3>
        <Button size="sm" variant="secondary" onClick={onTransfer}>
          <ArrowLeftRight size={14} /> Transfer
        </Button>
      </div>

      {recent.length === 0 ? (
        <p className="text-xs text-slate-400 text-center py-4">Belum ada transfer</p>
      ) : (
        <div className="space-y-2">
          {recent.map((t) => {
            const dari = banks.find((b) => b.id === t.dari);
            const ke = banks.find((b) => b.id === t.ke);
            return (
              <div key={t.id} className="flex items-center justify-between p-3 bg-indigo-50/40 border border-indigo-100/40 rounded-xl">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: dari?.warna || "#94a3b8" }} />
                  <span className="text-xs text-slate-600">{dari?.nama || "?"}</span>
                  <ArrowLeftRight size={12} className="text-slate-400" />
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: ke?.warna || "#94a3b8" }} />
                  <span className="text-xs text-slate-600">{ke?.nama || "?"}</span>
                </div>
                <span className="text-xs font-semibold text-indigo-600">{fmt(t.jumlah)}</span>
              </div>
            );
          })}
        </div>
      )}
    </Card>
  );
}
