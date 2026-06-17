import { useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useWorkout } from '../store/WorkoutContext.jsx'
import { SESSIONS, SESSION_COLOR } from '../data/sessions.js'
import { getExercise } from '../data/exercises.js'
import ExerciseCard from '../components/ExerciseCard.jsx'
import StickyProgress from '../components/StickyProgress.jsx'
import StickyFooter from '../components/StickyFooter.jsx'

export default function Workout() {
  const { type } = useParams()
  const navigate = useNavigate()
  const { draft, startWorkout, updateDraftSet, swapDraftExercise, finishWorkout, discardDraft } =
    useWorkout()

  // Ensure a draft exists for this workout type.
  useEffect(() => {
    if (!SESSIONS[type]) {
      navigate('/', { replace: true })
      return
    }
    if (!draft || draft.type !== type) startWorkout(type)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [type])

  if (!draft || draft.type !== type) return null

  const tpl = SESSIONS[type]
  const allSets = draft.exercises.flatMap((e) => e.sets)
  const done = allSets.filter((s) => s.done).length
  const total = allSets.length

  const currentEntry =
    draft.exercises.find((e) => e.sets.some((s) => !s.done)) ||
    draft.exercises[draft.exercises.length - 1]
  const currentName = currentEntry ? getExercise(currentEntry.exerciseId).name : tpl.title

  const handleFinish = () => {
    finishWorkout()
    navigate('/progress')
  }

  const handleCancel = () => {
    discardDraft()
    navigate('/')
  }

  return (
    <div className="min-h-full pb-28">
      <StickyProgress done={done} total={total} title={tpl.title} color={SESSION_COLOR[type]} />

      <div className="flex items-center justify-between px-4 pb-1 pt-3">
        <p className="text-xs text-ink-soft">{tpl.subtitle}</p>
        <button onClick={handleCancel} className="text-xs font-semibold text-ink-soft underline-offset-2 hover:underline">
          Cancel
        </button>
      </div>

      <div className="space-y-3 px-4 pt-1">
        {draft.exercises.map((entry, i) => (
          <ExerciseCard
            key={`${entry.exerciseId}-${i}`}
            entry={entry}
            exIndex={i}
            onSetChange={updateDraftSet}
            onSwap={swapDraftExercise}
          />
        ))}
      </div>

      <StickyFooter currentName={currentName} done={done} total={total} onSave={handleFinish} />
    </div>
  )
}
