import { useEffect, useState } from 'react'

export default function useElapsed(startedAt) {
  const [elapsed, setElapsed] = useState(() =>
    startedAt ? Math.floor((Date.now() - new Date(startedAt)) / 1000) : 0
  )
  useEffect(() => {
    if (!startedAt) return
    const id = setInterval(() => {
      setElapsed(Math.floor((Date.now() - new Date(startedAt)) / 1000))
    }, 1000)
    return () => clearInterval(id)
  }, [startedAt])
  return elapsed
}
