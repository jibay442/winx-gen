import { useRef, useState, useEffect, useCallback, forwardRef } from 'react'
import CharacterPreview from './CharacterPreview.jsx'

const MIN_ZOOM = 0.8
const MAX_ZOOM = 3.5

const clamp = (v, min, max) => Math.min(Math.max(v, min), max)

const ZoomablePreview = forwardRef(function ZoomablePreview({ character }, ref) {
  const [zoom,   setZoom]   = useState(1)
  const [offset, setOffset] = useState({ x: 0, y: 0 })

  const containerRef = useRef(null)
  const dragRef      = useRef(null)   // { startX, startY }
  const pinchRef     = useRef(null)   // { dist, zoom }

  const changeZoom = (factor) =>
    setZoom(z => clamp(z * factor, MIN_ZOOM, MAX_ZOOM))

  const reset = () => { setZoom(1); setOffset({ x: 0, y: 0 }) }

  // ── Scroll wheel (desktop) ───────────────────────────────────────────────
  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const onWheel = (e) => {
      e.preventDefault()
      setZoom(z => clamp(z * (e.deltaY < 0 ? 1.12 : 0.9), MIN_ZOOM, MAX_ZOOM))
    }
    el.addEventListener('wheel', onWheel, { passive: false })
    return () => el.removeEventListener('wheel', onWheel)
  }, [])

  // ── Drag (mouse) ─────────────────────────────────────────────────────────
  const onMouseDown = (e) => {
    e.preventDefault()
    dragRef.current = { startX: e.clientX - offset.x, startY: e.clientY - offset.y }
  }

  const onMouseMove = useCallback((e) => {
    if (!dragRef.current) return
    setOffset({ x: e.clientX - dragRef.current.startX, y: e.clientY - dragRef.current.startY })
  }, [])

  const onMouseUp = useCallback(() => { dragRef.current = null }, [])

  useEffect(() => {
    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('mouseup',   onMouseUp)
    return () => {
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('mouseup',   onMouseUp)
    }
  }, [onMouseMove, onMouseUp])

  // ── Pinch / drag (touch) ─────────────────────────────────────────────────
  const onTouchStart = (e) => {
    if (e.touches.length === 2) {
      const dx = e.touches[0].clientX - e.touches[1].clientX
      const dy = e.touches[0].clientY - e.touches[1].clientY
      pinchRef.current = { dist: Math.hypot(dx, dy), zoom }
      dragRef.current   = null
    } else if (e.touches.length === 1) {
      dragRef.current  = { startX: e.touches[0].clientX - offset.x, startY: e.touches[0].clientY - offset.y }
      pinchRef.current = null
    }
  }

  const onTouchMove = (e) => {
    e.preventDefault()
    if (e.touches.length === 2 && pinchRef.current) {
      const dx   = e.touches[0].clientX - e.touches[1].clientX
      const dy   = e.touches[0].clientY - e.touches[1].clientY
      const dist = Math.hypot(dx, dy)
      setZoom(clamp(pinchRef.current.zoom * (dist / pinchRef.current.dist), MIN_ZOOM, MAX_ZOOM))
    } else if (e.touches.length === 1 && dragRef.current) {
      setOffset({ x: e.touches[0].clientX - dragRef.current.startX, y: e.touches[0].clientY - dragRef.current.startY })
    }
  }

  const onTouchEnd = () => { dragRef.current = null; pinchRef.current = null }

  const isDragging = zoom > 1

  return (
    <div
      ref={containerRef}
      className={`relative flex-1 flex items-center justify-center overflow-hidden select-none ${isDragging ? 'cursor-grab active:cursor-grabbing' : 'cursor-default'}`}
      onMouseDown={isDragging ? onMouseDown : undefined}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      {/* Personnage avec transform zoom + pan */}
      <div
        style={{
          transform: `scale(${zoom}) translate(${offset.x / zoom}px, ${offset.y / zoom}px)`,
          transformOrigin: 'center center',
          transition: dragRef.current ? 'none' : 'transform 0.15s ease-out',
          willChange: 'transform',
        }}
      >
        <CharacterPreview
          ref={ref}
          character={character}
          className="max-h-[580px]"
        />
      </div>

      {/* Boutons de zoom */}
      <div className="absolute bottom-4 right-4 flex flex-col gap-1.5 z-10">
        <button
          onClick={() => changeZoom(1.25)}
          className="w-9 h-9 bg-white/85 backdrop-blur-sm rounded-xl shadow-fairy text-xl font-bold text-winx-purple hover:bg-white transition-colors flex items-center justify-center"
          title="Zoom +"
        >
          +
        </button>
        <button
          onClick={() => changeZoom(0.8)}
          className="w-9 h-9 bg-white/85 backdrop-blur-sm rounded-xl shadow-fairy text-xl font-bold text-winx-purple hover:bg-white transition-colors flex items-center justify-center"
          title="Zoom −"
        >
          −
        </button>
        <button
          onClick={reset}
          className="w-9 h-9 bg-white/85 backdrop-blur-sm rounded-xl shadow-fairy text-sm text-winx-purple hover:bg-white transition-colors flex items-center justify-center"
          title="Réinitialiser"
        >
          ↺
        </button>
      </div>

      {/* Indicateur de zoom */}
      {zoom !== 1 && (
        <div className="absolute top-3 right-3 bg-white/75 backdrop-blur-sm rounded-lg px-2 py-0.5 text-xs font-mono text-purple-500 pointer-events-none">
          {Math.round(zoom * 100)}%
        </div>
      )}

      {/* Hint scroll */}
      {zoom === 1 && (
        <p className="absolute bottom-4 left-1/2 -translate-x-1/2 text-xs text-purple-300 pointer-events-none whitespace-nowrap">
          🖱️ Scroll ou pincer pour zoomer
        </p>
      )}
    </div>
  )
})

export default ZoomablePreview
