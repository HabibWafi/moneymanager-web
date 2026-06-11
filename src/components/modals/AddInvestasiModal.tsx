"use client";
import { useState, useEffect } from "react";
import { nanoid } from "nanoid";
import { useAppStore } from "@/store/useAppStore";
import { useToast } from "@/components/ui/Toast";
import { INV_TIPE_LABEL, SAHAM_LIST, CRYPTO_LIST } from "@/lib/constants";
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";
import NumericInput from "@/components/ui/NumericInput";
import type { Investasi } from "@/lib/types";

const TIPES = Object.entries(INV_TIPE_LABEL);

interface Props {
  open: boolean;
  onClose: () => void;
  editItem?: Investasi | null;
}

export default function AddInvestasiModal({ open, onClose, editItem }: Props) {
  const addInv = useAppStore((s) => s.addInv);
  const updInv = useAppStore((s) => s.updInv);
  const toast = useToast();

  const [tipe, setTipe] = useState<string>("saham");
  const [nama, setNama] = useState("");
  const [hargaBeli, setHargaBeli] = useState("");
  const [hargaSkrg, setHargaSkrg] = useState("");
  const [kode, setKode] = useState(SAHAM_LIST[0]);
  const [lot, setLot] = useState("");
  const [gram, setGram] = useState("");
  const [coinId, setCoinId] = useState(CRYPTO_LIST[0].id);
  const [jml, setJml] = useState("");
  const [manajer, setManajer] = useState("");
  const [unit, setUnit] = useState("");
  const [nabBeli, setNabBeli] = useState("");
  const [nabSkrg, setNabSkrg] = useState("");
  const [nominal, setNominal] = useState("");
  const [kupon, setKupon] = useState("");
  const [jatuhTempo, setJatuhTempo] = useState("");
  const [bank, setBank] = useState("");
  const [pokok, setPokok] = useState("");
  const [bunga, setBunga] = useState("");
  const [tanggalMulai, setTanggalMulai] = useState("");
  const [tanggalCair, setTanggalCair] = useState("");

  useEffect(() => {
    if (editItem) {
      setTipe(editItem.tipe);
      setNama(editItem.nama || "");
      setHargaBeli(editItem.hargaBeli?.toString() || "");
      setHargaSkrg(editItem.hargaSkrg?.toString() || "");
      setKode(editItem.kode || SAHAM_LIST[0]);
      setLot(editItem.lot?.toString() || "");
      setGram(editItem.gram?.toString() || "");
      setCoinId(editItem.coinId || CRYPTO_LIST[0].id);
      setJml(editItem.jml?.toString() || "");
      setManajer(editItem.manajer || "");
      setUnit(editItem.unit?.toString() || "");
      setNabBeli(editItem.nabBeli?.toString() || "");
      setNabSkrg(editItem.nabSkrg?.toString() || "");
      setNominal(editItem.nominal?.toString() || "");
      setKupon(editItem.kupon?.toString() || "");
      setJatuhTempo(editItem.jatuhTempo || "");
      setBank(editItem.bank || "");
      setPokok(editItem.pokok?.toString() || "");
      setBunga(editItem.bunga?.toString() || "");
      setTanggalMulai(editItem.tanggalMulai || "");
      setTanggalCair(editItem.tanggalCair || "");
    } else {
      reset();
    }
  }, [editItem, open]);

  const inputCls = "w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400";

  const handleSubmit = () => {
    const base = { tipe: tipe as Investasi["tipe"] };

    let inv: Partial<Investasi> = {};
    switch (tipe) {
      case "saham":
        if (!lot || !hargaBeli) return;
        inv = { ...base, kode, lot: Number(lot), hargaBeli: Number(hargaBeli), hargaSkrg: Number(hargaSkrg) || Number(hargaBeli) };
        break;
      case "emas":
        if (!gram || !hargaBeli) return;
        inv = { ...base, nama: nama || "Emas", gram: Number(gram), hargaBeli: Number(hargaBeli), hargaSkrg: Number(hargaSkrg) || Number(hargaBeli) };
        break;
      case "kripto": {
        if (!jml || !hargaBeli) return;
        const crypto = CRYPTO_LIST.find((c) => c.id === coinId);
        inv = { ...base, coinId, sym: crypto?.sym, nama: crypto?.nama, jml: Number(jml), hargaBeli: Number(hargaBeli), hargaSkrg: Number(hargaSkrg) || Number(hargaBeli) };
        break;
      }
      case "reksadana":
        if (!unit || !nabBeli) return;
        inv = { ...base, nama: nama || "Reksadana", manajer, unit: Number(unit), nabBeli: Number(nabBeli), nabSkrg: Number(nabSkrg) || Number(nabBeli) };
        break;
      case "obligasi":
        if (!nominal) return;
        inv = { ...base, nama: nama || "Obligasi", nominal: Number(nominal), kupon: Number(kupon) || 0, jatuhTempo };
        break;
      case "deposito":
        if (!pokok) return;
        inv = { ...base, nama: nama || "Deposito", bank, pokok: Number(pokok), bunga: Number(bunga) || 0, tanggalMulai, tanggalCair };
        break;
    }

    if (editItem) {
      updInv(editItem.id, inv);
      toast.add("Investasi berhasil diperbarui", "success");
    } else {
      addInv({ id: nanoid(), ...inv } as Investasi);
      toast.add("Investasi berhasil ditambahkan", "success");
    }
    reset();
    onClose();
  };

  const reset = () => {
    setTipe("saham");
    setNama(""); setHargaBeli(""); setHargaSkrg(""); setLot(""); setGram(""); setJml("");
    setUnit(""); setNabBeli(""); setNabSkrg(""); setNominal(""); setKupon(""); setJatuhTempo("");
    setPokok(""); setBunga(""); setTanggalMulai(""); setTanggalCair(""); setBank(""); setManajer("");
  };

  const isEdit = !!editItem;

  return (
    <Modal open={open} onClose={onClose} title={isEdit ? "Edit Investasi" : "Tambah Investasi"}>
      <div className="space-y-4">
        {!isEdit && (
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-1.5">Tipe Investasi</label>
            <div className="grid grid-cols-3 gap-2">
              {TIPES.map(([key, label]) => (
                <button key={key} type="button" onClick={() => setTipe(key)}
                  className={`py-2 rounded-xl text-xs font-medium border-2 transition-all ${tipe === key ? "border-indigo-500 bg-indigo-50 text-indigo-600" : "border-slate-200 text-slate-500 hover:bg-slate-50"}`}>
                  {label}
                </button>
              ))}
            </div>
          </div>
        )}

        {tipe === "saham" && (
          <>
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1.5">Kode Saham</label>
              <select value={kode} onChange={(e) => setKode(e.target.value)} className={inputCls} disabled={isEdit}>
                {SAHAM_LIST.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1.5">Jumlah Lot</label>
              <input type="number" value={lot} onChange={(e) => setLot(e.target.value)} placeholder="0" className={inputCls} />
            </div>
          </>
        )}

        {tipe === "emas" && (
          <>
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1.5">Nama</label>
              <input value={nama} onChange={(e) => setNama(e.target.value)} placeholder="Emas Antam" className={inputCls} />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1.5">Gram</label>
              <input type="number" value={gram} onChange={(e) => setGram(e.target.value)} placeholder="0" className={inputCls} step="any" />
            </div>
          </>
        )}

        {tipe === "kripto" && (
          <>
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1.5">Koin</label>
              <select value={coinId} onChange={(e) => setCoinId(e.target.value)} className={inputCls} disabled={isEdit}>
                {CRYPTO_LIST.map((c) => <option key={c.id} value={c.id}>{c.sym} - {c.nama}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1.5">Jumlah Koin</label>
              <input type="number" value={jml} onChange={(e) => setJml(e.target.value)} placeholder="0" className={inputCls} step="any" />
            </div>
          </>
        )}

        {tipe === "reksadana" && (
          <>
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1.5">Nama Produk</label>
              <input value={nama} onChange={(e) => setNama(e.target.value)} placeholder="Reksadana ABC" className={inputCls} />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1.5">Manajer Investasi</label>
              <input value={manajer} onChange={(e) => setManajer(e.target.value)} placeholder="MI" className={inputCls} />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1.5">Unit</label>
              <input type="number" value={unit} onChange={(e) => setUnit(e.target.value)} placeholder="0" className={inputCls} step="any" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1.5">NAB Beli</label>
                <NumericInput value={nabBeli} onChange={setNabBeli} className={inputCls} />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1.5">NAB Sekarang</label>
                <NumericInput value={nabSkrg} onChange={setNabSkrg} className={inputCls} />
              </div>
            </div>
          </>
        )}

        {tipe === "obligasi" && (
          <>
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1.5">Nama</label>
              <input value={nama} onChange={(e) => setNama(e.target.value)} placeholder="ORI024" className={inputCls} />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1.5">Nominal (Rp)</label>
              <NumericInput value={nominal} onChange={setNominal} className={inputCls} />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1.5">Kupon (%/tahun)</label>
              <input type="number" value={kupon} onChange={(e) => setKupon(e.target.value)} placeholder="0" className={inputCls} step="any" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1.5">Jatuh Tempo</label>
              <input type="date" value={jatuhTempo} onChange={(e) => setJatuhTempo(e.target.value)} className={inputCls} />
            </div>
          </>
        )}

        {tipe === "deposito" && (
          <>
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1.5">Nama/Bank</label>
              <input value={bank} onChange={(e) => setBank(e.target.value)} placeholder="BCA" className={inputCls} />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1.5">Pokok (Rp)</label>
              <NumericInput value={pokok} onChange={setPokok} className={inputCls} />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1.5">Bunga (%/tahun)</label>
              <input type="number" value={bunga} onChange={(e) => setBunga(e.target.value)} placeholder="0" className={inputCls} step="any" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1.5">Tanggal Mulai</label>
                <input type="date" value={tanggalMulai} onChange={(e) => setTanggalMulai(e.target.value)} className={inputCls} />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1.5">Tanggal Cair</label>
                <input type="date" value={tanggalCair} onChange={(e) => setTanggalCair(e.target.value)} className={inputCls} />
              </div>
            </div>
          </>
        )}

        {["saham", "emas", "kripto"].includes(tipe) && (
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1.5">Harga Beli</label>
              <NumericInput value={hargaBeli} onChange={setHargaBeli} className={inputCls} />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1.5">Harga Sekarang</label>
              <NumericInput value={hargaSkrg} onChange={setHargaSkrg} className={inputCls} />
            </div>
          </div>
        )}

        <Button fullWidth onClick={handleSubmit}>{isEdit ? "Simpan Perubahan" : "Simpan"}</Button>
      </div>
    </Modal>
  );
}
