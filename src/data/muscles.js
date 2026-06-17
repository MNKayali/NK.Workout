// The six recovery groups shown on the Muscles screen.
export const GROUPS = [
  { id: 'chest', label: 'Chest' },
  { id: 'back', label: 'Back' },
  { id: 'shoulders', label: 'Shoulders' },
  { id: 'arms', label: 'Arms' },
  { id: 'legs', label: 'Legs' },
  { id: 'core', label: 'Core' },
]

export const GROUP_LABEL = Object.fromEntries(GROUPS.map((g) => [g.id, g.label]))

// Finer SVG regions used by BodyDiagram, and which recovery group each belongs to.
export const REGION_GROUP = {
  chest: 'chest',
  shoulders: 'shoulders',
  biceps: 'arms',
  triceps: 'arms',
  forearms: 'arms',
  abs: 'core',
  obliques: 'core',
  quads: 'legs',
  hamstrings: 'legs',
  glutes: 'legs',
  calves: 'legs',
  lats: 'back',
  traps: 'back',
  lower_back: 'back',
}

// Hours until a muscle group is considered fully recovered.
export const FULL_RECOVERY_HOURS = 72

// Recovery % -> status badge.
export function recoveryStatus(pct) {
  if (pct < 40) return { key: 'fatigued', label: 'Fatigued', color: 'orange' }
  if (pct < 90) return { key: 'recovering', label: 'Recovering', color: 'blue' }
  return { key: 'ready', label: 'Ready', color: 'green' }
}
