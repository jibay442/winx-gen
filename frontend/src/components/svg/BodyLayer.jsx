/**
 * Couche Corps — silhouette peau de base.
 * Rendue après les ailes, avant les vêtements.
 * Utilise var(--skin-color).
 */
export default function BodyLayer({ variant }) {
  const skin = 'var(--skin-color)'

  if (variant === 'body_02') {
    return (
      <g id="body-02">
        {/* Silhouette légèrement plus mince/grande */}
        <ellipse cx="200" cy="108" rx="68" ry="78" fill={skin} />
        <ellipse cx="132" cy="115" rx="12" ry="15" fill={skin} />
        <ellipse cx="268" cy="115" rx="12" ry="15" fill={skin} />
        <rect x="183" y="183" width="34" height="38" rx="10" fill={skin} />
        <path d="M 148 222 C 125 232 112 265 112 308 C 112 348 128 382 160 408 L 240 408 C 272 382 288 348 288 308 C 288 265 275 232 252 222 Q 200 212 148 222 Z" fill={skin} />
        <path d="M 138 235 C 108 272 85 325 78 382 L 108 390 C 112 336 128 285 148 248 Z" fill={skin} />
        <path d="M 262 235 C 292 272 315 325 322 382 L 292 390 C 288 336 272 285 252 248 Z" fill={skin} />
        <ellipse cx="83"  cy="389" rx="18" ry="14" fill={skin} />
        <ellipse cx="317" cy="389" rx="18" ry="14" fill={skin} />
        <path d="M 160 408 C 150 455 144 512 140 572 L 172 578 L 178 515 L 190 410 Z" fill={skin} />
        <path d="M 240 408 C 250 455 256 512 260 572 L 228 578 L 222 515 L 210 410 Z" fill={skin} />
        <ellipse cx="150" cy="577" rx="24" ry="12" fill={skin} />
        <ellipse cx="250" cy="577" rx="24" ry="12" fill={skin} />
      </g>
    )
  }

  // body_01 — silhouette standard (défaut)
  return (
    <g id="body-01">
      {/* Visage */}
      <ellipse cx="200" cy="112" rx="72" ry="80" fill={skin} />
      {/* Oreilles */}
      <ellipse cx="129" cy="120" rx="13" ry="17" fill={skin} />
      <ellipse cx="271" cy="120" rx="13" ry="17" fill={skin} />
      {/* Cou */}
      <rect x="182" y="188" width="36" height="38" rx="10" fill={skin} />
      {/* Torse */}
      <path d="M 145 225 C 122 230 110 262 110 305 C 110 345 126 382 158 408 L 242 408 C 274 382 290 345 290 305 C 290 262 278 230 255 225 Q 200 215 145 225 Z" fill={skin} />
      {/* Bras gauche */}
      <path d="M 142 238 C 112 274 88 328 80 385 L 108 392 C 114 338 132 286 152 250 Z" fill={skin} />
      {/* Bras droit */}
      <path d="M 258 238 C 288 274 312 328 320 385 L 292 392 C 286 338 268 286 248 250 Z" fill={skin} />
      {/* Mains */}
      <ellipse cx="84"  cy="392" rx="18" ry="15" fill={skin} />
      <ellipse cx="316" cy="392" rx="18" ry="15" fill={skin} />
      {/* Jambe gauche */}
      <path d="M 158 408 C 148 452 142 510 138 572 L 170 578 L 176 515 L 188 410 Z" fill={skin} />
      {/* Jambe droite */}
      <path d="M 242 408 C 252 452 258 510 262 572 L 230 578 L 224 515 L 212 410 Z" fill={skin} />
      {/* Pieds */}
      <ellipse cx="148" cy="577" rx="24" ry="12" fill={skin} />
      <ellipse cx="252" cy="577" rx="24" ry="12" fill={skin} />
    </g>
  )
}
