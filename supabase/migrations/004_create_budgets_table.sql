CREATE TABLE budgets (
  id TEXT PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  kat TEXT NOT NULL,
  jumlah NUMERIC NOT NULL DEFAULT 0,
  UNIQUE(user_id, kat)
);

ALTER TABLE budgets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "budgets_owner" ON budgets FOR ALL USING (auth.uid() = user_id);
