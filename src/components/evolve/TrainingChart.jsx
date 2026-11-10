import { Bar, BarChart, CartesianGrid, Cell, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { ymd } from '../../lib/time'
import { useTheme } from '../../context/ThemeContext'

const PAL = {
  light: { grid: '#2A1F1A22', tick: '#2A1F1A', sub: '#7A6A5C', a1: '#E39A6F', a2: '#F1D3B4', t1: '#B84A22', t2: '#8A3515', line: '#2A1F1A', cursor: '#2A1F1A10' },
  dark: { grid: '#F4EBDD22', tick: '#F4EBDD', sub: '#B3A28F', a1: '#8A5A3E', a2: '#4B3426', t1: '#F28C5B', t2: '#F2C265', line: '#CDBBA2', cursor: '#F28C5B18' }
}

const GOAL = 30
const Tip = ({ active, payload }) => active && payload?.length ? (
  <div className="chart-tip"><b>{payload[0].payload.full}</b><br />{payload[0].value} min</div>
) : null

export default function TrainingChart({ workouts }) {
  const c = PAL[useTheme().theme]
  const data = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(); d.setDate(d.getDate() - (6 - i))
    const mins = workouts.filter((w) => w.done && w.day === ymd(d)).reduce((s, w) => s + w.minutes, 0)
    return { label: d.toLocaleDateString('en-US', { weekday: 'short' }), full: d.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'short' }), mins, today: i === 6 }
  })
  const total = data.reduce((s, d) => s + d.mins, 0)

  return (
    <div className="card">
      <div className="row between"><h2>Consistency, not perfection.</h2><span className="muted">{total} min this week</span></div>
      <p className="muted">Completed training minutes · past seven days · dashed line = {GOAL} min goal</p>
      <div style={{ height: 240 }}>
        <ResponsiveContainer>
          <BarChart data={data} margin={{ top: 10, right: 8, left: -18, bottom: 0 }}>
            <defs>
              <linearGradient id="barG" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={c.a1} /><stop offset="100%" stopColor={c.a2} /></linearGradient>
              <linearGradient id="barT" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={c.t1} /><stop offset="100%" stopColor={c.t2} /></linearGradient>
            </defs>
            <CartesianGrid vertical={false} stroke={c.grid} />
            <XAxis dataKey="label" axisLine={false} tickLine={false} tick={{ fill: c.tick, fontSize: 12, fontWeight: 700 }} />
            <YAxis axisLine={false} tickLine={false} tick={{ fill: c.sub, fontSize: 11 }} allowDecimals={false} />
            <Tooltip content={<Tip />} cursor={{ fill: c.cursor }} />
            <ReferenceLine y={GOAL} stroke={c.line} strokeDasharray="5 5" />
            <Bar dataKey="mins" radius={[10, 10, 0, 0]} maxBarSize={38} stroke={c.line} strokeWidth={1.5}>
              {data.map((d, i) => <Cell key={i} fill={d.today ? 'url(#barT)' : 'url(#barG)'} />)}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
