import { useState, useRef, useEffect, useCallback } from 'react'
import axios from 'axios'
import {
  BODIES, HAIRS, EYES, LIPS, TOPS, BOTTOMS, SHOES, WINGS,
  SKIN_COLORS, HAIR_COLORS, EYE_COLORS, LIP_COLORS, OUTFIT_COLORS, WINGS_COLORS,
} from '../data/variants.js'

const PARTS = [
  { id: 'body',   label: 'Corps',       variants: BODIES,  colors: SKIN_COLORS,   hasSuffix: false },
  { id: 'hair',   label: 'Cheveux',     variants: HAIRS,   colors: HAIR_COLORS,   hasSuffix: true  },
  { id: 'eyes',   label: 'Yeux',        variants: EYES,    colors: EYE_COLORS,    hasSuffix: false },
  { id: 'lips',   label: 'Lèvres',      variants: LIPS,    colors: LIP_COLORS,    hasSuffix: false },
  { id: 'top',    label: 'Haut',        variants: TOPS,    colors: OUTFIT_COLORS, hasSuffix: false },
  { id: 'bottom', label: 'Bas',         variants: BOTTOMS, colors: OUTFIT_COLORS, hasSuffix: false },
  { id: 'shoes',  label: 'Chaussures',  variants: SHOES,   colors: OUTFIT_COLORS, hasSuffix: false },
  { id: 'wings',  label: 'Ailes',       variants: WINGS.filter(w => w.id !== 'wings_none'), colors: WINGS_COLORS, hasSuffix: false },
]

const api = axios.create({ baseURL: '/api' })

function setAuthHeader(password) {
  api.defaults.headers['x-admin-password'] = password
}

