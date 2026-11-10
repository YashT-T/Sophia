import { useRef } from 'react'
import { Camera } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'
import { useProfile } from '../context/ProfileContext'

// size in px. editable = click to upload a new profile picture.
export default function Avatar({ size = 40, editable = false }) {
  const { user } = useAuth()
  const { profile, updateProfile } = useProfile()
  const input = useRef()
  const initials = (profile?.name || '?').slice(0, 2).toUpperCase()

  const upload = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    const path = `${user.id}/avatar`
    const { error } = await supabase.storage.from('avatars').upload(path, file, { upsert: true, contentType: file.type })
    if (error) return alert(error.message)
    const { data } = supabase.storage.from('avatars').getPublicUrl(path)
    updateProfile({ avatar_url: `${data.publicUrl}?t=${Date.now()}` })
  }

  return (
    <div className="avatar" style={{ width: size, height: size, fontSize: size / 3 }}
         onClick={() => editable && input.current.click()} title={editable ? 'Change profile picture' : ''}>
      {profile?.avatar_url ? <img src={profile.avatar_url} alt="" /> : initials}
      {editable && <span className="cam"><Camera size={12} /></span>}
      {editable && <input ref={input} type="file" accept="image/*" hidden onChange={upload} />}
    </div>
  )
}
