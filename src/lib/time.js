const p = (n) => String(n).padStart(2, '0')
export const ymd = (d) => { const x = new Date(d); return `${x.getFullYear()}-${p(x.getMonth() + 1)}-${p(x.getDate())}` }
export const hm = (d) => { const x = new Date(d); return `${p(x.getHours())}:${p(x.getMinutes())}` }
export const dayName = (s) => (s ? new Date(s + 'T00:00').toLocaleDateString('en-US', { weekday: 'long' }) : '')
export const fmtDue = (d) => new Date(d).toLocaleString('en-GB', { weekday: 'short', day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })
export const fmtDate = (s) => new Date(s + 'T00:00').toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
export const endOfDay = (s) => new Date(s + 'T23:59:59')
export const daysLeft = (s) => Math.ceil((endOfDay(s) - Date.now()) / 864e5) - 1

export const taskStatus = (t) => {
  if (t.done) return 'completed'
  const ms = new Date(t.due_at) - Date.now()
  if (ms < 0) return 'overdue'
  return ms <= 3 * 3600e3 ? 'in-progress' : 'pending'
}
