import { useState } from 'react'
import Modal from '../Modal'

export default function TitleForm({ initial, onSave, onClose }) {
  const [f, setF] = useState({ title: initial?.title || '', format: initial?.format || 'Movie', genre: initial?.genre || '', notes: initial?.notes || '' })
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value })
  return (
    <Modal title={initial ? 'Edit title' : 'Add a title'} onClose={onClose}>
      <form className="form" onSubmit={(e) => { e.preventDefault(); onSave(f) }}>
        <label>Title<input className="input" required value={f.title} onChange={set('title')} /></label>
        <label>Format<select className="input" value={f.format} onChange={set('format')}><option>Movie</option><option>Series</option><option>Anime</option></select></label>
        <label>Genre<input className="input" value={f.genre} onChange={set('genre')} placeholder="Sci-fi" /></label>
        <label>Personal notes<input className="input" value={f.notes} onChange={set('notes')} /></label>
        <button className="btn primary">Save title</button>
      </form>
    </Modal>
  )
}
