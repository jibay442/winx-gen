import { useRef, useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { toPng } from 'html-to-image'
import useWinxStore from '../store/useWinxStore.js'
import StudioCanvas from '../components/studio/StudioCanvas.jsx'
import BackgroundPanel from '../components/studio/BackgroundPanel.jsx'
import { getCreation, updateCreation } from '../api/winxApi.js'

export default function StudioPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const canvasRef = useRef(null)
  const [exporting, setExporting] = useState(false)
  const [exportMsg, setExportMsg] = useState(null)

  const { character, studio, currentId, currentName, loadCreation } = useWinxStore()

  useEffect(() => {
    if (!id) return
    if (currentId === id) return
    getCreation(id).then(loadCreation).catch(() => navigate('/studio'))
  }, [id])

  const handleExport = async () => {
    if (!canvasRef.current) return
    setExporting(true)
    try {
      const dataUrl = await toPng(canvasRef.current, { pixelRatio: 2 })
      const link = document.createElement('a')
      link.download = `${currentName || 'ma-winx'}.png`
      link.href = dataUrl
      link.click()

      // Mettre à jour la miniature en BDD si la création existe
      if (currentId) {
        await updateCreation(currentId, { thumbnail: dataUrl }).catch(() => {})
      }

      setExportMsg('✅ Image téléchargée !')
      setTimeout(() => setExportMsg(null), 3000)
    } catch (err) {
      console.error(err)
      setExportMsg('❌ Erreur export')
      setTimeout(() => setExportMsg(null), 3000)
    } finally {
      setExporting(false)
    }
  }

  return (
    <div className="flex flex-col lg:flex-row flex-1 overflow-hidden h-[calc(100vh-3.5rem)]">
      {/* Canvas principal */}
      <div className="flex-1 flex flex-col items-center justify-center p-4 gap-4 overflow-hidden">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(currentId ? `/create/${currentId}` : '/create')}
            className="btn-secondary flex items-center gap-2 text-sm"
          >
            ← Retour à l'éditeur
          </button>
          <h1 className="font-bold text-purple-800 text-lg">{currentName}</h1>
        </div>

        <StudioCanvas
          ref={canvasRef}
          character={character}
          studio={studio}
          className="w-full max-w-md flex-1 min-h-0 max-h-[550px]"
        />

        <div className="flex items-center gap-3">
          <button
            onClick={handleExport}
            disabled={exporting}
            className="btn-primary flex items-center gap-2"
          >
            {exporting ? '⏳ Export...' : '⬇️ Télécharger PNG'}
          </button>
          {exportMsg && (
            <span className="text-sm font-medium text-purple-700 animate-pulse">{exportMsg}</span>
          )}
        </div>
      </div>

      {/* Panneau décors */}
      <aside className="w-full lg:w-72 bg-white/60 backdrop-blur-sm border-t lg:border-t-0 lg:border-l border-purple-100 overflow-y-auto flex-shrink-0">
        <div className="p-4 border-b border-purple-100">
          <h2 className="font-bold text-purple-800 text-sm">🎨 Décors & arrière-plan</h2>
        </div>
        <BackgroundPanel />
      </aside>
    </div>
  )
}
