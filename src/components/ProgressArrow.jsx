import { useWorkout } from '../store/WorkoutContext.jsx'
import { getExercise } from '../data/exercises.js'
import { suggestNextWeight } from '../lib/progress.js'

// Small progression hint next to an exercise, from its own history:
//   up    → earned more weight (green ▲ +2.5 kg)
//   hold  → keep the weight, push for top reps (blue ▲ reps)
//   build → below target reps, build them up first (amber ▲ reps)
const TONE = {
  up: 'bg-green/10 text-green',
  hold: 'bg-blue/10 text-blue',
  build: 'bg-orange/10 text-orange',
}

function Triangle({ down }) {
  return (
    <svg viewBox="0 0 8 8" className="h-1.5 w-1.5" fill="currentColor" aria-hidden="true">
      {down ? <path d="M0 1h8L4 8z" /> : <path d="M4 0l4 7H0z" />}
    </svg>
  )
}

export default function ProgressArrow({ exerciseId }) {
  const { sessions } = useWorkout()
  const ex = getExercise(exerciseId)
  const s = suggestNextWeight(sessions, exerciseId)
  if (!ex || !s) return null

  const label = s.tone === 'up' ? `+${ex.step ?? 2.5} kg` : 'reps'

  return (
    <span
      title={s.text}
      className={`inline-flex shrink-0 items-center gap-0.5 rounded-full px-1.5 py-0.5 text-[10px] font-bold leading-none ${TONE[s.tone] || TONE.hold}`}
    >
      <Triangle />
      {label}
    </span>
  )
}
