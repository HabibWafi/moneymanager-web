CREATE TABLE monthly_snapshots (
  id TEXT PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  bk TEXT NOT NULL,
  income NUMERIC NOT NULL DEFAULT 0,
  expense NUMERIC NOT NULL DEFAULT 0,
  sisa NUMERIC NOT NULL DEFAULT 0,
  net_worth NUMERIC NOT NULL DEFAULT 0,
  bank_total NUMERIC NOT NULL DEFAULT 0,
  inv_total NUMERIC NOT NULL DEFAULT 0,
  hutang_total NUMERIC NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, bk)
);

ALTER TABLE monthly_snapshots ENABLE ROW LEVEL SECURITY;

CREATE POLICY "monthly_snapshots_owner" ON monthly_snapshots FOR ALL USING (auth.uid() = user_id);
