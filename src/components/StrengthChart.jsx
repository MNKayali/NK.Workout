import { getExercise } from '../data/exercises.js'

// Bar chart of top working weight per session for one exercise (last 8 sessions).
export default function StrengthChart({ sessions, exerciseId }) {
  const ex = getExercise(exerciseId)
  const points = sessions
    .filter((s) => s.exercises.some((e) => e.exerciseId === exerciseId))
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .slice(-8)
    .map((s) => {
      const entry = s.exercises.find((e) => e.exerciseId === exerciseId)
      const top = Math.max(...entry.sets.map((set) => (ex.cardio ? set.reps : set.weight)), 0)
      return { date: new Date(s.date), value: top }
    })

  if (points.length === 0) return null
  const max = Math.max(...points.map((p) => p.value), 1)
  const unit = ex.cardio ? 'min' : 'kg'

  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between">
        <span className="text-sm font-semibold">{ex.name}</span>
        <span className="text-xs text-ink-soft">
          {points[points.length - 1].value} {unit}
        </span>
      </div>
      <div className="flex h-24 items-end gap-1.5">
        {points.map((p, i) => {
          const h = Math.max(8, Math.round((p.value / max) * 100))
          const last = i === points.length - 1
          return (
            <div key={i} className="flex flex-1 flex-col items-center gap-1">
              <div className="flex w-full flex-1 items-end">
                <div
                  className="w-full rounded-t-md transition-all"
                  style={{ height: `${h}%`, background: last ? 'var(--color-blue)' : '#c9d6e8' }}
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
