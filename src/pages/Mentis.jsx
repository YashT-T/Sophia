import { useState } from 'react'
import { ExternalLink, Plus, Settings2, Trash2 } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'
import { useTable } from '../hooks/useTable'
import { useCompletion } from '../hooks/useCompletion'
import { useOverduePenalty } from '../hooks/useOverduePenalty'
import { useTick } from '../hooks/useTick'
import { daysLeft, endOfDay, fmtDate } from '../lib/time'
import PageHeader from '../components/PageHeader'
import PdfForm from '../components/mentis/PdfForm'
import CategoryManager from '../components/mentis/CategoryManager'

const NEVER = new Date(8.64e15)
const getDue = (p) => (p.due_date ? endOfDay(p.due_date) : NEVER)

export default function Mentis() {
  useTick(60000)
  const { user } = useAuth()
  const pdfs = useTable('pdfs', 'created_at')
  const cats = useTable('categories', 'created_at')
  const toggle = useCompletion(pdfs.update, getDue)
  useOverduePenalty('pdfs', pdfs.rows, getDue, pdfs.load)
  const [filter, setFilter] = useState('all')
  const [modal, setModal] = useState(null) // 'pdf' | 'cats' | 'both'

  const list = pdfs.rows.filter((p) => filter === 'all' || p.category_id === filter)
  const catName = (id) => cats.rows.find((c) => c.id === id)?.name || 'Uncategorised'

  const savePdf = async ({ file, title, category_id, due_date }) => {
    const path = `${user.id}/${Date.now()}-${file.name.replace(/[^\w.-]/g, '_')}`
    const { error } = await supabase.storage.from('pdfs').upload(path, file, { contentType: 'application/pdf' })
    if (error) return alert(error.message)
    await pdfs.insert({ title, category_id: category_id || null, due_date: due_date || null, file_path: path })
    setModal(null)
  }
  const open = async (p) => {
    const { data, error } = await supabase.storage.from('pdfs').createSignedUrl(p.file_path, 3600)
    if (error) return alert(error.message)
    window.open(data.signedUrl, '_blank')
  }
  const del = async (p) => {
    if (!confirm(`Delete "${p.title}"?`)) return
    await supabase.storage.from('pdfs').remove([p.file_path])
    pdfs.remove(p.id)
  }
  const left = (p) => {
    if (p.done) return 'Finished'
    if (!p.due_date) return 'No deadline'
    const d = daysLeft(p.due_date)
    return d < 0 ? 'Overdue' : d === 0 ? 'Due today' : `${d} day${d === 1 ? '' : 's'} left`
  }

  return (
    <>
      <PageHeader title="MENTIS" subtitle="Reading & knowledge" />
      <div className="row wrap gap">
        <button className={`chip ${filter === 'all' ? 'on' : ''}`} onClick={() => setFilter('all')}>All</button>
        {cats.rows.map((c) => <button key={c.id} className={`chip ${filter === c.id ? 'on' : ''}`} onClick={() => setFilter(c.id)}>{c.name}</button>)}
        <button className="chip" onClick={() => setModal('cats')}><Settings2 size={12} /> Edit</button>
      </div>
      <div className="card">
        <div className="row between"><h2>On your desk</h2><button className="btn small primary" onClick={() => setModal('pdf')}><Plus size={14} /> Add PDF</button></div>
        {!list.length && <p className="muted">No PDFs here yet. Add one from your device.</p>}
        {list.map((p) => (
          <div key={p.id} className={`item ${p.done ? 'is-done' : ''}`}>
            <input type="checkbox" checked={p.done} onChange={() => toggle(p)} title="Mark as read" />
            <div className="grow"><span className="title">{p.title}</span><small className="muted block">{catName(p.category_id)}{p.due_date ? ` · ${fmtDate(p.due_date)}` : ''}</small></div>
            <span className={`tag ${!p.done && p.due_date && daysLeft(p.due_date) < 0 ? 'bad' : ''}`}>{left(p)}</span>
            <button className="icon-btn" onClick={() => open(p)} aria-label="Open"><ExternalLink size={15} /></button>
            <button className="icon-btn" onClick={() => del(p)} aria-label="Delete"><Trash2 size={15} /></button>
          </div>
        ))}
      </div>
      {modal === 'pdf' && <PdfForm categories={cats.rows} onSave={savePdf} onClose={() => setModal(null)} onManage={() => setModal('cats')} />}
      {modal === 'cats' && (
        <CategoryManager categories={cats.rows} onClose={() => setModal(null)}
          onAdd={(name) => cats.insert({ name })} onRename={(id, name) => cats.update(id, { name })} onRemove={cats.remove} />
      )}
    </>
  )
}
