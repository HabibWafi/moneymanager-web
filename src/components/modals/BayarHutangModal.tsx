"use client";
import { useState, useEffect, useMemo } from "react";
import { useAppStore } from "@/store/useAppStore";
import { useToast } from "@/components/ui/Toast";
import { fmt, ymk, currentYM } from "@/lib/helpers";
import type { Hutang } from "@/lib/types";
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";
import NumericInput from "@/components/ui/NumericInput";
import { Minus, Plus, Check, Undo2 } from "lucide-react";

interface Props {
  open: boolean;
  onClose: () => void;
  hutang: Hutang | null;
}

export default function BayarHutangModal({ open, onClose, hutang }: Props) {
  const banks = useAppStore((s) => s.banks);
  const bayarHutang = useAppStore((s) => s.bayarHutang);
  const undoBayarHutang = useAppStore((s) => s.undoBayarHutang);
  const debtPayments = useAppStore((s) => s.debtPayments);
  const toast = useToast();

  const sisa = hutang ? hutang.pokok - hutang.sudah : 0;
  const isCicilan = hutang?.htipe === "cicilan";

  const [bulan, setBulan] = useState(1);
  const [jumlah, setJumlah] = useState("");
  const [bankId, setBankId] = useState("");
  const [startBk, setStartBk] = useState("");

  const { y: cy, m: cm } = currentYM();
  const curBk = ymk(cy, cm);

  const hutangPayments = useMemo(() => {
    if (!hutang) return [];
    return debtPayments.filter((d) => d.hutangId === hutang.id);
  }, [debtPayments, hutang?.id]);

  const paidBks = useMemo(() => new Set(hutangPayments.map((d) => d.bk)), [hutangPayments]);

  const monthOptions = useMemo(() => {
    if (!hutang) return [];
    const opts: { label: string; value: string }[] = [];
    const startIdx = hutang.mulaiY * 12 + hutang.mulaiM;
    const endIdx = hutang.selesaiY * 12 + hutang.selesaiM;
    for (let idx = startIdx; idx <= endIdx; idx++) {
      const y = Math.floor((idx - 1) / 12);
      const m = ((idx - 1) % 12) + 1;
      const bk = ymk(y, m);
      if (paidBks.has(bk)) continue;
      const d = new Date(y, m - 1, 1);
      opts.push({ label: d.toLocaleDateString("id-ID", { month: "long", year: "numeric" }), value: bk });
    }
    return opts;
  }, [hutang, paidBks]);

  useEffect(() => {
    if (open && hutang) {
      setBulan(1);
      setJumlah("");
      setBankId(hutang.bankId || banks.find((b) => b.utama)?.id || banks[0]?.id || "");
      const firstUnpaid = monthOptions.find((o) => o.value >= curBk) || monthOptions[0];
      setStartBk(firstUnpaid?.value || curBk);
    }
  }, [open, hutang?.id]);

  const selectedMonths = useMemo(() => {
    if (!isCicilan || monthOptions.length === 0) return [];
    const startIdx = monthOptions.findIndex((o) => o.value === startBk);
    if (startIdx < 0) return [];
    return monthOptions.slice(startIdx, startIdx + bulan);
  }, [startBk, bulan, monthOptions, isCicilan]);

  const maxBulan = useMemo(() => {
    if (!isCicilan || monthOptions.length === 0) return 1;
    const startIdx = monthOptions.findIndex((o) => o.value === startBk);
    if (startIdx < 0) return 1;
    const remaining = monthOptions.length - startIdx;
    const maxBySisa = hutang!.cicilan > 0 ? Math.ceil(sisa / hutang!.cicilan) : 1;
    return Math.min(remaining, maxBySisa);
  }, [isCicilan, monthOptions, startBk, sisa, hutang?.cicilan]);

  const totalCicilan = isCicilan ? Math.min(hutang!.cicilan * bulan, sisa) : 0;

  const handleSubmit = () => {
    if (!hutang || !bankId) return;

    if (isCicilan) {
      for (const mo of selectedMonths) {
        const amt = Math.min(hutang.cicilan, hutang.pokok - hutang.sudah);
        if (amt <= 0) break;
        bayarHutang(hutang.id, amt, bankId, mo.value);
      }
      toast.add(`Pembayaran ${fmt(totalCicilan)} berhasil (${selectedMonths.length} bulan)`, "success");
    } else {
      const amt = Math.min(Number(jumlah) || 0, sisa);
      if (amt <= 0) return;
      bayarHutang(hutang.id, amt, bankId, curBk);
      toast.add(`Pembayaran ${fmt(amt)} berhasil`, "success");
    }
    onClose();
  };

  const handleUndo = (bk: string) => {
    if (!hutang) return;
    undoBayarHutang(hutang.id, bk);
    toast.add("Pembayaran dibatalkan", "info");
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
            <label className="block text-sm font-medium text-slate-600 mb-1.5">Mulai Bulan</label>
            <select value={startBk} onChange={(e) => { setStartBk(e.target.value); setBulan(1); }} className={inputCls}>
              {monthOptions.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>

            <label className="block text-sm font-medium text-slate-600 mb-2 mt-3">Jumlah Bulan</label>
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

            {selectedMonths.length > 0 && (
              <div className="mt-3 space-y-1">
                <p className="text-xs font-medium text-slate-400">Bulan yang akan dibayar</p>
                {selectedMonths.map((mo) => (
                  <div key={mo.value} className="flex items-center justify-between text-xs p-2 bg-white border border-slate-100 rounded-lg">
                    <span className="text-slate-600">{mo.label}</span>
                    <span className="font-semibold text-indigo-600">{fmt(hutang!.cicilan)}</span>
                  </div>
                ))}
              </div>
            )}
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
          disabled={!bankId || (isCicilan ? totalCicilan <= 0 || selectedMonths.length === 0 : !jumlah || Number(jumlah) <= 0)}
        >
          Bayar {isCicilan ? fmt(totalCicilan) : jumlah ? fmt(Number(jumlah)) : ""}
        </Button>

        {hutangPayments.length > 0 && (
          <div className="pt-3 border-t border-slate-100">
            <p className="text-xs font-medium text-slate-400 mb-2">Riwayat Pembayaran</p>
            <div className="space-y-1.5 max-h-40 overflow-y-auto">
              {hutangPayments.sort((a, b) => a.bk.localeCompare(b.bk)).map((dp) => {
                const canUndo = dp.bk === curBk;
                const bankNm = banks.find((b) => b.id === dp.bankId)?.nama || "-";
                const [py, pm] = dp.bk.split("-").map(Number);
                const label = new Date(py, pm - 1, 1).toLocaleDateString("id-ID", { month: "long", year: "numeric" });
                return (
                  <div key={dp.id} className="flex items-center justify-between p-2 bg-emerald-50/80 border border-emerald-100/60 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Check size={12} className="text-emerald-500" />
                      <div>
                        <p className="text-xs font-medium text-slate-700">{label}</p>
                        <p className="text-[10px] text-slate-400">{bankNm}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-emerald-600">{fmt(dp.jumlah)}</span>
                      {canUndo && (
                        <button
                          onClick={() => handleUndo(dp.bk)}
                          className="p-1 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-500 transition-all"
                          title="Batalkan pembayaran bulan ini"
                        >
                          <Undo2 size={12} />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
}
