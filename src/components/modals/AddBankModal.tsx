"use client";
import { useState } from "react";
import { nanoid } from "nanoid";
import { useAppStore } from "@/store/useAppStore";
import { BANK_COLORS } from "@/lib/constants";
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";

export default function AddBankModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const banks = useAppStore((s) => s.banks);
  const saveBanks = useAppStore((s) => s.saveBanks);

  const [nama, setNama] = useState("");
  const [saldo, setSaldo] = useState("");
  const [tipe, setTipe] = useState<"bank" | "cash">("bank");
  const [warna, setWarna] = useState(BANK_COLORS[0]);

  const handleSubmit = () => {
    if (!nama) return;
    saveBanks([...banks, { id: nanoid(), nama, saldo: Number(saldo) || 0, warna, tipe }]);
    setNama("");
    setSaldo("");
    onClose();
  };

  const inputCls = "w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400";

  return (
    <Modal open={open} onClose={onClose} title="Tambah Rekening">
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-600 mb-1.5">Nama Rekening</label>
          <input value={nama} onChange={(e) => setNama(e.target.value)} placeholder="Contoh: BCA" className={inputCls} />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-600 mb-1.5">Saldo Awal (Rp)</label>
          <input type="number" value={saldo} onChange={(e) => setSaldo(e.target.value)} placeholder="0" className={inputCls} />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-600 mb-1.5">Tipe</label>
          <div className="flex gap-2">
            {(["bank", "cash"] as const).map((t) => (
              <button key={t} type="button" onClick={() => setTipe(t)}
                className={`flex-1 py-2.5 rounded-xl text-sm font-medium border-2 transition-all ${tipe === t ? "border-indigo-500 bg-indigo-50 text-indigo-600" : "border-slate-200 text-slate-500 hover:bg-slate-50"}`}>
                {t === "bank" ? "Bank" : "Cash"}
              </button>
            ))}
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-600 mb-1.5">Warna</label>
          <div className="flex gap-2 flex-wrap">
            {BANK_COLORS.map((c) => (
              <button key={c} type="button" onClick={() => setWarna(c)}
                className={`w-8 h-8 rounded-full transition-all ${warna === c ? "ring-2 ring-offset-2 ring-indigo-400 scale-110" : "hover:scale-110"}`}
                style={{ backgroundColor: c }} />
            ))}
          </div>
        </div>
        <Button fullWidth onClick={handleSubmit}>Simpan</Button>
      </div>
    </Modal>
  );
}
