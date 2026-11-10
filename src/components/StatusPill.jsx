const LABEL = { completed: 'Completed', 'in-progress': 'In progress', pending: 'Pending', overdue: 'Overdue' }
export default function StatusPill({ status }) {
  return <span className={`pill ${status}`}>{LABEL[status]}</span>
}
