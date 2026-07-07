import { useNavigate } from 'react-router-dom'
import { useWorkout } from '../store/WorkoutContext.jsx'
import { getExercise } from '../data/exercises.js'
import { SESSION_COLOR } from '../data/sessions.js'
import { recoverySnapshot, recommendSessions, startOfWeek } from '../lib/recovery.js'
import Card from '../components/Card.jsx'
import BodyDiagram from '../components/BodyDiagram.jsx'
import RecoveryGrid from '../components/RecoveryGrid.jsx'

export default function Muscles() {
  const { sessions, startWorkout } = useWorkout()
  const navigate = useNavigate()

  const weekStart = startOfWeek()
  const trainedRegions = new Set()
  sessions
    .filter((s) => new Date(s.date) >= weekStart)
    .forEach((s) =>
      s.exercises.forEach((e) => {
        const ex = getExercise(e.exerciseId)
        if (ex?.cardio) return // cardio finishers don't count as resistance work
        ex?.regions.forEach((r) => trainedRegions.add(r))
      }),
    )

  const snapshot = recoverySnapshot(sessions)
  const ranked = recommendSessions(sessions)

  const begin = (type) => {
    startWorkout(type)
    navigate(`/workout/${type}`)
  }

  return (
    <div className="px-4 pt-5">
      <h1 className="mb-4 text-[28px] font-extrabold">Muscles</h1>

      <Card className="mb-5 p-4">
        <h2 className="mb-1 text-sm font-bold">This week's training</h2>
        <p className="mb-2 text-xs text-ink-soft">Highlighted muscles worked since Monday</p>
        <BodyDiagram regions={trainedRegions} accent="blue" showBack className="mx-auto h-56 w-auto" />
      </Card>

      <h2 className="mb-2.5 text-lg font-bold">Recommended today</h2>
      <div className="mb-5 space-y-2.5">
        {ranked.map((r, i) => (
          <Card key={r.type} className="flex items-center gap-3 p-3.5">
            <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full text-sm font-bold text-white" style={{ background: SESSION_COLOR[r.type] }}>
              {i + 1}
            </span>
            <div className="min-w-0 flex-1">
              <div className="text-sm font-bold">{r.title}</div>
              <div className="text-xs text-ink-soft">
                {i === 0 ? 'Best pick — most recovered targets' : `Muscles ~${r.avgReady}% ready`}
              </div>
            </div>
            <button onClick={() => begin(r.type)} className="shrink-0 rounded-full bg-canvas px-4 py-2 text-sm font-bold text-ink active:scale-95 transition">
              Start
            </button>
          </Card>
        ))}
      </div>

      <h2 className="mb-2.5 text-lg font-bold">Recovery</h2>
      <RecoveryGrid snapshot={snapshot} />
    </div>
  )
}
