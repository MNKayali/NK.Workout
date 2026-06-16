// The three day templates. `type` drives calendar dot colour & accent.
export const SESSIONS = {
  push: {
    type: 'push',
    title: 'Push Day',
    subtitle: 'Chest · Shoulders · Triceps',
    color: 'blue',
    exercises: [
      'db_chest_press',
      'incline_db',
      'overhead_press',
      'pec_dec',
      'lateral_raise',
      'tricep_pushdown',
    ],
  },
  pull: {
    type: 'pull',
    title: 'Pull Day',
    subtitle: 'Back · Biceps · Core',
    color: 'orange',
    exercises: [
      'lat_pulldown',
      'seated_row',
      'db_row',
      'db_curl',
      'preacher_curl',
      'ball_crunch',
    ],
  },
  legs: {
    type: 'legs',
    title: 'Legs + Core',
    subtitle: 'Knee-safe Legs · Core · Cardio',
    color: 'green',
    exercises: [
      'leg_press',
      'leg_curl',
      'leg_ext',
      'ball_crunch',
      'cable_crunch',
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
