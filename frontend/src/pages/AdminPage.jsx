import { useState, useRef, useEffect, useCallback } from 'react'
import axios from 'axios'
import useWinxStore from '../store/useWinxStore.js'
import { BODIES, HAIRS, EYES, LIPS, TOPS, BOTTOMS, SHOES, WINGS } from '../data/variants.js'

const PARTS = [
  { id: 'body',   label: 'Corps',      variants: BODIES,  hasSuffix: false },
  { id: 'hair',   label: 'Cheveux',    variants: HAIRS,   hasSuffix: true  },
  { id: 'eyes',   label: 'Yeux',       variants: EYES,    hasSuffix: false },
  { id: 'lips',   label: 'Lèvres',     variants: LIPS,    hasSuffix: false },
  { id: 'top',    label: 'Haut',       variants: TOPS,    hasSuffix: false },
  { id: 'bottom', label: 'Bas',        variants: BOTTOMS, hasSuffix: false },
  { id: 'shoes',  label: 'Chaussures', variants: SHOES,   hasSuffix: false },
  { id: 'wings',  label: 'Ailes',      variants: WINGS.filter(w => w.id !== 'wings_none'), hasSuffix: false },
]

const ALL_VARIANTS = PARTS.flatMap(p => p.variants.map(v => ({ ...v, partLabel: p.label })))

const api = axios.create({ baseURL: '/api' })

