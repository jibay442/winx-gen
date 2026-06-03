import pg from 'pg'

const { Pool } = pg

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
})

export async function connectWithRetry(retries = 10, delay = 2000) {
  for (let i = 0; i < retries; i++) {
    try {
      const client = await pool.connect()
      client.release()
      console.log('Database connected')
      return
    } catch (err) {
      console.log(`DB not ready, retry ${i + 1}/${retries}...`)
      await new Promise(r => setTimeout(r, delay))
    }
  }
  throw new Error('Could not connect to database')
}

export default pool
