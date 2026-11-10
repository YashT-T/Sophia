import { Link, NavLink } from 'react-router-dom'
import { LogOut, Moon, Sun } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { useTheme } from '../context/ThemeContext'
import { LOGO } from '../config/brand'

const LINKS = ['evolve', 'ritual', 'chronos', 'mentis', 'celluloid']
export default function Navbar() {
  const { theme, toggle } = useTheme()
  return (
    <nav className="nav">
      <Link to="/" className="brand"><img src={LOGO} alt="" className="logo" /> Sophia</Link>
      <div className="row gap">
        {LINKS.map((l) => <NavLink key={l} to={`/${l}`}>{l}</NavLink>)}
        <button className="icon-btn" onClick={toggle} aria-label={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}>
          {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
        </button>
        <button className="icon-btn" onClick={() => supabase.auth.signOut()} aria-label="Log out"><LogOut size={16} /></button>
      </div>
    </nav>
  )
}
