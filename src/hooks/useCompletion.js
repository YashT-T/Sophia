import { useProfile } from '../context/ProfileContext'
import { PENALTY, REWARD } from '../lib/xp'

// Tick/untick an item. On time = +2 XP. Late = no reward (and the -4 is applied once).
export function useCompletion(update, getDue) {
  const { addXp } = useProfile()
  return async (item) => {
    if (item.done) {
      await update(item.id, { done: false, xp_awarded: 0 })
      if (item.xp_awarded) await addXp(-item.xp_awarded)
      return
    }
    const late = getDue && getDue(item).getTime() < Date.now()
    const patch = { done: true, xp_awarded: late ? 0 : REWARD, completed_at: new Date().toISOString() }
    if (late && !item.penalized) { patch.penalized = true; await addXp(-PENALTY) }
    await update(item.id, patch)
    if (!late) await addXp(REWARD)
  }
}
