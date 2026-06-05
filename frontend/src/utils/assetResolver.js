/**
 * Construit le chemin vers un PNG de la dessinatrice.
 *
 * Convention fichier (système niveaux de gris) :
 *   {varianteId}.png          → ex: body_01.png, outfit_01.png
 *   {varianteId}_{suffix}.png → ex: hair_01_back.png, hair_01_front.png
 *
 * La couleur est appliquée côté rendu (SVG feColorMatrix) — plus de couleur dans le nom de fichier.
 */
export function assetPath(part, variantId, suffix = '') {
  const s = suffix ? `_${suffix}` : ''
  return `/assets/${part}/${variantId}${s}.png`
}
