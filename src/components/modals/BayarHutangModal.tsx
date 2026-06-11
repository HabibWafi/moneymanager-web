"use client";
import { useState, useEffect } from "react";
import { useAppStore } from "@/store/useAppStore";
import { fmt } from "@/lib/helpers";
import type { Hutang } from "@/lib/types";
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";
import NumericInput from "@/components/ui/NumericInput";

interface Props {
  open: boolean;
  onClose: () => void;
  hutang: Hutang | null;
}

export default function BayarHutangModal({ open, onClose, hutang }: Props) {
  const banks = useAppStore((s) => s.banks);
  const bayarHutang = useAppStore((s) => s.bayarHutang);

  const sisa = hutang ? hutang.pokok - hutang.sudah : 0;
  const isCicilan = hutang?.htipe === "cicilan";

  const [jumlah, setJumlah] = useState("");
  const [bankId, setBankId] = useState("");

  useEffect(() => {
    if (open && hutang) {
      setJumlah(isCicilan ? String(hutang.cicilan) : "");
      setBankId(hutang.bankId || banks[0]?.id || "");
    }
  }, [open, hutang?.id]);

  const handleSubmit = () => {
    if (!hutang || !bankId || !jumlah || Number(jumlah) <= 0) return;
    const amt = Math.min(Number(jumlah), sisa);
    bayarHutang(hutang.id, amt, bankId);
    onClose();
  };

  const inputCls = "w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400";

  return (
    <Modal open={open} onClose={onClose} title={isCicilan ? "Bayar Cicilan" : "Bayar Hutang"}>
      <div className="space-y-4">
        {hutang && (
          <div className="bg-slate-50 rounded-xl p-3 space-y-1">
            <p className="text-sm font-semibold text-slate-700">{hutang.nama}</p>
            <div className="flex justify-between text-xs text-slate-500">
              <span>Sisa hutang</span>
              <span className="font-semibold text-red-500">{fmt(sisa)}</span>
            </div>
            {isCicilan && (
              <div className="flex justify-between text-xs text-slate-500">
                <span>Cicilan/bulan</span>
                <span className="font-semibold text-indigo-600">{fmt(hutang.cicilan)}</span>
              </div>
            )}
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-slate-600 mb-1.5">
            Jumlah Bayar (Rp)
          </label>
          <NumericInput
            value={jumlah}
            onChange={setJumlah}
            className={inputCls}
            disabled={isCicilan}
          />
          {!isCicilan && sisa > 0 && (
            <button
              type="button"
              onClick={() => setJumlah(String(sisa))}
              className="mt-1 text-xs text-indigo-500 hover:text-indigo-700"
            >
              Lunasi semua ({fmt(sisa)})
            </button>
          )}
        </div>

        {banks.length > 0 && (
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-1.5">Dari Rekening</label>
            <select value={bankId} onChange={(e) => setBankId(e.target.value)} className={inputCls}>
              {banks.map((b) => (
                <option key={b.id} value={b.id}>{b.nama} ({fmt(b.saldo)})</option>
              ))}
            </select>
          </div>
        )}

        <Button fullWidth variant="danger" onClick={handleSubmit} disabled={!bankId || !jumlah || Number(jumlah) <= 0}>
          Bayar {jumlah ? fmt(Number(jumlah)) : ""}
        </Button>
      </div>
    </Modal>
  );
}
