import { useNavigate } from 'react-router-dom'
import { useWorkout } from '../store/WorkoutContext.jsx'
import { SESSIONS, SESSION_COLOR } from '../data/sessions.js'
import Card from '../components/Card.jsx'
import Calendar from '../components/Calendar.jsx'
import StrengthChart from '../components/StrengthChart.jsx'

const fmtDay = (d) =>
  new Date(d).toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' })

export default function Progress() {
  const { sessions } = useWorkout()
  const navigate = useNavigate()

  // Exercises that appear in history, in order of first appearance.
  const trackedIds = []
  ;[...sessions]
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .forEach((s) => s.exercises.forEach((e) => {
      if (!trackedIds.includes(e.exerciseId)) trackedIds.push(e.exerciseId)
    }))

  const ordered = [...sessions].sort((a, b) => new Date(b.date) - new Date(a.date))

  return (
    <div className="px-4 pt-5">
      <h1 className="mb-4 text-[28px] font-extrabold">Progress</h1>

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

      {trackedIds.length > 0 && (
        <>
          <h2 className="mb-2.5 text-lg font-bold">Strength trend</h2>
          <div className="mb-5 space-y-3">
            {trackedIds.map((id) => (
              <Card key={id} className="p-4">
                <StrengthChart sessions={sessions} exerciseId={id} />
              </Card>
            ))}
          </div>
        </>
      )}

      <h2 className="mb-2.5 text-lg font-bold">All sessions</h2>
      {ordered.length === 0 ? (
        <Card className="p-6 text-center text-sm text-ink-soft">
          No sessions yet. Start one from Home.
        </Card>
      ) : (
        <div className="space-y-2.5">
          {ordered.map((s) => (
            <Card key={s.id} as="button" onClick={() => navigate(`/session/${s.id}`)} className="flex w-full items-center gap-3 p-3.5 text-left active:scale-[0.99] transition">
              <span className="h-9 w-1.5 rounded-full" style={{ background: SESSION_COLOR[s.type] }} />
              <div className="min-w-0 flex-1">
                <div className="text-sm font-bold">{SESSIONS[s.type].title}</div>
                <div className="text-xs text-ink-soft">{fmtDay(s.date)} · {s.exercises.length} exercises</div>
              </div>
              <span className="text-ink-soft/50">›</span>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
