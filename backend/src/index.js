import Fastify from 'fastify'
import cors from '@fastify/cors'
import multipart from '@fastify/multipart'
import { connectWithRetry } from './db.js'
import winxRoutes from './routes/winx.js'
import adminRoutes from './routes/admin.js'

const fastify = Fastify({ logger: true })
const PORT = parseInt(process.env.PORT || '3000')

await fastify.register(cors, { origin: true })
await fastify.register(multipart, { limits: { fileSize: 10 * 1024 * 1024 } }) // 10 MB max

fastify.get('/health', async () => ({ status: 'ok' }))

await fastify.register(winxRoutes)
await fastify.register(adminRoutes)

await connectWithRetry()
await fastify.listen({ port: PORT, host: '0.0.0.0' })
