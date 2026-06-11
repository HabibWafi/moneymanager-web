"use client";

const MONTHS = [
  "Januari", "Februari", "Maret", "April", "Mei", "Juni",
  "Juli", "Agustus", "September", "Oktober", "November", "Desember",
];

interface Props {
  year: number | undefined;
  month: number | undefined;
  onChangeYear: (v: number | undefined) => void;
  onChangeMonth: (v: number | undefined) => void;
  label?: string;
  optional?: boolean;
}

export default function MonthYearPicker({ year, month, onChangeYear, onChangeMonth, label, optional }: Props) {
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 8 }, (_, i) => currentYear - 2 + i);

  const inputCls = "w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400";

  return (
    <div>
      {label && <label className="block text-sm font-medium text-slate-600 mb-1.5">{label}</label>}
      <div className="flex gap-2">
        <select
          value={month ?? ""}
          onChange={(e) => onChangeMonth(e.target.value ? Number(e.target.value) : undefined)}
          className={inputCls}
        >
          {optional && <option value="">— Bulan —</option>}
          {MONTHS.map((name, i) => (
            <option key={i} value={i + 1}>{name}</option>
          ))}
        </select>
        <select
          value={year ?? ""}
          onChange={(e) => onChangeYear(e.target.value ? Number(e.target.value) : undefined)}
          className={inputCls}
        >
          {optional && <option value="">— Tahun —</option>}
          {years.map((y) => (
            <option key={y} value={y}>{y}</option>
          ))}
        </select>
      </div>
    </div>
  );
}
