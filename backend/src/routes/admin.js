import fs from 'fs'
import path from 'path'
import { pipeline } from 'stream/promises'

const ASSETS_PATH = process.env.ASSETS_PATH || './assets'
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'winx2024'

const VALID_PARTS = ['body', 'hair', 'eyes', 'lips', 'top', 'bottom', 'shoes', 'wings']

function checkAuth(req, reply) {
  const pwd = req.headers['x-admin-password']
  if (pwd !== ADMIN_PASSWORD) {
    reply.code(401).send({ error: 'Mot de passe incorrect' })
    return false
  }
  return true
}

function ensureDir(dirPath) {
  if (!fs.existsSync(dirPath)) fs.mkdirSync(dirPath, { recursive: true })
}

export default async function adminRoutes(fastify) {
  // Vérifier le mot de passe admin
  fastify.post('/api/admin/auth', async (req, reply) => {
    const { password } = req.body
    if (password !== ADMIN_PASSWORD) return reply.code(401).send({ error: 'Mot de passe incorrect' })
    return { ok: true }
  })

  // Lister les assets d'une partie
  fastify.get('/api/admin/assets/:partie', async (req, reply) => {
    if (!checkAuth(req, reply)) return
    const { partie } = req.params
    if (!VALID_PARTS.includes(partie)) return reply.code(400).send({ error: 'Partie invalide' })

    const dir = path.join(ASSETS_PATH, partie)
    ensureDir(dir)
    const files = fs.readdirSync(dir).filter(f => f.endsWith('.png'))
    return files
  })

  // Upload un PNG
  fastify.post('/api/admin/upload', async (req, reply) => {
    if (!checkAuth(req, reply)) return

    const data = await req.file()
    if (!data) return reply.code(400).send({ error: 'Aucun fichier reçu' })

    const partie     = data.fields.partie?.value
    const varianteId = data.fields.varianteId?.value
    const couleurId  = data.fields.couleurId?.value
    const suffix     = data.fields.suffix?.value || ''

    if (!partie || !varianteId || !couleurId) {
      return reply.code(400).send({ error: 'Champs partie, varianteId et couleurId requis' })
    }
    if (!VALID_PARTS.includes(partie)) {
      return reply.code(400).send({ error: 'Partie invalide' })
    }

    const filename = suffix
      ? `${varianteId}_${couleurId}_${suffix}.png`
      : `${varianteId}_${couleurId}.png`

    const dir      = path.join(ASSETS_PATH, partie)
    const filepath = path.join(dir, filename)
    ensureDir(dir)

    await pipeline(data.file, fs.createWriteStream(filepath))
    return { ok: true, filename, path: `/assets/${partie}/${filename}` }
  })

  // Supprimer un asset
  fastify.delete('/api/admin/assets/:partie/:filename', async (req, reply) => {
    if (!checkAuth(req, reply)) return
    const { partie, filename } = req.params

    if (!VALID_PARTS.includes(partie)) return reply.code(400).send({ error: 'Partie invalide' })
    if (!filename.endsWith('.png')) return reply.code(400).send({ error: 'Fichier invalide' })

    const filepath = path.join(ASSETS_PATH, partie, filename)
    if (!fs.existsSync(filepath)) return reply.code(404).send({ error: 'Fichier introuvable' })

    fs.unlinkSync(filepath)
    return reply.code(204).send()
  })
}
