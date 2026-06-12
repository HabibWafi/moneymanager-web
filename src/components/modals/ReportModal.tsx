"use client";
import { useState } from "react";
import { useAppStore } from "@/store/useAppStore";
import { fmt, monthOptionsRange, firstDataMonth, kym, ghk, isExpRutinActive, computeNetWorth, calcInvValue } from "@/lib/helpers";
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";

export default function ReportModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const s = useAppStore.getState();
  const incEx = useAppStore((s) => s.incEx);
  const expEx = useAppStore((s) => s.expEx);
  const snapshots = useAppStore((s) => s.snapshots);
  const opts = monthOptionsRange(firstDataMonth({ incEx, expEx, snapshots }), 0);
  const [bk, setBk] = useState(opts[0]?.value ?? "");

  const { y, m } = kym(bk);
  const hk = ghk(y, m, s.cuti);

  const rutinIncomeItems = s.pendapatanRutin.filter((p) => p.aktif && isExpRutinActive(p.mulaiY, p.mulaiM, p.selesaiY, p.selesaiM, y, m));
  const extraIncomeItems = s.incEx.filter((x) => x.bk === bk);
  const rutinExpenseItems = s.expRutin.filter((e) => isExpRutinActive(e.mulaiY, e.mulaiM, e.selesaiY, e.selesaiM, y, m));
  const extraExpenseItems = s.expEx.filter((x) => x.bk === bk);
  const cicilanItems = s.hutang.filter((h) => {
    if (h.htipe !== "cicilan") return false;
    const start = h.mulaiY * 12 + h.mulaiM;
    const end = h.selesaiY * 12 + h.selesaiM;
    const cur = y * 12 + m;
    return cur >= start && cur <= end && h.sudah < h.pokok;
  });

  const totalRutinIncome = rutinIncomeItems.reduce((a, p) => a + (p.tipe === "tetap" ? p.jumlah : p.jumlah * hk), 0);
  const totalExtraIncome = extraIncomeItems.reduce((a, x) => a + x.jumlah, 0);
  const totalIncome = totalRutinIncome + totalExtraIncome;

  const totalRutinExpense = rutinExpenseItems.reduce((a, e) => a + e.jumlah, 0);
  const totalExtraExpense = extraExpenseItems.reduce((a, x) => a + x.jumlah, 0);
  const totalCicilan = cicilanItems.reduce((a, h) => a + h.cicilan, 0);
  const totalExpense = totalRutinExpense + totalExtraExpense + totalCicilan;

  const sisa = totalIncome - totalExpense;
  const savRatio = totalIncome > 0 ? Math.round((sisa / totalIncome) * 100) : 0;

  const bankTotal = s.banks.reduce((a, b) => a + b.saldo, 0);
  const invTotal = calcInvValue(s.inv);
  const hutangTotal = s.hutang.reduce((a, h) => a + Math.max(h.pokok - h.sudah, 0), 0);
  const netWorth = computeNetWorth(s);

  const bankName = (id?: string) => s.banks.find((b) => b.id === id)?.nama ?? "-";
  const monthLabel = new Date(y, m - 1, 1).toLocaleDateString("id-ID", { month: "long", year: "numeric" });

  const handlePrint = () => window.print();

  const thCls = "text-left text-xs font-semibold text-slate-500 py-2 px-3 border-b border-slate-200";
  const tdCls = "text-sm text-slate-700 py-2 px-3 border-b border-slate-100";
  const tdNumCls = "text-sm text-slate-700 py-2 px-3 border-b border-slate-100 text-right tabular-nums font-medium";

  return (
    <Modal open={open} onClose={onClose} title="Ekspor Laporan Keuangan">
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <select value={bk} onChange={(e) => setBk(e.target.value)}
            className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-200">
            {opts.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
          <Button onClick={handlePrint}>Cetak / PDF</Button>
        </div>

        <div id="report-content" className="bg-white p-6 rounded-xl border border-slate-200 print:border-none print:p-0 print:rounded-none">
          <div className="text-center mb-6 print:mb-8">
            <h1 className="text-xl font-bold text-slate-900 print:text-2xl">Laporan Keuangan</h1>
            <p className="text-sm text-slate-500 mt-1">{monthLabel}</p>
          </div>

          {/* Ringkasan */}
          <div className="grid grid-cols-4 gap-3 mb-6">
            <div className="text-center p-3 bg-emerald-50 rounded-lg print:bg-transparent print:border print:border-slate-300">
              <p className="text-[10px] text-slate-500 uppercase tracking-wide">Pemasukan</p>
              <p className="text-sm font-bold text-emerald-600 tabular-nums">{fmt(totalIncome)}</p>
            </div>
            <div className="text-center p-3 bg-red-50 rounded-lg print:bg-transparent print:border print:border-slate-300">
              <p className="text-[10px] text-slate-500 uppercase tracking-wide">Pengeluaran</p>
              <p className="text-sm font-bold text-red-500 tabular-nums">{fmt(totalExpense)}</p>
            </div>
            <div className="text-center p-3 bg-indigo-50 rounded-lg print:bg-transparent print:border print:border-slate-300">
              <p className="text-[10px] text-slate-500 uppercase tracking-wide">Sisa</p>
              <p className={`text-sm font-bold tabular-nums ${sisa >= 0 ? "text-emerald-600" : "text-red-500"}`}>{fmt(sisa)}</p>
            </div>
            <div className="text-center p-3 bg-slate-50 rounded-lg print:bg-transparent print:border print:border-slate-300">
              <p className="text-[10px] text-slate-500 uppercase tracking-wide">Rasio Tabungan</p>
              <p className="text-sm font-bold text-slate-700">{savRatio}%</p>
            </div>
          </div>

          {/* Tabel Pemasukan */}
          <h2 className="text-sm font-semibold text-slate-700 mb-2">Pemasukan</h2>
          <table className="w-full mb-5">
            <thead><tr>
              <th className={thCls}>Nama</th>
              <th className={thCls}>Kategori</th>
              <th className={thCls}>Sumber</th>
              <th className={`${thCls} text-right`}>Jumlah</th>
            </tr></thead>
            <tbody>
              {rutinIncomeItems.map((p) => (
                <tr key={p.id}>
                  <td className={tdCls}>{p.nama} <span className="text-[10px] text-slate-400">(Rutin)</span></td>
                  <td className={tdCls}>{p.kat}</td>
                  <td className={tdCls}>{bankName(p.bankId)}</td>
                  <td className={tdNumCls}>{fmt(p.tipe === "tetap" ? p.jumlah : p.jumlah * hk)}</td>
                </tr>
              ))}
              {extraIncomeItems.map((x) => (
                <tr key={x.id}>
                  <td className={tdCls}>{x.desc} <span className="text-[10px] text-slate-400">(Extra)</span></td>
                  <td className={tdCls}>{x.kat}</td>
                  <td className={tdCls}>{bankName(x.sumber)}</td>
                  <td className={tdNumCls}>{fmt(x.jumlah)}</td>
                </tr>
              ))}
              <tr className="font-bold">
                <td colSpan={3} className="text-sm text-slate-700 py-2 px-3">Total Pemasukan</td>
                <td className="text-sm text-emerald-600 py-2 px-3 text-right tabular-nums">{fmt(totalIncome)}</td>
              </tr>
            </tbody>
          </table>

          {/* Tabel Pengeluaran */}
          <h2 className="text-sm font-semibold text-slate-700 mb-2">Pengeluaran</h2>
          <table className="w-full mb-5">
            <thead><tr>
              <th className={thCls}>Nama</th>
              <th className={thCls}>Kategori</th>
              <th className={thCls}>Sumber</th>
              <th className={`${thCls} text-right`}>Jumlah</th>
            </tr></thead>
            <tbody>
              {rutinExpenseItems.map((e) => (
                <tr key={e.id}>
                  <td className={tdCls}>{e.nama} <span className="text-[10px] text-slate-400">(Rutin)</span></td>
                  <td className={tdCls}>{e.kat}</td>
                  <td className={tdCls}>{bankName(e.bankId)}</td>
                  <td className={tdNumCls}>{fmt(e.jumlah)}</td>
                </tr>
              ))}
              {cicilanItems.map((h) => (
                <tr key={h.id}>
                  <td className={tdCls}>{h.nama} <span className="text-[10px] text-slate-400">(Cicilan)</span></td>
                  <td className={tdCls}>Cicilan</td>
                  <td className={tdCls}>{bankName(h.bankId)}</td>
                  <td className={tdNumCls}>{fmt(h.cicilan)}</td>
                </tr>
              ))}
              {extraExpenseItems.map((x) => (
                <tr key={x.id}>
                  <td className={tdCls}>{x.desc} <span className="text-[10px] text-slate-400">(Extra)</span></td>
                  <td className={tdCls}>{x.kat}</td>
                  <td className={tdCls}>{bankName(x.sumber)}</td>
                  <td className={tdNumCls}>{fmt(x.jumlah)}</td>
                </tr>
              ))}
              <tr className="font-bold">
                <td colSpan={3} className="text-sm text-slate-700 py-2 px-3">Total Pengeluaran</td>
                <td className="text-sm text-red-500 py-2 px-3 text-right tabular-nums">{fmt(totalExpense)}</td>
              </tr>
            </tbody>
          </table>

          {/* Saldo Rekening */}
          <h2 className="text-sm font-semibold text-slate-700 mb-2">Saldo Rekening</h2>
          <table className="w-full mb-5">
            <thead><tr>
              <th className={thCls}>Rekening</th>
              <th className={thCls}>Tipe</th>
              <th className={`${thCls} text-right`}>Saldo</th>
            </tr></thead>
            <tbody>
              {s.banks.map((b) => (
                <tr key={b.id}>
                  <td className={tdCls}>{b.nama}{b.utama ? " ★" : ""}</td>
                  <td className={tdCls}>{b.tipe === "bank" ? "Bank" : "Cash"}</td>
                  <td className={tdNumCls}>{fmt(b.saldo)}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Ringkasan Kekayaan */}
          <h2 className="text-sm font-semibold text-slate-700 mb-2">Ringkasan Kekayaan</h2>
          <table className="w-full mb-5">
            <tbody>
              <tr><td className={tdCls}>Total Bank & Cash</td><td className={tdNumCls}>{fmt(bankTotal)}</td></tr>
              <tr><td className={tdCls}>Total Investasi</td><td className={tdNumCls}>{fmt(invTotal)}</td></tr>
              <tr><td className={tdCls}>Total Hutang</td><td className={`${tdNumCls} text-red-500`}>-{fmt(hutangTotal)}</td></tr>
              <tr className="font-bold">
                <td className="text-sm text-slate-700 py-2 px-3">Kekayaan Bersih</td>
                <td className="text-sm text-indigo-600 py-2 px-3 text-right tabular-nums">{fmt(netWorth)}</td>
              </tr>
            </tbody>
          </table>

          <div className="text-center text-[10px] text-slate-400 mt-6 pt-4 border-t border-slate-100">
            Digenerate pada {new Date().toLocaleDateString("id-ID", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
          </div>
        </div>
      </div>
    </Modal>
  );
}
