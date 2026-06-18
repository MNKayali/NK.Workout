// Body metrics + workout energy estimates derived from the user profile.
// Profile shape: { weightKg, heightCm, age, sex: 'male' | 'female' }.
import { getExercise } from '../data/exercises.js'

// Approximate MET values (Compendium of Physical Activities).
const MET_STRENGTH = 5 // general resistance training, moderate effort
const MET_CARDIO = 7 // elliptical / arc trainer, moderate-vigorous

// Total minutes logged on cardio exercises (cardio stores minutes in `reps`).
function cardioMinutes(session) {
  let mins = 0
  for (const entry of session.exercises) {
    const ex = getExercise(entry.exerciseId)
    if (!ex?.cardio) continue
    for (const set of entry.sets) {
      if (set.done) mins += Number(set.reps) || 0
    }
  }
  return mins
}

// Estimated calories burned for a session. Needs bodyweight + a duration.
// Splits time into cardio minutes (MET 7) and the remaining strength time (MET 5):
//   kcal = MET × weightKg × hours. Returns null when we can't estimate.
export function estimateCalories(session, profile) {
  const weightKg = Number(profile?.weightKg)
  if (!weightKg || !session) return null

  const totalMin = session.durationSec ? session.durationSec / 60 : null
  if (!totalMin) return null

  const cardioMin = Math.min(cardioMinutes(session), totalMin)
  const strengthMin = Math.max(0, totalMin - cardioMin)

  const kcal =
    MET_CARDIO * weightKg * (cardioMin / 60) + MET_STRENGTH * weightKg * (strengthMin / 60)
  return Math.round(kcal)
}

// Body Mass Index (kg / m²), or null if weight/height missing.
export function bmi(profile) {
  const w = Number(profile?.weightKg)
  const h = Number(profile?.heightCm)
  if (!w || !h) return null
  return Number((w / (h / 100) ** 2).toFixed(1))
}

export function bmiLabel(value) {
  if (value == null) return ''
  if (value < 18.5) return 'Underweight'
  if (value < 25) return 'Healthy'
  if (value < 30) return 'Overweight'
  return 'Obese'
}

// Basal Metabolic Rate via Mifflin-St Jeor (kcal/day), or null if data missing.
export function bmr(profile) {
  const w = Number(profile?.weightKg)
  const h = Number(profile?.heightCm)
  const age = Number(profile?.age)
  if (!w || !h || !age || !profile?.sex) return null
  const base = 10 * w + 6.25 * h - 5 * age
  return Math.round(base + (profile.sex === 'female' ? -161 : 5))
}
