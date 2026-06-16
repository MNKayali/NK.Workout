import Card from './Card.jsx'

function Stat({ value, label, sub, accent }) {
  return (
    <div className="flex-1 px-2 py-3 text-center">
      <div className="text-[26px] font-extrabold leading-none" style={{ color: accent }}>
        {value}
      </div>
      <div className="mt-1 text-[11px] font-medium text-ink-soft">{label}</div>
      {sub && <div className="text-[10px] text-ink-soft/70">{sub}</div>}
    </div>
  )
}

export default function StatStrip({ total, thisWeek, goal = 3 }) {
  return (
    <Card className="flex divide-x divide-hairline">
      <Stat value={total} label="Sessions" accent="var(--color-ink)" />
      <Stat value={thisWeek} label="This week" accent="var(--color-blue)" />
      <Stat value={`${thisWeek}/${goal}`} label="Weekly goal" accent="var(--color-green)" />
    </Card>
  )
}
