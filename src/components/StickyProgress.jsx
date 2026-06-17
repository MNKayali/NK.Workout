// Sticky top progress bar (X / Y sets done).
export default function StickyProgress({ done, total, title, color = 'var(--color-blue)' }) {
  const pct = total ? Math.round((done / total) * 100) : 0
  return (
    <div className="sticky top-0 z-30 border-b border-hairline bg-surface/90 px-4 pb-2 pt-3 backdrop-blur-xl">
      <div className="mx-auto max-w-md">
        <div className="flex items-center justify-between text-sm">
          <span className="font-bold">{title}</span>
          <span className="font-semibold text-ink-soft">
            {done}/{total} sets
          </span>
        </div>
        <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-canvas">
          <div
            className="h-full rounded-full transition-all duration-300"
            style={{ width: `${pct}%`, background: color }}
          />
        </div>
      </div>
    </div>
  )
}
