CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE IF NOT EXISTS winx_creations (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name        VARCHAR(100) NOT NULL DEFAULT 'Ma Winx',
  character_data JSONB NOT NULL DEFAULT '{}',
  studio_data    JSONB NOT NULL DEFAULT '{}',
  thumbnail   TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_winx_updated_at
  BEFORE UPDATE ON winx_creations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
