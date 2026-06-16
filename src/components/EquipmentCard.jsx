import Card from './Card.jsx'
import ExerciseIllustration from './ExerciseIllustration.jsx'

// One machine/equipment item with illustration, machine name, exercise name + status dot.
export default function EquipmentCard({ exerciseId, name, machine }) {
  return (
    <Card className="flex items-center gap-3 p-3">
      <ExerciseIllustration exerciseId={exerciseId} className="h-14 w-14 shrink-0" />
      <div className="min-w-0 flex-1">
        <div className="truncate text-sm font-bold">{machine}</div>
        <div className="truncate text-xs text-ink-soft">{name}</div>
      </div>
      <div className="flex shrink-0 items-center gap-1.5">
        <span className="h-2 w-2 rounded-full bg-green shadow-[0_0_0_3px_rgba(52,199,89,0.15)]" />
        <span className="text-[11px] font-semibold text-green">Online</span>
      </div>
    </Card>
  )
}
