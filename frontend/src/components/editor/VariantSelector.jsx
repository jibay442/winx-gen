import useWinxStore from '../../store/useWinxStore.js'

/**
 * Grille de sélection de variante + palette de couleurs pré-dessinées.
 *
 * Props:
 *   variants      — [{ id, label }]
 *   selectedId    — id sélectionné
 *   charKey       — clé dans character pour la forme (ex: 'hair')
 *   colorCharKey  — clé dans character pour la couleur (ex: 'hairColor')
 *   colorTarget   — clé pour le color picker flottant (ex: 'hair')
 *   colors        — [{ id, color, label }] couleurs pré-dessinées
 *   currentColor  — couleur hex actuelle (pour highlight)
 */
export default function VariantSelector({
  variants,
  selectedId,
  charKey,
  colorCharKey,
  colorTarget,
  colors = [],
  currentColor,
}) {
  const { setCharacterProp, openColorPicker } = useWinxStore()

  const handleSwatchClick = (e, target) => {
    const rect = e.currentTarget.getBoundingClientRect()
    openColorPicker(target, rect.left - 228, rect.top)
  }

  return (
    <div className="space-y-4">
      {/* Grille des variantes de forme */}
      <div className="grid grid-cols-2 gap-2">
        {variants.map((v) => (
          <button
            key={v.id}
            onClick={() => setCharacterProp(charKey, v.id)}
            className={`variant-item p-3 ${selectedId === v.id ? 'selected' : ''}`}
          >
            <div className="h-10 flex items-center justify-center text-2xl mb-1">✨</div>
            <p className="text-xs font-semibold text-center text-gray-600 leading-tight">{v.label}</p>
          </button>
        ))}
      </div>

      {/* Palette de couleurs pré-dessinées */}
      {colorTarget && colors.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-purple-600">Couleur</span>
            {/* Swatch ouvre le color picker libre */}
            <button
              className="color-swatch"
              style={{ background: currentColor }}
              title="Couleur personnalisée"
              onClick={(e) => handleSwatchClick(e, colorTarget)}
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {colors.map((c) => (
              <button
                key={c.id}
                title={c.label}
                className="color-swatch"
                style={{
                  background:    c.color,
                  outline:       currentColor === c.color ? '2px solid #9333EA' : 'none',
                  outlineOffset: '2px',
                }}
                onClick={() => setCharacterProp(colorCharKey, c.color)}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
