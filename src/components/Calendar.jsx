import { useState } from 'react'
import { SESSION_COLOR } from '../data/sessions.js'

const WEEKDAYS = ['M', 'T', 'W', 'T', 'F', 'S', 'S']
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

function dayKey(d) {
  return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`
}

// Monthly calendar with coloured dots on trained days. Tap a day -> onSelectDay(sessions[]).
export default function Calendar({ sessions, onSelectDay }) {
  const today = new Date()
  const [cursor, setCursor] = useState(new Date(today.getFullYear(), today.getMonth(), 1))

  const byDay = {}
  sessions.forEach((s) => {
    const d = new Date(s.date)
    const k = dayKey(d)
    ;(byDay[k] = byDay[k] || []).push(s)
  })

  const year = cursor.getFullYear()
  const month = cursor.getMonth()
  const firstWeekday = (new Date(year, month, 1).getDay() + 6) % 7 // Mon = 0
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const cells = [...Array(firstWeekday).fill(null), ...Array.from({ length: daysInMonth }, (_, i) => i + 1)]

  const shift = (delta) => setCursor(new Date(year, month + delta, 1))

  return (
    <div>
      <div className="mb-3 flex items-center justify-between">
        <button onClick={() => shift(-1)} className="grid h-8 w-8 place-items-center rounded-full bg-canvas text-ink-soft active:scale-95">‹</button>
        <span className="text-sm font-bold">{MONTHS[month]} {year}</span>
        <button onClick={() => shift(1)} className="grid h-8 w-8 place-items-center rounded-full bg-canvas text-ink-soft active:scale-95">›</button>
      </div>
      <div className="grid grid-cols-7 gap-1 text-center text-[11px] font-semibold text-ink-soft/60">
        {WEEKDAYS.map((d, i) => <div key={i} className="py-1">{d}</div>)}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {cells.map((day, i) => {
          if (!day) return <div key={i} />
          const d = new Date(year, month, day)
          const list = byDay[dayKey(d)] || []
          const isToday = dayKey(d) === dayKey(today)
          return (
            <button
              key={i}
              onClick={() => list.length && onSelectDay(list)}
              className={`relative aspect-square rounded-xl text-sm transition ${
                list.length ? 'font-bold active:scale-95' : 'text-ink-soft/70'
              } ${isToday ? 'bg-canvas' : ''}`}
            >
              {day}
              {list.length > 0 && (
                <span className="absolute inset-x-0 bottom-1 flex justify-center gap-0.5">
                  {list.slice(0, 3).map((s, k) => (
                    <span key={k} className="h-1.5 w-1.5 rounded-full" style={{ background: SESSION_COLOR[s.type] }} />
                  ))}
                </span>
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}
