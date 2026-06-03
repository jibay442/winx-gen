import { forwardRef } from 'react'
import CharacterPreview from '../editor/CharacterPreview.jsx'

const SCENE_STYLES = {
  scene_sky: {
    background: 'linear-gradient(180deg, #87CEEB 0%, #B0E2FF 60%, #E0F7FF 100%)',
  },
  scene_forest: {
    background: 'linear-gradient(180deg, #2d6a4f 0%, #40916c 40%, #74c69d 100%)',
  },
  scene_sea: {
    background: 'linear-gradient(180deg, #0077b6 0%, #00b4d8 50%, #90e0ef 100%)',
  },
  scene_stars: {
    background: 'radial-gradient(ellipse at top, #1a1a2e 0%, #16213e 40%, #0f3460 100%)',
  },
}

const StudioCanvas = forwardRef(function StudioCanvas({ character, studio, className = '' }, ref) {
  const { bgType, bgColor, bgColor2, bgScene } = studio

  let bgStyle = {}
  if (bgScene && SCENE_STYLES[bgScene]) {
    bgStyle = SCENE_STYLES[bgScene]
  } else if (bgType === 'gradient') {
    bgStyle = { background: `linear-gradient(135deg, ${bgColor} 0%, ${bgColor2} 100%)` }
  } else {
    bgStyle = { background: bgColor }
  }

  return (
    <div
      ref={ref}
      className={`relative flex items-end justify-center overflow-hidden rounded-2xl ${className}`}
      style={bgStyle}
    >
      {/* Étoiles décoratives pour les scènes nocturnes */}
      {bgScene === 'scene_stars' && (
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(30)].map((_, i) => (
            <div
              key={i}
              className="absolute bg-white rounded-full animate-pulse"
              style={{
                width:  Math.random() * 3 + 1,
                height: Math.random() * 3 + 1,
                left:   `${Math.random() * 100}%`,
                top:    `${Math.random() * 60}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${Math.random() * 2 + 1}s`,
              }}
            />
          ))}
        </div>
      )}

      {/* Reflet / sol */}
      <div className="absolute bottom-0 left-0 right-0 h-16 opacity-20"
        style={{ background: 'linear-gradient(to top, rgba(255,255,255,0.4), transparent)' }}
      />

      <CharacterPreview
        character={character}
        className="relative z-10 w-full h-full"
      />
    </div>
  )
})

export default StudioCanvas
