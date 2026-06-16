import Card from './Card.jsx'

const BADGE = {
  ready: 'bg-green/12 text-green',
  recovering: 'bg-blue/12 text-blue',
  fatigued: 'bg-orange/12 text-orange',
}
const BAR = { green: 'var(--color-green)', blue: 'var(--color-blue)', orange: 'var(--color-orange)' }

function relDate(d) {
  if (!d) return 'Not yet'
  const days = Math.floor((Date.now() - d.getTime()) / 86400000)
  if (days <= 0) return 'Today'
  if (days === 1) return 'Yesterday'
  return `${days}d ago`
}

// Recovery card per muscle group: status badge + last trained + recovery % bar.
export default function RecoveryGrid({ snapshot }) {
  return (
    <div className="grid grid-cols-2 gap-2.5">
      {snapshot.map((g) => (
        <Card key={g.id} className="p-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-bold">{g.label}</span>
            <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${BADGE[g.status.key]}`}>
              {g.status.label}
            </span>
          </div>
          <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-canvas">
            <div className="h-full rounded-full" style={{ width: `${g.pct}%`, background: BAR[g.status.color] }} />
          </div>
          <div className="mt-1.5 flex items-center justify-between text-[11px] text-ink-soft">
            <span>{relDate(g.lastTrained)}</span>
            <span className="font-semibold">{g.pct}%</span>
          </div>
        </Card>
      ))}
    </div>
  )
}
