import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useWorkout } from '../store/WorkoutContext.jsx'
import { SESSIONS, SESSION_COLOR, SESSION_ORDER } from '../data/sessions.js'
import { getExercise } from '../data/exercises.js'
import { startOfWeek } from '../lib/recovery.js'
import { totalVolume, totalDuration, currentStreak, fmtDuration, bestWeight, suggestNextWeight } from '../lib/progress.js'
import { estimateCalories } from '../lib/calories.js'
import Card from '../components/Card.jsx'
import Calendar from '../components/Calendar.jsx'
import StrengthChart from '../components/StrengthChart.jsx'
import ExerciseIllustration from '../components/ExerciseIllustration.jsx'
import EquipmentChip from '../components/EquipmentChip.jsx'

const fmtDay = (d) =>
  new Date(d).toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' })

const TONE_CLASS = {
  up: 'bg-green/10 text-green',
  hold: 'bg-blue/10 text-blue',
  build: 'bg-orange/10 text-orange',
}

function Stat({ value, label, sub, accent = 'var(--color-ink)' }) {
  return (
    <div className="flex-1 px-2 py-3 text-center">
      <div className="text-[22px] font-extrabold leading-none" style={{ color: accent }}>
        {value}
      </div>
      <div className="mt-1 text-[11px] font-medium text-ink-soft">{label}</div>
      {sub && <div className="text-[10px] text-ink-soft/70">{sub}</div>}
    </div>
  )
}

function fmtVol(kg) {
  if (kg >= 1000) return `${(kg / 1000).toFixed(1)}t`
  return `${kg}kg`
}

// Returns the session type (push/pull/legs) that an exercise most commonly appears in.
function sessionTypeFor(sessions, exerciseId) {
  const counts = {}
  for (const s of sessions) {
    if (s.exercises.some((e) => e.exerciseId === exerciseId)) {
      counts[s.type] = (counts[s.type] || 0) + 1
    }
  }
  const entries = Object.entries(counts).sort((a, b) => b[1] - a[1])
  return entries[0]?.[0] ?? null
}