export default function AdminPage() {
  const [password, setPassword]     = useState(() => localStorage.getItem('admin_pwd') || '')
  const [authed, setAuthed]         = useState(false)
  const [authError, setAuthError]   = useState(false)

  const [partie, setPartie]         = useState('body')
  const [varianteId, setVarianteId] = useState('')
  const [couleurId, setCouleurId]   = useState('')
  const [suffix, setSuffix]         = useState('back')
  const [file, setFile]             = useState(null)
  const [dragOver, setDragOver]     = useState(false)
  const [uploading, setUploading]   = useState(false)
  const [uploadMsg, setUploadMsg]   = useState(null)
  const [assets, setAssets]         = useState([])

  const inputRef = useRef(null)
  const currentPart = PARTS.find(p => p.id === partie)

  // Init sélections quand la partie change
  useEffect(() => {
    setVarianteId(currentPart?.variants[0]?.id || '')
    setCouleurId(currentPart?.colors[0]?.id || '')
  }, [partie])

  const loadAssets = useCallback(async () => {
    if (!authed) return
    try {
      const { data } = await api.get(`/admin/assets/${partie}`)
      setAssets(data)
    } catch { setAssets([]) }
  }, [authed, partie])

  useEffect(() => { loadAssets() }, [loadAssets])

  const handleLogin = async () => {
    try {
      await api.post('/admin/auth', { password })
      setAuthHeader(password)
      localStorage.setItem('admin_pwd', password)
      setAuthed(true)
      setAuthError(false)
    } catch {
      setAuthError(true)
    }
  }

  const handleFile = (f) => {
    if (f && f.type === 'image/png') setFile(f)
    else alert('Uniquement les fichiers PNG sont acceptés.')
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setDragOver(false)
    handleFile(e.dataTransfer.files[0])
  }

  const previewFilename = () => {
    if (!varianteId || !couleurId) return '—'
    const s = currentPart?.hasSuffix ? `_${suffix}` : ''
    return `${varianteId}_${couleurId}${s}.png`
  }

  const handleUpload = async () => {
    if (!file || !varianteId || !couleurId) return
    setUploading(true)
    setUploadMsg(null)
    try {
      const form = new FormData()
      form.append('file', file)
      form.append('partie', partie)
      form.append('varianteId', varianteId)
      form.append('couleurId', couleurId)
      if (currentPart?.hasSuffix) form.append('suffix', suffix)

      await api.post('/admin/upload', form)
      setUploadMsg({ ok: true, text: `✅ ${previewFilename()} uploadé !` })
      setFile(null)
      loadAssets()
    } catch {
      setUploadMsg({ ok: false, text: '❌ Erreur lors de l\'upload.' })
    } finally {
      setUploading(false)
    }
  }

  const handleDelete = async (filename) => {
    if (!confirm(`Supprimer ${filename} ?`)) return
    await api.delete(`/admin/assets/${partie}/${filename}`)
    loadAssets()
  }

  // ── Écran de login ────────────────────────────────────────────────────────
  if (!authed) {
    return (
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="card p-8 w-full max-w-sm space-y-4 text-center">
          <div className="text-5xl">🔐</div>
          <h1 className="text-xl font-bold text-purple-800">Espace Admin</h1>
          <input
            type="password"
            placeholder="Mot de passe..."
            value={password}
            onChange={e => setPassword(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleLogin()}
            className="w-full border border-purple-200 rounded-xl px-4 py-2 outline-none focus:border-winx-purple text-sm"
            autoFocus
          />
          {authError && <p className="text-red-500 text-sm">Mot de passe incorrect.</p>}
          <button onClick={handleLogin} className="btn-primary w-full">Entrer</button>
        </div>
      </div>
    )
  }

  // ── Interface admin ───────────────────────────────────────────────────────
  return (
    <div className="flex-1 p-6 max-w-4xl mx-auto w-full space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-purple-800">🎨 Admin — Gestion des dessins</h1>
        <button
          onClick={() => { setAuthed(false); localStorage.removeItem('admin_pwd') }}
          className="text-xs text-purple-400 hover:text-purple-600"
        >
          Déconnexion
        </button>
      </div>

      {/* Formulaire d'upload */}
      <div className="card p-6 space-y-5">
        <h2 className="font-bold text-purple-700">Ajouter un dessin</h2>

        {/* Sélection partie */}
        <div>
          <label className="text-xs font-semibold text-purple-600 block mb-2">Partie du corps</label>
          <div className="flex flex-wrap gap-2">
            {PARTS.map(p => (
              <button
                key={p.id}
                onClick={() => setPartie(p.id)}
                className={`px-3 py-1.5 rounded-xl text-sm font-semibold border transition-all ${
                  partie === p.id
                    ? 'bg-winx-purple text-white border-winx-purple'
                    : 'bg-white text-purple-500 border-purple-200 hover:border-winx-purple'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Variante */}
          <div>
            <label className="text-xs font-semibold text-purple-600 block mb-1">Variante</label>
            <select
              value={varianteId}
              onChange={e => setVarianteId(e.target.value)}
              className="w-full border border-purple-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-winx-purple"
            >
              {currentPart?.variants.map(v => (
                <option key={v.id} value={v.id}>{v.label} ({v.id})</option>
              ))}
            </select>
          </div>

          {/* Couleur */}
          <div>
            <label className="text-xs font-semibold text-purple-600 block mb-1">Couleur</label>
            <select
              value={couleurId}
              onChange={e => setCouleurId(e.target.value)}
              className="w-full border border-purple-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-winx-purple"
            >
              {currentPart?.colors.map(c => (
                <option key={c.id} value={c.id}>{c.label} ({c.id})</option>
              ))}
            </select>
          </div>
        </div>

        {/* Suffixe (cheveux uniquement) */}
        {currentPart?.hasSuffix && (
          <div>
            <label className="text-xs font-semibold text-purple-600 block mb-2">Partie cheveux</label>
            <div className="flex gap-3">
              {['back', 'front'].map(s => (
                <button
                  key={s}
                  onClick={() => setSuffix(s)}
                  className={`px-4 py-1.5 rounded-xl text-sm font-semibold border transition-all ${
                    suffix === s
                      ? 'bg-winx-purple text-white border-winx-purple'
                      : 'bg-white text-purple-500 border-purple-200'
                  }`}
                >
                  {s === 'back' ? '⬅️ Arrière' : '➡️ Avant'}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Nom du fichier résultant */}
        <div className="bg-purple-50 rounded-xl px-4 py-3 flex items-center gap-3">
          <span className="text-xs text-purple-500 font-medium">Nom du fichier :</span>
          <code className="text-sm font-mono font-bold text-winx-purple">{previewFilename()}</code>
        </div>

        {/* Dropzone */}
        <div
          onClick={() => inputRef.current?.click()}
          onDrop={handleDrop}
          onDragOver={e => { e.preventDefault(); setDragOver(true) }}
          onDragLeave={() => setDragOver(false)}
          className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all ${
            dragOver
              ? 'border-winx-purple bg-purple-50'
              : 'border-purple-200 hover:border-winx-purple hover:bg-purple-50'
          }`}
        >
          {file ? (
            <div className="space-y-2">
              <div className="text-3xl">🖼️</div>
              <p className="font-semibold text-purple-700">{file.name}</p>
              <p className="text-xs text-purple-400">({(file.size / 1024).toFixed(0)} Ko)</p>
              <button
                onClick={e => { e.stopPropagation(); setFile(null) }}
                className="text-xs text-red-400 hover:text-red-600"
              >
                Changer
              </button>
            </div>
          ) : (
            <div className="space-y-2">
              <div className="text-4xl">📁</div>
              <p className="font-medium text-purple-500">Glisse ton PNG ici</p>
              <p className="text-xs text-purple-300">ou clique pour choisir un fichier</p>
            </div>
          )}
          <input
            ref={inputRef}
            type="file"
            accept="image/png"
            className="hidden"
            onChange={e => handleFile(e.target.files[0])}
          />
        </div>

        <button
          onClick={handleUpload}
          disabled={!file || !varianteId || !couleurId || uploading}
          className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {uploading ? '⏳ Upload en cours...' : '⬆️ Mettre en ligne'}
        </button>

        {uploadMsg && (
          <p className={`text-sm font-medium text-center ${uploadMsg.ok ? 'text-green-600' : 'text-red-500'}`}>
            {uploadMsg.text}
          </p>
        )}
      </div>

      {/* Liste des assets existants */}
      <div className="card p-6">
        <h2 className="font-bold text-purple-700 mb-4">
          Dessins en ligne — <span className="text-purple-400 capitalize">{currentPart?.label}</span>
          <span className="ml-2 text-xs font-normal text-purple-400">({assets.length} fichier{assets.length !== 1 ? 's' : ''})</span>
        </h2>

        {assets.length === 0 ? (
          <p className="text-sm text-purple-300 text-center py-4">Aucun dessin pour cette partie.</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {assets.map(filename => (
              <div key={filename} className="border border-purple-100 rounded-xl overflow-hidden group">
                <div className="bg-purple-50 h-28 flex items-center justify-center p-2">
                  <img
                    src={`/assets/${partie}/${filename}`}
                    alt={filename}
                    className="h-full object-contain"
                  />
                </div>
                <div className="p-2 flex items-center justify-between gap-1">
                  <p className="text-[10px] font-mono text-purple-500 truncate">{filename}</p>
                  <button
                    onClick={() => handleDelete(filename)}
                    className="text-red-400 hover:text-red-600 flex-shrink-0 text-sm"
                    title="Supprimer"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
