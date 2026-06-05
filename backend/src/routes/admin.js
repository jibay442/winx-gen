import fs from 'fs'
import path from 'path'
import { pipeline } from 'stream/promises'

const ASSETS_PATH    = process.env.ASSETS_PATH    || './assets'
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'winx2024'

const VALID_PARTS  = ['body', 'hair', 'eyes', 'lips', 'top', 'bottom', 'shoes', 'wings']
const CONFIG_PATH  = () => path.join(ASSETS_PATH, 'config.json')

const DEFAULT_CONFIG = {
  canvas: { width: 600, height: 1791 },
  parts: {
    body:   [{ id: 'body_01', label: 'Silhouette 1' }, { id: 'body_02', label: 'Silhouette 2' }],
    hair:   [{ id: 'hair_01', label: 'Longs lisses' }, { id: 'hair_02', label: 'Courts bouclés' }, { id: 'hair_03', label: 'Queue de cheval' }],
    eyes:   [{ id: 'eyes_01', label: 'Grands yeux' }, { id: 'eyes_02', label: 'Yeux en amande' }, { id: 'eyes_03', label: 'Yeux ronds' }],
    lips:   [{ id: 'lips_01', label: 'Lèvres douces' }, { id: 'lips_02', label: 'Lèvres pleines' }],
    top:    [{ id: 'top_01', label: 'Haut 1' }, { id: 'top_02', label: 'Haut 2' }, { id: 'top_03', label: 'Haut 3' }],
    bottom: [{ id: 'bottom_01', label: 'Bas 1' }, { id: 'bottom_02', label: 'Bas 2' }, { id: 'bottom_03', label: 'Bas 3' }],
    shoes:  [{ id: 'shoes_01', label: 'Chaussures 1' }, { id: 'shoes_02', label: 'Chaussures 2' }, { id: 'shoes_03', label: 'Chaussures 3' }],
    wings:  [{ id: 'wings_01', label: 'Ailes papillon' }, { id: 'wings_02', label: 'Ailes fée' }, { id: 'wings_none', label: 'Sans ailes' }],
  },
}

function readConfig() {
  try {
    const data = JSON.parse(fs.readFileSync(CONFIG_PATH(), 'utf8'))
    // Fusionner avec les défauts pour les clés manquantes
    return {
      canvas: data.canvas || DEFAULT_CONFIG.canvas,
      parts:  data.parts  || DEFAULT_CONFIG.parts,
    }
  } catch {
    return { ...DEFAULT_CONFIG }
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

  // Ajouter une variante à une partie
  fastify.post('/api/admin/parts/:partie/variants', async (req, reply) => {
    if (!checkAuth(req, reply)) return
    const { partie } = req.params
    if (!VALID_PARTS.includes(partie)) return reply.code(400).send({ error: 'Partie invalide' })

    const { id, label } = req.body
    if (!id || !label) return reply.code(400).send({ error: 'id et label requis' })
    if (!/^[a-z0-9_]+$/.test(id)) return reply.code(400).send({ error: 'id invalide (lettres minuscules, chiffres, _)' })

    const config = readConfig()
    const variants = config.parts[partie] || []
    if (variants.find(v => v.id === id)) return reply.code(409).send({ error: 'Cet id existe déjà' })

    variants.push({ id, label })
    config.parts[partie] = variants
    writeConfig(config)
    return { ok: true, variant: { id, label } }
  })

  // Renommer une variante
  fastify.put('/api/admin/parts/:partie/variants/:id', async (req, reply) => {
    if (!checkAuth(req, reply)) return
    const { partie, id } = req.params
    if (!VALID_PARTS.includes(partie)) return reply.code(400).send({ error: 'Partie invalide' })

    const { label } = req.body
    if (!label) return reply.code(400).send({ error: 'label requis' })

    const config = readConfig()
    const variant = (config.parts[partie] || []).find(v => v.id === id)
    if (!variant) return reply.code(404).send({ error: 'Variante introuvable' })

    variant.label = label
    writeConfig(config)
    return { ok: true, variant }
  })

  // Supprimer une variante
  fastify.delete('/api/admin/parts/:partie/variants/:id', async (req, reply) => {
    if (!checkAuth(req, reply)) return
    const { partie, id } = req.params
    if (!VALID_PARTS.includes(partie)) return reply.code(400).send({ error: 'Partie invalide' })
    if (id === 'wings_none') return reply.code(400).send({ error: 'Cette variante ne peut pas être supprimée' })

    const config = readConfig()
    const before = (config.parts[partie] || []).length
    config.parts[partie] = (config.parts[partie] || []).filter(v => v.id !== id)
    if (config.parts[partie].length === before) return reply.code(404).send({ error: 'Variante introuvable' })

    writeConfig(config)
    return reply.code(204).send()
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
