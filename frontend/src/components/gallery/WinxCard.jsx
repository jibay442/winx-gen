import { useNavigate } from 'react-router-dom'
import { deleteCreation } from '../../api/winxApi.js'
import useWinxStore from '../../store/useWinxStore.js'

export default function WinxCard({ creation, onDeleted }) {
  const navigate = useNavigate()
  const { loadCreation } = useWinxStore()

  const handleEdit = () => {
    loadCreation(creation)
    navigate(`/create/${creation.id}`)
  }

  const handleStudio = () => {
    loadCreation(creation)
    navigate(`/studio/${creation.id}`)
  }

  const handleDelete = async () => {
    if (!confirm(`Supprimer "${creation.name}" ?`)) return
    await deleteCreation(creation.id)
    onDeleted(creation.id)
  }

  const date = new Date(creation.updated_at).toLocaleDateString('fr-FR', {
    day: '2-digit', month: 'short', year: 'numeric',
  })

  return (
    <div className="card overflow-hidden group hover:shadow-xl transition-shadow duration-300">
      {/* Miniature */}
      <div className="relative bg-gradient-to-br from-pink-50 to-purple-50 h-48 flex items-center justify-center overflow-hidden">
        {creation.thumbnail ? (
          <img
            src={creation.thumbnail}
            alt={creation.name}
            className="h-full object-contain"
          />
        ) : (
          <div className="text-6xl opacity-30">🧚</div>
        )}
        {/* Overlay actions */}
        <div className="absolute inset-0 bg-winx-purple/0 group-hover:bg-winx-purple/10 transition-colors duration-300" />
      </div>

      {/* Info */}
      <div className="p-4">
        <h3 className="font-bold text-gray-800 truncate">{creation.name}</h3>
        <p className="text-xs text-purple-400 mt-0.5">{date}</p>

        <div className="flex gap-2 mt-3">
          <button onClick={handleEdit} className="btn-primary flex-1 text-sm py-1.5">
            ✏️ Éditer
          </button>
          <button onClick={handleStudio} className="btn-secondary text-sm py-1.5 px-3">
            📸
          </button>
          <button onClick={handleDelete} className="btn-danger text-sm py-1.5 px-3">
            🗑️
          </button>
        </div>
      </div>
    </div>
  )
}
