import useWinxStore from '../../store/useWinxStore.js'

/**
 * Grille de sélection de variante avec swatch de couleur.
 *
 * Props:
 *   variants     — tableau [{ id, label }]
 *   selectedId   — id sélectionné
 *   charKey      — clé dans character (ex: 'hair')
 *   colorTarget  — clé pour le color picker (ex: 'hair'), null si pas de couleur
 *   colors       — palette de couleurs rapides []
 *   currentColor — couleur actuelle
 *   renderPreview(variant) — optionnel, rendu miniature SVG/emoji
 */
export default function VariantSelector({
  variants,
  selectedId,
  charKey,
  colorTarget,
  colors = [],
  currentColor,
  renderPreview,
}) {
  const { setCharacterProp, openColorPicker } = useWinxStore()

  const handleColorClick = (e, target) => {
    const rect = e.currentTarget.getBoundingClientRect()
    openColorPicker(target, rect.left - 228, rect.top)
  }

  return (
    <div className="space-y-4">
      {/* Grille des variantes */}
      <div className="grid grid-cols-2 gap-2">
        {variants.map((v) => (
          <button
            key={v.id}
            onClick={() => setCharacterProp(charKey, v.id)}
            className={`variant-item p-3 text-left ${selectedId === v.id ? 'selected' : ''}`}
          >
            {renderPreview ? (
              <div className="h-12 flex items-center justify-center mb-1">
                {renderPreview(v)}
              </div>
            ) : (
              <div className="h-10 flex items-center justify-center mb-1 text-3xl">
                ✨
              </div>
            )}
            <p className="text-xs font-semibold text-center text-gray-600 leading-tight">{v.label}</p>
          </button>
        ))}
      </div>

      {/* Couleur */}
      {colorTarget && (
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-purple-600">Couleur</span>
            <button
              className="color-swatch"
              style={{ background: currentColor }}
              onClick={(e) => handleColorClick(e, colorTarget)}
              title="Ouvrir le sélecteur de couleur"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {colors.map((c) => (
              <button
                key={c}
                className="color-swatch"
                style={{ background: c, outline: currentColor === c ? '2px solid #9333EA' : 'none', outlineOffset: '2px' }}
                onClick={() => setCharacterProp(
                  colorTarget === 'skin' ? 'skinColor' :
                  colorTarget === 'hair' ? 'hairColor' :
                  colorTarget === 'eyes' ? 'eyeColor'  :
                  colorTarget === 'lips' ? 'lipColor'  :
                  colorTarget === 'outfit'  ? 'outfitColor'  :
                  colorTarget === 'outfit2' ? 'outfitColor2' :
                  'wingsColor',
                  c
                )}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
