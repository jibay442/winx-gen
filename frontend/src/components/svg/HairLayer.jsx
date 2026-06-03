/**
 * Couche Cheveux.
 * `part="back"` est rendu DERRIÈRE le corps (avant BodyLayer dans le SVG).
 * `part="front"` est rendu DEVANT les yeux/lèvres.
 * Utilise var(--hair-color).
 */
export default function HairLayer({ variant, part }) {
  const c = 'var(--hair-color)'

  // ── LONGS LISSES (hair_01) ──────────────────────────────────────────────
  if (variant === 'hair_01') {
    if (part === 'back') {
      return (
        <g id="hair-01-back">
          <path d="M 142 75 C 112 130 92 198 95 300 C 98 380 112 435 122 490 C 138 492 148 485 146 475 C 138 422 126 368 124 300 C 122 208 136 148 158 98 Z" fill={c} />
          <path d="M 258 75 C 288 130 308 198 305 300 C 302 380 288 435 278 490 C 262 492 252 485 254 475 C 262 422 274 368 276 300 C 278 208 264 148 242 98 Z" fill={c} />
        </g>
      )
    }
    return (
      <g id="hair-01-front">
        <path d="M 148 58 C 162 18 200 8 200 8 C 200 8 238 18 252 58 C 238 42 200 36 148 58 Z" fill={c} />
        <path d="M 148 58 C 132 76 126 98 130 115 C 136 96 142 76 150 64 Z" fill={c} />
        <path d="M 252 58 C 268 76 274 98 270 115 C 264 96 258 76 250 64 Z" fill={c} />
        <path d="M 148 60 C 155 72 158 88 156 105 C 162 88 164 72 162 62 Z" fill={c} opacity="0.7" />
        <path d="M 252 60 C 245 72 242 88 244 105 C 238 88 236 72 238 62 Z" fill={c} opacity="0.7" />
      </g>
    )
  }

  // ── COURTS BOUCLÉS (hair_02) ────────────────────────────────────────────
  if (variant === 'hair_02') {
    if (part === 'back') {
      return (
        <g id="hair-02-back">
          <path d="M 142 78 C 118 108 105 145 108 188 C 120 188 130 182 130 182 C 128 152 136 118 152 96 Z" fill={c} />
          <path d="M 258 78 C 282 108 295 145 292 188 C 280 188 270 182 270 182 C 272 152 264 118 248 96 Z" fill={c} />
        </g>
      )
    }
    return (
      <g id="hair-02-front">
        <path d="M 145 55 C 158 15 200 8 200 8 C 200 8 242 15 255 55 C 240 42 200 38 145 55 Z" fill={c} />
        {/* Boucles */}
        <ellipse cx="140" cy="85" rx="20" ry="22" fill={c} />
        <ellipse cx="155" cy="70" rx="18" ry="20" fill={c} />
        <ellipse cx="260" cy="85" rx="20" ry="22" fill={c} />
        <ellipse cx="245" cy="70" rx="18" ry="20" fill={c} />
        <ellipse cx="172" cy="60" rx="18" ry="18" fill={c} />
        <ellipse cx="200" cy="55" rx="20" ry="18" fill={c} />
        <ellipse cx="228" cy="60" rx="18" ry="18" fill={c} />
      </g>
    )
  }

  // ── QUEUE DE CHEVAL (hair_03) ───────────────────────────────────────────
  if (variant === 'hair_03') {
    if (part === 'back') {
      return (
        <g id="hair-03-back">
          <path d="M 195 175 C 175 240 165 330 170 430 C 180 435 192 432 194 425 C 192 328 200 242 215 182 Z" fill={c} />
        </g>
      )
    }
    return (
      <g id="hair-03-front">
        <path d="M 148 58 C 160 20 200 10 200 10 C 200 10 240 20 252 58 C 238 44 200 38 148 58 Z" fill={c} />
        <path d="M 148 60 C 134 78 128 100 132 118 C 138 98 144 78 152 65 Z" fill={c} />
        <path d="M 252 60 C 266 78 272 100 268 118 C 262 98 256 78 248 65 Z" fill={c} />
        {/* Élastique */}
        <ellipse cx="200" cy="172" rx="10" ry="6" fill={c} />
        <circle cx="200" cy="172" r="5" fill="var(--outfit-color)" opacity="0.8" />
      </g>
    )
  }

  return null
}
