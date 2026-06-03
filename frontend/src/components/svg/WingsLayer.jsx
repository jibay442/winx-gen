/**
 * Couche Ailes — rendue DERRIÈRE le corps.
 * Pour remplacer par les vrais dessins : ajoute un case dans le switch ci-dessous.
 * Les couleurs utilisent var(--wings-color) défini sur le SVG parent.
 */
export default function WingsLayer({ variant }) {
  if (variant === 'wings_none') return null

  if (variant === 'wings_02') {
    return (
      <g id="wings-02">
        {/* Ailes fée — plus petites, pointues */}
        <path
          d="M 178 275 C 140 240 105 210 115 268 C 120 300 155 305 178 275 Z"
          fill="var(--wings-color)" opacity="0.82" stroke="var(--wings-color)" strokeWidth="1"
        />
        <path
          d="M 222 275 C 260 240 295 210 285 268 C 280 300 245 305 222 275 Z"
          fill="var(--wings-color)" opacity="0.82" stroke="var(--wings-color)" strokeWidth="1"
        />
        <path
          d="M 174 305 C 138 318 115 355 138 385 C 158 408 172 365 174 305 Z"
          fill="var(--wings-color)" opacity="0.65"
        />
        <path
          d="M 226 305 C 262 318 285 355 262 385 C 242 408 228 365 226 305 Z"
          fill="var(--wings-color)" opacity="0.65"
        />
        {/* Nervures */}
        <path d="M 178 275 C 155 265 132 260 115 268" stroke="white" strokeWidth="1" fill="none" opacity="0.4" />
        <path d="M 222 275 C 245 265 268 260 285 268" stroke="white" strokeWidth="1" fill="none" opacity="0.4" />
      </g>
    )
  }

  // wings_01 — papillon (défaut)
  return (
    <g id="wings-01">
      {/* Aile supérieure gauche */}
      <path
        d="M 176 278 C 125 228 55 198 48 278 C 43 332 128 340 176 278 Z"
        fill="var(--wings-color)" opacity="0.85"
      />
      {/* Aile supérieure droite */}
      <path
        d="M 224 278 C 275 228 345 198 352 278 C 357 332 272 340 224 278 Z"
        fill="var(--wings-color)" opacity="0.85"
      />
      {/* Aile inférieure gauche */}
      <path
        d="M 170 308 C 108 325 68 375 95 418 C 118 452 163 398 170 308 Z"
        fill="var(--wings-color)" opacity="0.72"
      />
      {/* Aile inférieure droite */}
      <path
        d="M 230 308 C 292 325 332 375 305 418 C 282 452 237 398 230 308 Z"
        fill="var(--wings-color)" opacity="0.72"
      />
      {/* Nervures décoratives */}
      <path d="M 176 278 C 148 262 110 252 48 278" stroke="white" strokeWidth="1.2" fill="none" opacity="0.35" />
      <path d="M 224 278 C 252 262 290 252 352 278" stroke="white" strokeWidth="1.2" fill="none" opacity="0.35" />
      <path d="M 170 308 C 138 330 105 365 95 418" stroke="white" strokeWidth="1" fill="none" opacity="0.28" />
      <path d="M 230 308 C 262 330 295 365 305 418" stroke="white" strokeWidth="1" fill="none" opacity="0.28" />
      {/* Points lumineux */}
      <circle cx="100" cy="258" r="4" fill="white" opacity="0.5" />
      <circle cx="300" cy="258" r="4" fill="white" opacity="0.5" />
    </g>
  )
}
