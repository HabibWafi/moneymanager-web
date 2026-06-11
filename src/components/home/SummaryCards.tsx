"use client";
import { useAppStore } from "@/store/useAppStore";
import { fmt, computeMonthView } from "@/lib/helpers";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import { ArrowDownLeft, ArrowUpRight, PiggyBank, Landmark } from "lucide-react";

const STATUS_META: Record<string, { label: string; color: string }> = {
  riwayat: { label: "Riwayat", color: "slate" },
  berjalan: { label: "Bulan Berjalan", color: "indigo" },
  proyeksi: { label: "Proyeksi", color: "violet" },
};

export default function SummaryCards() {
  const selB = useAppStore((s) => s.selB);
  const banks = useAppStore((s) => s.banks);
  const inv = useAppStore((s) => s.inv);
  const hutang = useAppStore((s) => s.hutang);
  const pendapatanRutin = useAppStore((s) => s.pendapatanRutin);
  const incEx = useAppStore((s) => s.incEx);
  const expRutin = useAppStore((s) => s.expRutin);
  const expEx = useAppStore((s) => s.expEx);
  const snapshots = useAppStore((s) => s.snapshots);
  const cuti = useAppStore((s) => s.cuti);

  const view = computeMonthView(
    { banks, inv, hutang, pendapatanRutin, incEx, expRutin, expEx, snapshots, cuti },
    selB
  );

  const rasioTabungan = view.income > 0 ? Math.round((view.sisa / view.income) * 100) : 0;
  const status = STATUS_META[view.status];

  const cards = [
    {
      label: "Pemasukan",
      value: fmt(view.income),
      icon: ArrowDownLeft,
      iconBg: "bg-emerald-100",
      iconColor: "text-emerald-600",
      valueColor: "text-emerald-600",
      hoverShadow: "hover:shadow-glow-emerald",
    },
    {
      label: "Pengeluaran",
      value: fmt(view.expense),
      icon: ArrowUpRight,
      iconBg: "bg-red-100",
      iconColor: "text-red-500",
      valueColor: "text-red-600",
      hoverShadow: "hover:shadow-glow-red",
    },
    {
      label: "Sisa",
      value: fmt(view.sisa),
      icon: PiggyBank,
      iconBg: "bg-indigo-100",
      iconColor: "text-indigo-600",
      valueColor: view.sisa >= 0 ? "text-indigo-600" : "text-red-600",
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
    <div className="space-y-3">
      <div className="flex justify-end">
        <Badge color={status.color}>{status.label}</Badge>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        {cards.map((c) => (
          <Card key={c.label} className={`${c.hoverShadow} transition-shadow duration-200`}>
            <div className="flex items-start gap-3">
              <div className={`w-10 h-10 rounded-xl ${c.iconBg} flex items-center justify-center flex-shrink-0`}>
                <c.icon size={18} className={c.iconColor} />
              </div>
              <div className="min-w-0">
                <p className="text-xs text-slate-400 font-medium mb-1">{c.label}</p>
                <p className={`text-base md:text-lg font-bold tabular-nums leading-tight ${c.valueColor}`}>{c.value}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
