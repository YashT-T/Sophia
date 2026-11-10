import { useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useProfile } from '../context/ProfileContext'
import { PENALTY } from '../lib/xp'

// Every 30s: any unfinished item past its deadline costs -4 XP, exactly once.
export function useOverduePenalty(table, items, getDue, reload) {
  const { addXp } = useProfile()
  useEffect(() => {
    const check = async () => {
      const late = items.filter((i) => !i.done && !i.penalized && getDue(i).getTime() < Date.now())
      let changed = false
      for (const i of late) {
        // the .eq('penalized', false) makes this safe if two tabs run at once
        const { data } = await supabase.from(table).update({ penalized: true }).eq('id', i.id).eq('penalized', false).select()
        if (data?.length) { await addXp(-PENALTY); changed = true }
      }
      if (changed) reload()
    }
    check()
    const t = setInterval(check, 30000)
    return () => clearInterval(t)
    // eslint-disable-next-line
  }, [items])
}
