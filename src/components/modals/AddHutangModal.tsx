"use client";
import { useState } from "react";
import { nanoid } from "nanoid";
import { useAppStore } from "@/store/useAppStore";
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";

export default function AddHutangModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const addHutang = useAppStore((s) => s.addHutang);

  const [nama, setNama] = useState("");
  const [htipe, setHtipe] = useState<"cicilan" | "hutang">("cicilan");
  const [pokok, setPokok] = useState("");
  const [cicilan, setCicilan] = useState("");
  const [sudah, setSudah] = useState("");
  const [mulaiY, setMulaiY] = useState(new Date().getFullYear());
  const [mulaiM, setMulaiM] = useState(new Date().getMonth() + 1);
  const [selesaiY, setSelesaiY] = useState(new Date().getFullYear() + 1);
  const [selesaiM, setSelesaiM] = useState(new Date().getMonth() + 1);

  const handleSubmit = () => {
    if (!nama || !pokok || Number(pokok) <= 0) return;
    addHutang({
      id: nanoid(), nama, htipe,
      pokok: Number(pokok), cicilan: Number(cicilan) || 0, sudah: Number(sudah) || 0,
      mulaiY, mulaiM, selesaiY, selesaiM,
    });
    setNama("");
    setPokok("");
    setCicilan("");
    setSudah("");
    onClose();
  };

  const inputCls = "w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400";

  return (
    <Modal open={open} onClose={onClose} title="Tambah Hutang / Cicilan">
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-600 mb-1.5">Nama</label>
          <input value={nama} onChange={(e) => setNama(e.target.value)} placeholder="Contoh: KPR Rumah" className={inputCls} />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-600 mb-1.5">Tipe</label>
          <div className="flex gap-2">
            {(["cicilan", "hutang"] as const).map((t) => (
              <button key={t} type="button" onClick={() => setHtipe(t)}
                className={`flex-1 py-2.5 rounded-xl text-sm font-medium border-2 transition-all ${htipe === t ? "border-indigo-500 bg-indigo-50 text-indigo-600" : "border-slate-200 text-slate-500 hover:bg-slate-50"}`}>
                {t === "cicilan" ? "Cicilan" : "Hutang"}
              </button>
            ))}
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-600 mb-1.5">Total Pokok (Rp)</label>
          <input type="number" value={pokok} onChange={(e) => setPokok(e.target.value)} placeholder="0" className={inputCls} />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-600 mb-1.5">Cicilan/Bulan (Rp)</label>
          <input type="number" value={cicilan} onChange={(e) => setCicilan(e.target.value)} placeholder="0" className={inputCls} />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-600 mb-1.5">Sudah Dibayar (Rp)</label>
          <input type="number" value={sudah} onChange={(e) => setSudah(e.target.value)} placeholder="0" className={inputCls} />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-1.5">Mulai (Bulan/Tahun)</label>
            <div className="flex gap-2">
              <input type="number" value={mulaiM} onChange={(e) => setMulaiM(Number(e.target.value))} min={1} max={12} className={inputCls} />
              <input type="number" value={mulaiY} onChange={(e) => setMulaiY(Number(e.target.value))} className={inputCls} />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-1.5">Selesai (Bulan/Tahun)</label>
            <div className="flex gap-2">
              <input type="number" value={selesaiM} onChange={(e) => setSelesaiM(Number(e.target.value))} min={1} max={12} className={inputCls} />
              <input type="number" value={selesaiY} onChange={(e) => setSelesaiY(Number(e.target.value))} className={inputCls} />
            </div>
          </div>
        </div>
        <Button fullWidth onClick={handleSubmit}>Simpan</Button>
      </div>
    </Modal>
  );
}
