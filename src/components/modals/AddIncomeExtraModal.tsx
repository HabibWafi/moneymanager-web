"use client";
import { useState } from "react";
import { nanoid } from "nanoid";
import { useAppStore } from "@/store/useAppStore";
import { KI } from "@/lib/constants";
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";

export default function AddIncomeExtraModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const selB = useAppStore((s) => s.selB);
  const banks = useAppStore((s) => s.banks);
  const addIncEx = useAppStore((s) => s.addIncEx);

  const [kat, setKat] = useState(KI[0]);
  const [desc, setDesc] = useState("");
  const [jumlah, setJumlah] = useState("");
  const [sumber, setSumber] = useState(banks[0]?.id || "");

  const handleSubmit = () => {
    if (!desc || !jumlah || Number(jumlah) <= 0) return;
    addIncEx({ id: nanoid(), bk: selB, kat, desc, jumlah: Number(jumlah), sumber });
    // Update bank balance
    if (sumber) {
      const store = useAppStore.getState();
      const updBanks = store.banks.map((b) =>
        b.id === sumber ? { ...b, saldo: b.saldo + Number(jumlah) } : b
      );
      store.saveBanks(updBanks);
    }
    setDesc("");
    setJumlah("");
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose} title="Tambah Pendapatan Extra">
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-600 mb-1.5">Kategori</label>
          <select value={kat} onChange={(e) => setKat(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400">
            {KI.map((k) => <option key={k} value={k}>{k}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-600 mb-1.5">Deskripsi</label>
          <input value={desc} onChange={(e) => setDesc(e.target.value)} placeholder="Contoh: Bonus proyek" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400" />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-600 mb-1.5">Jumlah (Rp)</label>
          <input type="number" value={jumlah} onChange={(e) => setJumlah(e.target.value)} placeholder="0" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400" />
        </div>
        {banks.length > 0 && (
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-1.5">Masuk ke Rekening</label>
            <select value={sumber} onChange={(e) => setSumber(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400">
              {banks.map((b) => <option key={b.id} value={b.id}>{b.nama}</option>)}
            </select>
          </div>
        )}
        <Button fullWidth onClick={handleSubmit}>Simpan</Button>
      </div>
    </Modal>
  );
}
