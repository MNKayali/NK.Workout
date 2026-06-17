// Consistent line-art illustration per exercise (no photos). Each exercise id maps
// to a glyph drawn on a softly tinted panel. Accent tints both panel and strokes.
import { getExercise } from '../data/exercises.js'

const ACCENT = {
  blue: { line: '#007aff', wash1: '#eaf2ff', wash2: '#dcebff' },
  green: { line: '#1f9e46', wash1: '#e8faee', wash2: '#d2f3df' },
  orange: { line: '#d97800', wash1: '#fff2e0', wash2: '#ffe6c7' },
}

// exercise id -> glyph key
const GLYPH = {
  db_chest_press: 'benchDb',
  incline_db: 'benchDb',
  smith_press: 'barbell',
  overhead_press: 'overhead',
  pec_dec: 'pecDec',
  cable_fly: 'pecDec',
  lateral_raise: 'lateral',
  tricep_pushdown: 'cable',
  cable_crunch: 'cable',
  lat_pulldown: 'pulldown',
  seated_row: 'row',
  db_row: 'dbRow',
  db_curl: 'curl',
  preacher_curl: 'curl',
  leg_press: 'legPress',
  leg_curl: 'legMachine',
  leg_ext: 'legMachine',
  ball_crunch: 'ball',
  arc: 'cardio',
}

// group -> accent key (drives the tint)
const GROUP_ACCENT = {
  chest: 'blue',
  shoulders: 'blue',
  back: 'orange',
  arms: 'orange',
  legs: 'green',
  core: 'blue',
}

