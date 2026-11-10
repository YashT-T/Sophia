import { Navigate, Route, Routes } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { ThemeProvider } from './context/ThemeContext'
import ProtectedRoute from './components/ProtectedRoute'
import Layout from './components/Layout'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Evolve from './pages/Evolve'
import Ritual from './pages/Ritual'
import Chronos from './pages/Chronos'
import Mentis from './pages/Mentis'
import Celluloid from './pages/Celluloid'

export default function App() {
  return (
    <ThemeProvider>
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/evolve" element={<Evolve />} />
          <Route path="/ritual" element={<Ritual />} />
          <Route path="/chronos" element={<Chronos />} />
          <Route path="/mentis" element={<Mentis />} />
          <Route path="/celluloid" element={<Celluloid />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AuthProvider>
    </ThemeProvider>
  )
}
