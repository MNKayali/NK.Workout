import { SESSIONS, getSessionTemplate } from '../data/sessions.js'
import { EXERCISES, getExercise } from '../data/exercises.js'

export const STORAGE_KEY = 'nk_gym_v3'

const EMPTY = { sessions: [] }

export function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return { ...EMPTY }
    const parsed = JSON.parse(raw)
    if (!parsed || !Array.isArray(parsed.sessions)) return { ...EMPTY }
    return parsed
  } catch {
    return { ...EMPTY }
  }
}

export function saveState(state) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  } catch {
    /* quota / private mode — ignore */
  }
}

export function newId() {
  return `s_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 7)}`
}

// Most recent saved session of a given type (push/pull/legs), or null.
export function lastSessionOfType(state, type) {
  return (
    [...state.sessions]
      .filter((s) => s.type === type)
      .sort((a, b) => new Date(b.date) - new Date(a.date))[0] || null
  )
}

// Last logged weight/reps for a specific exercise across all history.
export function lastLogForExercise(state, exerciseId) {
  const sorted = [...state.sessions].sort(
    (a, b) => new Date(b.date) - new Date(a.date),
  )
  for (const s of sorted) {
    const ex = s.exercises.find((e) => e.exerciseId === exerciseId)
    if (ex) {
      const done = ex.sets.filter((set) => set.done)
      const ref = done.length ? done[done.length - 1] : ex.sets[ex.sets.length - 1]
      if (ref) return { weight: ref.weight, reps: ref.reps }
    }
  }
  return null
}

// Build a fresh in-progress workout for `type`, prefilling weights/reps from the
// last session of that type (falling back to the exercise's own last log, then defaults).
export function buildWorkoutDraft(state, type) {
  const template = getSessionTemplate(type)
  return {
    type,
    date: new Date().toISOString(),
    exercises: template.exercises.map((exerciseId) => {
      const ex = getExercise(exerciseId)
      const prior = lastLogForExercise(state, exerciseId)
      const weight = prior ? prior.weight : ex.defaultWeight
      const reps = prior ? prior.reps : ex.defaultReps
      return {
        exerciseId,
        machine: ex.machine,
        sets: Array.from({ length: ex.sets }, () => ({
          weight,
          reps,
          done: false,
        })),
      }
    }),
  }
}

export { SESSIONS, EXERCISES }
