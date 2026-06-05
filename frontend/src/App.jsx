import { useEffect, Component } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import axios from 'axios'
import Navbar from './components/layout/Navbar.jsx'
import CreatePage from './pages/CreatePage.jsx'
import StudioPage from './pages/StudioPage.jsx'
import GalleryPage from './pages/GalleryPage.jsx'
import AdminPage from './pages/AdminPage.jsx'
import useWinxStore from './store/useWinxStore.js'

class ErrorBoundary extends Component {
  constructor(props) { super(props); this.state = { error: null } }
  static getDerivedStateFromError(error) { return { error } }
  render() {
    if (!this.state.error) return this.props.children
    return (
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="card p-8 text-center max-w-md space-y-4">
          <div className="text-5xl">💥</div>
          <h2 className="text-lg font-bold text-red-600">Une erreur est survenue</h2>
          <p className="text-sm text-gray-500 font-mono bg-gray-50 rounded-lg p-3 text-left break-all">
            {this.state.error.message}
          </p>
          <button
            onClick={() => { this.setState({ error: null }); window.location.href = '/create' }}
            className="btn-primary"
          >
            Retour à l'éditeur
          </button>
        </div>
      </div>
    )
  }
}

function AppContent() {
  const applyConfig = useWinxStore(s => s.applyConfig)

  useEffect(() => {
    axios.get('/api/config')
      .then(r => applyConfig(r.data))
      .catch(() => {})
  }, [])

  return (
    <BrowserRouter>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-1 flex flex-col">
          <ErrorBoundary>
            <Routes>
              <Route path="/" element={<Navigate to="/create" replace />} />
              <Route path="/create" element={<CreatePage />} />
              <Route path="/create/:id" element={<CreatePage />} />
              <Route path="/studio" element={<StudioPage />} />
              <Route path="/studio/:id" element={<StudioPage />} />
              <Route path="/gallery" element={<GalleryPage />} />
              <Route path="/admin" element={<AdminPage />} />
            </Routes>
          </ErrorBoundary>
        </main>
      </div>
    </BrowserRouter>
  )
}

export default AppContent
