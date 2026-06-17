export default function StickyProgress({ done, total, title, color = 'var(--color-blue)', onCancel }) {
  const pct = total ? Math.round((done / total) * 100) : 0
  return (
    <div
      className="sticky top-0 z-30 border-b border-hairline bg-surface/90 backdrop-blur-xl"
      style={{ paddingTop: 'calc(env(safe-area-inset-top) + 12px)', paddingBottom: '8px', paddingLeft: '16px', paddingRight: '16px' }}
    >
      <div className="mx-auto max-w-md">
        <div className="flex items-center justify-between text-sm">
          <span className="font-bold">{title}</span>
          <div className="flex items-center gap-3">
            <span className="font-semibold text-ink-soft">{done}/{total} sets</span>
            {onCancel && (
              <button
                onClick={onCancel}
                aria-label="Cancel workout"
                className="grid h-7 w-7 place-items-center rounded-full bg-canvas text-base font-bold text-ink-soft active:scale-90 transition"
              >
                ✕
              </button>
            )}
          </div>
        </div>
        <div className="mt-2 h-2 overflow-hidden rounded-full bg-canvas">
          <div
            className="h-full rounded-full transition-all duration-300"
            style={{ width: `${pct}%`, background: color }}
          />
        </div>
      </div>
    </div>
  )
}
