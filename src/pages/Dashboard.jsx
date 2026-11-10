import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useProfile } from '../context/ProfileContext'
import { useTable } from '../hooks/useTable'
import { CURRENTS } from '../config/currents'
import { taskStatus, ymd } from '../lib/time'
import Avatar from '../components/Avatar'
import XpBar from '../components/XpBar'
import LevelModal from '../components/LevelModal'

export default function Dashboard() {
  const { profile } = useProfile()
  const tasks = useTable('tasks').rows
  const workouts = useTable('workouts').rows
  const habits = useTable('habits').rows
  const [showLevels, setShowLevels] = useState(false)
  if (!profile) return <p className="muted">Loading…</p>

  const h = new Date().getHours()
  const greeting = h < 12 ? 'Good morning' : h < 18 ? 'Good afternoon' : 'Good evening'
  const open = tasks.filter((t) => ['pending', 'in-progress'].includes(taskStatus(t))).length
  const todays = workouts.filter((w) => w.day === ymd(new Date()) && !w.hidden)
  const best = Math.max(0, ...habits.map((x) => x.streak || 0))

  return (
    <>
      <section className="card hero-card">
        <div className="row gap"><Avatar size={56} editable />
          <div><small>Your personal ecosystem</small><div>{greeting}, <span className="cursive">{profile.name}</span></div></div></div>
        <button className="xp-click" onClick={() => setShowLevels(true)} aria-label="Show level thresholds">
          <XpBar xp={profile.xp} />
        </button>
      </section>

      <h1 className="big">A life, in orbit.</h1>
      <p className="muted">Five currents. One quieter way forward.</p>
      <div className="grid3 currents">
        {CURRENTS.map(({ to, name, sub, Icon, image }) => (
          <Link key={to} to={to} className="card current">
            <img src={image} alt="" loading="lazy" />
            <Icon size={22} /><b>{name}</b><span className="muted">{sub}</span>
          </Link>
        ))}
      </div>

      <div className="row between"><h2>Today, gently.</h2><small>{new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' })}</small></div>
      <div className="grid3">
        <div className="card"><small>Ritual · today</small><h3>{open} task{open === 1 ? '' : 's'} still in motion</h3></div>
        <div className="card"><small>Evolve · movement</small><h3>{todays.filter((w) => w.done).length} of {todays.length} sessions complete</h3></div>
        <div className="card"><small>Chronos · habit</small><h3>{best ? `A ${best}-day streak` : 'Start a habit streak'}</h3></div>
      </div>

      {showLevels && <LevelModal xp={profile.xp} onClose={() => setShowLevels(false)} />}
    </>
  )
}
