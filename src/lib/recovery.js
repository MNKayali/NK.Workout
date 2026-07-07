import { GROUPS, FULL_RECOVERY_HOURS, recoveryStatus } from '../data/muscles.js'
import { getExercise } from '../data/exercises.js'
import { SESSIONS } from '../data/sessions.js'

const HOUR = 1000 * 60 * 60

// Groups worked in a saved session (union of its exercises' groups).
// Cardio finishers (e.g. the Arc Trainer) are excluded — a low-impact cardio
// finisher shouldn't register the target muscles as resistance-trained/fatigued.
export function groupsWorkedIn(session) {
  const set = new Set()
  session.exercises.forEach((e) => {
    const ex = getExercise(e.exerciseId)
    if (ex?.cardio) return
    ex?.groups.forEach((g) => set.add(g))
  })
  return set
}

// Last time each group was trained -> Date or null.
export function lastTrainedByGroup(sessions) {
  const map = {}
  GROUPS.forEach((g) => (map[g.id] = null))
  const sorted = [...sessions].sort((a, b) => new Date(a.date) - new Date(b.date))
  sorted.forEach((s) => {
    groupsWorkedIn(s).forEach((g) => {
      map[g] = new Date(s.date)
    })
  })
  return map
}

// Recovery snapshot per group: { id, label, pct, status, lastTrained }.
export function recoverySnapshot(sessions, now = new Date()) {
  const last = lastTrainedByGroup(sessions)
  return GROUPS.map((g) => {
    const lt = last[g.id]
    let pct = 100
    if (lt) {
      const hrs = (now - lt) / HOUR
      pct = Math.max(0, Math.min(100, Math.round((hrs / FULL_RECOVERY_HOURS) * 100)))
    }
    return {
      id: g.id,
      label: g.label,
      pct,
      status: recoveryStatus(pct),
      lastTrained: lt,
    }
  })
}

// Muscle groups trained within the current week (Mon-start).
export function groupsTrainedThisWeek(sessions, now = new Date()) {
  const start = startOfWeek(now)
  const set = new Set()
  sessions
    .filter((s) => new Date(s.date) >= start)
    .forEach((s) => groupsWorkedIn(s).forEach((g) => set.add(g)))
  return set
}

// Rank the 3 day templates by how recovered their target muscles are.
// Best pick = the session whose muscles are, on average, most recovered (highest
// avgReady). Cardio finishers are excluded so the readiness reflects the muscles the
// session actually resistance-trains.
export function recommendSessions(sessions, now = new Date()) {
  const snap = recoverySnapshot(sessions, now)
  const pctById = Object.fromEntries(snap.map((s) => [s.id, s.pct]))
  return Object.values(SESSIONS)
    .map((tpl) => {
      const groups = new Set()
      tpl.exercises.forEach((id) => {
        const ex = getExercise(id)
        if (ex?.cardio) return
        ex?.groups.forEach((g) => groups.add(g))
      })
      const groupArr = [...groups]
      const avgReady = groupArr.length
        ? Math.round(groupArr.reduce((s, g) => s + (pctById[g] ?? 100), 0) / groupArr.length)
        : 100
      return { type: tpl.type, title: tpl.title, color: tpl.color, avgReady }
    })
    .sort((a, b) => b.avgReady - a.avgReady)
}

export function startOfWeek(d = new Date()) {
  const date = new Date(d)
  const day = (date.getDay() + 6) % 7 // Mon = 0
  date.setHours(0, 0, 0, 0)
  date.setDate(date.getDate() - day)
  return date
}
