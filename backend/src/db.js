import pg from 'pg'

const { Pool } = pg

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
})

const SCHEMA = `
  CREATE EXTENSION IF NOT EXISTS "pgcrypto";

  CREATE TABLE IF NOT EXISTS winx_creations (
    id             UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    name           VARCHAR(100) NOT NULL DEFAULT 'Ma Winx',
    character_data JSONB        NOT NULL DEFAULT '{}',
    studio_data    JSONB        NOT NULL DEFAULT '{}',
    thumbnail      TEXT,
    created_at     TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    updated_at     TIMESTAMPTZ  NOT NULL DEFAULT NOW()
  );

  CREATE OR REPLACE FUNCTION update_updated_at()
  RETURNS TRIGGER AS $$
  BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
  END;
  $$ LANGUAGE plpgsql;

  DROP TRIGGER IF EXISTS trg_winx_updated_at ON winx_creations;
  CREATE TRIGGER trg_winx_updated_at
    BEFORE UPDATE ON winx_creations
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();
`

export async function connectWithRetry(retries = 10, delay = 2000) {
  for (let i = 0; i < retries; i++) {
    try {
      const client = await pool.connect()
      await client.query(SCHEMA)
      client.release()
      console.log('Database connected and schema ready')
      return
    } catch (err) {
      console.log(`DB not ready, retry ${i + 1}/${retries}...`)
      await new Promise(r => setTimeout(r, delay))
    }
  }
  throw new Error('Could not connect to database')
}

export default pool
