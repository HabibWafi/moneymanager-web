import type {
  Bank,
  BankTransfer,
  PendapatanRutin,
  IncomeExtra,
  ExpRutin,
  ExpExtra,
  Hutang,
  Investasi,
  Budget,
  MonthlySnapshot,
  RealizationLog,
  DebtPayment,
} from "@/lib/types";

// ---------------------------------------------------------------------------
// Bank
// ---------------------------------------------------------------------------

export function dbToBank(row: any): Bank {
  return {
    id: row.id,
    nama: row.nama,
    saldo: Number(row.saldo),
    warna: row.warna,
    tipe: row.tipe,
    utama: row.utama ?? false,
  };
}

export function bankToDb(bank: Bank, userId: string) {
  return {
    id: bank.id,
    user_id: userId,
    nama: bank.nama,
    saldo: bank.saldo,
    warna: bank.warna,
    tipe: bank.tipe,
    utama: bank.utama ?? false,
  };
}

// ---------------------------------------------------------------------------
// BankTransfer
// ---------------------------------------------------------------------------

export function dbToBankTransfer(row: any): BankTransfer {
  return {
    id: row.id,
    dari: row.dari,
    ke: row.ke,
    jumlah: Number(row.jumlah),
    ket: row.ket,
    tgl: row.tgl,
  };
}

export function bankTransferToDb(t: BankTransfer, userId: string) {
  return {
    id: t.id,
    user_id: userId,
    dari: t.dari,
    ke: t.ke,
    jumlah: t.jumlah,
    ket: t.ket,
    tgl: t.tgl,
  };
}

// ---------------------------------------------------------------------------
// PendapatanRutin (income_routine)
// ---------------------------------------------------------------------------

export function dbToPendapatanRutin(row: any): PendapatanRutin {
  return {
    id: row.id,
    nama: row.nama,
    jumlah: Number(row.jumlah),
    tipe: row.tipe,
    kat: row.kat,
    aktif: row.aktif,
    bankId: row.bank_id || undefined,
    tglBayar: row.tgl_bayar != null ? Number(row.tgl_bayar) : undefined,
    mulaiY: row.mulai_y ?? new Date().getFullYear(),
    mulaiM: row.mulai_m ?? (new Date().getMonth() + 1),
    selesaiY: row.selesai_y ?? undefined,
    selesaiM: row.selesai_m ?? undefined,
    realisasi: row.realisasi ?? "otomatis",
  };
}

export function pendapatanRutinToDb(p: PendapatanRutin, userId: string) {
  return {
    id: p.id,
    user_id: userId,
    nama: p.nama,
    jumlah: p.jumlah,
    tipe: p.tipe,
    kat: p.kat,
    aktif: p.aktif,
    bank_id: p.bankId || null,
    tgl_bayar: p.tglBayar ?? null,
    mulai_y: p.mulaiY,
    mulai_m: p.mulaiM,
    selesai_y: p.selesaiY ?? null,
    selesai_m: p.selesaiM ?? null,
    realisasi: p.realisasi,
  };
}

// ---------------------------------------------------------------------------
// IncomeExtra
// ---------------------------------------------------------------------------

export function dbToIncomeExtra(row: any): IncomeExtra {
  return {
    id: row.id,
    bk: row.bk,
    kat: row.kat,
    desc: row.desc,
    jumlah: Number(row.jumlah),
    sumber: row.sumber,
    tgl: row.tgl || undefined,
    status: row.status ?? "terjadi",
    realisasi: row.realisasi || undefined,
  };
}

export function incomeExtraToDb(x: IncomeExtra, userId: string) {
  return {
    id: x.id,
    user_id: userId,
    bk: x.bk,
    kat: x.kat,
    desc: x.desc,
    jumlah: x.jumlah,
    sumber: x.sumber,
    tgl: x.tgl || null,
    status: x.status,
    realisasi: x.realisasi || null,
  };
}

// ---------------------------------------------------------------------------
// ExpRutin (expense_routine)
// ---------------------------------------------------------------------------

