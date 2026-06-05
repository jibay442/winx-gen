import fs from 'fs'
import path from 'path'
import { pipeline } from 'stream/promises'

const ASSETS_PATH    = process.env.ASSETS_PATH    || './assets'
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'winx2024'

const VALID_PARTS  = ['body', 'hair', 'eyes', 'lips', 'top', 'bottom', 'shoes', 'wings']
const CONFIG_PATH  = () => path.join(ASSETS_PATH, 'config.json')

function readConfig() {
  try {
    return JSON.parse(fs.readFileSync(CONFIG_PATH(), 'utf8'))
  } catch {
    return { canvas: { width: 600, height: 1791 }, variantLabels: {} }
  }
}

function writeConfig(data) {
  ensureDir(ASSETS_PATH)
  fs.writeFileSync(CONFIG_PATH(), JSON.stringify(data, null, 2))
}

function checkAuth(req, reply) {
  if (req.headers['x-admin-password'] !== ADMIN_PASSWORD) {
    reply.code(401).send({ error: 'Mot de passe incorrect' })
    return false
  }
  return true
}

function ensureDir(dirPath) {
  if (!fs.existsSync(dirPath)) fs.mkdirSync(dirPath, { recursive: true })
}

export default async function adminRoutes(fastify) {
  // Config publique (lue par le frontend au démarrage)
  fastify.get('/api/config', async () => readConfig())

  // Config admin (lecture + écriture)
  fastify.get('/api/admin/config', async (req, reply) => {
    if (!checkAuth(req, reply)) return
    return readConfig()
  })

  fastify.put('/api/admin/config', async (req, reply) => {
    if (!checkAuth(req, reply)) return
    writeConfig(req.body)
    return req.body
  })

  // Vérification du mot de passe
  fastify.post('/api/admin/auth', async (req, reply) => {
    const { password } = req.body
    if (password !== ADMIN_PASSWORD) return reply.code(401).send({ error: 'Mot de passe incorrect' })
    return { ok: true }
  })

  // Liste des fichiers d'une partie
  fastify.get('/api/admin/assets/:partie', async (req, reply) => {
    if (!checkAuth(req, reply)) return
    const { partie } = req.params
    if (!VALID_PARTS.includes(partie)) return reply.code(400).send({ error: 'Partie invalide' })
    const dir = path.join(ASSETS_PATH, partie)
    ensureDir(dir)
    return fs.readdirSync(dir).filter(f => f.endsWith('.png'))
  })

  // Upload d'un PNG
  // Le frontend envoie les champs texte EN PREMIER, puis le fichier en dernier
  fastify.post('/api/admin/upload', async (req, reply) => {
    if (!checkAuth(req, reply)) return

    const fields = {}
    let savedFilename = null

    for await (const part of req.parts()) {
      if (part.type === 'file') {
        const { partie, varianteId, suffix = '' } = fields

        if (!partie || !varianteId) {
          await part.toBuffer() // vider le stream pour éviter une fuite mémoire
          return reply.code(400).send({ error: 'Champs partie et varianteId requis' })
        }
        if (!VALID_PARTS.includes(partie)) {
          await part.toBuffer()
          return reply.code(400).send({ error: 'Partie invalide' })
        }

        const filename = suffix
          ? `${varianteId}_${suffix}.png`
          : `${varianteId}.png`

        const dir = path.join(ASSETS_PATH, partie)
        ensureDir(dir)
        await pipeline(part.file, fs.createWriteStream(path.join(dir, filename)))
        savedFilename = filename
      } else {
        fields[part.fieldname] = part.value
      }
    }

    if (!savedFilename) return reply.code(400).send({ error: 'Aucun fichier reçu' })
    return { ok: true, filename: savedFilename, path: `/assets/${fields.partie}/${savedFilename}` }
  })

  // Suppression d'un fichier
  fastify.delete('/api/admin/assets/:partie/:filename', async (req, reply) => {
    if (!checkAuth(req, reply)) return
    const { partie, filename } = req.params
    if (!VALID_PARTS.includes(partie))  return reply.code(400).send({ error: 'Partie invalide' })
    if (!filename.endsWith('.png'))     return reply.code(400).send({ error: 'Fichier invalide' })

    const filepath = path.join(ASSETS_PATH, partie, filename)
    if (!fs.existsSync(filepath)) return reply.code(404).send({ error: 'Fichier introuvable' })
    fs.unlinkSync(filepath)
    return reply.code(204).send()
  })
}
