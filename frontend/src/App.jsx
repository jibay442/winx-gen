import { useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import axios from 'axios'
import Navbar from './components/layout/Navbar.jsx'
import CreatePage from './pages/CreatePage.jsx'
import StudioPage from './pages/StudioPage.jsx'
import GalleryPage from './pages/GalleryPage.jsx'
import AdminPage from './pages/AdminPage.jsx'
import useWinxStore from './store/useWinxStore.js'

export default function App() {
  const applyConfig = useWinxStore(s => s.applyConfig)

  useEffect(() => {
    axios.get('/api/config').then(r => applyConfig(r.data)).catch(() => {})
  }, [])

  return (
    <BrowserRouter>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-1 flex flex-col">
          <Routes>
            <Route path="/" element={<Navigate to="/create" replace />} />
            <Route path="/create" element={<CreatePage />} />
            <Route path="/create/:id" element={<CreatePage />} />
            <Route path="/studio" element={<StudioPage />} />
            <Route path="/studio/:id" element={<StudioPage />} />
            <Route path="/gallery" element={<GalleryPage />} />
            <Route path="/admin" element={<AdminPage />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  )
}
