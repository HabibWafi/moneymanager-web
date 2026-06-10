-- ============================================================================
-- Money Manager — Initial Schema
-- ============================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- Helper: auto-update updated_at
-- ============================================================================

CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- banks
-- ============================================================================

CREATE TABLE banks (
  id         TEXT PRIMARY KEY,
  user_id    UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  nama       TEXT NOT NULL,
  saldo      NUMERIC NOT NULL DEFAULT 0,
  warna      TEXT NOT NULL DEFAULT '#4F46E5',
  tipe       TEXT NOT NULL CHECK (tipe IN ('bank', 'cash')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_banks_user_id ON banks(user_id);

CREATE TRIGGER trg_banks_updated_at
  BEFORE UPDATE ON banks
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

ALTER TABLE banks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own banks"
  ON banks FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own banks"
  ON banks FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own banks"
  ON banks FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own banks"
  ON banks FOR DELETE USING (auth.uid() = user_id);

-- ============================================================================
-- bank_transfers
-- ============================================================================

CREATE TABLE bank_transfers (
  id         TEXT PRIMARY KEY,
  user_id    UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  dari       TEXT NOT NULL REFERENCES banks(id) ON DELETE CASCADE,
  ke         TEXT NOT NULL REFERENCES banks(id) ON DELETE CASCADE,
  jumlah     NUMERIC NOT NULL,
  ket        TEXT NOT NULL DEFAULT '',
  tgl        TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_bank_transfers_user_id ON bank_transfers(user_id);

CREATE TRIGGER trg_bank_transfers_updated_at
  BEFORE UPDATE ON bank_transfers
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

ALTER TABLE bank_transfers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own bank_transfers"
  ON bank_transfers FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own bank_transfers"
  ON bank_transfers FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own bank_transfers"
  ON bank_transfers FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own bank_transfers"
  ON bank_transfers FOR DELETE USING (auth.uid() = user_id);

-- ============================================================================
-- income_routine
-- ============================================================================

CREATE TABLE income_routine (
  id         TEXT PRIMARY KEY,
  user_id    UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  nama       TEXT NOT NULL,
  jumlah     NUMERIC NOT NULL,
  tipe       TEXT NOT NULL CHECK (tipe IN ('tetap', 'harian')),
  kat        TEXT NOT NULL DEFAULT 'Other',
  aktif      BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_income_routine_user_id ON income_routine(user_id);

CREATE TRIGGER trg_income_routine_updated_at
  BEFORE UPDATE ON income_routine
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

ALTER TABLE income_routine ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own income_routine"
  ON income_routine FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own income_routine"
  ON income_routine FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own income_routine"
  ON income_routine FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own income_routine"
  ON income_routine FOR DELETE USING (auth.uid() = user_id);

-- ============================================================================
-- income_extra
-- ============================================================================

CREATE TABLE income_extra (
  id         TEXT PRIMARY KEY,
  user_id    UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  bk         TEXT NOT NULL,
  kat        TEXT NOT NULL DEFAULT 'Other',
  "desc"     TEXT NOT NULL DEFAULT '',
  jumlah     NUMERIC NOT NULL,
  sumber     TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_income_extra_user_id ON income_extra(user_id);
CREATE INDEX idx_income_extra_user_bk ON income_extra(user_id, bk);

CREATE TRIGGER trg_income_extra_updated_at
  BEFORE UPDATE ON income_extra
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

ALTER TABLE income_extra ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own income_extra"
  ON income_extra FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own income_extra"
  ON income_extra FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own income_extra"
  ON income_extra FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own income_extra"
  ON income_extra FOR DELETE USING (auth.uid() = user_id);

-- ============================================================================
-- expense_routine
-- ============================================================================

CREATE TABLE expense_routine (
  id         TEXT PRIMARY KEY,
  user_id    UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  nama       TEXT NOT NULL,
  jumlah     NUMERIC NOT NULL,
  tipe       TEXT NOT NULL CHECK (tipe IN ('tetap', 'cicilan')),
  mulai_y    INT NOT NULL,
  mulai_m    INT NOT NULL,
  selesai_y  INT,
  selesai_m  INT,
  kat        TEXT NOT NULL DEFAULT 'Other',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_expense_routine_user_id ON expense_routine(user_id);

CREATE TRIGGER trg_expense_routine_updated_at
  BEFORE UPDATE ON expense_routine
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

ALTER TABLE expense_routine ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own expense_routine"
  ON expense_routine FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own expense_routine"
  ON expense_routine FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own expense_routine"
  ON expense_routine FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own expense_routine"
  ON expense_routine FOR DELETE USING (auth.uid() = user_id);

-- ============================================================================
-- expense_extra
-- ============================================================================

CREATE TABLE expense_extra (
  id         TEXT PRIMARY KEY,
  user_id    UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  bk         TEXT NOT NULL,
  kat        TEXT NOT NULL DEFAULT 'Other',
  "desc"     TEXT NOT NULL DEFAULT '',
  jumlah     NUMERIC NOT NULL,
  sumber     TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_expense_extra_user_id ON expense_extra(user_id);
CREATE INDEX idx_expense_extra_user_bk ON expense_extra(user_id, bk);

CREATE TRIGGER trg_expense_extra_updated_at
  BEFORE UPDATE ON expense_extra
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

ALTER TABLE expense_extra ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own expense_extra"
  ON expense_extra FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own expense_extra"
  ON expense_extra FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own expense_extra"
  ON expense_extra FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own expense_extra"
  ON expense_extra FOR DELETE USING (auth.uid() = user_id);

-- ============================================================================
-- debts
-- ============================================================================

CREATE TABLE debts (
  id         TEXT PRIMARY KEY,
  user_id    UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  nama       TEXT NOT NULL,
  htipe      TEXT NOT NULL CHECK (htipe IN ('cicilan', 'hutang')),
  cicilan    NUMERIC NOT NULL DEFAULT 0,
  pokok      NUMERIC NOT NULL DEFAULT 0,
  sudah      NUMERIC NOT NULL DEFAULT 0,
  mulai_y    INT NOT NULL,
  mulai_m    INT NOT NULL,
  selesai_y  INT NOT NULL,
  selesai_m  INT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_debts_user_id ON debts(user_id);

CREATE TRIGGER trg_debts_updated_at
  BEFORE UPDATE ON debts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

ALTER TABLE debts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own debts"
  ON debts FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own debts"
  ON debts FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own debts"
  ON debts FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own debts"
  ON debts FOR DELETE USING (auth.uid() = user_id);

-- ============================================================================
-- investments
-- ============================================================================

CREATE TABLE investments (
  id            TEXT PRIMARY KEY,
  user_id       UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  tipe          TEXT NOT NULL CHECK (tipe IN ('saham', 'emas', 'kripto', 'obligasi', 'deposito', 'reksadana')),
  currency      TEXT NOT NULL DEFAULT 'IDR' CHECK (currency IN ('IDR', 'USD')),
  nama          TEXT,
  sym           TEXT,
  kode          TEXT,
  bank          TEXT,
  lot           NUMERIC,
  gram          NUMERIC,
  jml           NUMERIC,
  unit          NUMERIC,
  harga_beli    NUMERIC,
  harga_skrg    NUMERIC,
  nab_beli      NUMERIC,
  nab_skrg      NUMERIC,
  nominal       NUMERIC,
  kupon         NUMERIC,
  jatuh_tempo   TEXT,
  pokok         NUMERIC,
  bunga         NUMERIC,
  tanggal_mulai TEXT,
  tanggal_cair  TEXT,
  coin_id       TEXT,
  manajer       TEXT,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_investments_user_id ON investments(user_id);

CREATE TRIGGER trg_investments_updated_at
  BEFORE UPDATE ON investments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

ALTER TABLE investments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own investments"
  ON investments FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own investments"
  ON investments FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own investments"
  ON investments FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own investments"
  ON investments FOR DELETE USING (auth.uid() = user_id);

-- ============================================================================
-- holidays
-- ============================================================================

CREATE TABLE holidays (
  id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id    UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  bk         TEXT NOT NULL,
  days       INT[] NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, bk)
);

CREATE INDEX idx_holidays_user_id ON holidays(user_id);

CREATE TRIGGER trg_holidays_updated_at
  BEFORE UPDATE ON holidays
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

ALTER TABLE holidays ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own holidays"
  ON holidays FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own holidays"
  ON holidays FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own holidays"
  ON holidays FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own holidays"
  ON holidays FOR DELETE USING (auth.uid() = user_id);

-- ============================================================================
-- price_cache (shared, no user_id)
-- ============================================================================

CREATE TABLE price_cache (
  id         TEXT PRIMARY KEY,
  price_idr  NUMERIC,
  price_usd  NUMERIC,
  fetched_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE price_cache ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view price_cache"
  ON price_cache FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can insert price_cache"
  ON price_cache FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated users can update price_cache"
  ON price_cache FOR UPDATE TO authenticated USING (true);
