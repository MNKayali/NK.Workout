import { getExercise } from '../data/exercises.js'

// metric: 'weight' (default) | 'volume'
export default function StrengthChart({ sessions, exerciseId, metric = 'weight' }) {
  const ex = getExercise(exerciseId)
  if (!ex) return null

  const points = sessions
    .filter((s) => s.exercises.some((e) => e.exerciseId === exerciseId))
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .slice(-8)
    .map((s) => {
      const entry = s.exercises.find((e) => e.exerciseId === exerciseId)
      let value
      if (metric === 'volume' && !ex.cardio) {
        value = Math.round(
          entry.sets.filter((set) => set.done).reduce((sum, set) => sum + set.weight * set.reps, 0)
        )
      } else {
        value = Math.max(...entry.sets.map((set) => (ex.cardio ? set.reps : set.weight)), 0)
      }
      return { date: new Date(s.date), value }
    })

  if (points.length === 0) return null

  const max = Math.max(...points.map((p) => p.value), 1)
  const prValue = metric === 'weight' ? Math.max(...points.map((p) => p.value)) : null
  const unit = ex.cardio ? 'min' : metric === 'volume' ? 'kg lifted' : 'kg'

  // Trend vs previous session
  const latest = points[points.length - 1].value
  const prev = points.length >= 2 ? points[points.length - 2].value : null
  const delta = prev != null ? latest - prev : null

  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between gap-2">
        <span className="text-sm font-semibold truncate">{ex.name}</span>
        <div className="flex items-center gap-2 shrink-0">
          {delta != null && (
            <span
              className="text-[11px] font-semibold"
              style={{
                color:
                  delta > 0
                    ? 'var(--color-green)'
                    : delta < 0
                    ? 'var(--color-orange)'
                    : 'var(--color-ink-soft)',
              }}
            >
              {delta > 0 ? `↑ +${delta}` : delta < 0 ? `↓ ${delta}` : '→ Same'}
            </span>
          )}
          <span className="text-xs text-ink-soft">
            {latest} {unit}
          </span>
        </div>
      </div>
      <div className="flex h-24 items-end gap-1.5">
        {points.map((p, i) => {
          const h = Math.max(8, Math.round((p.value / max) * 100))
          const isLast = i === points.length - 1
          const isPR = metric === 'weight' && p.value === prValue

          let bg
          if (isPR) bg = 'var(--color-green)'
          else if (isLast) bg = 'var(--color-blue)'
          else bg = '#c9d6e8'

          return (
            <div key={i} className="flex flex-1 flex-col items-center gap-1">
              <div className="flex w-full flex-1 items-end">
                <div
                  className="w-full rounded-t-md transition-all"
                  style={{ height: `${h}%`, background: bg }}
                  title={`${p.value} ${unit}`}
                />
              </div>
              <span className="text-[9px] text-ink-soft/70">
                {p.date.getDate()}/{p.date.getMonth() + 1}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
