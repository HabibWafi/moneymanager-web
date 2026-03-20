"use client";
import { useAppStore } from "@/store/useAppStore";
import { fmt } from "@/lib/helpers";
import { Wallet, TrendingUp, TrendingDown } from "lucide-react";

export default function TotalAsetHero() {
  const banks = useAppStore((s) => s.banks);
  const inv = useAppStore((s) => s.inv);

  const totalBank = banks.reduce((a, b) => a + b.saldo, 0);

  const totalInv = inv.reduce((a, item) => {
    if (item.tipe === "saham" && item.lot && item.hargaSkrg) return a + item.lot * 100 * item.hargaSkrg;
    if (item.tipe === "emas" && item.gram && item.hargaSkrg) return a + item.gram * item.hargaSkrg;
    if (item.tipe === "kripto" && item.jml && item.hargaSkrg) return a + item.jml * item.hargaSkrg;
    if (item.tipe === "obligasi" && item.nominal) return a + item.nominal;
    if (item.tipe === "deposito" && item.pokok) return a + item.pokok;
    if (item.tipe === "reksadana" && item.unit && item.nabSkrg) return a + item.unit * item.nabSkrg;
    return a;
  }, 0);

  const totalInvBeli = inv.reduce((a, item) => {
    if (item.tipe === "saham" && item.lot && item.hargaBeli) return a + item.lot * 100 * item.hargaBeli;
    if (item.tipe === "emas" && item.gram && item.hargaBeli) return a + item.gram * item.hargaBeli;
    if (item.tipe === "kripto" && item.jml && item.hargaBeli) return a + item.jml * item.hargaBeli;
    if (item.tipe === "obligasi" && item.nominal) return a + item.nominal;
    if (item.tipe === "deposito" && item.pokok) return a + item.pokok;
    if (item.tipe === "reksadana" && item.unit && item.nabBeli) return a + item.unit * item.nabBeli;
    return a;
  }, 0);

  const totalAset = totalBank + totalInv;
  const gain = totalInv - totalInvBeli;
  const isPositive = gain >= 0;

  return (
    <div className="bg-gradient-to-br from-indigo-600 via-indigo-700 to-violet-700 rounded-2xl p-6 md:p-8 text-white shadow-lg shadow-indigo-200">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
          <Wallet size={20} />
        </div>
        <p className="text-indigo-100 text-sm font-medium">Total Aset</p>
      </div>
      <p className="text-3xl md:text-4xl font-bold mb-6">{fmt(totalAset)}</p>
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
          <p className="text-indigo-200 text-xs mb-1">Saldo Bank/Cash</p>
          <p className="text-lg font-bold">{fmt(totalBank)}</p>
        </div>
        <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
          <p className="text-indigo-200 text-xs mb-1">Portfolio Investasi</p>
          <p className="text-lg font-bold">{fmt(totalInv)}</p>
          {totalInvBeli > 0 && (
            <div className={`flex items-center gap-1 mt-1 text-xs ${isPositive ? "text-emerald-300" : "text-red-300"}`}>
              {isPositive ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
              <span>{isPositive ? "+" : ""}{fmt(gain)}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
