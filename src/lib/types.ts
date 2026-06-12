export interface Bank {
  id: string;
  nama: string;
  saldo: number;
  warna: string;
  tipe: "bank" | "cash";
  utama?: boolean;
}

export interface PendapatanRutin {
  id: string;
  nama: string;
  jumlah: number;
  tipe: "tetap" | "harian";
  kat: string;
  aktif: boolean;
  bankId?: string;
  tglBayar?: number;
  mulaiY: number;
  mulaiM: number;
  selesaiY?: number;
  selesaiM?: number;
  realisasi: "otomatis" | "manual";
}

export interface IncomeExtra {
  id: string;
  bk: string; // bulan key YYYY-MM
  kat: string;
  desc: string;
  jumlah: number;
  sumber: string; // bank id
  tgl?: string;
  status: "terjadi" | "belum";
  realisasi?: "otomatis" | "manual";
}

export interface ExpRutin {
  id: string;
  nama: string;
  jumlah: number;
  tipe: "tetap" | "cicilan";
  mulaiY: number;
  mulaiM: number;
  selesaiY?: number;
  selesaiM?: number;
  kat: string;
  bankId?: string;
  tglBayar?: number;
  realisasi: "otomatis" | "manual";
}

export interface ExpExtra {
  id: string;
  bk: string;
  kat: string;
  desc: string;
  jumlah: number;
  sumber: string;
  tgl?: string;
  status: "terjadi" | "belum";
  realisasi?: "otomatis" | "manual";
}

export interface Hutang {
  id: string;
  nama: string;
  htipe: "cicilan" | "hutang";
  cicilan: number;
  pokok: number;
  sudah: number;
  mulaiY: number;
  mulaiM: number;
  selesaiY: number;
  selesaiM: number;
  bankId?: string;
  tglBayar?: number;
}

export interface Budget {
  id: string;
  kat: string;
  jumlah: number;
}

export interface MonthlySnapshot {
  id: string;
  bk: string; // YYYY-MM
  income: number;
  expense: number;
  sisa: number;
  netWorth: number;
  bankTotal: number;
  invTotal: number;
  hutangTotal: number;
}

export interface Investasi {
  id: string;
  tipe: "saham" | "emas" | "kripto" | "obligasi" | "deposito" | "reksadana";
  currency?: "IDR" | "USD";
  nama?: string;
  sym?: string;
  kode?: string;
  bank?: string;
  lot?: number;
  gram?: number;
  jml?: number;
  unit?: number;
  hargaBeli?: number;
  hargaSkrg?: number;
  nabBeli?: number;
  nabSkrg?: number;
  nominal?: number;
  kupon?: number;
  jatuhTempo?: string;
  pokok?: number;
  bunga?: number;
  tanggalMulai?: string;
  tanggalCair?: string;
  coinId?: string;
  manajer?: string;
}

export interface RealizationLog {
  id: string;
  sourceType: "income_routine" | "expense_routine" | "income_extra" | "expense_extra";
  sourceId: string;
  bk: string;
}

export interface BankTransfer {
  id: string;
  dari: string;
  ke: string;
  jumlah: number;
  ket: string;
  tgl: string;
}

export interface AppData {
  banks: Bank[];
  bankTrf: BankTransfer[];
  pendapatanRutin: PendapatanRutin[];
  incEx: IncomeExtra[];
  expRutin: ExpRutin[];
  expEx: ExpExtra[];
  hutang: Hutang[];
  inv: Investasi[];
  cuti: Record<string, number[]>;
  budgets: Budget[];
  snapshots: MonthlySnapshot[];
  realizationLog: RealizationLog[];
}
