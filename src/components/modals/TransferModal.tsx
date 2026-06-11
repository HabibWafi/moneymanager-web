"use client";
import { useState } from "react";
import { nanoid } from "nanoid";
import { useAppStore } from "@/store/useAppStore";
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";
import NumericInput from "@/components/ui/NumericInput";

export default function TransferModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const banks = useAppStore((s) => s.banks);
  const doBankTransfer = useAppStore((s) => s.doBankTransfer);

  const [dari, setDari] = useState(banks[0]?.id || "");
  const [ke, setKe] = useState(banks[1]?.id || "");
  const [jumlah, setJumlah] = useState("");
  const [ket, setKet] = useState("");

  const handleSubmit = () => {
    if (!dari || !ke || dari === ke || !jumlah || Number(jumlah) <= 0) return;
    doBankTransfer({ id: nanoid(), dari, ke, jumlah: Number(jumlah), ket, tgl: new Date().toISOString() });
    setJumlah("");
    setKet("");
    onClose();
  };

  const inputCls = "w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400";

  return (
    <Modal open={open} onClose={onClose} title="Transfer Antar Rekening">
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-600 mb-1.5">Dari</label>
          <select value={dari} onChange={(e) => setDari(e.target.value)} className={inputCls}>
            {banks.map((b) => <option key={b.id} value={b.id}>{b.nama}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-600 mb-1.5">Ke</label>
          <select value={ke} onChange={(e) => setKe(e.target.value)} className={inputCls}>
            {banks.map((b) => <option key={b.id} value={b.id}>{b.nama}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-600 mb-1.5">Jumlah (Rp)</label>
          <NumericInput value={jumlah} onChange={setJumlah} className={inputCls} />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-600 mb-1.5">Keterangan</label>
          <input value={ket} onChange={(e) => setKet(e.target.value)} placeholder="Opsional" className={inputCls} />
        </div>
        <Button fullWidth onClick={handleSubmit}>Transfer</Button>
      </div>
    </Modal>
  );
}
