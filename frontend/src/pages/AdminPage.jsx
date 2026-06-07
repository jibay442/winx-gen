import { useState, useRef, useEffect, useCallback } from 'react'
import axios from 'axios'
import useWinxStore from '../store/useWinxStore.js'

const PART_LABELS = {
  body:   'Corps',
  hair:   'Cheveux',
  eyes:   'Yeux',
  lips:   'Lèvres',
  top:    'Haut',
  bottom: 'Bas',
  shoes:  'Chaussures',
  wings:  'Ailes',
}
const VALID_PARTS = Object.keys(PART_LABELS)
const SUFFIX_OPTIONS = {
  hair: [
    { id: 'back',  label: '⬅️ Arrière' },
    { id: 'front', label: '➡️ Avant' },
  ],
  eyes: [
    { id: 'white', label: '⚪ Blanc de l\'œil' },
    { id: 'iris',  label: '👁️ Iris' },
  ],
}
const HAS_SUFFIX = Object.fromEntries(Object.keys(SUFFIX_OPTIONS).map(p => [p, true]))

const api = axios.create({ baseURL: '/api' })

// ── Helpers ──────────────────────────────────────────────────────────────────

function slugify(str) {
  return str.toLowerCase()
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '')
}

function reloadConfig(applyConfig) {
  return axios.get('/api/config').then(r => applyConfig(r.data))
}

// ── Composant principal ───────────────────────────────────────────────────────

