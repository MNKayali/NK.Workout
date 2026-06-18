// Prominent labeled pill showing the machine / equipment for an exercise.
// Tinted to the exercise's accent; wraps rather than truncates so the full name shows.
const TINT = {
  blue: 'bg-blue/10 text-blue',
  green: 'bg-green/10 text-green',
  orange: 'bg-orange/10 text-orange',
}

function EquipIcon() {
  return (
    <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
      <rect x="2.5" y="9" width="2.5" height="6" rx="1" />
      <rect x="19" y="9" width="2.5" height="6" rx="1" />
      <line x1="5" y1="12" x2="19" y2="12" />
      <line x1="8" y1="8" x2="8" y2="16" />
      <line x1="16" y1="8" x2="16" y2="16" />
    </svg>
  )
}

export default function EquipmentChip({ machine, accent = 'blue', className = '' }) {
  if (!machine) return null
  const tint = TINT[accent] || TINT.blue
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold leading-tight ${tint} ${className}`}>
      <EquipIcon />
      {machine}
    </span>
  )
}
