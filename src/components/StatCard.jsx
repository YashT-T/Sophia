export default function StatCard({ label, value }) {
  return <div className="card stat"><small>{label}</small><strong>{value}</strong></div>
}
