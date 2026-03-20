"use client";
import { useState } from "react";
import { nanoid } from "nanoid";
import { useAppStore } from "@/store/useAppStore";
import { KE } from "@/lib/constants";
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";

export default function AddExpRutinModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const expRutin = useAppStore((s) => s.expRutin);
  const saveER = useAppStore((s) => s.saveER);

  const [nama, setNama] = useState("");
  const [jumlah, setJumlah] = useState("");
  const [tipe, setTipe] = useState<"tetap" | "cicilan">("tetap");
  const [kat, setKat] = useState(KE[0]);
  const [mulaiY, setMulaiY] = useState(new Date().getFullYear());
  const [mulaiM, setMulaiM] = useState(new Date().getMonth() + 1);
  const [selesaiY, setSelesaiY] = useState<number | undefined>();
  const [selesaiM, setSelesaiM] = useState<number | undefined>();

  const handleSubmit = () => {
    if (!nama || !jumlah || Number(jumlah) <= 0) return;
    saveER([...expRutin, {
      id: nanoid(), nama, jumlah: Number(jumlah), tipe, kat,
      mulaiY, mulaiM, selesaiY, selesaiM,
    }]);
    setNama("");
    setJumlah("");
    onClose();
  };

  const inputCls = "w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400";

  return (
    <Modal open={open} onClose={onClose} title="Tambah Pengeluaran Rutin">
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-600 mb-1.5">Nama</label>
          <input value={nama} onChange={(e) => setNama(e.target.value)} placeholder="Internet" className={inputCls} />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-600 mb-1.5">Kategori</label>
          <select value={kat} onChange={(e) => setKat(e.target.value)} className={inputCls}>
            {KE.map((k) => <option key={k} value={k}>{k}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-600 mb-1.5">Tipe</label>
          <div className="flex gap-2">
            {(["tetap", "cicilan"] as const).map((t) => (
              <button key={t} type="button" onClick={() => setTipe(t)}
                className={`flex-1 py-2.5 rounded-xl text-sm font-medium border-2 transition-all ${tipe === t ? "border-indigo-500 bg-indigo-50 text-indigo-600" : "border-slate-200 text-slate-500 hover:bg-slate-50"}`}>
                {t === "tetap" ? "Tetap" : "Cicilan"}
              </button>
            ))}
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-600 mb-1.5">Jumlah/Bulan (Rp)</label>
          <input type="number" value={jumlah} onChange={(e) => setJumlah(e.target.value)} placeholder="0" className={inputCls} />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-1.5">Mulai (B/T)</label>
            <div className="flex gap-2">
              <input type="number" value={mulaiM} onChange={(e) => setMulaiM(Number(e.target.value))} min={1} max={12} className={inputCls} />
              <input type="number" value={mulaiY} onChange={(e) => setMulaiY(Number(e.target.value))} className={inputCls} />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-1.5">Selesai (opsional)</label>
            <div className="flex gap-2">
              <input type="number" value={selesaiM ?? ""} onChange={(e) => setSelesaiM(e.target.value ? Number(e.target.value) : undefined)} min={1} max={12} placeholder="B" className={inputCls} />
              <input type="number" value={selesaiY ?? ""} onChange={(e) => setSelesaiY(e.target.value ? Number(e.target.value) : undefined)} placeholder="T" className={inputCls} />
            </div>
          </div>
        </div>
        <Button fullWidth onClick={handleSubmit}>Simpan</Button>
      </div>
    </Modal>
  );
}
