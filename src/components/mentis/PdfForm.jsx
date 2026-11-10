import { useState } from 'react'
import Modal from '../Modal'

export default function PdfForm({ categories, onSave, onClose, onManage }) {
  const [file, setFile] = useState(null)
  const [title, setTitle] = useState('')
  const [category_id, setCat] = useState(categories[0]?.id || '')
  const [due_date, setDue] = useState('')
  const [busy, setBusy] = useState(false)

  const pick = (e) => { const f = e.target.files[0]; setFile(f); if (f && !title) setTitle(f.name.replace(/\.pdf$/i, '')) }
  const submit = async (e) => { e.preventDefault(); setBusy(true); await onSave({ file, title, category_id, due_date }); setBusy(false) }

  return (
    <Modal title="Add a PDF" onClose={onClose}>
      <form className="form" onSubmit={submit}>
        <label>PDF file from your device<input className="input" type="file" accept="application/pdf" required onChange={pick} /></label>
        <label>Title<input className="input" required value={title} onChange={(e) => setTitle(e.target.value)} /></label>
        <label>Category
          <select className="input" value={category_id} onChange={(e) => setCat(e.target.value)}>
            <option value="">No category</option>
            {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </label>
        <button type="button" className="link" onClick={onManage}>Edit categories</button>
        <label>Finish by<input className="input" type="date" value={due_date} onChange={(e) => setDue(e.target.value)} /></label>
        <button className="btn primary" disabled={busy}>{busy ? 'Uploading…' : 'Add PDF'}</button>
      </form>
    </Modal>
  )
}
