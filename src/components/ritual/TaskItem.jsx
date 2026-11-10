import { Pencil, Trash2 } from 'lucide-react'
import StatusPill from '../StatusPill'
import { fmtDue, taskStatus } from '../../lib/time'

export default function TaskItem({ task, onToggle, onEdit, onDelete }) {
  const status = taskStatus(task)
  return (
    <div className={`item ${status}`}>
      <input type="checkbox" checked={task.done} onChange={() => onToggle(task)} />
      <div className="grow"><span className="title">{task.title}</span><small className="muted block">{fmtDue(task.due_at)}</small></div>
      <StatusPill status={status} />
      <button className="icon-btn" onClick={() => onEdit(task)} aria-label="Edit"><Pencil size={15} /></button>
      <button className="icon-btn" onClick={() => onDelete(task.id)} aria-label="Delete"><Trash2 size={15} /></button>
    </div>
  )
}
