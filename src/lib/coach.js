// Builds a compact training summary for the AI coach and calls the serverless proxy.
import { getExercise } from '../data/exercises.js'
import { SESSIONS, SESSION_ORDER } from '../data/sessions.js'
import { bestWeight, totalVolume, totalDuration, currentStreak, suggestNextWeight } from './progress.js'
import { estimateCalories, bmi } from './calories.js'
import { startOfWeek } from './recovery.js'

// A small, token-efficient JSON snapshot of everything the coach needs.
export function buildCoachPayload(sessions, profile) {
  const weekStart = startOfWeek()
  const recent = [...sessions].sort((a, b) => new Date(b.date) - new Date(a.date))

  // Unique tracked exercises → PR + progression suggestion (skip cardio).
  const trackedIds = []
  sessions.forEach((s) =>
    s.exercises.forEach((e) => {
      if (!trackedIds.includes(e.exerciseId)) trackedIds.push(e.exerciseId)
    }),
  )
  const exercises = trackedIds
    .map((id) => {
      const ex = getExercise(id)
      if (!ex || ex.cardio) return null
      return {
        name: ex.name,
        prWeightKg: bestWeight(sessions, id),
        suggestion: suggestNextWeight(sessions, id)?.text || null,
      }
    })
    .filter(Boolean)

  const recentSessions = recent.slice(0, 8).map((s) => ({
    date: String(s.date).slice(0, 10),
    day: SESSIONS[s.type]?.title || s.type,
    durationMin: s.durationSec ? Math.round(s.durationSec / 60) : null,
    calories: estimateCalories(s, profile),
    exercises: s.exercises
      .map((e) => {
        const ex = getExercise(e.exerciseId)
        if (!ex) return null
        const done = e.sets.filter((st) => st.done)
        const top = done.length ? Math.max(...done.map((st) => (ex.cardio ? st.reps : st.weight))) : null
        return ex.cardio
          ? { name: ex.name, minutes: top }
          : { name: ex.name, topWeightKg: top, setsDone: done.length }
      })
      .filter(Boolean),
  }))

  const programme = SESSION_ORDER.map((t) => ({
    day: SESSIONS[t].title,
    focus: SESSIONS[t].subtitle,
    exercises: SESSIONS[t].exercises.map((id) => getExercise(id)?.name).filter(Boolean),
  }))

  return {
    profile: profile?.weightKg
      ? { weightKg: profile.weightKg, heightCm: profile.heightCm, age: profile.age, sex: profile.sex, bmi: bmi(profile) }
      : null,
    stats: {
      totalSessions: sessions.length,
      sessionsThisWeek: sessions.filter((s) => new Date(s.date) >= weekStart).length,
      currentStreakWeeks: currentStreak(sessions),
      totalVolumeKg: totalVolume(sessions),
      totalMinutes: Math.round(totalDuration(sessions) / 60),
    },
    programme,
    exercises,
    recentSessions,
  }
}

// POST the summary to the Netlify function. Returns the analysis string or throws.
export async function requestCoachAnalysis(payload) {
  const res = await fetch('/.netlify/functions/coach', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(payload),
  })
  let data = {}
  try {
    data = await res.json()
  } catch {
    // Non-JSON response (e.g. running the Vite dev server with no function backend).
    throw new Error('The AI coach is only available on the deployed site (Netlify).')
  }
  if (!res.ok) throw new Error(data.error || `Request failed (${res.status}).`)
  return data.analysis || ''
}
