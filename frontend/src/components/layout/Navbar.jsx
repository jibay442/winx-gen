import { NavLink, useNavigate } from 'react-router-dom'
import useWinxStore from '../../store/useWinxStore.js'

export default function Navbar() {
  const navigate = useNavigate()
  const { newCreation } = useWinxStore()

  const linkClass = ({ isActive }) =>
    `px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
      isActive
        ? 'bg-winx-purple text-white shadow-fairy'
        : 'text-purple-500 hover:text-winx-purple hover:bg-winx-muted'
    }`

  const handleNew = () => {
    newCreation()
    navigate('/create')
  }

  return (
    <header className="sticky top-0 z-40 bg-white/70 backdrop-blur-md border-b border-purple-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between gap-4">
        {/* Logo */}
        <button
          onClick={handleNew}
          className="flex items-center gap-2 font-display font-bold text-xl text-winx-purple hover:opacity-80 transition-opacity"
        >
          <span className="text-2xl">🧚</span>
          <span className="hidden sm:inline">Winx Gen</span>
        </button>

        {/* Navigation */}
        <nav className="flex items-center gap-1">
          <NavLink to="/create"  className={linkClass}>✏️ <span className="hidden sm:inline">Créer</span></NavLink>
          <NavLink to="/studio"  className={linkClass}>📸 <span className="hidden sm:inline">Studio</span></NavLink>
          <NavLink to="/gallery" className={linkClass}>🖼️ <span className="hidden sm:inline">Galerie</span></NavLink>
        </nav>
      </div>
    </header>
  )
}
