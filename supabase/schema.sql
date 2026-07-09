-- ═══════════════════════════════════════════════════════════════
-- SCHEMA: Floripa Mais Aprendizagem
-- Execute no Supabase Dashboard > SQL Editor
-- ═══════════════════════════════════════════════════════════════

-- Estado dos marcos de entrega
CREATE TABLE IF NOT EXISTS marcos_state (
  id TEXT PRIMARY KEY,
  status TEXT DEFAULT 'nao-iniciado',
  prazo TEXT,
  areas JSONB,
  obs TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Resultados dos indicadores
CREATE TABLE IF NOT EXISTS indicadores_state (
  id TEXT PRIMARY KEY,
  resultado NUMERIC,
  notas TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Marcos adicionados pelo admin
CREATE TABLE IF NOT EXISTS marcos_custom (
  id TEXT PRIMARY KEY,
  eixo_id TEXT NOT NULL,
  diretriz_id TEXT NOT NULL,
  descricao TEXT NOT NULL,
  responsavel JSONB,
  prazo_original TEXT NOT NULL,
  ordem INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Row Level Security
ALTER TABLE marcos_state ENABLE ROW LEVEL SECURITY;
ALTER TABLE indicadores_state ENABLE ROW LEVEL SECURITY;
ALTER TABLE marcos_custom ENABLE ROW LEVEL SECURITY;

-- Leitura pública, escrita autenticada
CREATE POLICY "select_marcos" ON marcos_state FOR SELECT USING (true);
CREATE POLICY "all_marcos" ON marcos_state FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "update_marcos" ON marcos_state FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "delete_marcos" ON marcos_state FOR DELETE USING (auth.role() = 'authenticated');

CREATE POLICY "select_indicadores" ON indicadores_state FOR SELECT USING (true);
CREATE POLICY "all_indicadores" ON indicadores_state FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "update_indicadores" ON indicadores_state FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "delete_indicadores" ON indicadores_state FOR DELETE USING (auth.role() = 'authenticated');

CREATE POLICY "select_marcos_custom" ON marcos_custom FOR SELECT USING (true);
CREATE POLICY "all_marcos_custom" ON marcos_custom FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "update_marcos_custom" ON marcos_custom FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "delete_marcos_custom" ON marcos_custom FOR DELETE USING (auth.role() = 'authenticated');

-- Trigger auto-update timestamp
CREATE OR REPLACE FUNCTION update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER marcos_updated BEFORE UPDATE ON marcos_state
  FOR EACH ROW EXECUTE FUNCTION update_timestamp();
CREATE TRIGGER indicadores_updated BEFORE UPDATE ON indicadores_state
  FOR EACH ROW EXECUTE FUNCTION update_timestamp();
