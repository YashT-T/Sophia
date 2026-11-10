import { useEffect, useState } from 'react'
import { Check, Pencil } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../context/AuthContext'
import { DAYS, DEFAULT_PLAN as DEFAULTS } from '../../lib/plan'

// One pencil at the top edits the whole week together. Save writes all seven days at once.
export default function WeekPlan() {
  const { user } = useAuth()
  const [labels, setLabels] = useState(DEFAULTS)
  const [draft, setDraft] = useState(null) // null = just viewing

  useEffect(() => {
    supabase.from('week_plan').select('*').then(({ data }) => {
      if (!data?.length) return
      const next = [...DEFAULTS]
      data.forEach((r) => (next[r.day] = r.label))
      setLabels(next)
    })
  }, [])

  const save = async () => {
    const clean = draft.map((l) => l.trim())
    const rows = clean.map((label, day) => ({ user_id: user.id, day, label }))
    const { error } = await supabase.from('week_plan').upsert(rows, { onConflict: 'user_id,day' })
    if (error) return alert('Could not save: ' + error.message)
    setLabels(clean); setDraft(null)
  }
  const today = (new Date().getDay() + 6) % 7

  return (
    <div className="card">
      <div className="row between">
        <h2>The week ahead</h2>
        {draft ? (
          <div className="row gap">
            <button className="btn small" onClick={() => setDraft(null)}>Cancel</button>
            <button className="btn small primary" onClick={save}><Check size={14} /> Save</button>
          </div>
        ) : (
          <button className="icon-btn" onClick={() => setDraft([...labels])} aria-label="Edit the week"><Pencil size={17} /></button>
        )}
      </div>
      {DAYS.map((d, i) => (
        <div key={d} className={`week-row ${i === today ? 'today' : ''}`}>
          <b>{d}</b>
          {draft ? (
            <input className="week-input" value={draft[i]} placeholder="Add a plan"
              onChange={(e) => setDraft(draft.map((l, j) => (j === i ? e.target.value : l)))}
              onKeyDown={(e) => e.key === 'Enter' && save()} />
          ) : (
            <span className="week-label">{labels[i] || '—'}</span>
          )}
        </div>
      ))}
    </div>
  )
}
