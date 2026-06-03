import useWinxStore from '../../store/useWinxStore.js'
import { BG_SCENES } from '../../data/variants.js'

const GRADIENTS = [
  { label: 'Aurore',    c1: '#A8EDEA', c2: '#FED6E3' },
  { label: 'Galaxie',  c1: '#667EEA', c2: '#764BA2' },
  { label: 'Coucher',  c1: '#F7971E', c2: '#FFD200' },
  { label: 'Mer',      c1: '#2196F3', c2: '#21CBF3' },
  { label: 'Forêt',    c1: '#56AB2F', c2: '#A8E063' },
  { label: 'Nuit',     c1: '#1A1A2E', c2: '#16213E' },
  { label: 'Printemps',c1: '#F953C6', c2: '#B91D73' },
  { label: 'Arc-en-ciel', c1: '#FF6B6B', c2: '#C9FF87' },
]

const SOLID_COLORS = [
  '#FFFFFF', '#FDF2F8', '#F3E8FF', '#EDE9FE',
  '#DBEAFE', '#D1FAE5', '#FEF3C7', '#FFE4E6',
  '#1A1A2E', '#0F172A', '#7C3AED', '#EC4899',
]

export default function BackgroundPanel() {
  const { studio, setStudioProp } = useWinxStore()

  return (
    <div className="space-y-5 p-4">
      <div>
        <p className="text-xs font-semibold text-purple-600 mb-2">Scènes</p>
        <div className="grid grid-cols-2 gap-2">
          {BG_SCENES.map((s) => (
            <button
              key={String(s.id)}
              onClick={() => setStudioProp('bgScene', s.id)}
              className={`variant-item p-2 text-xs font-medium ${studio.bgScene === s.id ? 'selected' : ''}`}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {studio.bgScene === null && (
        <>
          <div>
            <p className="text-xs font-semibold text-purple-600 mb-2">Dégradés</p>
            <div className="grid grid-cols-4 gap-2">
              {GRADIENTS.map((g) => (
                <button
                  key={g.label}
                  title={g.label}
                  onClick={() => {
                    setStudioProp('bgType',   'gradient')
                    setStudioProp('bgColor',  g.c1)
                    setStudioProp('bgColor2', g.c2)
                  }}
                  className="h-10 rounded-xl border-2 transition-all hover:scale-105"
                  style={{
                    background: `linear-gradient(135deg, ${g.c1}, ${g.c2})`,
                    borderColor:
                      studio.bgType === 'gradient' &&
                      studio.bgColor === g.c1 &&
                      studio.bgColor2 === g.c2
                        ? '#9333EA' : 'transparent',
                  }}
                />
              ))}
            </div>
          </div>

          <div>
            <p className="text-xs font-semibold text-purple-600 mb-2">Couleur unie</p>
            <div className="flex flex-wrap gap-2">
              {SOLID_COLORS.map((c) => (
                <button
                  key={c}
                  className="color-swatch border border-gray-100"
                  style={{
                    background: c,
                    outline: studio.bgType === 'solid' && studio.bgColor === c ? '2px solid #9333EA' : 'none',
                    outlineOffset: '2px',
                  }}
                  onClick={() => {
                    setStudioProp('bgType',  'solid')
                    setStudioProp('bgColor', c)
                  }}
                />
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  )
}
