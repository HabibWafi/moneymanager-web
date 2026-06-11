"use client";
import { useState } from "react";
import { nanoid } from "nanoid";
import { useAppStore } from "@/store/useAppStore";
import { useToast } from "@/components/ui/Toast";
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";
import NumericInput from "@/components/ui/NumericInput";
import MonthYearPicker from "@/components/ui/MonthYearPicker";

export default function AddHutangModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const addHutang = useAppStore((s) => s.addHutang);
  const banks = useAppStore((s) => s.banks);
  const toast = useToast();

  const [nama, setNama] = useState("");
  const [htipe, setHtipe] = useState<"cicilan" | "hutang">("cicilan");
  const [pokok, setPokok] = useState("");
  const [cicilan, setCicilan] = useState("");
  const [sudah, setSudah] = useState("");
  const [bankId, setBankId] = useState(banks[0]?.id || "");
  const [tglBayar, setTglBayar] = useState(1);
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
      bankId: bankId || undefined,
      tglBayar: htipe === "cicilan" ? tglBayar : undefined,
    });
    toast.add("Hutang berhasil ditambahkan", "success");
    setNama("");
    setPokok("");
    setCicilan("");
    setSudah("");
    onClose();
  };

  const inputCls = "w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400";
  const days = Array.from({ length: 28 }, (_, i) => i + 1);

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
          <p className="text-xs text-slate-400 mt-1.5">
            {htipe === "cicilan" ? "Otomatis masuk pengeluaran tiap bulan" : "Bayar manual kapan saja"}
          </p>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-600 mb-1.5">Total Pokok (Rp)</label>
          <NumericInput value={pokok} onChange={setPokok} className={inputCls} />
        </div>
        {htipe === "cicilan" && (
          <>
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1.5">Cicilan/Bulan (Rp)</label>
              <NumericInput value={cicilan} onChange={setCicilan} className={inputCls} />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1.5">Tanggal Bayar Tiap Bulan</label>
              <select value={tglBayar} onChange={(e) => setTglBayar(Number(e.target.value))} className={inputCls}>
                {days.map((d) => (
                  <option key={d} value={d}>Tanggal {d}</option>
                ))}
              </select>
            </div>
          </>
        )}
        <div>
          <label className="block text-sm font-medium text-slate-600 mb-1.5">Sudah Dibayar (Rp)</label>
          <NumericInput value={sudah} onChange={setSudah} className={inputCls} />
        </div>
        {banks.length > 0 && (
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-1.5">Rekening Pembayaran</label>
            <select value={bankId} onChange={(e) => setBankId(e.target.value)} className={inputCls}>
              <option value="">— Pilih Rekening —</option>
              {banks.map((b) => <option key={b.id} value={b.id}>{b.nama}</option>)}
            </select>
          </div>
        )}
        <div className="grid grid-cols-2 gap-3">
          <MonthYearPicker
            label="Mulai"
            year={mulaiY}
            month={mulaiM}
            onChangeYear={(v) => setMulaiY(v ?? new Date().getFullYear())}
            onChangeMonth={(v) => setMulaiM(v ?? 1)}
          />
          <MonthYearPicker
            label="Selesai"
            year={selesaiY}
            month={selesaiM}
            onChangeYear={(v) => setSelesaiY(v ?? new Date().getFullYear())}
            onChangeMonth={(v) => setSelesaiM(v ?? 1)}
          />
        </div>
        <Button fullWidth onClick={handleSubmit}>Simpan</Button>
      </div>
    </Modal>
  );
}
