import { Link } from 'react-router-dom'
import { ChevronLeft } from 'lucide-react'
export default function PageHeader({ title, subtitle }) {
  return (
    <header className="page-head">
      <Link to="/" className="btn small"><ChevronLeft size={14} /> Dashboard</Link>
      <h1>{title}</h1>
      <p className="muted">{subtitle}</p>
      <div className="banner"><span>Finish on time: +2 XP. Miss the deadline: −4 XP.</span><b>+2 XP</b></div>
    </header>
  )
}
