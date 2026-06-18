import { useNavigate } from 'react-router-dom'
import { useWorkout } from '../store/WorkoutContext.jsx'
import { SESSIONS, SESSION_ORDER, SESSION_COLOR } from '../data/sessions.js'
import { startOfWeek } from '../lib/recovery.js'
import StatStrip from '../components/StatStrip.jsx'
import Card from '../components/Card.jsx'
import ExerciseIllustration from '../components/ExerciseIllustration.jsx'

const fmtDay = (d) =>
  new Date(d).toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' })

export default function Home() {
  const { sessions, startWorkout } = useWorkout()
  const navigate = useNavigate()

  const weekStart = startOfWeek()
  const thisWeek = sessions.filter((s) => new Date(s.date) >= weekStart).length
  const recent = [...sessions].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 3)

  const begin = (type) => {
    startWorkout(type)
    navigate(`/workout/${type}`)
  }

  return (
    <div className="px-4 pt-5">
      <header className="mb-5 flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-ink-soft">
            {new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' })}
          </p>
          <h1 className="text-[28px] font-extrabold leading-tight">Hi Nabil 👋</h1>
        </div>
        <button
          onClick={() => navigate('/profile')}
          aria-label="Profile"
          className="mt-1 grid h-9 w-9 place-items-center rounded-full bg-surface text-ink-soft shadow-[var(--shadow-card)] active:scale-95 transition"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="8" r="4"/>
            <path d="M4 20c0-4.4 3.6-8 8-8s8 3.6 8 8"/>
          </svg>
        </button>
      </header>

      <StatStrip total={sessions.length} thisWeek={thisWeek} goal={3} />

      <h2 className="mb-2.5 mt-6 text-lg font-bold">Today's sessions</h2>
      <div className="space-y-3">
        {SESSION_ORDER.map((type) => {
          const s = SESSIONS[type]
          return (
            <Card key={type} className="overflow-hidden">
              <button onClick={() => begin(type)} className="flex w-full items-center gap-3.5 p-4 text-left active:scale-[0.99] transition">
                <span className="h-12 w-1.5 shrink-0 rounded-full" style={{ background: SESSION_COLOR[type] }} />
                <div className="min-w-0 flex-1">
                  <div className="text-base font-bold">{s.title}</div>
                  <div className="truncate text-xs text-ink-soft">{s.subtitle}</div>
                  <div className="mt-0.5 text-[11px] font-medium text-ink-soft/70">{s.exercises.length} exercises</div>
                </div>
                <span className="shrink-0 rounded-full px-4 py-2 text-sm font-bold text-white shadow-[var(--shadow-card)]" style={{ background: SESSION_COLOR[type] }}>
                  Start
                </span>
              </button>
            </Card>
          )
        })}
      </div>

      {recent.length > 0 && (
        <>
          <h2 className="mb-2.5 mt-6 text-lg font-bold">Recent</h2>
          <div className="space-y-2.5">
            {recent.map((s) => {
              const first = s.exercises[0]
              return (
                <Card key={s.id} as="button" onClick={() => navigate(`/session/${s.id}`)} className="flex w-full items-center gap-3 p-3 text-left active:scale-[0.99] transition">
                  {first && <ExerciseIllustration exerciseId={first.exerciseId} className="h-11 w-11 shrink-0" />}
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-bold">{SESSIONS[s.type].title}</div>
                    <div className="text-xs text-ink-soft">{fmtDay(s.date)} · {s.exercises.length} exercises</div>
                  </div>
                  <span className="h-2.5 w-2.5 rounded-full" style={{ background: SESSION_COLOR[s.type] }} />
                </Card>
              )
            })}
          </div>
        </>
      )}
    </div>
  )
}
