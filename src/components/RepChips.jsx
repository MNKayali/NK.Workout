import { REP_CHIPS } from '../data/exercises.js'

// Tap-to-select rep chips (no typing). `options` overrides the default set.
export default function RepChips({ value, onChange, options = REP_CHIPS, unit }) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {options.map((n) => {
        const active = value === n
        return (
          <button
            key={n}
            type="button"
            onClick={() => onChange(n)}
            className={`h-8 min-w-[34px] rounded-full px-2 text-sm font-semibold transition active:scale-95 ${
              active
                ? 'bg-blue text-white shadow-[var(--shadow-card)]'
                : 'bg-canvas text-ink-soft'
            }`}
          >
            {n}
            {unit ? <span className="ml-0.5 text-[10px] font-normal">{unit}</span> : null}
          </button>
        )
      })}
    </div>
  )
}
