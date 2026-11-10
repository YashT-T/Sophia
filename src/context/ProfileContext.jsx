import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from './AuthContext'

const Ctx = createContext(null)
export const useProfile = () => useContext(Ctx)

export function ProfileProvider({ children }) {
  const { user } = useAuth()
  const [profile, setProfile] = useState(null)

  const refresh = useCallback(async () => {
    const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single()
    setProfile(data)
  }, [user.id])
  useEffect(() => { refresh() }, [refresh])

  // delta = +2 for finishing, -4 for missing a deadline
  const addXp = async (delta) => {
    const { data } = await supabase.rpc('add_xp', { delta })
    if (typeof data === 'number') setProfile((p) => ({ ...p, xp: data }))
  }
  const updateProfile = async (patch) => {
    await supabase.from('profiles').update(patch).eq('id', user.id)
    refresh()
  }
  return <Ctx.Provider value={{ profile, addXp, updateProfile }}>{children}</Ctx.Provider>
}
