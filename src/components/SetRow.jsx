import WeightStepper from './WeightStepper.jsx'
import RepChips from './RepChips.jsx'

const CheckIcon = ({ done }) => (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    {done ? <path d="M5 12l4 4 10-11" /> : <circle cx="12" cy="12" r="8" strokeWidth="2" />}
  </svg>
)

// One set row: tick + weight stepper + rep chips. Cardio shows minutes only.
export default function SetRow({ index, set, exercise, onChange }) {
  const cardio = exercise.cardio
  const repOptions = exercise.repOptions
  return (
    <div
      className={`rounded-2xl border p-3 transition ${
        set.done ? 'border-green/40 bg-green/5' : 'border-hairline bg-white'
      }`}
    >
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => onChange({ done: !set.done })}
            aria-label={set.done ? 'mark set not done' : 'mark set done'}
            className={`grid h-9 w-9 place-items-center rounded-full transition active:scale-95 ${
              set.done ? 'bg-green text-white' : 'bg-canvas text-ink-soft'
            }`}
          >
            <CheckIcon done={set.done} />
          </button>
          <span className="text-sm font-semibold text-ink-soft">
            {cardio ? 'Session' : `Set ${index + 1}`}
          </span>
        </div>
        {!cardio && (
          <WeightStepper
            value={set.weight}
            step={exercise.step}
            onChange={(weight) => onChange({ weight })}
            unit={exercise.bodyweight ? '+kg' : 'kg'}
          />
        )}
      </div>
      <div className="mt-2.5">
        <div className="mb-1 text-[11px] font-medium uppercase tracking-wide text-ink-soft/70">
          {cardio ? 'Minutes' : 'Reps'}
        </div>
        <RepChips
          value={set.reps}
          onChange={(reps) => onChange({ reps })}
          options={repOptions}
          unit={cardio ? 'm' : undefined}
        />
      </div>
    </div>
  )
}