export function dbToExpRutin(row: any): ExpRutin {
  return {
    id: row.id,
    nama: row.nama,
    jumlah: Number(row.jumlah),
    tipe: row.tipe,
    mulaiY: row.mulai_y,
    mulaiM: row.mulai_m,
    selesaiY: row.selesai_y,
    selesaiM: row.selesai_m,
    kat: row.kat,
    bankId: row.bank_id || undefined,
    tglBayar: row.tgl_bayar != null ? Number(row.tgl_bayar) : undefined,
    realisasi: row.realisasi ?? "otomatis",
  };
}

export function expRutinToDb(e: ExpRutin, userId: string) {
  return {
    id: e.id,
    user_id: userId,
    nama: e.nama,
    jumlah: e.jumlah,
    tipe: e.tipe,
    mulai_y: e.mulaiY,
    mulai_m: e.mulaiM,
    selesai_y: e.selesaiY,
    selesai_m: e.selesaiM,
    kat: e.kat,
    bank_id: e.bankId || null,
    tgl_bayar: e.tglBayar ?? null,
    realisasi: e.realisasi,
  };
}

// ---------------------------------------------------------------------------
// ExpExtra (expense_extra)
// ---------------------------------------------------------------------------

export function dbToExpExtra(row: any): ExpExtra {
  return {
    id: row.id,
    bk: row.bk,
    kat: row.kat,
    desc: row.desc,
    jumlah: Number(row.jumlah),
    sumber: row.sumber,
    tgl: row.tgl || undefined,
    status: row.status ?? "terjadi",
    realisasi: row.realisasi || undefined,
  };
}

export function expExtraToDb(x: ExpExtra, userId: string) {
  return {
    id: x.id,
    user_id: userId,
    bk: x.bk,
    kat: x.kat,
    desc: x.desc,
    jumlah: x.jumlah,
    sumber: x.sumber,
    tgl: x.tgl || null,
    status: x.status,
    realisasi: x.realisasi || null,
  };
}

// ---------------------------------------------------------------------------
// Hutang (debts)
// ---------------------------------------------------------------------------

export function dbToHutang(row: any): Hutang {
  return {
    id: row.id,
    nama: row.nama,
    htipe: row.htipe,
    cicilan: Number(row.cicilan),
    pokok: Number(row.pokok),
    sudah: Number(row.sudah),
    mulaiY: row.mulai_y,
    mulaiM: row.mulai_m,
    selesaiY: row.selesai_y,
    selesaiM: row.selesai_m,
    bankId: row.bank_id || undefined,
    tglBayar: row.tgl_bayar != null ? Number(row.tgl_bayar) : undefined,
  };
}

export function hutangToDb(h: Hutang, userId: string) {
  return {
    id: h.id,
    user_id: userId,
    nama: h.nama,
    htipe: h.htipe,
    cicilan: h.cicilan,
    pokok: h.pokok,
    sudah: h.sudah,
    mulai_y: h.mulaiY,
    mulai_m: h.mulaiM,
    selesai_y: h.selesaiY,
    selesai_m: h.selesaiM,
    bank_id: h.bankId || null,
    tgl_bayar: h.tglBayar || null,
  };
}

// ---------------------------------------------------------------------------
// Investasi (investments)
// ---------------------------------------------------------------------------

export function dbToInvestasi(row: any): Investasi {
  return {
    id: row.id,
    tipe: row.tipe,
    currency: row.currency,
    nama: row.nama,
    sym: row.sym,
    kode: row.kode,
    bank: row.bank,
    lot: row.lot != null ? Number(row.lot) : undefined,
    gram: row.gram != null ? Number(row.gram) : undefined,
    jml: row.jml != null ? Number(row.jml) : undefined,
    unit: row.unit != null ? Number(row.unit) : undefined,
    hargaBeli: row.harga_beli != null ? Number(row.harga_beli) : undefined,
    hargaSkrg: row.harga_skrg != null ? Number(row.harga_skrg) : undefined,
    nabBeli: row.nab_beli != null ? Number(row.nab_beli) : undefined,
    nabSkrg: row.nab_skrg != null ? Number(row.nab_skrg) : undefined,
    nominal: row.nominal != null ? Number(row.nominal) : undefined,
    kupon: row.kupon != null ? Number(row.kupon) : undefined,
    jatuhTempo: row.jatuh_tempo,
    pokok: row.pokok != null ? Number(row.pokok) : undefined,
    bunga: row.bunga != null ? Number(row.bunga) : undefined,
    tanggalMulai: row.tanggal_mulai,
    tanggalCair: row.tanggal_cair,
    coinId: row.coin_id,
    manajer: row.manajer,
  };
}

