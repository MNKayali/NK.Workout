// The three day templates. `type` drives calendar dot colour & accent.
export const SESSIONS = {
  push: {
    type: 'push',
    title: 'Push Day',
    subtitle: 'Chest · Shoulders · Triceps · Core',
    color: 'blue',
    exercises: [
      'db_chest_press',
      'incline_db',
      'overhead_press',
      'lateral_raise',
      'tricep_pushdown',
      'cable_crunch',
      'arc',
    ],
  },
  pull: {
    type: 'pull',
    title: 'Pull Day',
    subtitle: 'Back · Rear Delts · Biceps',
    color: 'orange',
    exercises: [
      'lat_pulldown',
      'seated_row',
      'reverse_pec_dec',
      'db_curl',
      'preacher_curl',
      'ball_crunch',
      'arc',
    ],
  },
  legs: {
    type: 'legs',
    title: 'Legs + Core',
    subtitle: 'Knee-safe Legs · Glutes · Calves · Core',
    color: 'green',
    exercises: [
      'leg_press',
      'leg_curl',
      'hip_thrust',
      'calf_raise',
      'leg_ext',
      'russian_twist',
      'arc',
    ],
  },
}

export const SESSION_ORDER = ['push', 'pull', 'legs']

export const SESSION_COLOR = {
  push: 'var(--color-blue)',
  pull: 'var(--color-orange)',
  legs: 'var(--color-green)',
}

export const getSessionTemplate = (type) => SESSIONS[type]
