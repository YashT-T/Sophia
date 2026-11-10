import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
export default function ProtectedRoute({ children }) {
  const { session } = useAuth()
  if (session === undefined) return <p className="center muted">Loading…</p>
  return session ? children : <Navigate to="/login" replace />
}
