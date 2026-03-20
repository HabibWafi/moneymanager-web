"use client";
import { useState } from "react";
import { nanoid } from "nanoid";
import { useAppStore } from "@/store/useAppStore";
import { KI } from "@/lib/constants";
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";

export default function AddPendapatanRutinModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const pendapatanRutin = useAppStore((s) => s.pendapatanRutin);
  const savePR = useAppStore((s) => s.savePR);

  const [nama, setNama] = useState("");
  const [jumlah, setJumlah] = useState("");
  const [tipe, setTipe] = useState<"tetap" | "harian">("tetap");
  const [kat, setKat] = useState(KI[0]);

  const handleSubmit = () => {
    if (!nama || !jumlah || Number(jumlah) <= 0) return;
    savePR([...pendapatanRutin, { id: nanoid(), nama, jumlah: Number(jumlah), tipe, kat, aktif: true }]);
    setNama("");
    setJumlah("");
    onClose();
  };

  const inputCls = "w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400";

  return (
    <Modal open={open} onClose={onClose} title="Tambah Pendapatan Rutin">
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-600 mb-1.5">Nama</label>
          <input value={nama} onChange={(e) => setNama(e.target.value)} placeholder="Gaji Pokok" className={inputCls} />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-600 mb-1.5">Kategori</label>
          <select value={kat} onChange={(e) => setKat(e.target.value)} className={inputCls}>
            {KI.map((k) => <option key={k} value={k}>{k}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-600 mb-1.5">Tipe</label>
          <div className="flex gap-2">
            {(["tetap", "harian"] as const).map((t) => (
              <button key={t} type="button" onClick={() => setTipe(t)}
                className={`flex-1 py-2.5 rounded-xl text-sm font-medium border-2 transition-all ${tipe === t ? "border-indigo-500 bg-indigo-50 text-indigo-600" : "border-slate-200 text-slate-500 hover:bg-slate-50"}`}>
                {t === "tetap" ? "Bulanan Tetap" : "Harian (x HK)"}
              </button>
            ))}
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-600 mb-1.5">
            {tipe === "tetap" ? "Jumlah/Bulan (Rp)" : "Jumlah/Hari (Rp)"}
          </label>
          <input type="number" value={jumlah} onChange={(e) => setJumlah(e.target.value)} placeholder="0" className={inputCls} />
        </div>
        <Button fullWidth onClick={handleSubmit}>Simpan</Button>
      </div>
    </Modal>
  );
}
