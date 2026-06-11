-- Add bank_id column to debts table for tracking which bank account pays the debt
ALTER TABLE debts ADD COLUMN IF NOT EXISTS bank_id TEXT REFERENCES banks(id) ON DELETE SET NULL;
