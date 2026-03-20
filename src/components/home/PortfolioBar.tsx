"use client";
import { useAppStore } from "@/store/useAppStore";
import { fmt } from "@/lib/helpers";
import Card from "@/components/ui/Card";

export default function PortfolioBar() {
  const banks = useAppStore((s) => s.banks);
  const total = banks.reduce((a, b) => a + b.saldo, 0);

  if (banks.length === 0) {
    return (
      <Card>
        <p className="text-sm text-slate-400 text-center py-4">Belum ada rekening. Tambahkan di Pengaturan.</p>
      </Card>
    );
  }

  return (
    <Card>
      <h3 className="text-sm font-semibold text-slate-700 mb-4">Saldo per Rekening</h3>
      {/* Portfolio bar */}
      <div className="h-3 rounded-full overflow-hidden flex mb-4 bg-slate-100">
        {banks.map((b) => {
          const pct = total > 0 ? (b.saldo / total) * 100 : 0;
          return (
            <div
              key={b.id}
              style={{ width: `${pct}%`, backgroundColor: b.warna }}
              className="h-full transition-all duration-500 first:rounded-l-full last:rounded-r-full"
            />
          );
        })}
      </div>
      {/* Legend */}
      <div className="space-y-2">
        {banks.map((b) => (
          <div key={b.id} className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: b.warna }} />
              <span className="text-sm text-slate-600">{b.nama}</span>
            </div>
            <span className="text-sm font-semibold text-slate-700">{fmt(b.saldo)}</span>
          </div>
        ))}
      </div>
    </Card>
  );
}
