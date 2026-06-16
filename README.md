# NK Gym Tracker

A clean, mobile-first workout tracker for Nabil's Push / Pull / Legs split at
Arden Club, Solihull. Built with React + Vite + Tailwind, persisting to
`localStorage` (no backend). Deployed on Netlify.

## Features

- **Home** — greeting, weekly stats (sessions · this week · 3× goal), three session
  cards, and recent sessions.
- **Workout** — single scrollable session: per-exercise illustration, muscle-highlight
  diagram, machine name, swap dropdown, and per-set tick + weight stepper + rep chips
  (no typing). Sticky progress + save bar. Weights auto-prefill from your last session.
- **Progress** — monthly calendar with coloured dots (Blue Push / Orange Pull / Green
  Legs), per-exercise strength trend bars (last 8 sessions), and full session list.
- **Muscles** — full-body diagram of this week's worked muscles, recovery grid
  (Ready / Recovering / Fatigued), and "Recommended today" ranking.
- **Equipment** — filter tabs (All / Machines / Free Weights / Cardio) with status dots.
- **Session detail** — edit any weight/reps (auto-saves), remove exercises, delete sessions.

## Develop

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production build -> dist/
```

## Deploy

Netlify builds from this repo (`npm run build` → `dist/`, see `netlify.toml`).
Push to `main` and Netlify auto-deploys to https://nkworkoutapp.netlify.app.

## Data

All data lives in the browser under the `localStorage` key `nk_gym_v3`. No accounts,
no server. The workout plan and exercise/swap definitions live in `src/data/`.
