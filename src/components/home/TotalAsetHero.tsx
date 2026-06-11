"use client";
import { useAppStore } from "@/store/useAppStore";
import { fmt } from "@/lib/helpers";
import { Wallet, TrendingUp, TrendingDown, CreditCard } from "lucide-react";

export default function TotalAsetHero() {
  const banks = useAppStore((s) => s.banks);
  const inv = useAppStore((s) => s.inv);
  const hutang = useAppStore((s) => s.hutang);

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

  const totalHutang = hutang.reduce((a, h) => a + Math.max(h.pokok - h.sudah, 0), 0);
  const netWorth = totalBank + totalInv - totalHutang;
  const gain = totalInv - totalInvBeli;
  const isPositive = gain >= 0;

  return (
    <div className="bg-gradient-to-br from-indigo-500 via-purple-500 to-violet-600 rounded-2xl p-6 md:p-8 text-white shadow-xl shadow-indigo-300/40">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
          <Wallet size={20} />
        </div>
        <div>
          <p className="text-indigo-200 text-xs">Kekayaan Bersih</p>
          <p className="text-2xl md:text-3xl font-bold">{fmt(netWorth)}</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div className="bg-white/20 rounded-xl p-3 backdrop-blur-sm border border-white/10">
          <p className="text-indigo-200 text-[10px] mb-1">Saldo Bank/Cash</p>
          <p className="text-sm font-bold">{fmt(totalBank)}</p>
        </div>
        <div className="bg-white/20 rounded-xl p-3 backdrop-blur-sm border border-white/10">
          <p className="text-indigo-200 text-[10px] mb-1">Investasi</p>
          <p className="text-sm font-bold">{fmt(totalInv)}</p>
          {totalInvBeli > 0 && (
            <div className={`flex items-center gap-0.5 mt-0.5 text-[10px] ${isPositive ? "text-emerald-300" : "text-red-300"}`}>
              {isPositive ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
              <span>{isPositive ? "+" : ""}{fmt(gain)}</span>
            </div>
          )}
        </div>
        <div className="bg-white/20 rounded-xl p-3 backdrop-blur-sm border border-white/10">
          <div className="flex items-center gap-1 mb-1">
            <CreditCard size={10} className="text-red-300" />
            <p className="text-red-200 text-[10px]">Total Hutang</p>
          </div>
          <p className="text-sm font-bold text-red-200">{fmt(totalHutang)}</p>
        </div>
      </div>
    </div>
  );
}
