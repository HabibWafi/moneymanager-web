"use client";
import { useState, useRef } from "react";
import { useAppStore } from "@/store/useAppStore";
import { useToast } from "@/components/ui/Toast";
import { fmt } from "@/lib/helpers";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import AddBankModal from "@/components/modals/AddBankModal";
import AdjustSaldoModal from "@/components/modals/AdjustSaldoModal";
import { Plus, Trash2, Download, Upload, Landmark, Pencil, Star } from "lucide-react";
import type { Bank } from "@/lib/types";

export default function PengaturanPage() {
  const banks = useAppStore((s) => s.banks);
  const saveBanks = useAppStore((s) => s.saveBanks);
  const exportData = useAppStore((s) => s.exportData);
  const importData = useAppStore((s) => s.importData);

  const toast = useToast();

  const [showAddBank, setShowAddBank] = useState(false);
  const [adjustBank, setAdjustBank] = useState<Bank | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleExport = () => {
    const data = exportData();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `moneymanager-backup-${new Date().toISOString().split("T")[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.add("Data berhasil diexport!", "success");
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const data = JSON.parse(ev.target?.result as string);
        importData(data);
        toast.add("Data berhasil diimpor!", "success");
      } catch {
        toast.add("File tidak valid!", "error");
      }
    };
    reader.readAsText(file);
    e.target.value = "";
  };

  const deleteBank = (id: string) => {
    saveBanks(banks.filter((b) => b.id !== id));
    toast.add("Rekening dihapus", "success");
  };

  const toggleUtama = (id: string) => {
    const updated = banks.map((b) => ({ ...b, utama: b.id === id ? !b.utama : false }));
    saveBanks(updated);
    toast.add("Rekening utama diperbarui", "success");
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 space-y-5">
      <h1 className="text-xl font-bold text-slate-900">Pengaturan</h1>

      {/* Banks */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-slate-700 flex items-center gap-2">
            <Landmark size={16} className="text-indigo-500" /> Rekening / Kas
          </h3>
          <Button size="sm" onClick={() => setShowAddBank(true)}><Plus size={14} /> Tambah</Button>
        </div>
        {banks.length === 0 ? (
          <p className="text-xs text-slate-400 text-center py-4">Belum ada rekening</p>
        ) : (
          <div className="space-y-2">
            {banks.map((b) => (
              <div key={b.id} className="flex items-center justify-between p-3 bg-slate-50/80 border border-slate-100/60 rounded-xl group">
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 rounded-full flex-shrink-0" style={{ backgroundColor: b.warna }} />
                  <div>
                    <p className="text-sm font-medium text-slate-700">{b.nama}</p>
                    <p className="text-xs text-slate-400">{b.tipe === "bank" ? "Bank" : "Cash"}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-slate-600">{fmt(b.saldo)}</span>
                  <button onClick={() => toggleUtama(b.id)}
                    className={`p-1 rounded-lg transition-all ${b.utama ? "text-amber-500 hover:bg-amber-50" : "opacity-0 group-hover:opacity-100 text-slate-300 hover:text-amber-400 hover:bg-amber-50"}`}
                    title={b.utama ? "Rekening utama" : "Set sebagai utama"}>
                    <Star size={14} fill={b.utama ? "currentColor" : "none"} />
                  </button>
                  <button onClick={() => setAdjustBank(b)} className="p-1 rounded-lg opacity-0 group-hover:opacity-100 hover:bg-indigo-50 text-slate-400 hover:text-indigo-500 transition-all" title="Sesuaikan saldo">
                    <Pencil size={14} />
                  </button>
                  <button onClick={() => deleteBank(b.id)} className="p-1 rounded-lg opacity-0 group-hover:opacity-100 hover:bg-red-50 text-slate-400 hover:text-red-500 transition-all">
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
        <p className="text-xs text-slate-400 mt-3">Klik ikon pensil untuk menyesuaikan saldo rekening secara manual</p>
      </Card>

      {/* Backup/Restore */}
      <Card>
        <h3 className="text-sm font-semibold text-slate-700 mb-4">Backup & Restore</h3>
        <div className="flex gap-3">
          <Button variant="secondary" onClick={handleExport} className="flex-1">
            <Download size={16} /> Export Data
          </Button>
          <Button variant="outline" onClick={() => fileRef.current?.click()} className="flex-1">
            <Upload size={16} /> Import Data
          </Button>
          <input ref={fileRef} type="file" accept=".json" onChange={handleImport} className="hidden" />
        </div>
      </Card>

      <AddBankModal open={showAddBank} onClose={() => setShowAddBank(false)} />
      <AdjustSaldoModal open={!!adjustBank} onClose={() => setAdjustBank(null)} bank={adjustBank} />
    </div>
  );
}
