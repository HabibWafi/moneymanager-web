"use client";
import { useState } from "react";
import { nanoid } from "nanoid";
import { useAppStore } from "@/store/useAppStore";
import { useToast } from "@/components/ui/Toast";
import { KE } from "@/lib/constants";
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";
import NumericInput from "@/components/ui/NumericInput";
import MonthYearPicker from "@/components/ui/MonthYearPicker";

export default function AddExpRutinModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const expRutin = useAppStore((s) => s.expRutin);
  const saveER = useAppStore((s) => s.saveER);
  const maybeRealizeNew = useAppStore((s) => s.maybeRealizeNew);
  const banks = useAppStore((s) => s.banks);
  const toast = useToast();

  const defaultBank = banks.find((b) => b.utama)?.id ?? banks[0]?.id ?? "";

  const [nama, setNama] = useState("");
  const [jumlah, setJumlah] = useState("");
  const [tipe, setTipe] = useState<"tetap" | "cicilan">("tetap");
  const [kat, setKat] = useState(KE[0]);
  const [bankId, setBankId] = useState(defaultBank);
  const [tglBayarAktif, setTglBayarAktif] = useState(false);
  const [tglBayar, setTglBayar] = useState(1);
  const [mulaiY, setMulaiY] = useState(new Date().getFullYear());
  const [mulaiM, setMulaiM] = useState(new Date().getMonth() + 1);
  const [selesaiY, setSelesaiY] = useState<number | undefined>();
  const [selesaiM, setSelesaiM] = useState<number | undefined>();
  const [realisasi, setRealisasi] = useState<"otomatis" | "manual">("otomatis");

  const handleSubmit = () => {
    if (!nama || !jumlah || Number(jumlah) <= 0) return;
    const newItem = {
      id: nanoid(), nama, jumlah: Number(jumlah), tipe, kat,
      mulaiY, mulaiM, selesaiY, selesaiM,
      bankId: bankId || undefined,
      tglBayar: tglBayarAktif ? tglBayar : undefined,
      realisasi,
    };
    saveER([...expRutin, newItem]);
    maybeRealizeNew("expense", newItem);
    toast.add("Pengeluaran rutin berhasil ditambahkan", "success");
    setNama("");
    setJumlah("");
    onClose();
  };

  const inputCls = "w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400";
  const toggleBtnCls = (active: boolean) =>
    `flex-1 py-2.5 rounded-xl text-sm font-medium border-2 transition-all ${active ? "border-indigo-500 bg-indigo-50 text-indigo-600" : "border-slate-200 text-slate-500 hover:bg-slate-50"}`;

  return (
    <Modal open={open} onClose={onClose} title="Tambah Pengeluaran Rutin">
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-600 mb-1.5">Nama</label>
          <input value={nama} onChange={(e) => setNama(e.target.value)} placeholder="Internet" className={inputCls} />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-600 mb-1.5">Kategori</label>
          <select value={kat} onChange={(e) => setKat(e.target.value)} className={inputCls}>
            {KE.map((k) => <option key={k} value={k}>{k}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-600 mb-1.5">Tipe</label>
          <div className="flex gap-2">
            {(["tetap", "cicilan"] as const).map((t) => (
              <button key={t} type="button" onClick={() => setTipe(t)} className={toggleBtnCls(tipe === t)}>
                {t === "tetap" ? "Tetap" : "Cicilan"}
              </button>
            ))}
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-600 mb-1.5">Jumlah/Bulan (Rp)</label>
          <NumericInput value={jumlah} onChange={setJumlah} className={inputCls} />
        </div>
        {banks.length > 0 && (
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-1.5">Dari Rekening</label>
            <select value={bankId} onChange={(e) => setBankId(e.target.value)} className={inputCls}>
              <option value="">Tidak ditentukan</option>
              {banks.map((b) => <option key={b.id} value={b.id}>{b.nama}{b.utama ? " ★" : ""}</option>)}
            </select>
          </div>
        )}
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-slate-600 mb-1.5">
            <input type="checkbox" checked={tglBayarAktif} onChange={(e) => setTglBayarAktif(e.target.checked)}
              className="rounded border-slate-300 text-indigo-500 focus:ring-indigo-200" />
            Tanggal pasti tiap bulan
          </label>
          {tglBayarAktif && (
            <input type="number" min={1} max={31} value={tglBayar}
              onChange={(e) => setTglBayar(Math.min(31, Math.max(1, Number(e.target.value))))}
              className={inputCls} placeholder="1-31" />
          )}
        </div>
        <div className="grid grid-cols-2 gap-3">
          <MonthYearPicker
            label="Mulai"
            year={mulaiY}
            month={mulaiM}
            onChangeYear={(v) => setMulaiY(v ?? new Date().getFullYear())}
            onChangeMonth={(v) => setMulaiM(v ?? 1)}
          />
          <MonthYearPicker
            label="Selesai (opsional)"
            year={selesaiY}
            month={selesaiM}
            onChangeYear={(v) => setSelesaiY(v)}
            onChangeMonth={(v) => setSelesaiM(v)}
            optional
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-600 mb-1.5">Mode Realisasi</label>
          <div className="flex gap-2">
            <button type="button" onClick={() => setRealisasi("otomatis")} className={toggleBtnCls(realisasi === "otomatis")}>
              Otomatis
            </button>
            <button type="button" onClick={() => setRealisasi("manual")} className={toggleBtnCls(realisasi === "manual")}>
              Manual
            </button>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            {realisasi === "otomatis" ? "Saldo rekening otomatis berubah pada tanggal yang ditentukan" : "Anda perlu konfirmasi manual setiap bulan"}
          </p>
        </div>
        <Button fullWidth onClick={handleSubmit}>Simpan</Button>
      </div>
    </Modal>
  );
}
