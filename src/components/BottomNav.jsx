import { NavLink } from 'react-router-dom'

const TABS = [
  { to: '/', label: 'Home', icon: HomeIcon, end: true },
  { to: '/progress', label: 'Progress', icon: ProgressIcon },
  { to: '/muscles', label: 'Muscles', icon: MuscleIcon },
  { to: '/equipment', label: 'Equipment', icon: EquipIcon },
]

export default function BottomNav() {
  return (
    <nav className="fixed bottom-0 inset-x-0 z-40 border-t border-hairline bg-surface/90 backdrop-blur-xl">
      <div className="mx-auto max-w-md grid grid-cols-4 pb-[env(safe-area-inset-bottom)]">
        {TABS.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              `flex flex-col items-center gap-1 py-2.5 text-[11px] font-medium transition-colors ${
                isActive ? 'text-blue' : 'text-ink-soft'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <Icon active={isActive} />
                <span>{label}</span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  )
}

const base = (active) => ({
  width: 24,
  height: 24,
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: active ? 2.4 : 2,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
})

function HomeIcon({ active }) {
  return (
    <svg viewBox="0 0 24 24" {...base(active)}>
      <path d="M3 11l9-7 9 7" />
      <path d="M5 10v9a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-9" />
    </svg>
  )
}
function ProgressIcon({ active }) {
  return (
    <svg viewBox="0 0 24 24" {...base(active)}>
      <line x1="6" y1="20" x2="6" y2="13" />
      <line x1="12" y1="20" x2="12" y2="8" />
      <line x1="18" y1="20" x2="18" y2="11" />
    </svg>
  )
}
function MuscleIcon({ active }) {
  return (
    <svg viewBox="0 0 24 24" {...base(active)}>
      <circle cx="12" cy="5" r="2.4" />
      <path d="M8 11c0-1.6 1.8-2.5 4-2.5s4 .9 4 2.5l-1 3-3 1-3-1z" />
      <path d="M9 15l-1.5 5M15 15l1.5 5" />
    </svg>
  )
}
function EquipIcon({ active }) {
  return (
    <svg viewBox="0 0 24 24" {...base(active)}>
      <rect x="2.5" y="9" width="3" height="6" rx="1" />
      <rect x="18.5" y="9" width="3" height="6" rx="1" />
      <line x1="5.5" y1="12" x2="18.5" y2="12" />
      <line x1="8" y1="8" x2="8" y2="16" />
      <line x1="16" y1="8" x2="16" y2="16" />
    </svg>
  )
}