export function investasiToDb(inv: Investasi, userId: string) {
  return {
    id: inv.id,
    user_id: userId,
    tipe: inv.tipe,
    currency: inv.currency,
    nama: inv.nama,
    sym: inv.sym,
    kode: inv.kode,
    bank: inv.bank,
    lot: inv.lot,
    gram: inv.gram,
    jml: inv.jml,
    unit: inv.unit,
    harga_beli: inv.hargaBeli,
    harga_skrg: inv.hargaSkrg,
    nab_beli: inv.nabBeli,
    nab_skrg: inv.nabSkrg,
    nominal: inv.nominal,
    kupon: inv.kupon,
    jatuh_tempo: inv.jatuhTempo,
    pokok: inv.pokok,
    bunga: inv.bunga,
    tanggal_mulai: inv.tanggalMulai,
    tanggal_cair: inv.tanggalCair,
    coin_id: inv.coinId,
    manajer: inv.manajer,
  };
}

// ---------------------------------------------------------------------------
// Holidays
// ---------------------------------------------------------------------------

export function dbToHoliday(row: any): { bk: string; days: number[] } {
  return {
    bk: row.bk,
    days: row.days ?? [],
  };
}

export function holidayToDb(bk: string, days: number[], userId: string) {
  return {
    user_id: userId,
    bk,
    days,
  };
}

// ---------------------------------------------------------------------------
// Budget
// ---------------------------------------------------------------------------

export function dbToBudget(row: any): Budget {
  return {
    id: row.id,
    kat: row.kat,
    jumlah: Number(row.jumlah),
  };
}

export function budgetToDb(b: Budget, userId: string) {
  return {
    id: b.id,
    user_id: userId,
    kat: b.kat,
    jumlah: b.jumlah,
  };
}

// ---------------------------------------------------------------------------
// MonthlySnapshot
// ---------------------------------------------------------------------------

export function dbToSnapshot(row: any): MonthlySnapshot {
  return {
    id: row.id,
    bk: row.bk,
    income: Number(row.income),
    expense: Number(row.expense),
    sisa: Number(row.sisa),
    netWorth: Number(row.net_worth),
    bankTotal: Number(row.bank_total),
    invTotal: Number(row.inv_total),
    hutangTotal: Number(row.hutang_total),
  };
}

export function snapshotToDb(s: MonthlySnapshot, userId: string) {
  return {
    id: s.id,
    user_id: userId,
    bk: s.bk,
    income: s.income,
    expense: s.expense,
    sisa: s.sisa,
    net_worth: s.netWorth,
    bank_total: s.bankTotal,
    inv_total: s.invTotal,
    hutang_total: s.hutangTotal,
  };
}

// ---------------------------------------------------------------------------
// RealizationLog
// ---------------------------------------------------------------------------

export function dbToRealizationLog(row: any): RealizationLog {
  return {
    id: row.id,
    sourceType: row.source_type,
    sourceId: row.source_id,
    bk: row.bk,
    jumlah: Number(row.jumlah) || 0,
    bankId: row.bank_id || undefined,
  };
}

export function realizationLogToDb(r: RealizationLog, userId: string) {
  return {
    id: r.id,
    user_id: userId,
    source_type: r.sourceType,
    source_id: r.sourceId,
    bk: r.bk,
    jumlah: r.jumlah,
    bank_id: r.bankId || null,
  };
}

// ---------------------------------------------------------------------------
// DebtPayment
// ---------------------------------------------------------------------------

export function dbToDebtPayment(row: any): DebtPayment {
  return {
    id: row.id,
    hutangId: row.hutang_id,
    bk: row.bk,
    jumlah: Number(row.jumlah),
    bankId: row.bank_id,
  };
}

export function debtPaymentToDb(dp: DebtPayment, userId: string) {
  return {
    id: dp.id,
    user_id: userId,
    hutang_id: dp.hutangId,
    bk: dp.bk,
    jumlah: dp.jumlah,
    bank_id: dp.bankId,
  };
}
