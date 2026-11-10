import { useEffect, useState } from 'react'
// Re-renders the page every `ms` so statuses (pending → overdue) update live.
export function useTick(ms = 30000) {
  const [, set] = useState(0)
  useEffect(() => { const t = setInterval(() => set((n) => n + 1), ms); return () => clearInterval(t) }, [ms])
}
