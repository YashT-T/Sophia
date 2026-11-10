import { useState } from 'react'
import { Pencil, Plus, Trash2 } from 'lucide-react'
import { useTable } from '../hooks/useTable'
import { useCompletion } from '../hooks/useCompletion'
import PageHeader from '../components/PageHeader'
import TitleForm from '../components/celluloid/TitleForm'

export default function Celluloid() {
  const { rows, insert, update, remove } = useTable('titles', 'created_at')
  const toggle = useCompletion(update)
  const [tab, setTab] = useState('watchlist')
  const [format, setFormat] = useState('All')
  const [form, setForm] = useState(null)

  const shown = rows.filter((t) => (tab === 'watched' ? t.done : !t.done) && (format === 'All' || t.format === format))
  const save = async (v) => { form.id ? await update(form.id, v) : await insert(v); setForm(null) }
  const month = (t) => new Date(t.completed_at).toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })
  const groups = tab === 'watched' ? [...new Set(shown.map(month))] : [null]

  return (
    <>
      <PageHeader title="CELLULOID" subtitle="Stories & watchlist" />
      <div className="row wrap gap">
        {['watchlist', 'watched'].map((t) => <button key={t} className={`chip ${tab === t ? 'on' : ''}`} onClick={() => setTab(t)}>{t === 'watchlist' ? 'Watchlist' : 'Watched'}</button>)}
        <span className="grow" />
        {['All', 'Movie', 'Series', 'Anime'].map((f) => <button key={f} className={`chip ${format === f ? 'on' : ''}`} onClick={() => setFormat(f)}>{f}</button>)}
      </div>
      <div className="row between"><h2>{tab === 'watchlist' ? 'Your watchlist' : 'Watched'} <small className="muted">{shown.length} titles</small></h2>
        <button className="btn small primary" onClick={() => setForm({})}><Plus size={14} /> Add a title</button></div>
      {!shown.length && <p className="muted">Nothing here yet.</p>}
      {groups.map((g) => (
        <section key={g || 'all'}>
          {g && <h3>{g}</h3>}
          <div className="grid3">
            {shown.filter((t) => !g || month(t) === g).map((t) => (
              <div key={t.id} className="card title-card">
                <small>{t.format}{t.genre ? ` · ${t.genre}` : ''}</small>
                <h3>{t.title}</h3>
                {t.notes && <p className="muted">{t.notes}</p>}
                <div className="row gap">
                  <button className="btn small primary grow" onClick={() => toggle(t)}>{t.done ? 'Move back' : 'Mark watched · +2 XP'}</button>
                  <button className="icon-btn" onClick={() => setForm(t)} aria-label="Edit"><Pencil size={15} /></button>
                  <button className="icon-btn" onClick={() => remove(t.id)} aria-label="Delete"><Trash2 size={15} /></button>
                </div>
              </div>
            ))}
          </div>
        </section>
      ))}
      {form && <TitleForm initial={form.id ? form : null} onSave={save} onClose={() => setForm(null)} />}
    </>
  )
}
