import { ChevronLeft, ChevronRight } from 'lucide-react'
import { ymd } from '../../lib/time'

export default function MonthCalendar({ month, setMonth, selected, onSelect, marked }) {
  const first = new Date(month.getFullYear(), month.getMonth(), 1)
  const offset = (first.getDay() + 6) % 7
  const total = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate()
  const shift = (n) => setMonth(new Date(month.getFullYear(), month.getMonth() + n, 1))
  const cells = [...Array(offset).fill(null), ...Array.from({ length: total }, (_, i) => i + 1)]

  return (
    <div className="card">
      <div className="row between">
        <h2>{month.toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })}</h2>
        <div><button className="icon-btn" onClick={() => shift(-1)} aria-label="Previous month"><ChevronLeft size={18} /></button>
          <button className="icon-btn" onClick={() => shift(1)} aria-label="Next month"><ChevronRight size={18} /></button></div>
      </div>
      <div className="cal">
        {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((d, i) => <small key={i}>{d}</small>)}
        {cells.map((d, i) => {
          if (!d) return <span key={i} />
          const key = ymd(new Date(month.getFullYear(), month.getMonth(), d))
          return (
            <button key={i} onClick={() => onSelect(key)}
              className={`day ${key === selected ? 'sel' : ''} ${key === ymd(new Date()) ? 'now' : ''} ${marked.has(key) ? 'has' : ''}`}>{d}</button>
          )
        })}
      </div>
    </div>
  )
}
