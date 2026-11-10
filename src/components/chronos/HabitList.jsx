import { useState } from 'react'
import { Trash2 } from 'lucide-react'
import { ymd } from '../../lib/time'
import { useProfile } from '../../context/ProfileContext'
import { REWARD } from '../../lib/xp'

export default function HabitList({ habits, insert, update, remove }) {
  const { addXp } = useProfile()
  const [title, setTitle] = useState('')
  const today = ymd(new Date())
  const yesterday = ymd(new Date(Date.now() - 864e5))

  const markDone = async (h) => {
    if (h.last_done === today) return
    await update(h.id, { last_done: today, streak: h.last_done === yesterday ? h.streak + 1 : 1 })
    await addXp(REWARD)
  }
  const add = async (e) => { e.preventDefault(); if (!title.trim()) return; await insert({ title: title.trim() }); setTitle('') }

  return (
    <div className="card">
      <h2>A small promise, kept.</h2>
      {habits.map((h) => (
        <div key={h.id} className="item">
          <div className="grow">{h.title}<small className="muted block">{h.streak || 0} day streak</small></div>
          <button className="btn small" disabled={h.last_done === today} onClick={() => markDone(h)}>{h.last_done === today ? 'Done today' : 'Done +2 XP'}</button>
          <button className="icon-btn" onClick={() => remove(h.id)} aria-label="Delete"><Trash2 size={15} /></button>
        </div>
      ))}
      <form className="row gap" onSubmit={add}>
        <input className="input grow" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="New habit, e.g. Read for 20 minutes" />
        <button className="btn small primary">Add</button>
      </form>
    </div>
  )
}
