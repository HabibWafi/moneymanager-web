"use client";
import { useState, useRef } from "react";
import { useAppStore } from "@/store/useAppStore";
import { fmt } from "@/lib/helpers";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import AddBankModal from "@/components/modals/AddBankModal";
import AddPendapatanRutinModal from "@/components/modals/AddPendapatanRutinModal";
import AddExpRutinModal from "@/components/modals/AddExpRutinModal";
import { Plus, Trash2, Download, Upload, Landmark, ArrowDownLeft, ArrowUpRight, ToggleLeft, ToggleRight } from "lucide-react";

export default function PengaturanPage() {
  const banks = useAppStore((s) => s.banks);
  const saveBanks = useAppStore((s) => s.saveBanks);
  const pendapatanRutin = useAppStore((s) => s.pendapatanRutin);
  const savePR = useAppStore((s) => s.savePR);
  const expRutin = useAppStore((s) => s.expRutin);
  const saveER = useAppStore((s) => s.saveER);
  const exportData = useAppStore((s) => s.exportData);
  const importData = useAppStore((s) => s.importData);

  const [showAddBank, setShowAddBank] = useState(false);
  const [showAddPR, setShowAddPR] = useState(false);
  const [showAddER, setShowAddER] = useState(false);
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
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const data = JSON.parse(ev.target?.result as string);
        importData(data);
        alert("Data berhasil diimpor!");
      } catch {
        alert("File tidak valid!");
      }
    };
    reader.readAsText(file);
    e.target.value = "";
  };

  const deleteBank = (id: string) => saveBanks(banks.filter((b) => b.id !== id));
  const deletePR = (id: string) => savePR(pendapatanRutin.filter((p) => p.id !== id));
  const togglePR = (id: string) => savePR(pendapatanRutin.map((p) => p.id === id ? { ...p, aktif: !p.aktif } : p));
  const deleteER = (id: string) => saveER(expRutin.filter((e) => e.id !== id));

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
                <div className="flex items-center gap-3">
                  <span className="text-sm font-bold text-slate-600">{fmt(b.saldo)}</span>
                  <button onClick={() => deleteBank(b.id)} className="p-1 rounded-lg opacity-0 group-hover:opacity-100 hover:bg-red-50 text-slate-400 hover:text-red-500 transition-all">
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Pendapatan Rutin */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-slate-700 flex items-center gap-2">
            <ArrowDownLeft size={16} className="text-emerald-500" /> Pendapatan Rutin
          </h3>
          <Button size="sm" onClick={() => setShowAddPR(true)}><Plus size={14} /> Tambah</Button>
        </div>
        {pendapatanRutin.length === 0 ? (
          <p className="text-xs text-slate-400 text-center py-4">Belum ada pendapatan rutin</p>
        ) : (
          <div className="space-y-2">
            {pendapatanRutin.map((p) => (
              <div key={p.id} className="flex items-center justify-between p-3 bg-slate-50/80 border border-slate-100/60 rounded-xl group">
                <div className="flex items-center gap-3">
                  <button onClick={() => togglePR(p.id)} className="text-slate-400 hover:text-indigo-500 transition-colors">
                    {p.aktif ? <ToggleRight size={20} className="text-emerald-500" /> : <ToggleLeft size={20} />}
                  </button>
                  <div>
                    <p className={`text-sm font-medium ${p.aktif ? "text-slate-700" : "text-slate-400 line-through"}`}>{p.nama}</p>
                    <p className="text-xs text-slate-400">{p.kat} · {p.tipe === "tetap" ? "Bulanan" : "Harian"}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-bold text-emerald-600">{fmt(p.jumlah)}{p.tipe === "harian" ? "/hari" : "/bln"}</span>
                  <button onClick={() => deletePR(p.id)} className="p-1 rounded-lg opacity-0 group-hover:opacity-100 hover:bg-red-50 text-slate-400 hover:text-red-500 transition-all">
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Pengeluaran Rutin */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-slate-700 flex items-center gap-2">
            <ArrowUpRight size={16} className="text-red-500" /> Pengeluaran Rutin
          </h3>
          <Button size="sm" onClick={() => setShowAddER(true)}><Plus size={14} /> Tambah</Button>
        </div>
        {expRutin.length === 0 ? (
          <p className="text-xs text-slate-400 text-center py-4">Belum ada pengeluaran rutin</p>
        ) : (
          <div className="space-y-2">
            {expRutin.map((e) => (
              <div key={e.id} className="flex items-center justify-between p-3 bg-slate-50/80 border border-slate-100/60 rounded-xl group">
                <div>
                  <p className="text-sm font-medium text-slate-700">{e.nama}</p>
                  <div className="flex items-center gap-2">
                    <p className="text-xs text-slate-400">{e.kat} · {e.tipe === "tetap" ? "Tetap" : "Cicilan"}</p>
                    <Badge color="slate">{e.mulaiM}/{e.mulaiY}{e.selesaiY ? ` — ${e.selesaiM}/${e.selesaiY}` : ""}</Badge>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-bold text-red-500">{fmt(e.jumlah)}/bln</span>
                  <button onClick={() => deleteER(e.id)} className="p-1 rounded-lg opacity-0 group-hover:opacity-100 hover:bg-red-50 text-slate-400 hover:text-red-500 transition-all">
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
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
      <AddPendapatanRutinModal open={showAddPR} onClose={() => setShowAddPR(false)} />
      <AddExpRutinModal open={showAddER} onClose={() => setShowAddER(false)} />
    </div>
  );
}
