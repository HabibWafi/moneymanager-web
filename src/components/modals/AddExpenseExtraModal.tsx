"use client";
import { useState } from "react";
import { nanoid } from "nanoid";
import { useAppStore } from "@/store/useAppStore";
import { useToast } from "@/components/ui/Toast";
import { KE } from "@/lib/constants";
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";
import NumericInput from "@/components/ui/NumericInput";

export default function AddExpenseExtraModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const selB = useAppStore((s) => s.selB);
  const banks = useAppStore((s) => s.banks);
  const addExpEx = useAppStore((s) => s.addExpEx);
  const toast = useToast();

  const defaultBank = banks.find((b) => b.utama)?.id ?? banks[0]?.id ?? "";

  const [kat, setKat] = useState(KE[0]);
  const [desc, setDesc] = useState("");
  const [jumlah, setJumlah] = useState("");
  const [sumber, setSumber] = useState(defaultBank);
  const [tgl, setTgl] = useState("");
  const [status, setStatus] = useState<"terjadi" | "belum">("terjadi");
  const [realisasi, setRealisasi] = useState<"otomatis" | "manual">("otomatis");

  const handleSubmit = () => {
    if (!desc || !jumlah || Number(jumlah) <= 0) return;
    addExpEx({
      id: nanoid(), bk: selB, kat, desc, jumlah: Number(jumlah), sumber,
      tgl: tgl || undefined, status,
      realisasi: status === "belum" ? realisasi : undefined,
    });
    if (sumber && status === "terjadi") {
      const store = useAppStore.getState();
      const updBanks = store.banks.map((b) =>
        b.id === sumber ? { ...b, saldo: b.saldo - Number(jumlah) } : b
      );
      store.saveBanks(updBanks);
    }
    toast.add("Pengeluaran berhasil ditambahkan", "success");
    setDesc("");
    setJumlah("");
    setTgl("");
    setStatus("terjadi");
    onClose();
  };

  const inputCls = "w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400";
  const toggleBtnCls = (active: boolean) =>
    `flex-1 py-2.5 rounded-xl text-sm font-medium border-2 transition-all ${active ? "border-indigo-500 bg-indigo-50 text-indigo-600" : "border-slate-200 text-slate-500 hover:bg-slate-50"}`;

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
        <div>
          <label className="block text-sm font-medium text-slate-600 mb-1.5">Tanggal (opsional)</label>
          <input type="date" value={tgl} onChange={(e) => setTgl(e.target.value)} className={inputCls} />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-600 mb-1.5">Status</label>
          <div className="flex gap-2">
            <button type="button" onClick={() => setStatus("terjadi")} className={toggleBtnCls(status === "terjadi")}>
              Sudah Terjadi
            </button>
            <button type="button" onClick={() => setStatus("belum")} className={toggleBtnCls(status === "belum")}>
              Belum (Pasti Dilakukan)
            </button>
          </div>
        </div>
        {status === "belum" && (
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
              {realisasi === "otomatis" ? "Saldo otomatis berubah saat tanggal tiba" : "Anda perlu konfirmasi manual"}
            </p>
          </div>
        )}
        {banks.length > 0 && (
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-1.5">Dari Rekening</label>
            <select value={sumber} onChange={(e) => setSumber(e.target.value)} className={inputCls}>
              <option value="">Tidak ditentukan</option>
              {banks.map((b) => <option key={b.id} value={b.id}>{b.nama}{b.utama ? " ★" : ""}</option>)}
            </select>
          </div>
        )}
        <Button fullWidth variant="danger" onClick={handleSubmit}>Simpan</Button>
      </div>
    </Modal>
  );
}
