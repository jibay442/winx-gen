import Fastify from 'fastify'
import cors from '@fastify/cors'
import { connectWithRetry } from './db.js'
import winxRoutes from './routes/winx.js'

const fastify = Fastify({ logger: true })
const PORT = parseInt(process.env.PORT || '3000')

await fastify.register(cors, { origin: true })

fastify.get('/health', async () => ({ status: 'ok' }))

await fastify.register(winxRoutes)

await connectWithRetry()
await fastify.listen({ port: PORT, host: '0.0.0.0' })
