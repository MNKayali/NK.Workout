import { useState } from 'react'
import { EXERCISES } from '../data/exercises.js'
import EquipmentCard from '../components/EquipmentCard.jsx'

const TABS = [
  { key: 'all', label: 'All' },
  { key: 'machine', label: 'Machines' },
  { key: 'free', label: 'Free Weights' },
  { key: 'cardio', label: 'Cardio' },
]

export default function Equipment() {
  const [filter, setFilter] = useState('all')
  const items = Object.values(EXERCISES).filter((e) => filter === 'all' || e.equipment === filter)

  return (
    <div className="px-4 pt-5">
      <h1 className="mb-4 text-[28px] font-extrabold">Equipment</h1>

      <div className="mb-4 flex gap-2 overflow-x-auto pb-1">
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => setFilter(t.key)}
            className={`shrink-0 rounded-full px-4 py-2 text-sm font-semibold transition ${
              filter === t.key ? 'bg-blue text-white shadow-[var(--shadow-card)]' : 'bg-surface text-ink-soft'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="space-y-2.5">
        {items.map((e) => (
          <EquipmentCard key={e.id} exerciseId={e.id} name={e.name} machine={e.machine} />
        ))}
      </div>
    </div>
  )
}