function Glyph({ kind, c }) {
  const s = { fill: 'none', stroke: c.line, strokeWidth: 3, strokeLinecap: 'round', strokeLinejoin: 'round' }
  const dot = { fill: c.line }
  switch (kind) {
    case 'benchDb':
      return (
        <g style={s}>
          <line x1="14" y1="40" x2="50" y2="40" />
          <line x1="20" y1="40" x2="20" y2="50" />
          <line x1="44" y1="40" x2="44" y2="50" />
          <rect x="18" y="16" width="6" height="14" rx="2" style={dot} stroke="none" />
          <rect x="40" y="16" width="6" height="14" rx="2" style={dot} stroke="none" />
          <line x1="21" y1="23" x2="43" y2="23" />
          <circle cx="32" cy="36" r="0.5" />
        </g>
      )
    case 'barbell':
      return (
        <g style={s}>
          <line x1="10" y1="32" x2="54" y2="32" />
          <rect x="12" y="22" width="6" height="20" rx="2" style={dot} stroke="none" />
          <rect x="20" y="18" width="5" height="28" rx="2" style={dot} stroke="none" />
          <rect x="39" y="18" width="5" height="28" rx="2" style={dot} stroke="none" />
          <rect x="46" y="22" width="6" height="20" rx="2" style={dot} stroke="none" />
        </g>
      )
    case 'overhead':
      return (
        <g style={s}>
          <circle cx="32" cy="16" r="6" />
          <line x1="32" y1="22" x2="32" y2="40" />
          <line x1="32" y1="26" x2="20" y2="14" />
          <line x1="32" y1="26" x2="44" y2="14" />
          <line x1="16" y1="12" x2="24" y2="12" />
          <line x1="40" y1="12" x2="48" y2="12" />
          <line x1="32" y1="40" x2="24" y2="52" />
          <line x1="32" y1="40" x2="40" y2="52" />
        </g>
      )
    case 'pecDec':
      return (
        <g style={s}>
          <circle cx="32" cy="32" r="6" />
          <path d="M32 32 C20 24 14 24 12 30" />
          <path d="M32 32 C44 24 50 24 52 30" />
          <circle cx="12" cy="30" r="3" style={dot} stroke="none" />
          <circle cx="52" cy="30" r="3" style={dot} stroke="none" />
        </g>
      )
    case 'lateral':
      return (
        <g style={s}>
          <circle cx="32" cy="20" r="5" />
          <line x1="32" y1="25" x2="32" y2="40" />
          <line x1="32" y1="28" x2="14" y2="28" />
          <line x1="32" y1="28" x2="50" y2="28" />
          <rect x="10" y="24" width="4" height="9" rx="1.5" style={dot} stroke="none" />
          <rect x="50" y="24" width="4" height="9" rx="1.5" style={dot} stroke="none" />
        </g>
      )
    case 'cable':
      return (
        <g style={s}>
          <line x1="32" y1="10" x2="32" y2="46" />
          <rect x="24" y="10" width="16" height="4" rx="2" style={dot} stroke="none" />
          <line x1="26" y1="46" x2="38" y2="46" />
          <line x1="28" y1="46" x2="28" y2="50" />
          <line x1="36" y1="46" x2="36" y2="50" />
        </g>
      )
    case 'pulldown':
      return (
        <g style={s}>
          <line x1="14" y1="14" x2="50" y2="14" />
          <line x1="22" y1="14" x2="26" y2="30" />
          <line x1="42" y1="14" x2="38" y2="30" />
          <circle cx="32" cy="36" r="6" />
          <line x1="32" y1="42" x2="32" y2="52" />
        </g>
      )
    case 'row':
      return (
        <g style={s}>
          <circle cx="20" cy="24" r="5" />
          <line x1="25" y1="26" x2="44" y2="30" />
          <line x1="44" y1="22" x2="44" y2="38" />
          <line x1="20" y1="29" x2="20" y2="44" />
          <line x1="20" y1="44" x2="34" y2="48" />
        </g>
      )
    case 'dbRow':
      return (
        <g style={s}>
          <line x1="12" y1="44" x2="40" y2="40" />
          <circle cx="20" cy="30" r="5" />
          <line x1="24" y1="32" x2="44" y2="34" />
          <rect x="42" y="34" width="4" height="12" rx="1.5" style={dot} stroke="none" />
        </g>
      )
    case 'curl':
      return (
        <g style={s}>
          <line x1="18" y1="20" x2="30" y2="40" />
          <line x1="30" y1="40" x2="44" y2="30" />
          <rect x="42" y="24" width="5" height="12" rx="2" style={dot} stroke="none" />
          <circle cx="16" cy="18" r="4" />
        </g>
      )
    case 'legPress':
      return (
        <g style={s}>
          <line x1="12" y1="46" x2="40" y2="20" />
          <rect x="36" y="14" width="16" height="10" rx="2" />
          <circle cx="18" cy="42" r="5" />
          <line x1="22" y1="40" x2="34" y2="30" />
        </g>
      )
    case 'legMachine':
      return (
        <g style={s}>
          <circle cx="22" cy="22" r="5" />
          <line x1="22" y1="27" x2="22" y2="40" />
          <line x1="22" y1="40" x2="40" y2="40" />
          <line x1="40" y1="40" x2="48" y2="28" />
          <rect x="44" y="22" width="8" height="6" rx="2" style={dot} stroke="none" />
        </g>
      )
    case 'ball':
      return (
        <g style={s}>
          <circle cx="34" cy="38" r="14" />
          <path d="M18 30 C24 24 30 24 36 28" />
          <circle cx="16" cy="26" r="4" />
        </g>
      )
    case 'cardio':
      return (
        <g style={s}>
          <path d="M12 44 Q32 12 52 44" />
          <circle cx="20" cy="40" r="4" style={dot} stroke="none" />
          <circle cx="44" cy="40" r="4" style={dot} stroke="none" />
          <line x1="20" y1="40" x2="32" y2="24" />
          <line x1="44" y1="40" x2="32" y2="24" />
        </g>
      )
    default:
      return (
        <g style={s}>
          <circle cx="32" cy="22" r="6" />
          <line x1="32" y1="28" x2="32" y2="44" />
          <line x1="32" y1="32" x2="22" y2="40" />
          <line x1="32" y1="32" x2="42" y2="40" />
        </g>
      )
  }
}

export default function ExerciseIllustration({ exerciseId, accent, className = '' }) {
  const ex = getExercise(exerciseId)
  const accentKey = accent || GROUP_ACCENT[ex?.groups?.[0]] || 'blue'
  const c = ACCENT[accentKey] || ACCENT.blue
  const kind = GLYPH[exerciseId] || 'default'
  const gradId = `g_${exerciseId}`

  return (
    <svg viewBox="0 0 64 64" className={className} role="img" aria-label={ex?.name || 'exercise'}>
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={c.wash1} />
          <stop offset="100%" stopColor={c.wash2} />
        </linearGradient>
      </defs>
      <rect x="0" y="0" width="64" height="64" rx="16" fill={`url(#${gradId})`} />
      <Glyph kind={kind} c={c} />
    </svg>
  )
}
