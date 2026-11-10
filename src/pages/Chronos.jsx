import { useState } from 'react'
import { Bell, BellRing, Pencil, Plus, Trash2 } from 'lucide-react'
import { useTable } from '../hooks/useTable'
import { fmtDue, ymd } from '../lib/time'
import PageHeader from '../components/PageHeader'
import MonthCalendar from '../components/chronos/MonthCalendar'
import ReminderForm from '../components/chronos/ReminderForm'
import HabitList from '../components/chronos/HabitList'

export default function Chronos() {
  const reminders = useTable('reminders', 'remind_at')
  const habits = useTable('habits', 'created_at')
  const [month, setMonth] = useState(new Date())
  const [selected, setSelected] = useState(ymd(new Date()))
  const [form, setForm] = useState(null)
  const [perm, setPerm] = useState(typeof Notification === 'undefined' ? 'unsupported' : Notification.permission)

  const marked = new Set(reminders.rows.map((r) => ymd(r.remind_at)))
  const dayList = reminders.rows.filter((r) => ymd(r.remind_at) === selected)
  const save = async (v) => { form.id ? await reminders.update(form.id, v) : await reminders.insert(v); setForm(null) }
  const enable = async () => setPerm(await Notification.requestPermission())

  return (
    <>
      <PageHeader title="CHRONOS" subtitle="Time & habits" />
      <div className="grid2">
        <MonthCalendar month={month} setMonth={setMonth} selected={selected} onSelect={setSelected} marked={marked} />
        <div className="card">
          <div className="row between"><h2>Reminders · {selected}</h2><button className="btn small primary" onClick={() => setForm({})}><Plus size={14} /> Add</button></div>
          {perm === 'default' && <button className="btn small" onClick={enable}><Bell size={14} /> Allow notifications</button>}
          {perm === 'denied' && <p className="msg">Notifications are blocked. Allow them in your browser or phone settings.</p>}
          {!dayList.length && <p className="muted">No reminders this day.</p>}
          {dayList.map((r) => (
            <div key={r.id} className={`item ${r.fired ? 'is-done' : ''}`}>
              {r.mode === 'ring' ? <BellRing size={16} /> : <Bell size={16} />}
              <div className="grow">{r.title}<small className="muted block">{fmtDue(r.remind_at)} · {r.mode === 'ring' ? 'Ring' : 'Pop-up'}{r.fired ? ' · sent' : ''}</small></div>
              <button className="icon-btn" onClick={() => setForm(r)} aria-label="Edit"><Pencil size={15} /></button>
              <button className="icon-btn" onClick={() => reminders.remove(r.id)} aria-label="Delete"><Trash2 size={15} /></button>
            </div>
          ))}
        </div>
      </div>
      <HabitList habits={habits.rows} insert={habits.insert} update={habits.update} remove={habits.remove} />
      {form && <ReminderForm initial={form.id ? form : null} defaultDate={selected} onSave={save} onClose={() => setForm(null)} />}
    </>
  )
}
