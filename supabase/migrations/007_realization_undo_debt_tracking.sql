-- Enhance realization_log with jumlah & bank_id for reversal
ALTER TABLE realization_log ADD COLUMN IF NOT EXISTS jumlah NUMERIC DEFAULT 0;
ALTER TABLE realization_log ADD COLUMN IF NOT EXISTS bank_id TEXT REFERENCES banks(id) ON DELETE SET NULL;

-- Debt payment tracking per-month
CREATE TABLE IF NOT EXISTS debt_payments (
  id TEXT PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  hutang_id TEXT NOT NULL REFERENCES debts(id) ON DELETE CASCADE,
  bk TEXT NOT NULL,
  jumlah NUMERIC NOT NULL,
  bank_id TEXT NOT NULL REFERENCES banks(id) ON DELETE SET NULL,
  paid_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(hutang_id, bk)
);
ALTER TABLE debt_payments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "debt_payments_owner" ON debt_payments FOR ALL USING (auth.uid() = user_id);
