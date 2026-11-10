import { useState } from 'react'
import { Pencil, Plus, Repeat, Trash2 } from 'lucide-react'
import { useTable } from '../hooks/useTable'
import { useCompletion } from '../hooks/useCompletion'
import { useDailyPlanTask } from '../hooks/useDailyPlanTask'
import { useTick } from '../hooks/useTick'
import { REWARD } from '../lib/xp'
import { ymd } from '../lib/time'
import PageHeader from '../components/PageHeader'
import StatCard from '../components/StatCard'
import WorkoutForm from '../components/evolve/WorkoutForm'
import WeekPlan from '../components/evolve/WeekPlan'
import TrainingChart from '../components/evolve/TrainingChart'

export default function Evolve() {
  useTick(60000) // so "today" rolls over at midnight
  const { rows: all, insert, update, remove, load } = useTable('workouts', 'created_at')
  useDailyPlanTask(load)
  const toggle = useCompletion(update) // workouts have no deadline, so no penalty
  const [form, setForm] = useState(null)

  const rows = all.filter((w) => !w.hidden)
  const today = rows.filter((w) => w.day === ymd(new Date()))
  const done = today.filter((w) => w.done)
  const pct = today.length ? Math.round((done.length / today.length) * 100) : 0
  const firstOpen = today.find((w) => !w.done)

  const save = async (v) => { form.id ? await update(form.id, v) : await insert(v); setForm(null) }
  // Removing today's plan workout hides it (so it isn't re-added); your own workouts are deleted.
  const del = (w) => (w.plan_date ? update(w.id, { hidden: true }) : remove(w.id))

  return (
    <>
      <PageHeader title="EVOLVE" subtitle="Movement & strength" />
      <div className="grid3">
        <StatCard label="Today's activities" value={`${done.length} / ${today.length}`} />
        <StatCard label="Completion" value={`${pct}%`} />
        <StatCard label="XP earned" value={`${done.length * REWARD} XP`} />
      </div>

      <div className="grid2">
        <div className="card">
          <div className="row between"><h2>Today's movement</h2><button className="btn small primary" onClick={() => setForm({})}><Plus size={14} /> Add</button></div>
          <p className="muted hint">Today's plan from "The week ahead" is added here automatically.</p>
          {!today.length && <p className="muted">Nothing planned today. Add one small session.</p>}
          {today.map((w) => (
            <div key={w.id} className={`item ${w.done ? 'is-done' : ''}`}>
              <input type="checkbox" checked={w.done} onChange={() => toggle(w)} />
              <div className="grow"><span>{w.title}</span>{w.plan_date && <Repeat size={12} className="muted" title="From your weekly plan" style={{ marginLeft: 6 }} />}<small className="muted"> · {w.minutes} min</small></div>
              <span className="tag">{w.done ? 'Completed' : w === firstOpen ? 'Up next' : 'Planned'}</span>
              <button className="icon-btn" onClick={() => setForm(w)} aria-label="Edit"><Pencil size={15} /></button>
              <button className="icon-btn" onClick={() => del(w)} aria-label="Delete"><Trash2 size={15} /></button>
            </div>
          ))}
        </div>
        <WeekPlan />
      </div>

      <TrainingChart workouts={rows} />
      {form && <WorkoutForm initial={form.id ? form : null} onSave={save} onClose={() => setForm(null)} />}
    </>
  )
}
