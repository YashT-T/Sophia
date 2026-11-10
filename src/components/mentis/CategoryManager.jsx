import { useState } from 'react'
import { Trash2 } from 'lucide-react'
import Modal from '../Modal'

// Add, rename (edit then click away) and delete categories.
export default function CategoryManager({ categories, onAdd, onRename, onRemove, onClose }) {
  const [name, setName] = useState('')
  const [edits, setEdits] = useState({})
  return (
    <Modal title="Edit categories" onClose={onClose}>
      {categories.map((c) => (
        <div key={c.id} className="item">
          <input className="input grow" value={edits[c.id] ?? c.name}
            onChange={(e) => setEdits({ ...edits, [c.id]: e.target.value })}
            onBlur={() => edits[c.id] && edits[c.id] !== c.name && onRename(c.id, edits[c.id].trim())} />
          <button className="icon-btn" onClick={() => confirm(`Delete "${c.name}"? PDFs in it stay, uncategorised.`) && onRemove(c.id)} aria-label="Delete"><Trash2 size={15} /></button>
        </div>
      ))}
      <form className="row gap" onSubmit={(e) => { e.preventDefault(); if (name.trim()) { onAdd(name.trim()); setName('') } }}>
        <input className="input grow" value={name} onChange={(e) => setName(e.target.value)} placeholder="New category" />
        <button className="btn small primary">Add</button>
      </form>
    </Modal>
  )
}