export default function AdminPage() {
  const [password, setPassword]   = useState(() => localStorage.getItem('admin_pwd') || '')
  const [authed, setAuthed]       = useState(false)
  const [authError, setAuthError] = useState(false)
  const [tab, setTab]             = useState('upload') // upload | settings

  // Upload
  const [partie, setPartie]       = useState('body')
  const [varianteId, setVarianteId] = useState('')
  const [suffix, setSuffix]       = useState('back')
  const [file, setFile]           = useState(null)
  const [dragOver, setDragOver]   = useState(false)
  const [uploading, setUploading] = useState(false)
  const [uploadMsg, setUploadMsg] = useState(null)
  const [assets, setAssets]       = useState([])

  // Réglages
  const { canvasWidth, canvasHeight, variantLabels, applyConfig } = useWinxStore()
  const [cw, setCw]               = useState(String(canvasWidth))
  const [ch, setCh]               = useState(String(canvasHeight))
  const [labels, setLabels]       = useState({})
  const [settingsSaved, setSettingsSaved] = useState(false)

  const inputRef = useRef(null)
  const currentPart = PARTS.find(p => p.id === partie)

  useEffect(() => { setVarianteId(currentPart?.variants[0]?.id || '') }, [partie])

  // Charger config
  useEffect(() => {
    if (!authed) return
    api.get('/admin/config').then(r => {
      setCw(String(r.data.canvas?.width  || canvasWidth))
      setCh(String(r.data.canvas?.height || canvasHeight))
      setLabels(r.data.variantLabels || {})
    }).catch(() => {})
  }, [authed])

  const loadAssets = useCallback(async () => {
    if (!authed) return
    try { setAssets((await api.get(`/admin/assets/${partie}`)).data) }
    catch { setAssets([]) }
  }, [authed, partie])

  useEffect(() => { loadAssets() }, [loadAssets])

  const handleLogin = async () => {
    try {
      await api.post('/admin/auth', { password })
      api.defaults.headers['x-admin-password'] = password
      localStorage.setItem('admin_pwd', password)
      setAuthed(true)
      setAuthError(false)
    } catch { setAuthError(true) }
  }

  const handleFile = (f) => {
    if (f && f.type === 'image/png') setFile(f)
    else alert('Uniquement les fichiers PNG sont acceptés.')
  }

  const handleDrop = (e) => { e.preventDefault(); setDragOver(false); handleFile(e.dataTransfer.files[0]) }

  const previewFilename = () => {
    if (!varianteId) return '—'
    const s = currentPart?.hasSuffix ? `_${suffix}` : ''
    return `${varianteId}${s}.png`
  }

  const handleUpload = async () => {
    if (!file || !varianteId) return
    setUploading(true); setUploadMsg(null)
    try {
      const form = new FormData()
      form.append('partie', partie)
      form.append('varianteId', varianteId)
      if (currentPart?.hasSuffix) form.append('suffix', suffix)
      form.append('file', file)
      await api.post('/admin/upload', form)
      setUploadMsg({ ok: true, text: `✅ ${previewFilename()} mis en ligne !` })
      setFile(null)
      if (inputRef.current) inputRef.current.value = ''
      loadAssets()
    } catch (err) {
      setUploadMsg({ ok: false, text: `❌ ${err.response?.data?.error || 'Erreur upload'}` })
    } finally { setUploading(false) }
  }

  const handleDelete = async (filename) => {
    if (!confirm(`Supprimer ${filename} ?`)) return
    await api.delete(`/admin/assets/${partie}/${filename}`)
    loadAssets()
  }

  const handleSaveSettings = async () => {
    const config = {
      canvas: { width: parseInt(cw) || canvasWidth, height: parseInt(ch) || canvasHeight },
      variantLabels: labels,
    }
    await api.put('/admin/config', config)
    applyConfig(config)
    setSettingsSaved(true)
    setTimeout(() => setSettingsSaved(false), 2500)
  }

  const handleLabelChange = (id, value) => {
    setLabels(prev => ({ ...prev, [id]: value }))
  }

  // ── Login ──────────────────────────────────────────────────────────────────
  if (!authed) {
    return (
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="card p-8 w-full max-w-sm space-y-4 text-center">
          <div className="text-5xl">🔐</div>
          <h1 className="text-xl font-bold text-purple-800">Espace Admin</h1>
          <input type="password" placeholder="Mot de passe..." value={password}
            onChange={e => setPassword(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleLogin()}
            className="w-full border border-purple-200 rounded-xl px-4 py-2 outline-none focus:border-winx-purple text-sm"
            autoFocus />
          {authError && <p className="text-red-500 text-sm">Mot de passe incorrect.</p>}
          <button onClick={handleLogin} className="btn-primary w-full">Entrer</button>
        </div>
      </div>
    )
  }

  // ── Admin ──────────────────────────────────────────────────────────────────
  return (
    <div className="flex-1 p-6 max-w-4xl mx-auto w-full space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-purple-800">🎨 Admin</h1>
        <button onClick={() => { setAuthed(false); localStorage.removeItem('admin_pwd') }}
          className="text-xs text-purple-400 hover:text-purple-600">Déconnexion</button>
      </div>

      {/* Onglets */}
      <div className="flex gap-2">
        {[
          { id: 'upload',   label: '⬆️ Dessins' },
          { id: 'settings', label: '⚙️ Réglages' },
        ].map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className={`px-4 py-2 rounded-xl text-sm font-semibold border transition-all ${
              tab === t.id ? 'bg-winx-purple text-white border-winx-purple' : 'bg-white text-purple-500 border-purple-200'
            }`}>
            {t.label}
          </button>
        ))}
      </div>

      {/* ── Onglet Upload ─────────────────────────────────────────────────── */}
      {tab === 'upload' && (
        <>
          <div className="card p-6 space-y-5">
            <h2 className="font-bold text-purple-700">Ajouter un dessin</h2>
            <p className="text-xs text-purple-400">Dessins en niveaux de gris — la couleur est appliquée par le site.</p>

            {/* Partie */}
            <div>
              <label className="text-xs font-semibold text-purple-600 block mb-2">Partie du corps</label>
              <div className="flex flex-wrap gap-2">
                {PARTS.map(p => (
                  <button key={p.id} onClick={() => setPartie(p.id)}
                    className={`px-3 py-1.5 rounded-xl text-sm font-semibold border transition-all ${
                      partie === p.id ? 'bg-winx-purple text-white border-winx-purple' : 'bg-white text-purple-500 border-purple-200 hover:border-winx-purple'
                    }`}>{p.label}</button>
                ))}
              </div>
            </div>

            {/* Variante */}
            <div>
              <label className="text-xs font-semibold text-purple-600 block mb-1">Variante</label>
              <select value={varianteId} onChange={e => setVarianteId(e.target.value)}
                className="w-full border border-purple-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-winx-purple">
                {currentPart?.variants.map(v => (
                  <option key={v.id} value={v.id}>{labels[v.id] || v.label} ({v.id})</option>
                ))}
              </select>
            </div>

            {/* Suffixe cheveux */}
            {currentPart?.hasSuffix && (
              <div>
                <label className="text-xs font-semibold text-purple-600 block mb-2">Partie cheveux</label>
                <div className="flex gap-3">
                  {['back', 'front'].map(s => (
                    <button key={s} onClick={() => setSuffix(s)}
                      className={`px-4 py-1.5 rounded-xl text-sm font-semibold border transition-all ${
                        suffix === s ? 'bg-winx-purple text-white border-winx-purple' : 'bg-white text-purple-500 border-purple-200'
                      }`}>
                      {s === 'back' ? '⬅️ Arrière' : '➡️ Avant'}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Nom fichier */}
            <div className="bg-purple-50 rounded-xl px-4 py-3 flex items-center gap-3">
              <span className="text-xs text-purple-500 font-medium">Nom du fichier :</span>
              <code className="text-sm font-mono font-bold text-winx-purple">{previewFilename()}</code>
            </div>

            {/* Dropzone */}
            <div onClick={() => inputRef.current?.click()}
              onDrop={handleDrop}
              onDragOver={e => { e.preventDefault(); setDragOver(true) }}
              onDragLeave={() => setDragOver(false)}
              className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all ${
                dragOver ? 'border-winx-purple bg-purple-50' : 'border-purple-200 hover:border-winx-purple hover:bg-purple-50'
              }`}>
              {file ? (
                <div className="space-y-1">
                  <div className="text-3xl">🖼️</div>
                  <p className="font-semibold text-purple-700">{file.name}</p>
                  <p className="text-xs text-purple-400">({(file.size / 1024).toFixed(0)} Ko)</p>
                  <button onClick={e => { e.stopPropagation(); setFile(null) }} className="text-xs text-red-400 hover:text-red-600">Changer</button>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="text-4xl">📁</div>
                  <p className="font-medium text-purple-500">Glisse ton PNG ici</p>
                  <p className="text-xs text-purple-300">ou clique pour choisir</p>
                </div>
              )}
              <input ref={inputRef} type="file" accept="image/png" className="hidden"
                onChange={e => handleFile(e.target.files[0])} />
            </div>

            <button onClick={handleUpload} disabled={!file || !varianteId || uploading}
              className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed">
              {uploading ? '⏳ Upload en cours...' : '⬆️ Mettre en ligne'}
            </button>

            {uploadMsg && (
              <p className={`text-sm font-medium text-center ${uploadMsg.ok ? 'text-green-600' : 'text-red-500'}`}>
                {uploadMsg.text}
              </p>
            )}
          </div>

          {/* Galerie */}
          <div className="card p-6">
            <h2 className="font-bold text-purple-700 mb-4">
              Dessins en ligne — <span className="capitalize text-purple-500">{currentPart?.label}</span>
              <span className="ml-2 text-xs font-normal text-purple-400">({assets.length} fichier{assets.length !== 1 ? 's' : ''})</span>
            </h2>
            {assets.length === 0 ? (
              <p className="text-sm text-purple-300 text-center py-4">Aucun dessin pour cette partie.</p>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {assets.map(filename => (
                  <div key={filename} className="border border-purple-100 rounded-xl overflow-hidden">
                    <div className="bg-gray-100 h-28 flex items-center justify-center p-2">
                      <img src={`/assets/${partie}/${filename}`} alt={filename} className="h-full object-contain" />
                    </div>
                    <div className="p-2 flex items-center justify-between gap-1">
                      <p className="text-[10px] font-mono text-purple-500 truncate">{filename}</p>
                      <button onClick={() => handleDelete(filename)}
                        className="text-red-400 hover:text-red-600 flex-shrink-0 text-sm">🗑️</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}

      {/* ── Onglet Réglages ───────────────────────────────────────────────── */}
      {tab === 'settings' && (
        <div className="space-y-6">
          {/* Dimensions canvas */}
          <div className="card p-6 space-y-4">
            <h2 className="font-bold text-purple-700">📐 Dimensions des dessins</h2>
            <p className="text-xs text-purple-400">
              Doit correspondre exactement à la taille du canvas Procreate en pixels.
            </p>
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <label className="text-xs font-semibold text-purple-600 block mb-1">Largeur (px)</label>
                <input type="number" value={cw} onChange={e => setCw(e.target.value)} min="100" max="5000"
                  className="w-full border border-purple-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-winx-purple" />
              </div>
              <div className="text-purple-300 text-2xl mt-5">×</div>
              <div className="flex-1">
                <label className="text-xs font-semibold text-purple-600 block mb-1">Hauteur (px)</label>
                <input type="number" value={ch} onChange={e => setCh(e.target.value)} min="100" max="9000"
                  className="w-full border border-purple-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-winx-purple" />
              </div>
            </div>
            <p className="text-xs text-purple-400">
              Ratio actuel : <strong>{cw} × {ch}</strong> = {(parseInt(cw)/parseInt(ch)).toFixed(3)} (plus proche de carré = plus large)
            </p>
          </div>

          {/* Noms des variantes */}
          <div className="card p-6 space-y-4">
            <h2 className="font-bold text-purple-700">✏️ Noms des variantes</h2>
            <p className="text-xs text-purple-400">
              Personnalise les noms affichés dans le menu (ex: "Cheveux 1" → "Longs lisses").
            </p>
            <div className="space-y-3">
              {PARTS.map(part => (
                <div key={part.id}>
                  <p className="text-xs font-bold text-purple-600 uppercase tracking-wide mb-2">{part.label}</p>
                  <div className="space-y-2">
                    {part.variants.map(v => (
                      <div key={v.id} className="flex items-center gap-3">
                        <code className="text-xs text-purple-300 w-24 flex-shrink-0">{v.id}</code>
                        <input
                          type="text"
                          value={labels[v.id] ?? v.label}
                          onChange={e => handleLabelChange(v.id, e.target.value)}
                          placeholder={v.label}
                          className="flex-1 border border-purple-200 rounded-lg px-3 py-1.5 text-sm outline-none focus:border-winx-purple"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button onClick={handleSaveSettings}
            className="btn-primary w-full flex items-center justify-center gap-2">
            {settingsSaved ? '✅ Sauvegardé !' : '💾 Enregistrer les réglages'}
          </button>
        </div>
      )}
    </div>
  )
}
