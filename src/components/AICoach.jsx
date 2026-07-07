import { useState } from 'react'
import { useWorkout } from '../store/WorkoutContext.jsx'
import Card from './Card.jsx'
import { buildCoachPayload, requestCoachAnalysis } from '../lib/coach.js'

// Inline **bold** → <strong>.
function inline(text, keyBase) {
  return text.split(/(\*\*[^*]+\*\*)/g).map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={`${keyBase}-${i}`}>{part.slice(2, -2)}</strong>
    }
    return <span key={`${keyBase}-${i}`}>{part}</span>
  })
}

// Minimal markdown → React (headers, bullets, bold, paragraphs).
function renderAnalysis(text) {
  const out = []
  text.split('\n').forEach((raw, i) => {
    const line = raw.trim()
    if (!line) return
    const key = `l${i}`
    if (/^#{1,3}\s+/.test(line)) {
      out.push(<h3 key={key} className="mt-3 text-sm font-bold">{inline(line.replace(/^#{1,3}\s+/, ''), key)}</h3>)
    } else if (/^\*\*[^*]+\*\*:?$/.test(line)) {
      out.push(<h3 key={key} className="mt-3 text-sm font-bold">{line.replace(/\*\*/g, '').replace(/:$/, '')}</h3>)
    } else if (/^[-*]\s+/.test(line)) {
      out.push(
        <div key={key} className="flex gap-2">
          <span className="text-ink-soft">•</span>
          <span className="flex-1">{inline(line.replace(/^[-*]\s+/, ''), key)}</span>
        </div>,
      )
    } else {
      out.push(<p key={key}>{inline(line, key)}</p>)
    }
  })
  return out
}

export default function AICoach() {
  const { sessions, profile } = useWorkout()
  const [status, setStatus] = useState('idle') // idle | loading | done | error
  const [text, setText] = useState('')
  const [error, setError] = useState('')

  const noData = sessions.length === 0

  const run = async () => {
    setStatus('loading')
    setError('')
    try {
      const analysis = await requestCoachAnalysis(buildCoachPayload(sessions, profile))
      setText(analysis)
      setStatus('done')
    } catch (e) {
      setError(e.message || 'Something went wrong.')
      setStatus('error')
    }
  }

  return (
    <Card className="mb-5 p-4">
      <div className="mb-1 flex items-center gap-2">
        <span className="text-lg">🤖</span>
        <h2 className="text-lg font-bold">AI Coach</h2>
      </div>
      <p className="mb-3 text-xs text-ink-soft">
        A personalised review of your progress, programme and next steps — powered by Claude.
      </p>

      {status !== 'done' && (
        <button
          onClick={run}
          disabled={noData || status === 'loading'}
          className="w-full rounded-2xl py-3 text-sm font-bold text-white transition active:scale-[0.99] disabled:opacity-50"
          style={{ background: 'var(--color-blue)' }}
        >
          {status === 'loading'
            ? 'Analysing your training…'
            : noData
              ? 'Log a session first'
              : 'Analyse my progress'}
        </button>
      )}

      {status === 'error' && (
        <p className="mt-3 rounded-xl bg-orange/10 px-3 py-2 text-xs font-medium text-orange">{error}</p>
      )}

      {status === 'done' && (
        <>
          <div className="text-sm leading-relaxed [&>*+*]:mt-1.5">{renderAnalysis(text)}</div>
          <button onClick={run} className="mt-3 text-xs font-semibold" style={{ color: 'var(--color-blue)' }}>
            ↻ Re-analyse
          </button>
        </>
      )}
    </Card>
  )
}
