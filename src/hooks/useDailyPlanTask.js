import { useEffect, useRef } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'
import { DEFAULT_PLAN, SKIP_LABELS } from '../lib/plan'
import { ymd } from '../lib/time'

const DEFAULT_MINUTES = 30

// Each day, adds that weekday's plan (Evolve > The week ahead) to today's movement as a workout.
// plan_date is unique per user, so it can never be added twice (even from two devices).
export function useDailyPlanTask(reload) {
  const { user } = useAuth()
  const last = useRef(null)
  useEffect(() => {
    const run = async () => {
      const now = new Date(), day = ymd(now)
      if (last.current === day) return
      last.current = day
      const idx = (now.getDay() + 6) % 7
      const { data } = await supabase.from('week_plan').select('label').eq('day', idx).maybeSingle()
      const label = (data?.label ?? DEFAULT_PLAN[idx]).trim()
      if (SKIP_LABELS.includes(label.toLowerCase())) return
      const { error } = await supabase.from('workouts').upsert(
        { user_id: user.id, title: label, minutes: DEFAULT_MINUTES, day, plan_date: day },
        { onConflict: 'user_id,plan_date', ignoreDuplicates: true }
      )
      if (error) { console.error(error); last.current = null; return }
      reload()
    }
    run()
    const t = setInterval(run, 60000) // also catches midnight while the app is open
    return () => clearInterval(t)
    // eslint-disable-next-line
  }, [user.id])
}
