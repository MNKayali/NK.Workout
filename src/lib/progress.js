// Pure aggregation + progressive-overload helpers for the Progress screen.
import { getExercise } from '../data/exercises.js'

// Total training volume (Σ weight × reps over completed, non-cardio sets), in kg.
export function totalVolume(sessions) {
  let vol = 0
  for (const s of sessions) {
    for (const entry of s.exercises) {
      const ex = getExercise(entry.exerciseId)
      if (ex?.cardio) continue
      for (const set of entry.sets) {
        if (set.done) vol += (Number(set.weight) || 0) * (Number(set.reps) || 0)
      }
    }
  }
  return Math.round(vol)
}

// Total recorded workout time across all sessions, in seconds.
export function totalDuration(sessions) {
  return sessions.reduce((sum, s) => sum + (Number(s.durationSec) || 0), 0)
}

// Current streak = consecutive calendar weeks (incl. this one) with ≥1 session.
export function currentStreak(sessions) {
  if (sessions.length === 0) return 0
  const MS_WEEK = 7 * 24 * 60 * 60 * 1000

  // Monday 00:00 of the week containing `d`.
  const weekStart = (d) => {
    const x = new Date(d)
    x.setHours(0, 0, 0, 0)
    const day = (x.getDay() + 6) % 7 // 0 = Monday
    x.setDate(x.getDate() - day)
    return x.getTime()
  }

  const trained = new Set(sessions.map((s) => weekStart(s.date)))
  let streak = 0
  let cursor = weekStart(Date.now())
  // Allow the streak to "start" last week if nothing logged yet this week.
  if (!trained.has(cursor)) cursor -= MS_WEEK
  while (trained.has(cursor)) {
    streak += 1
    cursor -= MS_WEEK
  }
  return streak
}

// Format seconds as "1h 05m" or "42m" or "—".
export function fmtDuration(sec) {
  if (!sec) return '—'
  const m = Math.round(sec / 60)
  if (m < 60) return `${m}m`
  const h = Math.floor(m / 60)
  return `${h}h ${String(m % 60).padStart(2, '0')}m`
}

// Best (heaviest completed) working weight ever logged for an exercise, or null.
export function bestWeight(sessions, exerciseId) {
  let best = null
  for (const s of sessions) {
    const entry = s.exercises.find((e) => e.exerciseId === exerciseId)
    if (!entry) continue
    for (const set of entry.sets) {
      if (set.done && (best == null || set.weight > best)) best = set.weight
    }
  }
  return best
}

// Progressive-overload suggestion based on the most recent session for an exercise.
// Returns { tone: 'up' | 'hold' | 'build', text, nextWeight? } or null.
export function suggestNextWeight(sessions, exerciseId) {
  const ex = getExercise(exerciseId)
  if (!ex || ex.cardio) return null

  const recent = [...sessions]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .find((s) => s.exercises.some((e) => e.exerciseId === exerciseId))
  if (!recent) return null

  const entry = recent.exercises.find((e) => e.exerciseId === exerciseId)
  const done = entry.sets.filter((set) => set.done)
  if (done.length === 0) return null

  const [low, high] = ex.repRange || [ex.defaultReps, ex.defaultReps]
  const topWeight = Math.max(...done.map((set) => set.weight))
  const repsAtTop = done.filter((set) => set.weight === topWeight).map((set) => set.reps)
  const minReps = Math.min(...repsAtTop)
  const step = ex.step || 2.5

  if (minReps >= high) {
    const nextWeight = Number((topWeight + step).toFixed(1))
    return { tone: 'up', nextWeight, text: `Hit your reps — try ${nextWeight} kg next time` }
  }
  if (minReps < low) {
    return { tone: 'build', text: `Build to ${low} reps at ${topWeight} kg before adding weight` }
  }
  return { tone: 'hold', text: `On track — push for ${high} reps at ${topWeight} kg` }
}
