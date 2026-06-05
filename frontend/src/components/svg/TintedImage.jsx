import { useId } from 'react'

/**
 * Affiche un PNG en niveaux de gris teinté par la couleur choisie.
 *
 * Principe (SVG feColorMatrix) :
 *   pixel blanc  (L=1.0) × couleur = couleur pure      → zones lumineuses
 *   pixel gris   (L=0.5) × couleur = couleur sombre    → ombres préservées
 *   pixel noir   (L=0.0) × couleur = noir              → contours intacts
 *   pixel transp (A=0)              = transparent       → fond toujours vide
 */
export default function TintedImage({ src, color = '#ffffff' }) {
  const uid      = useId()
  const filterId = `tint${uid.replace(/:/g, '')}`

  const hex = color.replace('#', '')
  const r   = parseInt(hex.slice(0, 2), 16) / 255
  const g   = parseInt(hex.slice(2, 4), 16) / 255
  const b   = parseInt(hex.slice(4, 6), 16) / 255

  // Matrice : chaque canal gris est multiplié par la composante RGB de la couleur
  const matrix = `${r} 0 0 0 0  0 ${g} 0 0 0  0 0 ${b} 0 0  0 0 0 1 0`

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', overflow: 'hidden' }}
    >
      <defs>
        <filter id={filterId} colorInterpolationFilters="sRGB" x="0" y="0" width="100%" height="100%">
          <feColorMatrix type="matrix" values={matrix} />
        </filter>
      </defs>
      <image
        href={src}
        x="0" y="0"
        width="100%" height="100%"
        preserveAspectRatio="none"
        filter={`url(#${filterId})`}
      />
    </svg>
  )
}
