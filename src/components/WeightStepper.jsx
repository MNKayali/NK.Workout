// − / + weight stepper (no typing). `unit` defaults to kg.
export default function WeightStepper({ value, step = 2.5, min = 0, onChange, unit = 'kg' }) {
  const fmt = (n) => (Number.isInteger(n) ? n : Number(n.toFixed(1)))
  // Snap to the gym's real plate/dumbbell grid (2.5 / 5 / 7.5 …): step to the
  // next grid point in each direction, correcting any off-grid history (16 → 15 / 17.5).
  const dec = () => onChange(Math.max(min, fmt(Math.ceil(value / step - 1) * step)))
  const inc = () => onChange(fmt(Math.floor(value / step + 1) * step))

  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={dec}
        aria-label="decrease weight"
        className="h-9 w-9 rounded-full bg-canvas text-ink text-xl font-semibold active:scale-95 transition disabled:opacity-30"
        disabled={value <= min}
      >
        −
      </button>
      <div className="min-w-[64px] text-center">
        <span className="text-lg font-bold tabular-nums">{fmt(value)}</span>
        <span className="ml-0.5 text-xs text-ink-soft">{unit}</span>
      </div>
      <button
        type="button"
        onClick={inc}
        aria-label="increase weight"
        className="h-9 w-9 rounded-full bg-canvas text-ink text-xl font-semibold active:scale-95 transition"
      >
        +
      </button>
    </div>
  )
}
