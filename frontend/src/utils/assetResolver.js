function hexToRgb(hex) {
  const h = hex.replace('#', '')
  return {
    r: parseInt(h.slice(0, 2), 16),
    g: parseInt(h.slice(2, 4), 16),
    b: parseInt(h.slice(4, 6), 16),
  }
}

function colorDist(a, b) {
  return Math.sqrt((a.r - b.r) ** 2 + (a.g - b.g) ** 2 + (a.b - b.b) ** 2)
}

/**
 * Trouve la variante de couleur pré-dessinée la plus proche du hex choisi.
 * @param {string} hexColor  — couleur choisie par l'utilisateur (#RRGGBB)
 * @param {Array}  variants  — tableau de { id, color, label }
 * @returns la variante la plus proche
 */
export function findClosestColor(hexColor, variants) {
  if (!hexColor || !variants?.length) return variants?.[0]
  const rgb = hexToRgb(hexColor)
  return variants.reduce((best, v) => {
    return colorDist(rgb, hexToRgb(v.color)) < colorDist(rgb, hexToRgb(best.color)) ? v : best
  })
}

/**
 * Construit le chemin vers un PNG de la girlfriend.
 * Convention : /assets/{partie}/{varianteId}_{couleurId}{_suffixe}.png
 *
 * Exemples :
 *   assetPath('hair',   'hair_01', 'chatain', 'back')  → /assets/hair/hair_01_chatain_back.png
 *   assetPath('body',   'body_01', 'peche')             → /assets/body/body_01_peche.png
 *   assetPath('outfit', 'outfit_01', 'violet')          → /assets/outfit/outfit_01_violet.png
 */
export function assetPath(part, variantId, colorId, suffix = '') {
  const s = suffix ? `_${suffix}` : ''
  return `/assets/${part}/${variantId}_${colorId}${s}.png`
}
