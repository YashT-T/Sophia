import { levelInfo } from '../lib/xp'
export default function XpBar({ xp }) {
  const { level, to, pct, left } = levelInfo(xp)
  return (
    <div className="xpbar">
      <div className="row between"><small>Level {String(level).padStart(2, '0')}</small><small>{xp} / {to} XP</small></div>
      <div className="track"><div style={{ width: `${Math.max(2, pct)}%` }} /></div>
      <span className="muted">{left} XP to Level {String(level + 1).padStart(2, '0')}</span>
    </div>
  )
}
