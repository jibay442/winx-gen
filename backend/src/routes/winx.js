import pool from '../db.js'

export default async function winxRoutes(fastify) {
  fastify.get('/api/winx', async (req, reply) => {
    const { rows } = await pool.query(
      'SELECT id, name, thumbnail, created_at, updated_at FROM winx_creations ORDER BY updated_at DESC'
    )
    return rows
  })

  fastify.get('/api/winx/:id', async (req, reply) => {
    const { rows } = await pool.query(
      'SELECT * FROM winx_creations WHERE id = $1',
      [req.params.id]
    )
    if (!rows.length) return reply.code(404).send({ error: 'Not found' })
    return rows[0]
  })

  fastify.post('/api/winx', async (req, reply) => {
    const { name, character_data, studio_data, thumbnail } = req.body
    const { rows } = await pool.query(
      `INSERT INTO winx_creations (name, character_data, studio_data, thumbnail)
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [name || 'Ma Winx', character_data, studio_data || {}, thumbnail]
    )
    return reply.code(201).send(rows[0])
  })

  fastify.put('/api/winx/:id', async (req, reply) => {
    const { name, character_data, studio_data, thumbnail } = req.body
    const { rows } = await pool.query(
      `UPDATE winx_creations
       SET name = COALESCE($1, name),
           character_data = COALESCE($2, character_data),
           studio_data = COALESCE($3, studio_data),
           thumbnail = COALESCE($4, thumbnail)
       WHERE id = $5 RETURNING *`,
      [name, character_data, studio_data, thumbnail, req.params.id]
    )
    if (!rows.length) return reply.code(404).send({ error: 'Not found' })
    return rows[0]
  })

  fastify.delete('/api/winx/:id', async (req, reply) => {
    const { rowCount } = await pool.query(
      'DELETE FROM winx_creations WHERE id = $1',
      [req.params.id]
    )
    if (!rowCount) return reply.code(404).send({ error: 'Not found' })
    return reply.code(204).send()
  })
}
