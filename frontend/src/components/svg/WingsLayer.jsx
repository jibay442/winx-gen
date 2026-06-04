/**
 * COUCHE AILES — rendue derrière le corps.
 *
 * Pour ajouter un dessin :
 *   1. Ajoute un `if (variant === 'wings_XX')` avec le SVG ci-dessous
 *   2. Utilise fill="var(--wings-color)" sur les éléments à coloriser
 *   3. Enregistre la variante dans src/data/variants.js → tableau WINGS
 *
 * ViewBox du SVG parent : 0 0 400 700
 */
export default function WingsLayer({ variant }) {
  if (variant === 'wings_none') return null

  // Ajoute tes variantes ici :
  // if (variant === 'wings_01') { return <g>...</g> }

  return null
}
