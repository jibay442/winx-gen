/**
 * Couche Yeux — grands yeux animé.
 * Utilise var(--eye-color).
 */
export default function EyesLayer({ variant }) {
  const iris  = 'var(--eye-color)'
  const pupil = '#1A0A2E'
  const lash  = '#2A1A1A'

  const Eye = ({ cx, flip }) => {
    const sign = flip ? 1 : -1

    if (variant === 'eyes_02') {
      // Yeux en amande
      return (
        <g transform={flip ? `translate(${cx * 2},0) scale(-1,1)` : ''}>
          <path d={`M ${cx - 28} 115 Q ${cx} 100 ${cx + 30} 112 Q ${cx} 135 ${cx - 28} 115 Z`} fill="white" />
          <ellipse cx={cx + 2} cy="113" rx="16" ry="17" fill={iris} />
          <ellipse cx={cx + 2} cy="115" rx="8"  ry="10" fill={pupil} />
          <ellipse cx={cx - 4} cy="110" rx="4"  ry="5"  fill="white" opacity="0.9" />
          <path d={`M ${cx - 28} 115 Q ${cx} 98 ${cx + 30} 112`} stroke={lash} strokeWidth="3" fill="none" strokeLinecap="round" />
          {/* Cils */}
          <line x1={cx - 24} y1="118" x2={cx - 30} y2="112" stroke={lash} strokeWidth="2" />
          <line x1={cx - 10} y1="108" x2={cx - 12} y2="102" stroke={lash} strokeWidth="2" />
          <line x1={cx + 5}  y1="104" x2={cx + 5}  y2="98"  stroke={lash} strokeWidth="2" />
          <line x1={cx + 18} y1="108" x2={cx + 21} y2="103" stroke={lash} strokeWidth="2" />
        </g>
      )
    }

    if (variant === 'eyes_03') {
      // Yeux ronds — très grands
      return (
        <g>
          <ellipse cx={cx} cy="115" rx="30" ry="26" fill="white" />
          <ellipse cx={cx} cy="117" rx="20" ry="22" fill={iris} />
          <ellipse cx={cx} cy="119" rx="11" ry="13" fill={pupil} />
          <ellipse cx={cx - 7} cy="112" rx="5"  ry="6"  fill="white" opacity="0.9" />
          <ellipse cx={cx + 5} cy="123" rx="2.5" ry="3" fill="white" opacity="0.5" />
          <path d={`M ${cx - 30} 100 Q ${cx} 90 ${cx + 30} 100`} stroke={lash} strokeWidth="3.5" fill="none" strokeLinecap="round" />
        </g>
      )
    }

    // eyes_01 — grands yeux animé (défaut)
    return (
      <g>
        {/* Blanc de l'œil */}
        <ellipse cx={cx} cy="115" rx="28" ry="23" fill="white" />
        {/* Iris */}
        <ellipse cx={cx} cy="117" rx="18" ry="20" fill={iris} />
        {/* Pupille */}
        <ellipse cx={cx + sign * 1} cy="119" rx="9" ry="11" fill={pupil} />
        {/* Reflet */}
        <ellipse cx={cx - 6} cy="111" rx="5" ry="6" fill="white" opacity="0.9" />
        <ellipse cx={cx + 5} cy="122" rx="2.5" ry="3" fill="white" opacity="0.45" />
        {/* Paupière supérieure / cils */}
        <path d={`M ${cx - 28} 104 Q ${cx} 94 ${cx + 28} 104`} stroke={lash} strokeWidth="3.5" fill="none" strokeLinecap="round" />
        <line x1={cx - 24} y1="107" x2={cx - 28} y2="100" stroke={lash} strokeWidth="2" />
        <line x1={cx - 8}  y1="98"  x2={cx - 9}  y2="91"  stroke={lash} strokeWidth="2" />
        <line x1={cx + 8}  y1="97"  x2={cx + 9}  y2="90"  stroke={lash} strokeWidth="2" />
        <line x1={cx + 22} y1="103" x2={cx + 26} y2="97"  stroke={lash} strokeWidth="2" />
        {/* Paupière inférieure */}
        <path d={`M ${cx - 27} 126 Q ${cx} 134 ${cx + 27} 126`} stroke={lash} strokeWidth="1.5" fill="none" opacity="0.6" />
      </g>
    )
  }

  return (
    <g id={`eyes-${variant}`}>
      <Eye cx={168} flip={false} />
      <Eye cx={232} flip={true} />
    </g>
  )
}