export default function Progress() {
  const { sessions, profile } = useWorkout()
  const navigate = useNavigate()
  const [metric, setMetric] = useState('weight')

  const weekStart = startOfWeek()
  const thisWeek = sessions.filter((s) => new Date(s.date) >= weekStart).length
  const streak = currentStreak(sessions)
  const time = totalDuration(sessions)
  const volume = totalVolume(sessions)
  const totalCal = sessions.reduce((sum, s) => sum + (estimateCalories(s, profile) || 0), 0)

  // All unique exercise IDs in history, chronological order of first appearance.
  const trackedIds = []
  ;[...sessions]
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .forEach((s) =>
      s.exercises.forEach((e) => {
        if (!trackedIds.includes(e.exerciseId)) trackedIds.push(e.exerciseId)
      }),
    )

  const nonCardioIds = trackedIds.filter((id) => !getExercise(id)?.cardio)
  const suggestIds = nonCardioIds.filter((id) => suggestNextWeight(sessions, id) != null)

  const ordered = [...sessions].sort((a, b) => new Date(b.date) - new Date(a.date))

  return (
    <div className="px-4 pt-5 pb-8">
      <h1 className="mb-4 text-[28px] font-extrabold">Progress</h1>

      {/* Summary stats */}
      <Card className="mb-5 divide-y divide-hairline">
        <div className="flex divide-x divide-hairline">
          <Stat value={sessions.length} label="Sessions" accent="var(--color-ink)" />
          <Stat value={thisWeek} label="This week" accent="var(--color-blue)" />
          <Stat
            value={streak ? `${streak}wk` : '—'}
            label="Streak"
            accent="var(--color-green)"
          />
        </div>
        <div className="flex divide-x divide-hairline">
          <Stat
            value={fmtDuration(time)}
            label="Total time"
            accent="var(--color-blue)"
          />
          {profile?.weightKg ? (
            <Stat
              value={totalCal > 0 ? `~${totalCal}` : '—'}
              label="Calories"
              sub="kcal"
              accent="var(--color-orange)"
            />
          ) : (
            <div className="flex-1 px-2 py-3 text-center">
              <button
                onClick={() => navigate('/profile')}
                className="text-[11px] font-medium leading-relaxed"
                style={{ color: 'var(--color-blue)' }}
              >
                Add weight<br />for calories
              </button>
            </div>
          )}
          <Stat
            value={volume > 0 ? fmtVol(volume) : '—'}
            label="Volume"
            accent="var(--color-ink)"
          />
        </div>
      </Card>

      {/* Calendar */}
      <Card className="mb-5 p-4">
        <Calendar sessions={sessions} onSelectDay={(list) => navigate(`/session/${list[0].id}`)} />
        <div className="mt-3 flex justify-center gap-4 text-[11px] text-ink-soft">
          {['push', 'pull', 'legs'].map((t) => (
            <span key={t} className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full" style={{ background: SESSION_COLOR[t] }} />
              {SESSIONS[t].title}
            </span>
          ))}
        </div>
      </Card>

      {/* Per-exercise suggestions */}
      {suggestIds.length > 0 && (
        <>
          <h2 className="mb-2.5 text-lg font-bold">Next session</h2>
          <Card className="mb-5 divide-y divide-hairline">
            {suggestIds.map((id) => {
              const ex = getExercise(id)
              const suggestion = suggestNextWeight(sessions, id)
              const pr = bestWeight(sessions, id)
              if (!ex || !suggestion) return null
              return (
                <div key={id} className="flex items-center gap-3 px-4 py-3">
                  <ExerciseIllustration exerciseId={id} className="h-10 w-10 shrink-0" />
                  <div className="min-w-0 flex-1">
                    <div className="text-xs font-bold leading-tight">{ex.name}</div>
                    <div className={`mt-1 rounded-lg px-2 py-0.5 text-[11px] font-semibold inline-block ${TONE_CLASS[suggestion.tone]}`}>
                      {suggestion.text}
                    </div>
                  </div>
                  {pr != null && (
                    <div className="shrink-0 text-right">
                      <div className="text-xs font-bold tabular-nums">{pr} kg</div>
                      <div className="text-[10px] text-ink-soft">PR</div>
                    </div>
                  )}
                </div>
              )
            })}
          </Card>
        </>
      )}

      {/* Strength charts */}
      {trackedIds.length > 0 && (
        <>
          <div className="mb-2 flex items-center justify-between">
            <h2 className="text-lg font-bold">Strength trend</h2>
            <div className="flex rounded-full bg-surface p-0.5 shadow-[var(--shadow-card)]">
              {['weight', 'volume'].map((m) => (
                <button
                  key={m}
                  onClick={() => setMetric(m)}
                  className="rounded-full px-3 py-1 text-xs font-semibold capitalize transition"
                  style={
                    metric === m
                      ? { background: 'var(--color-blue)', color: '#fff' }
                      : { color: 'var(--color-ink-soft)' }
                  }
                >
                  {m}
                </button>
              ))}
            </div>
          </div>
          {/* Legend */}
          <div className="mb-3 flex gap-3 text-[10px] text-ink-soft">
            <span className="flex items-center gap-1">
              <span className="inline-block h-2 w-2 rounded-sm" style={{ background: 'var(--color-green)' }} />
              PR
            </span>
            <span className="flex items-center gap-1">
              <span className="inline-block h-2 w-2 rounded-sm" style={{ background: 'var(--color-blue)' }} />
              Latest
            </span>
            <span className="flex items-center gap-1">
              <span className="inline-block h-2 w-2 rounded-sm bg-[#c9d6e8]" />
              Previous
            </span>
          </div>
          <div className="mb-5 space-y-4">
            {SESSION_ORDER.map((type) => {
              const ids = trackedIds.filter((id) => sessionTypeFor(sessions, id) === type)
              if (ids.length === 0) return null
              return (
                <div key={type}>
                  <h3
                    className="mb-2 text-sm font-bold uppercase tracking-wide"
                    style={{ color: SESSION_COLOR[type] }}
                  >
                    {SESSIONS[type].title}
                  </h3>
                  <div className="grid grid-cols-2 gap-2">
                    {ids.map((id) => (
                      <Card key={id} className="p-3">
                        <StrengthChart sessions={sessions} exerciseId={id} metric={metric} />
                      </Card>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        </>
      )}

      {/* All sessions */}
      <h2 className="mb-2.5 text-lg font-bold">All sessions</h2>
      {ordered.length === 0 ? (
        <Card className="p-6 text-center text-sm text-ink-soft">
          No sessions yet. Start one from Home.
        </Card>
      ) : (
        <div className="space-y-2.5">
          {ordered.map((s) => {
            const cal = estimateCalories(s, profile)
            return (
              <Card
                key={s.id}
                as="button"
                onClick={() => navigate(`/session/${s.id}`)}
                className="flex w-full items-center gap-3 p-3.5 text-left active:scale-[0.99] transition"
              >
                <span className="h-9 w-1.5 shrink-0 rounded-full" style={{ background: SESSION_COLOR[s.type] }} />
                <div className="min-w-0 flex-1">
                  <div className="text-sm font-bold">{SESSIONS[s.type].title}</div>
                  <div className="text-xs text-ink-soft">
                    {fmtDay(s.date)}
                    {s.durationSec ? ` · ${fmtDuration(s.durationSec)}` : ''}
                  </div>
                </div>
                {cal != null ? (
                  <span className="shrink-0 rounded-full bg-orange/10 px-2.5 py-1 text-xs font-bold" style={{ color: 'var(--color-orange)' }}>
                    ~{cal} kcal
                  </span>
                ) : !profile?.weightKg ? (
                  <span className="shrink-0 text-center text-[10px] leading-tight text-ink-soft/60">
                    Add weight<br />for cal
                  </span>
                ) : null}
                <span className="shrink-0 text-ink-soft/50">›</span>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
