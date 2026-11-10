import { createContext, useContext, useEffect, useState } from 'react'

const Ctx = createContext(null)
export const useTheme = () => useContext(Ctx)
const BAR = { light: '#F4EEE3', dark: '#16110E' } // phone status-bar colour

// Saved choice wins; otherwise follow the phone's light/dark setting.
// To always start in dark, change the fallback below to 'dark'.
function initial() {
  try {
    return localStorage.getItem('theme') || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
  } catch { return 'light' }
}

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(initial)
  useEffect(() => {
    document.documentElement.dataset.theme = theme
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', BAR[theme])
    try { localStorage.setItem('theme', theme) } catch {}
  }, [theme])
  const toggle = () => setTheme((t) => (t === 'dark' ? 'light' : 'dark'))
  return <Ctx.Provider value={{ theme, toggle }}>{children}</Ctx.Provider>
}
