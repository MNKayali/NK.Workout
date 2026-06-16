import { useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useWorkout } from '../store/WorkoutContext.jsx'
import { SESSIONS, SESSION_COLOR } from '../data/sessions.js'
import { getExercise } from '../data/exercises.js'
import Card from '../components/Card.jsx'
import ExerciseIllustration from '../components/ExerciseIllustration.jsx'
import SetRow from '../components/SetRow.jsx'

export default function SessionDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { sessions, updateSessionSet, removeSessionExercise, deleteSession } = useWorkout()
  const session = sessions.find((s) => s.id === id)

  // Redirect if the session is gone (e.g. deleted, or all exercises removed).
  useEffect(() => {
    if (!session) navigate('/progress', { replace: true })
  }, [session, navigate])
  if (!session) return null

  const tpl = SESSIONS[session.type]
  const handleDelete = () => {
    if (window.confirm('Delete this whole session?')) {
      deleteSession(session.id)
      navigate('/progress')
    }
  }

  return (
    <div className="px-4 pt-12 pb-8">
      <button onClick={() => navigate(-1)} className="mb-3 text-sm font-semibold text-blue">‹ Back</button>

      <header className="mb-5 flex items-center gap-3">
        <span className="h-10 w-1.5 rounded-full" style={{ background: SESSION_COLOR[session.type] }} />
        <div>
          <h1 className="text-2xl font-extrabold">{tpl.title}</h1>
          <p className="text-sm text-ink-soft">
            {new Date(session.date).toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
          </p>
        </div>
      </header>

      <p className="mb-3 text-xs text-ink-soft">Edit weights or reps below — changes save automatically.</p>

      <div className="space-y-3">
        {session.exercises.map((entry, exIndex) => {
          const ex = getExercise(entry.exerciseId)
          if (!ex) return null
          return (
            <Card key={`${entry.exerciseId}-${exIndex}`} className="p-3.5">
              <div className="mb-2.5 flex items-center gap-3">
                <ExerciseIllustration exerciseId={entry.exerciseId} className="h-12 w-12 shrink-0" />
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-bold">{ex.name}</div>
                  <div className="truncate text-xs text-ink-soft">{ex.machine}</div>
                </div>
                <button
                  onClick={() => removeSessionExercise(session.id, exIndex)}
                  aria-label="remove exercise"
                  className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-canvas text-ink-soft active:scale-95"
                >
                  ✕
                </button>
              </div>
              <div className="space-y-2">
                {entry.sets.map((set, j) => (
                  <SetRow
                    key={j}
                    index={j}
                    set={set}
                    exercise={ex}
                    onChange={(patch) => updateSessionSet(session.id, exIndex, j, patch)}
                  />
                ))}
              </div>
            </Card>
          )
        })}
      </div>

      <button
        onClick={handleDelete}
        className="mt-6 w-full rounded-2xl border border-orange/30 bg-orange/5 py-3 text-sm font-bold text-orange active:scale-[0.99] transition"
      >
        Delete session
      </button>
    </div>
  )
}
