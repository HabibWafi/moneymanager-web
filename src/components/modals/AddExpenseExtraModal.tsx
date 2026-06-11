"use client";
import { useState } from "react";
import { nanoid } from "nanoid";
import { useAppStore } from "@/store/useAppStore";
import { KE } from "@/lib/constants";
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";
import NumericInput from "@/components/ui/NumericInput";

export default function AddExpenseExtraModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const selB = useAppStore((s) => s.selB);
  const banks = useAppStore((s) => s.banks);
  const addExpEx = useAppStore((s) => s.addExpEx);

  const [kat, setKat] = useState(KE[0]);
  const [desc, setDesc] = useState("");
  const [jumlah, setJumlah] = useState("");
  const [sumber, setSumber] = useState(banks[0]?.id || "");

  const handleSubmit = () => {
    if (!desc || !jumlah || Number(jumlah) <= 0) return;
    addExpEx({ id: nanoid(), bk: selB, kat, desc, jumlah: Number(jumlah), sumber });
    if (sumber) {
      const store = useAppStore.getState();
      const updBanks = store.banks.map((b) =>
        b.id === sumber ? { ...b, saldo: b.saldo - Number(jumlah) } : b
      );
      store.saveBanks(updBanks);
    }
    setDesc("");
    setJumlah("");
    onClose();
  };

  const inputCls = "w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400";

  return (
    <Modal open={open} onClose={onClose} title="Tambah Pengeluaran Extra">
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-600 mb-1.5">Kategori</label>
          <select value={kat} onChange={(e) => setKat(e.target.value)} className={inputCls}>
            {KE.map((k) => <option key={k} value={k}>{k}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-600 mb-1.5">Deskripsi</label>
          <input value={desc} onChange={(e) => setDesc(e.target.value)} placeholder="Contoh: Beli groceries" className={inputCls} />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-600 mb-1.5">Jumlah (Rp)</label>
          <NumericInput value={jumlah} onChange={setJumlah} className={inputCls} />
        </div>
        {banks.length > 0 && (
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-1.5">Dari Rekening</label>
            <select value={sumber} onChange={(e) => setSumber(e.target.value)} className={inputCls}>
              {banks.map((b) => <option key={b.id} value={b.id}>{b.nama}</option>)}
            </select>
          </div>
        )}
        <Button fullWidth variant="danger" onClick={handleSubmit}>Simpan</Button>
      </div>
    </Modal>
  );
}
