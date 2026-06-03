/**
 * Couche Lèvres + nez.
 * Utilise var(--lip-color).
 */
export default function LipsLayer({ variant }) {
  const lip = 'var(--lip-color)'

  if (variant === 'lips_02') {
    return (
      <g id="lips-02">
        {/* Nez */}
        <path d="M 196 150 C 197 158 203 158 204 150" stroke="#C8917A" strokeWidth="1.5" fill="none" opacity="0.45" />
        {/* Lèvre supérieure — arc de cupidon prononcé */}
        <path d="M 176 166 C 183 158 192 156 200 159 C 208 156 217 158 224 166 C 218 168 208 170 200 169 C 192 170 182 168 176 166 Z" fill={lip} />
        {/* Lèvre inférieure — plus pleine */}
        <path d="M 176 166 C 181 175 190 180 200 180 C 210 180 219 175 224 166 C 218 168 208 170 200 169 C 192 170 182 168 176 166 Z" fill={lip} opacity="0.88" />
        {/* Ligne de séparation */}
        <path d="M 176 166 Q 200 170 224 166" stroke="#8B1A4A" strokeWidth="0.8" fill="none" opacity="0.4" />
        {/* Reflet */}
        <ellipse cx="196" cy="174" rx="7" ry="3" fill="white" opacity="0.22" />
      </g>
    )
  }

  // lips_01 — lèvres douces (défaut)
  return (
    <g id="lips-01">
      {/* Nez */}
      <path d="M 196 150 C 197 157 203 157 204 150" stroke="#C8917A" strokeWidth="1.5" fill="none" opacity="0.4" />
      {/* Lèvre supérieure */}
      <path d="M 180 163 C 186 157 194 155 200 158 C 206 155 214 157 220 163 C 214 166 206 168 200 167 C 194 168 186 166 180 163 Z" fill={lip} />
      {/* Lèvre inférieure */}
      <path d="M 180 163 C 184 170 192 175 200 175 C 208 175 216 170 220 163 C 214 166 206 168 200 167 C 194 168 186 166 180 163 Z" fill={lip} opacity="0.85" />
      {/* Ligne */}
      <path d="M 180 163 Q 200 167 220 163" stroke="#8B1A4A" strokeWidth="0.8" fill="none" opacity="0.35" />
      {/* Reflet */}
      <ellipse cx="197" cy="170" rx="6" ry="2.5" fill="white" opacity="0.2" />
    </g>
  )
}
