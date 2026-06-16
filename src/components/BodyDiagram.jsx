// Stylised front + back body diagram. Pass `regions` (array or Set of region ids
// from data/muscles.js) to highlight worked muscles. `accent` is a CSS color.
const ACCENT = {
  blue: 'var(--color-blue)',
  green: 'var(--color-green)',
  orange: 'var(--color-orange)',
}

const BASE = '#e6e8ec'
const OUTLINE = '#d3d6dc'

export default function BodyDiagram({
  regions = [],
  accent = 'blue',
  showBack = true,
  className = '',
}) {
  const active = regions instanceof Set ? regions : new Set(regions)
  const color = ACCENT[accent] || accent
  const fill = (id) => (active.has(id) ? color : BASE)

  const Front = (
    <g>
      {/* head + torso silhouette */}
      <circle cx="50" cy="16" r="11" fill={BASE} stroke={OUTLINE} />
      <path
        d="M34 30 Q50 26 66 30 L70 44 Q72 70 66 96 L58 96 Q56 70 50 70 Q44 70 42 96 L34 96 Q28 70 30 44 Z"
        fill={BASE}
        stroke={OUTLINE}
      />
      {/* upper arms */}
      <path d="M30 44 Q22 46 20 64 L26 66 Q30 50 34 46 Z" fill={fill('biceps')} stroke={OUTLINE} />
      <path d="M70 44 Q78 46 80 64 L74 66 Q70 50 66 46 Z" fill={fill('biceps')} stroke={OUTLINE} />
      {/* forearms */}
      <path d="M20 64 L18 86 L24 86 L26 66 Z" fill={fill('forearms')} stroke={OUTLINE} />
      <path d="M80 64 L82 86 L76 86 L74 66 Z" fill={fill('forearms')} stroke={OUTLINE} />
      {/* shoulders */}
      <ellipse cx="33" cy="42" rx="8" ry="6" fill={fill('shoulders')} stroke={OUTLINE} />
      <ellipse cx="67" cy="42" rx="8" ry="6" fill={fill('shoulders')} stroke={OUTLINE} />
      {/* chest */}
      <path d="M38 46 Q44 44 49 47 L49 58 Q43 59 38 56 Z" fill={fill('chest')} stroke={OUTLINE} />
      <path d="M62 46 Q56 44 51 47 L51 58 Q57 59 62 56 Z" fill={fill('chest')} stroke={OUTLINE} />
      {/* abs */}
      <rect x="43" y="60" width="14" height="22" rx="4" fill={fill('abs')} stroke={OUTLINE} />
      {/* obliques */}
      <path d="M38 60 L42 60 L42 80 L37 76 Z" fill={fill('obliques')} stroke={OUTLINE} />
      <path d="M62 60 L58 60 L58 80 L63 76 Z" fill={fill('obliques')} stroke={OUTLINE} />
      {/* quads + lower legs */}
      <path d="M37 98 Q44 96 49 98 L48 134 L40 134 Z" fill={fill('quads')} stroke={OUTLINE} />
      <path d="M63 98 Q56 96 51 98 L52 134 L60 134 Z" fill={fill('quads')} stroke={OUTLINE} />
      <path d="M40 136 L47 136 L46 168 L41 168 Z" fill={BASE} stroke={OUTLINE} />
      <path d="M60 136 L53 136 L54 168 L59 168 Z" fill={BASE} stroke={OUTLINE} />
      <text x="50" y="182" textAnchor="middle" fontSize="8" fill="#9aa0aa">Front</text>
    </g>
  )

  const Back = (
    <g transform="translate(100 0)">
      <circle cx="50" cy="16" r="11" fill={BASE} stroke={OUTLINE} />
      <path
        d="M34 30 Q50 26 66 30 L70 44 Q72 70 66 96 L58 96 Q56 70 50 70 Q44 70 42 96 L34 96 Q28 70 30 44 Z"
        fill={BASE}
        stroke={OUTLINE}
      />
      {/* triceps */}
      <path d="M30 44 Q22 46 20 64 L26 66 Q30 50 34 46 Z" fill={fill('triceps')} stroke={OUTLINE} />
      <path d="M70 44 Q78 46 80 64 L74 66 Q70 50 66 46 Z" fill={fill('triceps')} stroke={OUTLINE} />
      <path d="M20 64 L18 86 L24 86 L26 66 Z" fill={fill('forearms')} stroke={OUTLINE} />
      <path d="M80 64 L82 86 L76 86 L74 66 Z" fill={fill('forearms')} stroke={OUTLINE} />
      {/* traps */}
      <path d="M40 34 Q50 30 60 34 L58 46 Q50 42 42 46 Z" fill={fill('traps')} stroke={OUTLINE} />
      {/* lats */}
      <path d="M40 48 L49 50 L49 70 L37 64 Z" fill={fill('lats')} stroke={OUTLINE} />
      <path d="M60 48 L51 50 L51 70 L63 64 Z" fill={fill('lats')} stroke={OUTLINE} />
      {/* lower back */}
      <rect x="44" y="70" width="12" height="14" rx="3" fill={fill('lower_back')} stroke={OUTLINE} />
      {/* glutes */}
      <path d="M38 96 Q44 92 49 96 L49 110 Q43 112 39 108 Z" fill={fill('glutes')} stroke={OUTLINE} />
      <path d="M62 96 Q56 92 51 96 L51 110 Q57 112 61 108 Z" fill={fill('glutes')} stroke={OUTLINE} />
      {/* hamstrings */}
      <path d="M39 112 L48 112 L47 136 L41 136 Z" fill={fill('hamstrings')} stroke={OUTLINE} />
      <path d="M61 112 L52 112 L53 136 L59 136 Z" fill={fill('hamstrings')} stroke={OUTLINE} />
      {/* calves */}
      <path d="M41 138 L46 138 L45 168 L42 168 Z" fill={fill('calves')} stroke={OUTLINE} />
      <path d="M59 138 L54 138 L55 168 L58 168 Z" fill={fill('calves')} stroke={OUTLINE} />
      <text x="50" y="182" textAnchor="middle" fontSize="8" fill="#9aa0aa">Back</text>
    </g>
  )

  return (
    <svg
      viewBox={showBack ? '0 0 200 190' : '0 0 100 190'}
      className={className}
      role="img"
      aria-label="Muscle diagram"
    >
      {Front}
      {showBack && Back}
    </svg>
  )
}
