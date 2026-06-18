import Card from './Card.jsx'
import ExerciseIllustration from './ExerciseIllustration.jsx'
import EquipmentChip from './EquipmentChip.jsx'
import BodyDiagram from './BodyDiagram.jsx'
import SetRow from './SetRow.jsx'
import { getExercise } from '../data/exercises.js'
import { getMedia } from '../data/exerciseMedia.js'

const NOTE_STYLE = {
  warn: 'bg-orange/10 text-orange',
  safe: 'bg-green/10 text-green',
}

// A single exercise on the Workout screen.
export default function ExerciseCard({ entry, exIndex, onSetChange, onSwap }) {
  const ex = getExercise(entry.exerciseId)
  if (!ex) return null
  const doneCount = entry.sets.filter((s) => s.done).length
  const swapOptions = [entry.exerciseId, ...ex.swaps.filter((id) => id !== entry.exerciseId)]
  const accent = ex.groups[0] === 'legs' ? 'green' : ex.groups[0] === 'back' || ex.groups[0] === 'arms' ? 'orange' : 'blue'
  const hasPhoto = !!getMedia(entry.exerciseId)

  return (
    <Card className="overflow-hidden">
      {/* Demonstration photo banner */}
      {hasPhoto && (
        <div className="relative h-40 w-full bg-canvas">
          <ExerciseIllustration
            exerciseId={entry.exerciseId}
            accent={accent}
            variant="banner"
            className="h-full w-full"
          />
          <span className="absolute right-2.5 top-2.5 rounded-full bg-black/55 px-2 py-0.5 text-[11px] font-semibold text-white backdrop-blur-sm">
            {doneCount}/{entry.sets.length} sets
          </span>
        </div>
      )}

      <div className="p-3.5">
        <div className="flex gap-3">
          {!hasPhoto && (
            <ExerciseIllustration exerciseId={entry.exerciseId} accent={accent} className="h-20 w-20 shrink-0" />
          )}
          <div className="min-w-0 flex-1">
            <div className="flex items-start justify-between gap-2">
              <h3 className="text-[15px] font-bold leading-tight">{ex.name}</h3>
              {!hasPhoto && (
                <span className="shrink-0 rounded-full bg-canvas px-2 py-0.5 text-[11px] font-semibold text-ink-soft">
                  {doneCount}/{entry.sets.length}
                </span>
              )}
            </div>

            <div className="mt-1.5">
              <EquipmentChip machine={ex.machine} accent={accent} />
            </div>

            {ex.tip && <p className="mt-2 text-xs leading-snug text-ink-soft">{ex.tip}</p>}

            {ex.note && (
              <span className={`mt-1.5 inline-block rounded-full px-2 py-0.5 text-[11px] font-semibold ${NOTE_STYLE[ex.note.tone]}`}>
                {ex.note.tone === 'warn' ? '⚠ ' : '✓ '}
                {ex.note.text}
              </span>
            )}

            <div className="mt-2 flex items-center gap-2">
              <BodyDiagram regions={ex.regions} accent={accent} showBack className="h-12 w-auto" />
              {swapOptions.length > 1 && (
                <label className="relative flex-1">
                  <span className="sr-only">Swap exercise</span>
                  <select
                    value={entry.exerciseId}
                    onChange={(e) => onSwap(exIndex, e.target.value)}
                    className="w-full appearance-none rounded-xl border border-hairline bg-canvas py-1.5 pl-3 pr-7 text-xs font-semibold text-ink"
                  >
                    {swapOptions.map((id) => (
                      <option key={id} value={id}>
                        {id === entry.exerciseId ? '↺ ' : ''}
                        {getExercise(id).name}
                      </option>
                    ))}
                  </select>
                  <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-ink-soft">▾</span>
                </label>
              )}
            </div>
          </div>
        </div>

        <div className="mt-3 space-y-2">
          {entry.sets.map((set, j) => (
            <SetRow
              key={j}
              index={j}
              set={set}
              exercise={ex}
              onChange={(patch) => onSetChange(exIndex, j, patch)}
            />
          ))}
        </div>
      </div>
    </Card>
  )
}
