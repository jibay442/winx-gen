import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Navbar from './components/layout/Navbar.jsx'
import CreatePage from './pages/CreatePage.jsx'
import StudioPage from './pages/StudioPage.jsx'
import GalleryPage from './pages/GalleryPage.jsx'
import AdminPage from './pages/AdminPage.jsx'

export default function App() {
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
