"use client";
import { useAppStore } from "@/store/useAppStore";
import { fmt, ghk, kym, isExpRutinActive } from "@/lib/helpers";
import Card from "@/components/ui/Card";
import { ArrowDownLeft, ArrowUpRight, PiggyBank, Landmark } from "lucide-react";

export default function SummaryCards() {
  const selB = useAppStore((s) => s.selB);
  const pendapatanRutin = useAppStore((s) => s.pendapatanRutin);
  const incEx = useAppStore((s) => s.incEx);
  const expRutin = useAppStore((s) => s.expRutin);
  const expEx = useAppStore((s) => s.expEx);
  const hutang = useAppStore((s) => s.hutang);
  const cuti = useAppStore((s) => s.cuti);

  const { y, m } = kym(selB);
  const hk = ghk(y, m, cuti);

  const totalPR = pendapatanRutin.filter((p) => p.aktif).reduce((a, p) => {
    if (p.tipe === "tetap") return a + p.jumlah;
    return a + p.jumlah * hk;
  }, 0);

  const totalIncEx = incEx.filter((x) => x.bk === selB).reduce((a, x) => a + x.jumlah, 0);
  const totalIncome = totalPR + totalIncEx;

  const totalER = expRutin.filter((e) => isExpRutinActive(e.mulaiY, e.mulaiM, e.selesaiY, e.selesaiM, y, m)).reduce((a, e) => a + e.jumlah, 0);
  const totalExpEx = expEx.filter((x) => x.bk === selB).reduce((a, x) => a + x.jumlah, 0);

  const totalCicilan = hutang.filter((h) => {
    if (h.htipe !== "cicilan") return false;
    const start = h.mulaiY * 12 + h.mulaiM;
    const end = h.selesaiY * 12 + h.selesaiM;
    const cur = y * 12 + m;
    return cur >= start && cur <= end && h.sudah < h.pokok;
  }).reduce((a, h) => a + h.cicilan, 0);

  const totalExpense = totalER + totalExpEx + totalCicilan;

  const sisa = totalIncome - totalExpense;
  const rasioTabungan = totalIncome > 0 ? Math.round((sisa / totalIncome) * 100) : 0;

  const cards = [
    {
      label: "Pemasukan",
      value: fmt(totalIncome),
      icon: ArrowDownLeft,
      iconBg: "bg-emerald-100",
      iconColor: "text-emerald-600",
      valueColor: "text-emerald-600",
      hoverShadow: "hover:shadow-glow-emerald",
    },
    {
      label: "Pengeluaran",
      value: fmt(totalExpense),
      icon: ArrowUpRight,
      iconBg: "bg-red-100",
      iconColor: "text-red-500",
      valueColor: "text-red-600",
      hoverShadow: "hover:shadow-glow-red",
    },
    {
      label: "Sisa",
      value: fmt(sisa),
      icon: PiggyBank,
      iconBg: "bg-indigo-100",
      iconColor: "text-indigo-600",
      valueColor: sisa >= 0 ? "text-indigo-600" : "text-red-600",
      hoverShadow: "hover:shadow-glow-indigo",
    },
    {
      label: "Rasio Tabungan",
      value: `${rasioTabungan}%`,
      icon: Landmark,
      iconBg: "bg-violet-100",
      iconColor: "text-violet-600",
      valueColor: "text-violet-600",
      hoverShadow: "hover:shadow-glow-violet",
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
      {cards.map((c) => (
        <Card key={c.label} className={`${c.hoverShadow} transition-shadow duration-200`}>
          <div className="flex items-start gap-3">
            <div className={`w-10 h-10 rounded-xl ${c.iconBg} flex items-center justify-center flex-shrink-0`}>
              <c.icon size={18} className={c.iconColor} />
            </div>
            <div className="min-w-0">
              <p className="text-xs text-slate-400 font-medium mb-1">{c.label}</p>
              <p className={`text-lg font-bold ${c.valueColor} truncate`}>{c.value}</p>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
