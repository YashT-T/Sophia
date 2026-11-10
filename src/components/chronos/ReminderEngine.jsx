import { useEffect, useRef, useState } from 'react'
import { supabase } from '../../lib/supabase'
import Modal from '../Modal'

function startRing() {
  const ctx = new (window.AudioContext || window.webkitAudioContext)()
  const beep = () => {
    const o = ctx.createOscillator(), g = ctx.createGain()
    o.frequency.value = 880; g.gain.value = 0.25
    o.connect(g); g.connect(ctx.destination); o.start(); o.stop(ctx.currentTime + 0.25)
    navigator.vibrate?.(300)
  }
  beep()
  const id = setInterval(beep, 800)
  return () => { clearInterval(id); ctx.close() }
}

async function notify(title) {
  if (!('Notification' in window) || Notification.permission !== 'granted') return
  const reg = await navigator.serviceWorker?.getRegistration()
  if (reg) reg.showNotification('Sophia reminder', { body: title, icon: '/icon-192.png', vibrate: [200, 100, 200] })
  else new Notification('Sophia reminder', { body: title, icon: '/icon-192.png' })
}

// Mounted once in Layout: checks every 10s and fires due reminders (works while the app is open).
export default function ReminderEngine() {
  const [alert, setAlert] = useState(null)
  const stop = useRef(null)

  useEffect(() => {
    const check = async () => {
      const { data } = await supabase.from('reminders').select('*').eq('fired', false).lte('remind_at', new Date().toISOString())
      for (const r of data || []) {
        const { data: won } = await supabase.from('reminders').update({ fired: true }).eq('id', r.id).eq('fired', false).select()
        if (!won?.length) continue
        notify(r.title)
        if (r.mode === 'ring') { stop.current?.(); stop.current = startRing() }
        setAlert(r)
      }
    }
    check()
    const t = setInterval(check, 10000)
    return () => clearInterval(t)
  }, [])

  const close = () => { stop.current?.(); stop.current = null; setAlert(null) }
  if (!alert) return null
  return (
    <Modal title={alert.mode === 'ring' ? '⏰ Reminder' : 'Reminder'} onClose={close}>
      <h2>{alert.title}</h2>
      <button className="btn primary" onClick={close}>{alert.mode === 'ring' ? 'Stop ringing' : 'Got it'}</button>
    </Modal>
  )
}
