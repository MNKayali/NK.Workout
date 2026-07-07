// One-off: validate swap graph + fetch Free Exercise DB photos for the new equipment.
import { mkdir, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { EXERCISES } from '../src/data/exercises.js'

// --- 1. Validate every swap id resolves to a real exercise ---
let broken = 0
for (const ex of Object.values(EXERCISES)) {
  for (const id of ex.swaps || []) {
    if (!EXERCISES[id]) {
      console.log(`BROKEN SWAP: ${ex.id} -> ${id}`)
      broken++
    }
  }
}
console.log(broken === 0 ? '✓ swap graph valid' : `✗ ${broken} broken swaps`)
if (broken > 0) process.exit(1)

// --- 2. Fetch images for the new ids (best-effort; misses fall back to illustration) ---
const DB = 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/dist/exercises.json'
const IMG_BASE = 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/'
const OUT = path.resolve('public/images/exercises')

const WANT = {
  trx_row: ['Suspended Row', 'Inverted Row', 'Bodyweight Row'],
  trx_chest_press: ['Suspended Push-Up', 'Pushups', 'Push-Up'],
  trx_curl: ['Suspended Biceps Curl'],
  trx_y_fly: ['Suspended', 'Scapular'],
  trx_ham_curl: ['Stability Ball Hamstring Curl', 'Ball Leg Curl'],
  knee_raise: ['Hanging Leg Raise', 'Hanging Knee Raise', 'Captains Chair Leg Raise'],
  dip: ['Dips - Triceps Version', 'Dips - Chest Version', 'Triceps Dip'],
  bosu_crunch: ['Crunches', 'Crunch'],
  slant_calf_raise: ['Standing Calf Raises', 'Calf Raise'],
}

const norm = (s) => s.trim().toLowerCase()
const res = await fetch(DB)
if (!res.ok) throw new Error(`DB fetch failed: ${res.status}`)
const all = await res.json()

const manifest = {}
const report = []
for (const [ourId, candidates] of Object.entries(WANT)) {
  let match = null
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
  if (!match) { report.push(`MISS  ${ourId} (falls back to illustration)`); continue }
  const dir = path.join(OUT, ourId)
  await mkdir(dir, { recursive: true })
  const imgs = match.images.slice(0, 2)
  for (let i = 0; i < imgs.length; i++) {
    const r = await fetch(IMG_BASE + imgs[i])
    if (!r.ok) { report.push(`IMGFAIL ${ourId} ${r.status}`); continue }
    await writeFile(path.join(dir, `${i}.jpg`), Buffer.from(await r.arrayBuffer()))
  }
  manifest[ourId] = { name: match.name, photo: `/images/exercises/${ourId}/0.jpg`, photo2: imgs.length > 1 ? `/images/exercises/${ourId}/1.jpg` : null }
  report.push(`OK    ${ourId} <- "${match.name}"`)
}
await writeFile(path.resolve('scripts/new-match-report.json'), JSON.stringify(manifest, null, 2))
console.log('\n' + report.join('\n'))
