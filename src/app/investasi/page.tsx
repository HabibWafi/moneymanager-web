"use client";
import { useState } from "react";
import { useAppStore } from "@/store/useAppStore";
import { fmt } from "@/lib/helpers";
import { INV_TIPE_LABEL } from "@/lib/constants";
import InvCard from "@/components/investasi/InvCard";
import AddInvestasiModal from "@/components/modals/AddInvestasiModal";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import { Plus, RefreshCw, TrendingUp } from "lucide-react";

export default function InvestasiPage() {
  const inv = useAppStore((s) => s.inv);
  const delInv = useAppStore((s) => s.delInv);
  const loadCryptoPrices = useAppStore((s) => s.loadCryptoPrices);
  const cryptoLoading = useAppStore((s) => s.cryptoLoading);

  const [showAdd, setShowAdd] = useState(false);
  const [filter, setFilter] = useState("all");

  const filtered = filter === "all" ? inv : inv.filter((i) => i.tipe === filter);
  const tipes = [...new Set(inv.map((i) => i.tipe))];

  const totalValue = inv.reduce((a, item) => {
    if (item.tipe === "saham" && item.lot && item.hargaSkrg) return a + item.lot * 100 * item.hargaSkrg;
    if (item.tipe === "emas" && item.gram && item.hargaSkrg) return a + item.gram * item.hargaSkrg;
    if (item.tipe === "kripto" && item.jml && item.hargaSkrg) return a + item.jml * item.hargaSkrg;
    if (item.tipe === "obligasi" && item.nominal) return a + item.nominal;
    if (item.tipe === "deposito" && item.pokok) return a + item.pokok;
    if (item.tipe === "reksadana" && item.unit && item.nabSkrg) return a + item.unit * item.nabSkrg;
    return a;
  }, 0);

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-slate-800">Investasi</h1>
        <div className="flex gap-2">
          <Button size="sm" variant="secondary" onClick={loadCryptoPrices} disabled={cryptoLoading}>
            <RefreshCw size={14} className={cryptoLoading ? "animate-spin" : ""} /> Harga
          </Button>
          <Button size="sm" onClick={() => setShowAdd(true)}>
            <Plus size={16} /> Tambah
          </Button>
        </div>
      </div>

      {/* Summary */}
      <Card className="bg-gradient-to-br from-violet-50 to-indigo-50 border-violet-100">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-violet-100 rounded-xl flex items-center justify-center">
            <TrendingUp size={20} className="text-violet-600" />
          </div>
          <div>
            <p className="text-xs text-slate-400">Total Portfolio</p>
            <p className="text-2xl font-bold text-slate-700">{fmt(totalValue)}</p>
          </div>
        </div>
      </Card>

      {/* Filter */}
      {tipes.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          <button onClick={() => setFilter("all")}
            className={`px-4 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-all ${filter === "all" ? "bg-indigo-600 text-white shadow-sm" : "bg-white border border-slate-200 text-slate-500 hover:bg-slate-50"}`}>
            Semua
          </button>
          {tipes.map((t) => (
            <button key={t} onClick={() => setFilter(t)}
              className={`px-4 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-all ${filter === t ? "bg-indigo-600 text-white shadow-sm" : "bg-white border border-slate-200 text-slate-500 hover:bg-slate-50"}`}>
              {INV_TIPE_LABEL[t]}
            </button>
          ))}
        </div>
      )}

      {/* List */}
      {filtered.length === 0 ? (
        <Card>
          <p className="text-sm text-slate-400 text-center py-8">Belum ada investasi</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {filtered.map((item) => (
            <InvCard key={item.id} item={item} onDelete={() => delInv(item.id)} />
          ))}
        </div>
      )}

      <AddInvestasiModal open={showAdd} onClose={() => setShowAdd(false)} />
    </div>
  );
}
