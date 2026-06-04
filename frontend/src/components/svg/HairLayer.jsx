/**
 * COUCHE CHEVEUX.
 * Ce composant est appelé DEUX fois dans CharacterPreview :
 *   - part="back"  → rendu AVANT le corps (cheveux derrière la tête)
 *   - part="front" → rendu APRÈS les yeux/lèvres (mèches devant le visage)
 *
 * Pour ajouter un dessin :
 *   1. Ajoute un `if (variant === 'hair_XX')` avec deux groupes : back et front
 *   2. Utilise fill="var(--hair-color)" sur tous les éléments
 *   3. Enregistre la variante dans src/data/variants.js → tableau HAIRS
 *
 * ViewBox du SVG parent : 0 0 400 700
 */
export default function HairLayer({ variant, part }) {
  // Ajoute tes variantes ici :
  // if (variant === 'hair_01') {
  //   if (part === 'back')  return <g>...cheveux arrière...</g>
  //   if (part === 'front') return <g>...mèches avant...</g>
  // }

  return null
}
