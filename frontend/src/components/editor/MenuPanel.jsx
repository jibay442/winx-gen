import useWinxStore from '../../store/useWinxStore.js'
import VariantSelector from './VariantSelector.jsx'
import {
  BODIES, EYES, HAIRS, LIPS, TOPS, BOTTOMS, WINGS,
  SKIN_COLORS, HAIR_COLORS, EYE_COLORS,
  LIP_COLORS, OUTFIT_COLORS, WINGS_COLORS,
} from '../../data/variants.js'

const TABS = [
  { id: 'body',   label: 'Corps',   icon: '🧍' },
  { id: 'skin',   label: 'Peau',    icon: '✋' },
  { id: 'eyes',   label: 'Yeux',    icon: '👁️' },
  { id: 'hair',   label: 'Cheveux', icon: '💇' },
  { id: 'lips',   label: 'Lèvres',  icon: '💄' },
  { id: 'top',    label: 'Haut',    icon: '👚' },
  { id: 'bottom', label: 'Bas',     icon: '👗' },
  { id: 'wings',  label: 'Ailes',   icon: '🧚' },
]

export default function MenuPanel() {
  const { activeMenu, setActiveMenu, character, openColorPicker } = useWinxStore()

  const handleCustomSkin = (e) => {
    const rect = e.currentTarget.getBoundingClientRect()
    openColorPicker('skin', rect.left - 228, rect.top)
  }

  return (
    <aside className="w-full md:w-72 lg:w-80 flex flex-col bg-white/60 backdrop-blur-sm border-r border-purple-100 overflow-hidden">
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

        {activeMenu === 'body' && (
          <VariantSelector
            variants={BODIES}
            selectedId={character.body}
            charKey="body"
          />
        )}

        {activeMenu === 'skin' && (
          <div className="space-y-4">
            <p className="text-xs text-purple-500 font-medium">
              Choisis une couleur de peau — le personnage prend la variante dessinée la plus proche.
            </p>
            <div className="flex flex-wrap gap-2">
              {SKIN_COLORS.map((c) => (
                <button
                  key={c.id}
                  title={c.label}
                  className="color-swatch"
                  style={{
                    background:    c.color,
                    outline:       character.skinColor === c.color ? '2px solid #9333EA' : 'none',
                    outlineOffset: '2px',
                  }}
                  onClick={() => useWinxStore.getState().setCharacterProp('skinColor', c.color)}
                />
              ))}
            </div>
            <button
              className="flex items-center gap-2 text-sm font-medium text-purple-600 hover:text-purple-800"
              onClick={handleCustomSkin}
            >
              <span className="color-swatch" style={{ background: character.skinColor }} />
              Couleur personnalisée
            </button>
          </div>
        )}

        {activeMenu === 'eyes' && (
          <VariantSelector
            variants={EYES}
            selectedId={character.eyes}
            charKey="eyes"
            colorCharKey="eyeColor"
            colorTarget="eyes"
            colors={EYE_COLORS}
            currentColor={character.eyeColor}
          />
        )}

        {activeMenu === 'hair' && (
          <VariantSelector
            variants={HAIRS}
            selectedId={character.hair}
            charKey="hair"
            colorCharKey="hairColor"
            colorTarget="hair"
            colors={HAIR_COLORS}
            currentColor={character.hairColor}
          />
        )}

        {activeMenu === 'lips' && (
          <VariantSelector
            variants={LIPS}
            selectedId={character.lips}
            charKey="lips"
            colorCharKey="lipColor"
            colorTarget="lips"
            colors={LIP_COLORS}
            currentColor={character.lipColor}
          />
        )}

        {activeMenu === 'top' && (
          <VariantSelector
            variants={TOPS}
            selectedId={character.top}
            charKey="top"
            colorCharKey="topColor"
            colorTarget="top"
            colors={OUTFIT_COLORS}
            currentColor={character.topColor}
          />
        )}

        {activeMenu === 'bottom' && (
          <VariantSelector
            variants={BOTTOMS}
            selectedId={character.bottom}
            charKey="bottom"
            colorCharKey="bottomColor"
            colorTarget="bottom"
            colors={OUTFIT_COLORS}
            currentColor={character.bottomColor}
          />
        )}

        {activeMenu === 'wings' && (
          <VariantSelector
            variants={WINGS}
            selectedId={character.wings}
            charKey="wings"
            colorCharKey="wingsColor"
            colorTarget={character.wings !== 'wings_none' ? 'wings' : null}
            colors={WINGS_COLORS}
            currentColor={character.wingsColor}
          />
        )}

      </div>
    </aside>
  )
}
