import { useState } from 'react'
import Modal from '../Modal'
import { dayName, hm, ymd } from '../../lib/time'

export default function TaskForm({ initial, onSave, onClose }) {
  const due = initial ? new Date(initial.due_at) : null
  const [title, setTitle] = useState(initial?.title || '')
  const [date, setDate] = useState(due ? ymd(due) : ymd(new Date()))
  const [time, setTime] = useState(due ? hm(due) : '17:00')

  return (
    <Modal title={initial ? 'Edit task' : 'Add a task'} onClose={onClose}>
      <form className="form" onSubmit={(e) => { e.preventDefault(); onSave({ title, due_at: new Date(`${date}T${time}`).toISOString() }) }}>
        <label>Task<input className="input" required value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Read 10 pages" /></label>
        <div className="row gap">
          <label className="grow">Date<input className="input" type="date" required value={date} onChange={(e) => setDate(e.target.value)} /></label>
          <label>Time<input className="input" type="time" required value={time} onChange={(e) => setTime(e.target.value)} /></label>
        </div>
        <p className="muted">Deadline: {dayName(date)}, {date} at {time}</p>
        <button className="btn primary">Save task</button>
      </form>
    </Modal>
  )
}
