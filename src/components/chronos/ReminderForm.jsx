import { useState } from 'react'
import Modal from '../Modal'
import { hm, ymd } from '../../lib/time'

export default function ReminderForm({ initial, defaultDate, onSave, onClose }) {
  const at = initial ? new Date(initial.remind_at) : null
  const [title, setTitle] = useState(initial?.title || '')
  const [date, setDate] = useState(at ? ymd(at) : defaultDate)
  const [time, setTime] = useState(at ? hm(at) : '07:15')
  const [mode, setMode] = useState(initial?.mode || 'popup')

  return (
    <Modal title={initial ? 'Edit reminder' : 'Add a reminder'} onClose={onClose}>
      <form className="form" onSubmit={(e) => { e.preventDefault(); onSave({ title, mode, remind_at: new Date(`${date}T${time}`).toISOString(), fired: false }) }}>
        <label>Reminder<input className="input" required value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Morning reading" /></label>
        <div className="row gap">
          <label className="grow">Date<input className="input" type="date" required value={date} onChange={(e) => setDate(e.target.value)} /></label>
          <label>Time<input className="input" type="time" required value={time} onChange={(e) => setTime(e.target.value)} /></label>
        </div>
        <label>How should it alert you?
          <select className="input" value={mode} onChange={(e) => setMode(e.target.value)}>
            <option value="popup">Pop-up notification</option>
            <option value="ring">Ring (sound + vibration)</option>
          </select>
        </label>
        <button className="btn primary">Save reminder</button>
      </form>
    </Modal>
  )
}
