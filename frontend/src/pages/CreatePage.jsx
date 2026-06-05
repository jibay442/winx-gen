import { useEffect, useRef, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { toPng } from 'html-to-image'
import useWinxStore from '../store/useWinxStore.js'
import MenuPanel from '../components/editor/MenuPanel.jsx'
import CharacterPreview from '../components/editor/CharacterPreview.jsx'
import FloatingColorPicker from '../components/editor/FloatingColorPicker.jsx'
import { getCreation, createCreation, updateCreation } from '../api/winxApi.js'

export default function CreatePage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const previewRef = useRef(null)

  const {
    character, studio, currentId, currentName,
    loadCreation, setCurrentName, newCreation,
    saveModalOpen, setSaveModalOpen,
  } = useWinxStore()

  const [nameInput, setNameInput] = useState(currentName)
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(false)

  // Charger une création existante si :id dans l'URL
  useEffect(() => {
    if (!id) return
    if (currentId === id) return
    setLoading(true)
    getCreation(id)
      .then(loadCreation)
      .catch(() => navigate('/create'))
      .finally(() => setLoading(false))
  }, [id])

  useEffect(() => {
    setNameInput(currentName)
  }, [currentName, saveModalOpen])

  const handleSave = async () => {
    setSaving(true)
    try {
      let thumbnail = null
      if (previewRef.current) {
        thumbnail = await toPng(previewRef.current, { cacheBust: true }).catch(() => null)
      }

      const payload = {
        name:           nameInput.trim() || 'Ma Winx',
        character_data: character,
        studio_data:    studio,
        thumbnail,
      }

      let saved
      if (currentId) {
        saved = await updateCreation(currentId, payload)
      } else {
        saved = await createCreation(payload)
        navigate(`/create/${saved.id}`, { replace: true })
      }
      setCurrentName(saved.name)
      setSaveModalOpen(false)
    } catch (err) {
      console.error(err)
      alert('Erreur lors de la sauvegarde.')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-4xl animate-bounce">🧚</div>
      </div>
    )
  }

  return (
    <div className="flex flex-col md:flex-row flex-1 overflow-hidden h-[calc(100vh-3.5rem)]">
      {/* Panneau menu */}
      <MenuPanel />

      {/* Zone personnage */}
      <div className="flex-1 flex flex-col items-center justify-center gap-4 p-4 min-h-0 overflow-auto">
        {/* Barre d'actions */}
        <div className="flex items-center gap-3 w-full max-w-sm">
          <span className="flex-1 text-sm font-semibold text-purple-700 truncate">
            {currentName}
          </span>
          <button
            onClick={() => setSaveModalOpen(true)}
            className="btn-primary flex items-center gap-2"
          >
            💾 Sauvegarder
          </button>
          <button
            onClick={() => navigate(currentId ? `/studio/${currentId}` : '/studio')}
            className="btn-secondary flex items-center gap-2"
          >
            📸 Studio
          </button>
        </div>

        {/* Aperçu personnage */}
        <div className="flex-1 flex items-center justify-center w-full min-h-0">
          <CharacterPreview
            ref={previewRef}
            character={character}
            className="h-full max-h-[580px]"
          />
        </div>

        {/* Bouton nouveau */}
        <button
          onClick={() => { newCreation(); navigate('/create') }}
          className="text-xs text-purple-400 hover:text-purple-600 transition-colors"
        >
          + Nouveau personnage
        </button>
      </div>

      {/* Color picker flottant */}
      <FloatingColorPicker />

      {/* Modal sauvegarde */}
      {saveModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30 backdrop-blur-sm">
          <div className="card p-6 w-full max-w-sm space-y-4">
            <h2 className="text-lg font-bold text-purple-800">Sauvegarder ma Winx</h2>
            <input
              type="text"
              value={nameInput}
              onChange={(e) => setNameInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSave()}
              placeholder="Nom de ma Winx..."
              className="w-full border border-purple-200 rounded-xl px-4 py-2 outline-none focus:border-winx-purple text-sm"
              autoFocus
            />
            <div className="flex gap-3">
              <button
                onClick={handleSave}
                disabled={saving}
                className="btn-primary flex-1 flex items-center justify-center gap-2"
              >
                {saving ? '⏳ Sauvegarde...' : '💾 Sauvegarder'}
              </button>
              <button
                onClick={() => setSaveModalOpen(false)}
                className="btn-secondary"
              >
                Annuler
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
