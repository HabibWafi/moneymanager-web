export interface Bank {
  id: string;
  nama: string;
  saldo: number;
  warna: string;
  tipe: "bank" | "cash";
}

export interface PendapatanRutin {
  id: string;
  nama: string;
  jumlah: number;
  tipe: "tetap" | "harian";
  kat: string;
  aktif: boolean;
}

export interface IncomeExtra {
  id: string;
  bk: string; // bulan key YYYY-MM
  kat: string;
  desc: string;
  jumlah: number;
  sumber: string; // bank id
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
}

export interface ExpExtra {
  id: string;
  bk: string;
  kat: string;
  desc: string;
  jumlah: number;
  sumber: string;
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
}
