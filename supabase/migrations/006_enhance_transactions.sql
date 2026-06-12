-- income_routine: sumber rekening, tanggal bayar, mulai/selesai, realisasi
ALTER TABLE income_routine ADD COLUMN IF NOT EXISTS bank_id TEXT REFERENCES banks(id) ON DELETE SET NULL;
ALTER TABLE income_routine ADD COLUMN IF NOT EXISTS tgl_bayar INTEGER;
ALTER TABLE income_routine ADD COLUMN IF NOT EXISTS mulai_y INTEGER;
ALTER TABLE income_routine ADD COLUMN IF NOT EXISTS mulai_m INTEGER;
ALTER TABLE income_routine ADD COLUMN IF NOT EXISTS selesai_y INTEGER;
ALTER TABLE income_routine ADD COLUMN IF NOT EXISTS selesai_m INTEGER;
ALTER TABLE income_routine ADD COLUMN IF NOT EXISTS realisasi TEXT DEFAULT 'otomatis';

-- expense_routine: sumber rekening, tanggal bayar, realisasi
ALTER TABLE expense_routine ADD COLUMN IF NOT EXISTS bank_id TEXT REFERENCES banks(id) ON DELETE SET NULL;
ALTER TABLE expense_routine ADD COLUMN IF NOT EXISTS tgl_bayar INTEGER;
ALTER TABLE expense_routine ADD COLUMN IF NOT EXISTS realisasi TEXT DEFAULT 'otomatis';

-- income_extra: tanggal, status, realisasi
ALTER TABLE income_extra ADD COLUMN IF NOT EXISTS tgl TEXT;
ALTER TABLE income_extra ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'terjadi';
ALTER TABLE income_extra ADD COLUMN IF NOT EXISTS realisasi TEXT DEFAULT 'otomatis';

-- expense_extra: tanggal, status, realisasi
ALTER TABLE expense_extra ADD COLUMN IF NOT EXISTS tgl TEXT;
ALTER TABLE expense_extra ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'terjadi';
ALTER TABLE expense_extra ADD COLUMN IF NOT EXISTS realisasi TEXT DEFAULT 'otomatis';

-- banks: rekening utama
ALTER TABLE banks ADD COLUMN IF NOT EXISTS utama BOOLEAN DEFAULT FALSE;

-- realization_log: tracking realisasi rutin per bulan
CREATE TABLE IF NOT EXISTS realization_log (
  id TEXT PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  source_type TEXT NOT NULL,
  source_id TEXT NOT NULL,
  bk TEXT NOT NULL,
  realized_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(source_type, source_id, bk)
);
ALTER TABLE realization_log ENABLE ROW LEVEL SECURITY;
CREATE POLICY "realization_log_owner" ON realization_log FOR ALL USING (auth.uid() = user_id);
