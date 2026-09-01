-- Motivo e observacao informados pela empresa ao cancelar uma demanda.
-- Aplicar no Supabase (SQL Editor) antes de subir o backend com esta versao.
ALTER TABLE projetos
  ADD COLUMN IF NOT EXISTS cancelamento_motivo VARCHAR(80),
  ADD COLUMN IF NOT EXISTS cancelamento_observacao TEXT,
  ADD COLUMN IF NOT EXISTS cancelado_em TIMESTAMPTZ;
