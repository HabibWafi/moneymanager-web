"use client";
import { useState, useEffect } from "react";
import { useAppStore } from "@/store/useAppStore";
import { useToast } from "@/components/ui/Toast";
import { fmt } from "@/lib/helpers";
import type { Hutang } from "@/lib/types";
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";
import NumericInput from "@/components/ui/NumericInput";
import { Minus, Plus } from "lucide-react";

interface Props {
  open: boolean;
  onClose: () => void;
  hutang: Hutang | null;
}

export default function BayarHutangModal({ open, onClose, hutang }: Props) {
  const banks = useAppStore((s) => s.banks);
  const bayarHutang = useAppStore((s) => s.bayarHutang);
  const toast = useToast();

  const sisa = hutang ? hutang.pokok - hutang.sudah : 0;
  const isCicilan = hutang?.htipe === "cicilan";
  const maxBulan = isCicilan && hutang!.cicilan > 0 ? Math.ceil(sisa / hutang!.cicilan) : 1;

  const [bulan, setBulan] = useState(1);
  const [jumlah, setJumlah] = useState("");
  const [bankId, setBankId] = useState("");

  useEffect(() => {
    if (open && hutang) {
      setBulan(1);
      setJumlah(isCicilan ? "" : "");
      setBankId(hutang.bankId || banks[0]?.id || "");
    }
  }, [open, hutang?.id]);

  const totalCicilan = isCicilan ? Math.min(hutang!.cicilan * bulan, sisa) : 0;

  const handleSubmit = () => {
    if (!hutang || !bankId) return;
    const amt = isCicilan ? totalCicilan : Math.min(Number(jumlah) || 0, sisa);
    if (amt <= 0) return;
    bayarHutang(hutang.id, amt, bankId);
    toast.add(`Pembayaran ${fmt(amt)} berhasil`, "success");
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

        {isCicilan ? (
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-2">Jumlah Bulan</label>
            <div className="flex items-center justify-center gap-4">
              <button
                type="button"
                onClick={() => setBulan(Math.max(1, bulan - 1))}
                disabled={bulan <= 1}
                className="w-10 h-10 rounded-xl border-2 border-slate-200 flex items-center justify-center text-slate-500 hover:border-indigo-400 hover:text-indigo-600 disabled:opacity-30 disabled:hover:border-slate-200 disabled:hover:text-slate-500 transition-all"
              >
                <Minus size={18} />
              </button>
              <div className="text-center min-w-[100px]">
                <p className="text-3xl font-bold text-indigo-600">{bulan}</p>
                <p className="text-xs text-slate-400">bulan</p>
              </div>
              <button
                type="button"
                onClick={() => setBulan(Math.min(maxBulan, bulan + 1))}
                disabled={bulan >= maxBulan}
                className="w-10 h-10 rounded-xl border-2 border-slate-200 flex items-center justify-center text-slate-500 hover:border-indigo-400 hover:text-indigo-600 disabled:opacity-30 disabled:hover:border-slate-200 disabled:hover:text-slate-500 transition-all"
              >
                <Plus size={18} />
              </button>
            </div>
            <div className="mt-3 bg-indigo-50 rounded-xl p-3 text-center">
              <p className="text-xs text-indigo-500 mb-0.5">Total Pembayaran</p>
              <p className="text-xl font-bold text-indigo-700">{fmt(totalCicilan)}</p>
              <p className="text-[10px] text-indigo-400 mt-0.5">
                {hutang!.cicilan > 0 ? `${bulan} × ${fmt(hutang!.cicilan)}` : ""}
              </p>
            </div>
          </div>
        ) : (
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-1.5">
              Jumlah Bayar (Rp)
            </label>
            <NumericInput value={jumlah} onChange={setJumlah} className={inputCls} />
            {sisa > 0 && (
              <button
                type="button"
                onClick={() => setJumlah(String(sisa))}
                className="mt-1 text-xs text-indigo-500 hover:text-indigo-700"
              >
                Lunasi semua ({fmt(sisa)})
              </button>
            )}
          </div>
        )}

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

        <Button
          fullWidth
          variant="danger"
          onClick={handleSubmit}
          disabled={!bankId || (isCicilan ? totalCicilan <= 0 : !jumlah || Number(jumlah) <= 0)}
        >
          Bayar {isCicilan ? fmt(totalCicilan) : jumlah ? fmt(Number(jumlah)) : ""}
        </Button>
      </div>
    </Modal>
  );
}
