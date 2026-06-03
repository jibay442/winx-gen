/**
 * Couche Vêtements — recouvre le corps.
 * Utilise var(--outfit-color) pour la couleur principale
 * et var(--outfit-color2) pour les accents.
 */
export default function OutfitLayer({ variant }) {
  const c1 = 'var(--outfit-color)'
  const c2 = 'var(--outfit-color2)'

  if (variant === 'outfit_02') {
    return (
      <g id="outfit-02">
        {/* Tenue étoile — haut court + jupe asymétrique */}
        <path d="M 122 228 Q 200 218 278 228 L 270 340 Q 200 352 130 340 Z" fill={c1} />
        {/* Étoile déco */}
        <polygon points="200,235 205,248 218,248 208,257 212,270 200,262 188,270 192,257 182,248 195,248" fill={c2} />
        {/* Jupe asymétrique */}
        <path d="M 128 336 C 88 385 72 440 80 490 C 118 512 162 505 200 498 C 238 505 282 512 320 490 C 328 440 312 385 272 336 Q 200 352 128 336 Z" fill={c1} />
        {/* Ourlet diagonal */}
        <path d="M 80 490 Q 140 520 200 498 Q 260 520 320 490" stroke={c2} strokeWidth="3" fill="none" />
        {/* Manches courtes */}
        <path d="M 122 228 C 100 238 88 252 88 268 L 114 272 C 112 258 118 245 130 238 Z" fill={c1} />
        <path d="M 278 228 C 300 238 312 252 312 268 L 286 272 C 288 258 282 245 270 238 Z" fill={c1} />
      </g>
    )
  }

  if (variant === 'outfit_03') {
    return (
      <g id="outfit-03">
        {/* Robe papillon — ornements en forme d'aile */}
        <path d="M 125 228 Q 200 220 275 228 L 265 358 Q 200 372 135 358 Z" fill={c1} />
        {/* Ceinture */}
        <path d="M 148 350 Q 200 360 252 350 L 252 372 Q 200 382 148 372 Z" fill={c2} />
        {/* Jupe ample */}
        <path d="M 140 358 C 95 405 75 460 82 510 C 122 532 162 525 200 518 C 238 525 278 532 318 510 C 325 460 305 405 260 358 Q 200 375 140 358 Z" fill={c1} />
        {/* Ornements papillon sur le buste */}
        <path d="M 165 248 C 148 240 138 250 148 262 C 158 274 180 268 200 258 C 220 268 242 274 252 262 C 262 250 252 240 235 248 C 222 238 200 234 200 234 C 200 234 178 238 165 248 Z" fill={c2} opacity="0.8" />
      </g>
    )
  }

  // outfit_01 — robe fée (défaut)
  return (
    <g id="outfit-01">
      {/* Corsage */}
      <path d="M 125 228 Q 200 218 275 228 L 265 360 Q 200 374 135 360 Z" fill={c1} />
      {/* Décolleté / échancrure */}
      <path d="M 170 228 Q 200 252 230 228 Q 200 242 170 228 Z" fill={c2} opacity="0.7" />
      {/* Jupe évasée */}
      <path d="M 132 354 C 90 398 72 455 78 505 C 118 528 160 522 200 515 C 240 522 282 528 322 505 C 328 455 310 398 268 354 Q 200 370 132 354 Z" fill={c1} />
      {/* Étoiles / paillettes décoratives */}
      <circle cx="175" cy="300" r="3" fill={c2} opacity="0.9" />
      <circle cx="200" cy="310" r="2.5" fill={c2} opacity="0.9" />
      <circle cx="225" cy="298" r="3" fill={c2} opacity="0.9" />
      <circle cx="188" cy="330" r="2" fill={c2} opacity="0.7" />
      <circle cx="212" cy="325" r="2" fill={c2} opacity="0.7" />
      {/* Ourlet dégradé */}
      <path d="M 78 505 Q 140 535 200 515 Q 260 535 322 505" stroke={c2} strokeWidth="2.5" fill="none" opacity="0.8" />
      {/* Manches courtes */}
      <path d="M 125 228 C 102 240 90 256 92 272 L 118 270 C 116 258 122 246 132 238 Z" fill={c1} />
      <path d="M 275 228 C 298 240 310 256 308 272 L 282 270 C 284 258 278 246 268 238 Z" fill={c1} />
    </g>
  )
}
