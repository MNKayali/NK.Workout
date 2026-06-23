import { getExercise } from '../data/exercises.js'

// metric: 'weight' (default) | 'volume'
export default function StrengthChart({ sessions, exerciseId, metric = 'weight' }) {
  const ex = getExercise(exerciseId)
  if (!ex) return null

  const points = sessions
    .filter((s) => s.exercises.some((e) => e.exerciseId === exerciseId))
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .slice(-6)
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
  const unit = ex.cardio ? 'min' : metric === 'volume' ? 'kg↑' : 'kg'

  const latest = points[points.length - 1].value
  const prev = points.length >= 2 ? points[points.length - 2].value : null
  const delta = prev != null ? latest - prev : null

  return (
    <div>
      {/* Header: name + trend badge */}
      <div className="mb-1 flex items-start justify-between gap-1">
        <span className="text-xs font-bold leading-tight truncate">{ex.name}</span>
        {delta != null && (
          <span
            className="text-[10px] font-semibold shrink-0"
            style={{
              color:
                delta > 0
                  ? 'var(--color-green)'
                  : delta < 0
                  ? 'var(--color-orange)'
                  : 'var(--color-ink-soft)',
            }}
          >
            {delta > 0 ? `↑+${delta}` : delta < 0 ? `↓${delta}` : '→'}
          </span>
        )}
      </div>

      {/* Latest value */}
      <div className="mb-1.5 text-[11px] font-semibold" style={{ color: 'var(--color-blue)' }}>
        {latest} {unit}
      </div>

      {/* Bars */}
      <div className="flex h-14 items-end gap-1">
        {points.map((p, i) => {
          const h = Math.max(10, Math.round((p.value / max) * 100))
          const isLast = i === points.length - 1
          const isPR = metric === 'weight' && p.value === prValue

          let bg
          if (isPR) bg = 'var(--color-green)'
          else if (isLast) bg = 'var(--color-blue)'
          else bg = '#c9d6e8'

          return (
            <div key={i} className="flex flex-1 flex-col items-center gap-0.5">
              <div className="flex w-full flex-1 items-end">
                <div
                  className="w-full rounded-t transition-all"
                  style={{ height: `${h}%`, background: bg }}
                  title={`${p.date.getDate()}/${p.date.getMonth() + 1}: ${p.value} ${unit}`}
                />
              </div>
              <span className="text-[8px] text-ink-soft/60 tabular-nums">
                {p.date.getDate()}/{p.date.getMonth() + 1}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
