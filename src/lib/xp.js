export const REWARD = 2
export const PENALTY = 4

// XP needed to START level n. Gaps grow by 200 each level:
// L1 0 · L2 400 · L3 1000 · L4 1800 · L5 2800 · L6 4000 · L7 5400 ...
// To change the difficulty, edit BASE_GAP and GAP_GROWTH only.
const BASE_GAP = 400
const GAP_GROWTH = 200
export const levelStart = (n) => {
  let xp = 0
  for (let k = 1; k < n; k++) xp += BASE_GAP + GAP_GROWTH * (k - 1)
  return xp
}
export function levelInfo(xp) {
  let level = 1
  while (xp >= levelStart(level + 1)) level++
  const from = levelStart(level), to = levelStart(level + 1)
  return { level, from, to, pct: ((xp - from) / (to - from)) * 100, left: to - xp }
}