export default function AdminPage() {
  const { getVariants, applyConfig } = useWinxStore()

  const [password, setPassword]     = useState(() => localStorage.getItem('admin_pwd') || '')
  const [authed, setAuthed]         = useState(false)
  const [authError, setAuthError]   = useState(false)
  const [tab, setTab]               = useState('upload')
  const [imgVersion, setImgVersion] = useState(Date.now())

  // Upload
  const [partie, setPartie]         = useState('body')
  const [varianteId, setVarianteId] = useState('')
  const [suffix, setSuffix]         = useState(SUFFIX_OPTIONS.hair[0].id)
  const [file, setFile]             = useState(null)
  const [dragOver, setDragOver]     = useState(false)
  const [uploading, setUploading]   = useState(false)
  const [uploadMsg, setUploadMsg]   = useState(null)
  const [assets, setAssets]         = useState([])

  // Réglages canvas
  const { canvasWidth, canvasHeight } = useWinxStore()
  const [cw, setCw]                 = useState(String(canvasWidth))
  const [ch, setCh]                 = useState(String(canvasHeight))
  const [settingsSaved, setSettingsSaved] = useState(false)

  // Variantes
  const [newVariantPart, setNewVariantPart]   = useState('body')
  const [newVariantLabel, setNewVariantLabel] = useState('')
  const [newVariantId, setNewVariantId]       = useState('')
  const [variantMsg, setVariantMsg]           = useState(null)
  const [editingLabel, setEditingLabel]       = useState({}) // { [id]: string }

  const inputRef = useRef(null)
  const currentVariants = getVariants(partie)
  const currentPart = { id: partie, hasSuffix: !!HAS_SUFFIX[partie] }
  const suffixOptions = SUFFIX_OPTIONS[partie] || []

  // Réinitialise le suffixe sélectionné quand on change de partie
  useEffect(() => {
    if (suffixOptions.length) setSuffix(suffixOptions[0].id)
  }, [partie, suffixOptions])

  // Auto-login
  useEffect(() => {
    const saved = localStorage.getItem('admin_pwd')
    if (!saved) return
    api.defaults.headers['x-admin-password'] = saved
    api.post('/admin/auth', { password: saved })
      .then(() => { setPassword(saved); setAuthed(true) })
      .catch(() => { localStorage.removeItem('admin_pwd'); api.defaults.headers['x-admin-password'] = '' })
  }, [])

  useEffect(() => {
    if (!authed) return
    api.get('/admin/config').then(r => {
      setCw(String(r.data.canvas?.width  || canvasWidth))
      setCh(String(r.data.canvas?.height || canvasHeight))
    }).catch(() => {})
  }, [authed])

  const loadAssets = useCallback(async () => {
    if (!authed) return
    try { setAssets((await api.get(`/admin/assets/${partie}`)).data) }
    catch { setAssets([]) }
  }, [authed, partie])

  useEffect(() => { loadAssets() }, [loadAssets])

  // Auto-génère l'ID depuis le label
  useEffect(() => {
    if (!newVariantLabel) { setNewVariantId(''); return }
    const prefix = newVariantPart.replace(/s$/, '')
    const slug   = slugify(newVariantLabel)
    setNewVariantId(`${prefix}_${slug}`)
  }, [newVariantLabel, newVariantPart])

  const handleLogin = async () => {
    try {
      await api.post('/admin/auth', { password })
      api.defaults.headers['x-admin-password'] = password
      localStorage.setItem('admin_pwd', password)
      setAuthed(true); setAuthError(false)
    } catch { setAuthError(true) }
  }

  const handleFile = (f) => {
    if (f && f.type === 'image/png') setFile(f)
    else alert('Uniquement les fichiers PNG sont acceptés.')
  }

  const handleDrop = (e) => { e.preventDefault(); setDragOver(false); handleFile(e.dataTransfer.files[0]) }

  const previewFilename = () => {
    if (!varianteId) return '—'
    return currentPart.hasSuffix ? `${varianteId}_${suffix}.png` : `${varianteId}.png`
  }

  const handleUpload = async () => {
    if (!file || !varianteId) return
    setUploading(true); setUploadMsg(null)
    try {
      const form = new FormData()
      form.append('partie', partie)
      form.append('varianteId', varianteId)
      if (currentPart.hasSuffix) form.append('suffix', suffix)
      form.append('file', file)
      await api.post('/admin/upload', form)
      setUploadMsg({ ok: true, text: `✅ ${previewFilename()} mis en ligne !` })
      setFile(null)
      if (inputRef.current) inputRef.current.value = ''
      setImgVersion(Date.now())
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

  const handleSaveCanvas = async () => {
    const config = {
      canvas: { width: parseInt(cw) || canvasWidth, height: parseInt(ch) || canvasHeight },
    }
    await api.put('/admin/config', config)
    await reloadConfig(applyConfig)
    setSettingsSaved(true)
    setTimeout(() => setSettingsSaved(false), 2500)
  }

  const handleAddVariant = async () => {
    if (!newVariantLabel || !newVariantId) return
    setVariantMsg(null)
    try {
      await api.post(`/admin/parts/${newVariantPart}/variants`, { id: newVariantId, label: newVariantLabel })
      await reloadConfig(applyConfig)
      setNewVariantLabel(''); setNewVariantId('')
      setVariantMsg({ ok: true, text: `✅ "${newVariantLabel}" ajouté !` })
    } catch (err) {
      setVariantMsg({ ok: false, text: `❌ ${err.response?.data?.error || 'Erreur'}` })
    }
    setTimeout(() => setVariantMsg(null), 3000)
  }

  const handleRenameVariant = async (part, id, label) => {
    try {
      await api.put(`/admin/parts/${part}/variants/${id}`, { label })
      await reloadConfig(applyConfig)
      setEditingLabel(prev => { const n = { ...prev }; delete n[`${part}:${id}`]; return n })
    } catch (err) {
      alert(err.response?.data?.error || 'Erreur')
    }
  }

  const handleDeleteVariant = async (part, id) => {
    if (!confirm(`Supprimer la variante "${id}" ? Les fichiers PNG associés ne sont pas supprimés.`)) return
    try {
      await api.delete(`/admin/parts/${part}/variants/${id}`)
      await reloadConfig(applyConfig)
    } catch (err) {
      alert(err.response?.data?.error || 'Erreur')
    }
  }

  // ── Login ─────────────────────────────────────────────────────────────────
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

  // ── Admin ─────────────────────────────────────────────────────────────────
  return (
    <div className="flex-1 p-6 max-w-4xl mx-auto w-full space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-purple-800">🎨 Admin</h1>
        <button onClick={() => { setAuthed(false); localStorage.removeItem('admin_pwd') }}
          className="text-xs text-purple-400 hover:text-purple-600">Déconnexion</button>
      </div>

      {/* Onglets */}
      <div className="flex gap-2 flex-wrap">
        {[
          { id: 'upload',   label: '⬆️ Dessins'   },
          { id: 'variants', label: '🗂️ Variantes'  },
          { id: 'settings', label: '⚙️ Réglages'   },
        ].map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className={`px-4 py-2 rounded-xl text-sm font-semibold border transition-all ${
              tab === t.id ? 'bg-winx-purple text-white border-winx-purple' : 'bg-white text-purple-500 border-purple-200 hover:border-winx-purple'
            }`}>
            {t.label}
          </button>
        ))}
      </div>

      {/* ══ UPLOAD ══════════════════════════════════════════════════════════ */}
      {tab === 'upload' && (
        <>
          <div className="card p-6 space-y-5">
            <h2 className="font-bold text-purple-700">Ajouter un dessin PNG</h2>
            <p className="text-xs text-purple-400">Dessins en niveaux de gris — la couleur est appliquée automatiquement.</p>

            {/* Partie */}
            <div>
              <label className="text-xs font-semibold text-purple-600 block mb-2">Partie</label>
              <div className="flex flex-wrap gap-2">
                {VALID_PARTS.map(p => (
                  <button key={p} onClick={() => setPartie(p)}
                    className={`px-3 py-1.5 rounded-xl text-sm font-semibold border transition-all ${
                      partie === p ? 'bg-winx-purple text-white border-winx-purple' : 'bg-white text-purple-500 border-purple-200 hover:border-winx-purple'
                    }`}>{PART_LABELS[p]}</button>
                ))}
              </div>
            </div>

            {/* Variante */}
            <div>
              <label className="text-xs font-semibold text-purple-600 block mb-1">Variante</label>
              <select value={varianteId} onChange={e => setVarianteId(e.target.value)}
                className="w-full border border-purple-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-winx-purple">
                <option value="">-- Choisir --</option>
                {currentVariants.filter(v => v.id !== 'wings_none').map(v => (
                  <option key={v.id} value={v.id}>{v.label} ({v.id})</option>
                ))}
              </select>
            </div>

            {/* Suffixe (parties à plusieurs calques) */}
            {currentPart.hasSuffix && (
              <div>
                <label className="text-xs font-semibold text-purple-600 block mb-2">Calque</label>
                <div className="flex gap-3">
                  {suffixOptions.map(opt => (
                    <button key={opt.id} onClick={() => setSuffix(opt.id)}
                      className={`px-4 py-1.5 rounded-xl text-sm font-semibold border transition-all ${
                        suffix === opt.id ? 'bg-winx-purple text-white border-winx-purple' : 'bg-white text-purple-500 border-purple-200'
                      }`}>
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Nom fichier */}
            <div className="bg-purple-50 rounded-xl px-4 py-3 flex items-center gap-3">
              <span className="text-xs text-purple-500 font-medium">Fichier :</span>
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
                  <button onClick={e => { e.stopPropagation(); setFile(null) }}
                    className="text-xs text-red-400 hover:text-red-600">Changer</button>
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
              {uploading ? '⏳ Upload...' : '⬆️ Mettre en ligne'}
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
              Dessins en ligne — {PART_LABELS[partie]}
              <span className="ml-2 text-xs font-normal text-purple-400">
                ({assets.length} fichier{assets.length !== 1 ? 's' : ''})
              </span>
            </h2>
            {assets.length === 0 ? (
              <p className="text-sm text-purple-300 text-center py-4">Aucun dessin pour cette partie.</p>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {assets.map(filename => (
                  <div key={filename} className="border border-purple-100 rounded-xl overflow-hidden">
                    <div className="bg-gray-100 h-28 flex items-center justify-center p-2">
                      <img src={`/assets/${partie}/${filename}?v=${imgVersion}`} alt={filename}
                        className="h-full object-contain" />
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

      {/* ══ VARIANTES ═══════════════════════════════════════════════════════ */}
      {tab === 'variants' && (
        <div className="space-y-6">
          {/* Créer une variante */}
          <div className="card p-6 space-y-4">
            <h2 className="font-bold text-purple-700">➕ Créer une variante</h2>
            <p className="text-xs text-purple-400">
              Une variante = une nouvelle forme (ex: une 4ème coiffure). Tu pourras ensuite uploader son PNG.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="text-xs font-semibold text-purple-600 block mb-1">Partie</label>
                <select value={newVariantPart} onChange={e => setNewVariantPart(e.target.value)}
                  className="w-full border border-purple-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-winx-purple">
                  {VALID_PARTS.map(p => <option key={p} value={p}>{PART_LABELS[p]}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold text-purple-600 block mb-1">Nom affiché</label>
                <input type="text" value={newVariantLabel}
                  onChange={e => setNewVariantLabel(e.target.value)}
                  placeholder="ex: Tresses longues"
                  className="w-full border border-purple-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-winx-purple" />
              </div>
              <div>
                <label className="text-xs font-semibold text-purple-600 block mb-1">
                  ID fichier <span className="text-purple-300">(auto)</span>
                </label>
                <input type="text" value={newVariantId}
                  onChange={e => setNewVariantId(e.target.value)}
                  placeholder="hair_tresses_longues"
                  className="w-full border border-purple-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-winx-purple font-mono" />
              </div>
            </div>

            {newVariantId && (
              <div className="bg-purple-50 rounded-xl px-4 py-2 text-xs text-purple-500">
                📁 Fichier PNG à uploader ensuite :&nbsp;
                <code className="font-bold text-winx-purple">
                  {SUFFIX_OPTIONS[newVariantPart]
                    ? SUFFIX_OPTIONS[newVariantPart].map(o => `${newVariantId}_${o.id}.png`).join(' & ')
                    : `${newVariantId}.png`
                  }
                </code>
              </div>
            )}

            <button onClick={handleAddVariant}
              disabled={!newVariantLabel || !newVariantId}
              className="btn-primary flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed">
              ➕ Créer la variante
            </button>

            {variantMsg && (
              <p className={`text-sm font-medium ${variantMsg.ok ? 'text-green-600' : 'text-red-500'}`}>
                {variantMsg.text}
              </p>
            )}
          </div>

          {/* Liste des variantes par partie */}
          {VALID_PARTS.map(part => {
            const variants = getVariants(part)
            return (
              <div key={part} className="card p-6">
                <h3 className="font-bold text-purple-700 mb-4">{PART_LABELS[part]}</h3>
                <div className="space-y-2">
                  {variants.map(v => {
                    const editKey = `${part}:${v.id}`
                    const isEditing = editKey in editingLabel
                    return (
                      <div key={v.id}
                        className="flex items-center gap-3 p-2 rounded-xl hover:bg-purple-50 transition-colors">
                        <code className="text-xs text-purple-300 w-36 flex-shrink-0 truncate">{v.id}</code>

                        {isEditing ? (
                          <>
                            <input
                              type="text"
                              value={editingLabel[editKey]}
                              onChange={e => setEditingLabel(prev => ({ ...prev, [editKey]: e.target.value }))}
                              onKeyDown={e => e.key === 'Enter' && handleRenameVariant(part, v.id, editingLabel[editKey])}
                              className="flex-1 border border-purple-300 rounded-lg px-2 py-1 text-sm outline-none focus:border-winx-purple"
                              autoFocus
                            />
                            <button onClick={() => handleRenameVariant(part, v.id, editingLabel[editKey])}
                              className="text-green-500 hover:text-green-700 text-sm font-bold">✓</button>
                            <button onClick={() => setEditingLabel(prev => { const n={...prev}; delete n[editKey]; return n })}
                              className="text-gray-400 hover:text-gray-600 text-sm">✕</button>
                          </>
                        ) : (
                          <>
                            <span className="flex-1 text-sm font-medium text-gray-700">{v.label}</span>
                            <button
                              onClick={() => setEditingLabel(prev => ({ ...prev, [editKey]: v.label }))}
                              className="text-purple-400 hover:text-winx-purple text-xs px-2 py-1 rounded-lg hover:bg-purple-100">
                              ✏️
                            </button>
                            {v.id !== 'wings_none' && (
                              <button onClick={() => handleDeleteVariant(part, v.id)}
                                className="text-red-400 hover:text-red-600 text-xs px-2 py-1 rounded-lg hover:bg-red-50">
                                🗑️
                              </button>
                            )}
                          </>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* ══ RÉGLAGES ════════════════════════════════════════════════════════ */}
      {tab === 'settings' && (
        <div className="card p-6 space-y-4">
          <h2 className="font-bold text-purple-700">📐 Dimensions du canvas</h2>
          <p className="text-xs text-purple-400">
            Doit correspondre exactement à la taille du canvas Procreate en pixels.
            Tous les PNG doivent faire cette même taille.
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
            Ratio actuel : <strong>{cw} × {ch}</strong>
          </p>
          <button onClick={handleSaveCanvas} className="btn-primary flex items-center gap-2">
            {settingsSaved ? '✅ Sauvegardé !' : '💾 Enregistrer'}
          </button>
        </div>
      )}
    </div>
  )
}
