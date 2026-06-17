// − / + weight stepper (no typing). `unit` defaults to kg.
export default function WeightStepper({ value, step = 2.5, min = 0, onChange, unit = 'kg' }) {
  const fmt = (n) => (Number.isInteger(n) ? n : Number(n.toFixed(1)))
  const dec = () => onChange(Math.max(min, fmt(value - step)))
  const inc = () => onChange(fmt(value + step))

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
