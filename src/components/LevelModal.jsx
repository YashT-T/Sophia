import Modal from './Modal'
import { levelInfo, levelStart } from '../lib/xp'

export default function LevelModal({ xp, onClose }) {
  const { level, left } = levelInfo(xp)
  const shown = Math.max(7, level + 2)
  return (
    <Modal title="Cumulative level thresholds" onClose={onClose}>
      <p className="muted">{xp} XP total · {left} XP to Level {level + 1}</p>
      <div className="row wrap gap">
        {Array.from({ length: shown }, (_, i) => i + 1).map((n) => (
          <div key={n} className={`lvl ${n === level ? 'on' : ''}`}><small>Level {n}</small><span>{levelStart(n)} XP</span></div>
        ))}
      </div>
    </Modal>
  )
}
