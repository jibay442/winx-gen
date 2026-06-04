import { useEffect, useRef } from 'react'
import { HexColorPicker } from 'react-colorful'
import useWinxStore from '../../store/useWinxStore.js'

const TARGET_TO_CHAR_KEY = {
  skin:   'skinColor',
  hair:   'hairColor',
  eyes:   'eyeColor',
  lips:   'lipColor',
  outfit: 'outfitColor',
  wings:  'wingsColor',
}

export default function FloatingColorPicker() {
  const { colorPicker, closeColorPicker, character, setCharacterProp } = useWinxStore()
  const ref = useRef(null)

  const { visible, target, x, y } = colorPicker
  const charKey      = TARGET_TO_CHAR_KEY[target] || null
  const currentColor = charKey ? character[charKey] : '#ffffff'

  useEffect(() => {
    if (!visible) return
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) closeColorPicker()
    }
    document.addEventListener('mousedown', handler)
    document.addEventListener('touchstart', handler)
    return () => {
      document.removeEventListener('mousedown', handler)
      document.removeEventListener('touchstart', handler)
    }
  }, [visible, closeColorPicker])

  if (!visible || !charKey) return null

  const pickerW = 220
  const pickerH = 280
  const safeX = Math.min(Math.max(x, 8), window.innerWidth  - pickerW - 8)
  const safeY = Math.min(Math.max(y, 8), window.innerHeight - pickerH - 8)

  return (
    <div
      ref={ref}
      className="fixed z-50 bg-white rounded-2xl shadow-2xl border border-purple-100 p-3 select-none"
      style={{ left: safeX, top: safeY, width: pickerW }}
    >
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-semibold text-purple-700">Couleur personnalisée</span>
        <button onClick={closeColorPicker} className="text-gray-400 hover:text-gray-600 text-lg leading-none">×</button>
      </div>

      {/* Le picker affiche n'importe quelle couleur, CharacterPreview trouve le PNG le plus proche */}
      <HexColorPicker
        color={currentColor}
        onChange={(c) => setCharacterProp(charKey, c)}
        style={{ width: '100%', height: 150 }}
      />

      <p className="text-[10px] text-purple-400 mt-2 text-center">
        Le personnage affichera la variante dessinée la plus proche
      </p>

      <div className="flex items-center gap-2 mt-2">
        <div className="w-8 h-8 rounded-lg border border-gray-200 flex-shrink-0" style={{ background: currentColor }} />
        <input
          type="text"
          value={currentColor.toUpperCase()}
          onChange={(e) => {
            const v = e.target.value
            if (/^#[0-9A-Fa-f]{0,6}$/.test(v)) setCharacterProp(charKey, v)
          }}
          className="flex-1 text-xs font-mono border border-purple-200 rounded-lg px-2 py-1 outline-none focus:border-winx-purple"
        />
      </div>
    </div>
  )
}
