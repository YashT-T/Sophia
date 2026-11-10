import { useState } from 'react'
import Modal from '../Modal'
import { ymd } from '../../lib/time'

export default function WorkoutForm({ initial, onSave, onClose }) {
  const [f, setF] = useState({ title: initial?.title || '', minutes: initial?.minutes || 30, day: initial?.day || ymd(new Date()) })
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value })
  return (
    <Modal title={initial ? 'Edit activity' : 'Add activity'} onClose={onClose}>
      <form className="form" onSubmit={(e) => { e.preventDefault(); onSave({ ...f, minutes: Number(f.minutes) }) }}>
        <label>Activity<input className="input" required value={f.title} onChange={set('title')} placeholder="Evening walk" /></label>
        <label>Minutes<input className="input" type="number" min="1" required value={f.minutes} onChange={set('minutes')} /></label>
        <label>Date<input className="input" type="date" required value={f.day} onChange={set('day')} /></label>
        <button className="btn primary">Save activity</button>
      </form>
    </Modal>
  )
}
