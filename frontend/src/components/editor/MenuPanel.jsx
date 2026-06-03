import useWinxStore from '../../store/useWinxStore.js'
import VariantSelector from './VariantSelector.jsx'
import {
  BODIES, EYES, HAIRS, LIPS, OUTFITS, WINGS,
  SKIN_COLORS, HAIR_COLORS, EYE_COLORS, LIP_COLORS,
  OUTFIT_COLORS, WINGS_COLORS,
} from '../../data/variants.js'

const TABS = [
  { id: 'body',   label: 'Corps',     icon: '🧍' },
  { id: 'skin',   label: 'Peau',      icon: '✋' },
  { id: 'eyes',   label: 'Yeux',      icon: '👁️' },
  { id: 'hair',   label: 'Cheveux',   icon: '💇' },
  { id: 'lips',   label: 'Lèvres',    icon: '💄' },
  { id: 'outfit', label: 'Vêtements', icon: '👗' },
  { id: 'wings',  label: 'Ailes',     icon: '🧚' },
]

export default function MenuPanel() {
  const { activeMenu, setActiveMenu, character, openColorPicker } = useWinxStore()

  const handleSkinColorClick = (e) => {
    const rect = e.currentTarget.getBoundingClientRect()
    openColorPicker('skin', rect.left - 228, rect.top)
  }

  return (
    <aside className="w-full md:w-72 lg:w-80 flex flex-col bg-white/60 backdrop-blur-sm border-r border-purple-100 overflow-hidden">
      {/* Onglets de navigation */}
      <nav className="flex md:flex-col gap-1 p-2 overflow-x-auto md:overflow-x-hidden flex-shrink-0">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveMenu(tab.id)}
            className={`menu-tab flex-shrink-0 md:flex-row md:justify-start md:gap-3 md:px-4 ${activeMenu === tab.id ? 'active' : ''}`}
          >
            <span className="text-xl md:text-base">{tab.icon}</span>
            <span className="hidden md:inline">{tab.label}</span>
            <span className="md:hidden text-[10px]">{tab.label}</span>
          </button>
        ))}
      </nav>

      <div className="flex-1 overflow-y-auto p-3">
        {/* Corps */}
        {activeMenu === 'body' && (
          <VariantSelector
            variants={BODIES}
            selectedId={character.body}
            charKey="body"
            colorTarget={null}
          />
        )}

        {/* Couleur de peau */}
        {activeMenu === 'skin' && (
          <div className="space-y-4">
            <p className="text-xs text-purple-500 font-medium">Couleur de peau</p>
            <div className="flex flex-wrap gap-2">
              {SKIN_COLORS.map((c) => (
                <button
                  key={c}
                  className="color-swatch"
                  style={{
                    background: c,
                    outline: character.skinColor === c ? '2px solid #9333EA' : 'none',
                    outlineOffset: '2px',
                  }}
                  onClick={() => useWinxStore.getState().setCharacterProp('skinColor', c)}
                />
              ))}
            </div>
            <button
              className="flex items-center gap-2 text-sm font-medium text-purple-600 hover:text-purple-800"
              onClick={handleSkinColorClick}
            >
              <span
                className="color-swatch"
                style={{ background: character.skinColor }}
              />
              Couleur personnalisée
            </button>
          </div>
        )}

        {/* Yeux */}
        {activeMenu === 'eyes' && (
          <VariantSelector
            variants={EYES}
            selectedId={character.eyes}
            charKey="eyes"
            colorTarget="eyes"
            colors={EYE_COLORS}
            currentColor={character.eyeColor}
          />
        )}

        {/* Cheveux */}
        {activeMenu === 'hair' && (
          <VariantSelector
            variants={HAIRS}
            selectedId={character.hair}
            charKey="hair"
            colorTarget="hair"
            colors={HAIR_COLORS}
            currentColor={character.hairColor}
          />
        )}

        {/* Lèvres */}
        {activeMenu === 'lips' && (
          <VariantSelector
            variants={LIPS}
            selectedId={character.lips}
            charKey="lips"
            colorTarget="lips"
            colors={LIP_COLORS}
            currentColor={character.lipColor}
          />
        )}

        {/* Vêtements */}
        {activeMenu === 'outfit' && (
          <div className="space-y-5">
            <VariantSelector
              variants={OUTFITS}
              selectedId={character.outfit}
              charKey="outfit"
              colorTarget="outfit"
              colors={OUTFIT_COLORS}
              currentColor={character.outfitColor}
            />
            <div>
              <p className="text-xs font-semibold text-purple-600 mb-2">Couleur accent</p>
              <div className="flex flex-wrap gap-2">
                {OUTFIT_COLORS.map((c) => (
                  <button
                    key={c}
                    className="color-swatch"
                    style={{
                      background: c,
                      outline: character.outfitColor2 === c ? '2px solid #9333EA' : 'none',
                      outlineOffset: '2px',
                    }}
                    onClick={() => useWinxStore.getState().setCharacterProp('outfitColor2', c)}
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Ailes */}
        {activeMenu === 'wings' && (
          <VariantSelector
            variants={WINGS}
            selectedId={character.wings}
            charKey="wings"
            colorTarget={character.wings !== 'wings_none' ? 'wings' : null}
            colors={WINGS_COLORS}
            currentColor={character.wingsColor}
          />
        )}
      </div>
    </aside>
  )
}
