// Real demonstration photos for each exercise, sourced from the Free Exercise DB
// (https://github.com/yuhonas/free-exercise-db, Unlicense / public domain) and bundled
// locally under public/images/exercises/<id>/. `photo` is the primary still (start position),
// `photo2` the end position. Exercises absent from this map fall back to a figure illustration.
//
// Regenerate with: node scripts/fetch-exercise-images.mjs
export const EXERCISE_MEDIA = {
  db_chest_press: { source: 'Dumbbell Bench Press', photo: '/images/exercises/db_chest_press/0.jpg', photo2: '/images/exercises/db_chest_press/1.jpg' },
  incline_db: { source: 'Incline Dumbbell Press', photo: '/images/exercises/incline_db/0.jpg', photo2: '/images/exercises/incline_db/1.jpg' },
  overhead_press: { source: 'Standing Dumbbell Press', photo: '/images/exercises/overhead_press/0.jpg', photo2: '/images/exercises/overhead_press/1.jpg' },
  pec_dec: { source: 'Butterfly', photo: '/images/exercises/pec_dec/0.jpg', photo2: '/images/exercises/pec_dec/1.jpg' },
  lateral_raise: { source: 'Side Lateral Raise', photo: '/images/exercises/lateral_raise/0.jpg', photo2: '/images/exercises/lateral_raise/1.jpg' },
  tricep_pushdown: { source: 'Triceps Pushdown', photo: '/images/exercises/tricep_pushdown/0.jpg', photo2: '/images/exercises/tricep_pushdown/1.jpg' },
  lat_pulldown: { source: 'Wide-Grip Lat Pulldown', photo: '/images/exercises/lat_pulldown/0.jpg', photo2: '/images/exercises/lat_pulldown/1.jpg' },
  seated_row: { source: 'Seated Cable Rows', photo: '/images/exercises/seated_row/0.jpg', photo2: '/images/exercises/seated_row/1.jpg' },
  db_row: { source: 'One-Arm Dumbbell Row', photo: '/images/exercises/db_row/0.jpg', photo2: '/images/exercises/db_row/1.jpg' },
  db_curl: { source: 'Dumbbell Bicep Curl', photo: '/images/exercises/db_curl/0.jpg', photo2: '/images/exercises/db_curl/1.jpg' },
  preacher_curl: { source: 'Preacher Curl', photo: '/images/exercises/preacher_curl/0.jpg', photo2: '/images/exercises/preacher_curl/1.jpg' },
  leg_press: { source: 'Leg Press', photo: '/images/exercises/leg_press/0.jpg', photo2: '/images/exercises/leg_press/1.jpg' },
  leg_curl: { source: 'Lying Leg Curls', photo: '/images/exercises/leg_curl/0.jpg', photo2: '/images/exercises/leg_curl/1.jpg' },
  leg_ext: { source: 'Leg Extensions', photo: '/images/exercises/leg_ext/0.jpg', photo2: '/images/exercises/leg_ext/1.jpg' },
  ball_crunch: { source: 'Exercise Ball Crunch', photo: '/images/exercises/ball_crunch/0.jpg', photo2: '/images/exercises/ball_crunch/1.jpg' },
  cable_crunch: { source: 'Cable Crunch', photo: '/images/exercises/cable_crunch/0.jpg', photo2: '/images/exercises/cable_crunch/1.jpg' },
  arc: { source: 'Elliptical Trainer', photo: '/images/exercises/arc/0.jpg', photo2: '/images/exercises/arc/1.jpg' },
  chest_press_machine: { source: 'Leverage Chest Press', photo: '/images/exercises/chest_press_machine/0.jpg', photo2: '/images/exercises/chest_press_machine/1.jpg' },
  smith_press: { source: 'Smith Machine Bench Press', photo: '/images/exercises/smith_press/0.jpg', photo2: '/images/exercises/smith_press/1.jpg' },
  cable_fly: { source: 'Cable Crossover', photo: '/images/exercises/cable_fly/0.jpg', photo2: '/images/exercises/cable_fly/1.jpg' },
}

export const getMedia = (id) => EXERCISE_MEDIA[id] || null
