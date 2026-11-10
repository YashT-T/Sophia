import { useState } from 'react'
import { Navigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'

export default function Login() {
  const { session } = useAuth()
  const [mode, setMode] = useState('login')
  const [f, setF] = useState({ name: '', email: '', password: '' })
  const [msg, setMsg] = useState('')
  const [busy, setBusy] = useState(false)
  if (session) return <Navigate to="/" replace />

  const submit = async (e) => {
    e.preventDefault(); setBusy(true); setMsg('')
    const { error, data } = mode === 'login'
      ? await supabase.auth.signInWithPassword({ email: f.email, password: f.password })
      : await supabase.auth.signUp({ email: f.email, password: f.password, options: { data: { name: f.name } } })
    if (error) setMsg(error.message)
    else if (mode === 'signup' && !data.session) setMsg('Check your email to confirm your account, then log in.')
    setBusy(false)
  }
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value })

  return (
    <div className="login">
      <form className="card login-card" onSubmit={submit}>
        <h1>{mode === 'login' ? 'Welcome back.' : 'Start your orbit.'}</h1>
        <p className="muted">Five currents. One quieter way forward.</p>
        {mode === 'signup' && <label>Your name<input className="input" required value={f.name} onChange={set('name')} /></label>}
        <label>Email<input className="input" type="email" required value={f.email} onChange={set('email')} /></label>
        <label>Password<input className="input" type="password" minLength={6} required value={f.password} onChange={set('password')} /></label>
        {msg && <p className="msg">{msg}</p>}
        <button className="btn primary" disabled={busy}>{mode === 'login' ? 'Log in' : 'Create account'}</button>
        <button type="button" className="link" onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}>
          {mode === 'login' ? 'New here? Create an account' : 'Have an account? Log in'}
        </button>
      </form>
    </div>
  )
}
