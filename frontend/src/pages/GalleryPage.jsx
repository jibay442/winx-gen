import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import useWinxStore from '../store/useWinxStore.js'
import WinxCard from '../components/gallery/WinxCard.jsx'
import { listCreations } from '../api/winxApi.js'

export default function GalleryPage() {
  const navigate = useNavigate()
  const { newCreation } = useWinxStore()
  const [creations, setCreations] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    listCreations()
      .then(setCreations)
      .catch(() => setError('Impossible de charger la galerie. Le serveur est-il démarré ?'))
      .finally(() => setLoading(false))
  }, [])

  const handleDeleted = (id) => {
    setCreations(prev => prev.filter(c => c.id !== id))
  }

  const handleNew = () => {
    newCreation()
    navigate('/create')
  }

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-5xl animate-bounce">🧚</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="card p-8 text-center max-w-md">
          <div className="text-4xl mb-4">⚠️</div>
          <p className="text-red-500 font-medium mb-4">{error}</p>
          <button onClick={() => window.location.reload()} className="btn-secondary">
            Réessayer
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 p-6 max-w-7xl mx-auto w-full">
      {/* En-tête */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-purple-800">Mes Winx ✨</h1>
          <p className="text-sm text-purple-400 mt-1">
            {creations.length} création{creations.length !== 1 ? 's' : ''}
          </p>
        </div>
        <button onClick={handleNew} className="btn-primary flex items-center gap-2">
          + Nouvelle Winx
        </button>
      </div>

      {/* Grille */}
      {creations.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <div className="text-6xl">🧚‍♀️</div>
          <p className="text-purple-500 font-medium text-lg">Aucune création pour l'instant</p>
          <p className="text-purple-300 text-sm">Commence par créer ta première Winx !</p>
          <button onClick={handleNew} className="btn-primary mt-2">
            Créer ma première Winx
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {creations.map((c) => (
            <WinxCard key={c.id} creation={c} onDeleted={handleDeleted} />
          ))}
        </div>
      )}
    </div>
  )
}
