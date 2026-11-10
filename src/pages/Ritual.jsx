import { useState } from 'react'
import { Plus } from 'lucide-react'
import { useTable } from '../hooks/useTable'
import { useCompletion } from '../hooks/useCompletion'
import { useOverduePenalty } from '../hooks/useOverduePenalty'
import { useTick } from '../hooks/useTick'
import { taskStatus } from '../lib/time'
import PageHeader from '../components/PageHeader'
import StatCard from '../components/StatCard'
import TaskForm from '../components/ritual/TaskForm'
import TaskItem from '../components/ritual/TaskItem'

// Priority order: overdue first, then in progress, then pending (soonest deadline first), completed last.
const RANK = { overdue: 0, 'in-progress': 1, pending: 2, completed: 3 }
const getDue = (t) => new Date(t.due_at)

export default function Ritual() {
  useTick(30000)
  const { rows, insert, update, remove, load } = useTable('tasks')
  const toggle = useCompletion(update, getDue)
  useOverduePenalty('tasks', rows, getDue, load)
  const [form, setForm] = useState(null)

  const sorted = [...rows].sort((a, b) => RANK[taskStatus(a)] - RANK[taskStatus(b)] || getDue(a) - getDue(b))
  const count = (...s) => rows.filter((t) => s.includes(taskStatus(t))).length
  const save = async (v) => { form.id ? await update(form.id, v) : await insert(v); setForm(null) }

  return (
    <>
      <PageHeader title="RITUAL" subtitle="Daily planning" />
      <div className="grid3">
        <StatCard label="Pending" value={count('pending', 'in-progress')} />
        <StatCard label="Completed" value={count('completed')} />
        <StatCard label="Overdue" value={count('overdue')} />
      </div>
      <div className="card">
        <div className="row between"><h2>Your tasks</h2><button className="btn small primary" onClick={() => setForm({})}><Plus size={14} /> Add a task</button></div>
        {!sorted.length && <p className="muted">No tasks yet. Add one with a deadline.</p>}
        {sorted.map((t) => <TaskItem key={t.id} task={t} onToggle={toggle} onEdit={setForm} onDelete={remove} />)}
      </div>
      {form && <TaskForm initial={form.id ? form : null} onSave={save} onClose={() => setForm(null)} />}
    </>
  )
}
