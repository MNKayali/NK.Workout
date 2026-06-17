// One-off: fetch Free Exercise DB (public domain / Unlicense), match our 19 exercises
// by keyword, and download start/end demo photos into public/images/exercises/<id>/.
// Run: node scripts/fetch-exercise-images.mjs
import { mkdir, writeFile } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import path from 'node:path'

const DB = 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/dist/exercises.json'
const IMG_BASE = 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/'
const OUT = path.resolve('public/images/exercises')

// our id -> ordered list of name-match candidates (first hit wins, case-insensitive substring)
const WANT = {
  db_chest_press: ['Dumbbell Bench Press', 'Flat Bench Dumbbell'],
  incline_db: ['Incline Dumbbell Press'],
  overhead_press: ['Standing Dumbbell Press', 'Dumbbell Shoulder Press', 'Machine Shoulder', 'Standing Military Press'],
  pec_dec: ['Butterfly', 'Pec Deck', 'Machine Bench Press'],
  lateral_raise: ['Side Lateral Raise', 'Seated Side Lateral Raise', 'Lateral Raise'],
  tricep_pushdown: ['Triceps Pushdown', 'Triceps Pushdown - Rope Attachment', 'Pushdown'],
  lat_pulldown: ['Wide-Grip Lat Pulldown', 'Lat Pulldown', 'Pulldown'],
  seated_row: ['Seated Cable Rows', 'Seated Cable Row', 'Machine Row'],
  db_row: ['One-Arm Dumbbell Row', 'Dumbbell Row'],
  db_curl: ['Dumbbell Bicep Curl', 'Dumbbell Curl', 'Standing Dumbbell Curl'],
  preacher_curl: ['Preacher Curl', 'Barbell Preacher Curl'],
  leg_press: ['Leg Press', 'Leg Press '],
  leg_curl: ['Lying Leg Curls', 'Seated Leg Curl', 'Leg Curl'],
  leg_ext: ['Leg Extensions', 'Leg Extension'],
  ball_crunch: ['Exercise Ball Crunch', 'Ball Crunch', 'Crunches'],
  cable_crunch: ['Cable Crunch', 'Kneeling Cable Crunch'],
  arc: ['Elliptical Trainer', 'Elliptical', 'Stairmaster'],
  smith_press: ['Smith Machine Bench Press', 'Smith Machine'],
  cable_fly: ['Cable Crossover', 'Cable Fly', 'Cable Chest'],
}

const norm = (s) => s.trim().toLowerCase()

const res = await fetch(DB)
if (!res.ok) throw new Error(`DB fetch failed: ${res.status}`)
const all = await res.json()
console.log(`Loaded ${all.length} exercises from DB`)

const manifest = {}
const report = []

for (const [ourId, candidates] of Object.entries(WANT)) {
  let match = null
  // Pass 1: exact name match (case-insensitive). Pass 2: substring fallback.
  for (const cand of candidates) {
    match = all.find((e) => norm(e.name) === norm(cand) && e.images?.length)
    if (match) break
  }
  if (!match) {
    for (const cand of candidates) {
      match = all.find((e) => norm(e.name).includes(norm(cand)) && e.images?.length)
      if (match) break
    }
  }
  if (!match) {
    report.push(`MISS  ${ourId} (tried: ${candidates.join(' | ')})`)
    continue
  }
  const dir = path.join(OUT, ourId)
  await mkdir(dir, { recursive: true })
  const imgs = match.images.slice(0, 2)
  for (let i = 0; i < imgs.length; i++) {
    const url = IMG_BASE + imgs[i]
    const r = await fetch(url)
    if (!r.ok) { report.push(`IMGFAIL ${ourId} ${url} ${r.status}`); continue }
    const buf = Buffer.from(await r.arrayBuffer())
    await writeFile(path.join(dir, `${i}.jpg`), buf)
  }
  manifest[ourId] = { name: match.name, photo: `/images/exercises/${ourId}/0.jpg`, photo2: imgs.length > 1 ? `/images/exercises/${ourId}/1.jpg` : null }
  report.push(`OK    ${ourId} <- "${match.name}" (${imgs.length} img)`)
}

await writeFile(path.resolve('scripts/match-report.json'), JSON.stringify(manifest, null, 2))
console.log('\n' + report.join('\n'))
console.log(`\nMatched ${Object.keys(manifest).length}/${Object.keys(WANT).length}`)
