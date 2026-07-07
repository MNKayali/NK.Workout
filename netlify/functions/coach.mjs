// Netlify serverless function — server-side proxy to the Claude (Anthropic) API.
//
// The ANTHROPIC_API_KEY is read from the Netlify environment here and is NEVER
// exposed to the browser. The frontend POSTs a compact training summary to
// /.netlify/functions/coach and gets back a text analysis.
//
// Setup (one time): in Netlify → Site settings → Environment variables, add
//   ANTHROPIC_API_KEY = sk-ant-...      then redeploy.

const MODEL = 'claude-opus-4-8' // swap to 'claude-sonnet-5' for lower cost/latency
const ANTHROPIC_URL = 'https://api.anthropic.com/v1/messages'

const SYSTEM = `You are an experienced strength & conditioning coach reviewing a client's training log from their gym-tracker app.

Context you MUST respect in every suggestion:
- Goal: general fitness and fat loss.
- Real knee constraint: NO squats, lunges, step-ups, jumping, or high-impact work. Knee-safe lower body only (leg press with feet high, hip thrust, glute bridge, seated leg curl, TRX hamstring curl, standing/slant-board calf raise, and low-impact cardio like the Arc trainer).
- Programme style: Push / Pull / Legs, intermediate lifter, gym uses 2.5 kg plate increments.

Write a concise, encouraging, practical review of the data provided. Be specific — name exercises, weights, and rep targets, and give concrete next steps (e.g. "add 2.5 kg on leg press once you hit 15 reps"). Every recommendation must stay knee-safe. Keep it under ~350 words. Use short markdown sections, each with a bold header, and use bullet points. Do not invent data that wasn't provided; if history is thin, say what to focus on next.`

export default async (req) => {
  if (req.method !== 'POST') return json({ error: 'Method not allowed' }, 405)

  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) {
    return json(
      { error: 'The AI coach isn’t configured yet. Add ANTHROPIC_API_KEY in your Netlify site settings, then redeploy.' },
      503,
    )
  }

  let payload
  try {
    payload = await req.json()
  } catch {
    return json({ error: 'Invalid request body.' }, 400)
  }

  const userContent =
    "Here is the client's training data as JSON. Review it and give your coaching analysis.\n\n" +
    '```json\n' +
    JSON.stringify(payload, null, 2) +
    '\n```'

  try {
    const r = await fetch(ANTHROPIC_URL, {
      method: 'POST',
      headers: {
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json',
      },
      // No `thinking` field → Opus 4.8 responds without extended thinking, which
      // keeps latency comfortably inside Netlify's function timeout.
      body: JSON.stringify({
        model: MODEL,
        max_tokens: 1200,
        system: SYSTEM,
        messages: [{ role: 'user', content: userContent }],
      }),
    })

    if (!r.ok) {
      const detail = await r.text()
      return json({ error: `Claude API error (${r.status}).`, detail: detail.slice(0, 400) }, 502)
    }

    const data = await r.json()
    const analysis = (data.content || [])
      .filter((b) => b.type === 'text')
      .map((b) => b.text)
      .join('\n')
      .trim()

    if (!analysis) return json({ error: 'The coach returned an empty response. Try again.' }, 502)
    return json({ analysis })
  } catch (e) {
    return json({ error: 'Could not reach the Claude API.', detail: String(e).slice(0, 300) }, 502)
  }
}

function json(obj, status = 200) {
  return new Response(JSON.stringify(obj), {
    status,
    headers: { 'content-type': 'application/json' },
  })
}
