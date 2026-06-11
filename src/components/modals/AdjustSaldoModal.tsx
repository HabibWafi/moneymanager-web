"use client";
import { useState, useEffect } from "react";
import { useAppStore } from "@/store/useAppStore";
import { useToast } from "@/components/ui/Toast";
import { fmt } from "@/lib/helpers";
import type { Bank } from "@/lib/types";
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";
import NumericInput from "@/components/ui/NumericInput";

interface Props {
  open: boolean;
  onClose: () => void;
  bank: Bank | null;
}

export default function AdjustSaldoModal({ open, onClose, bank }: Props) {
  const saveBanks = useAppStore((s) => s.saveBanks);
  const banks = useAppStore((s) => s.banks);
  const toast = useToast();

  const [saldo, setSaldo] = useState("");

  useEffect(() => {
    if (open && bank) {
      setSaldo(String(bank.saldo));
    }
  }, [open, bank?.id]);

  const handleSubmit = () => {
    if (!bank || !saldo) return;
    const newSaldo = Number(saldo);
    const updatedBanks = banks.map((b) =>
      b.id === bank.id ? { ...b, saldo: newSaldo } : b
    );
    saveBanks(updatedBanks);
    toast.add("Saldo berhasil disesuaikan", "success");
    onClose();
  };

  const inputCls = "w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400";

  return (
    <Modal open={open} onClose={onClose} title="Sesuaikan Saldo">
      <div className="space-y-4">
        {bank && (
          <div className="bg-slate-50 rounded-xl p-3">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: bank.warna }} />
              <p className="text-sm font-semibold text-slate-700">{bank.nama}</p>
            </div>
            <p className="text-xs text-slate-400">Saldo saat ini: <span className="font-semibold text-slate-600">{fmt(bank.saldo)}</span></p>
          </div>
        )}
        <div>
          <label className="block text-sm font-medium text-slate-600 mb-1.5">Saldo Baru (Rp)</label>
          <NumericInput value={saldo} onChange={setSaldo} className={inputCls} />
          <p className="text-xs text-slate-400 mt-1">Gunakan ini untuk menyesuaikan saldo jika ada transaksi di luar aplikasi</p>
        </div>
        <Button fullWidth onClick={handleSubmit}>Simpan</Button>
      </div>
    </Modal>
  );
}
