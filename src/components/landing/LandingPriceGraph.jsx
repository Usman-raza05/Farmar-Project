import { useMemo, useState } from 'react'
import { MARKET_SURFACE } from '../../lib/enr'

const SERIES = {
  soybean: {
    label: 'Soybean · Beed',
    points: [2380, 2395, 2410, 2425, 2440, 2435, 2450, 2480, 2510, 2550, 2610, 2680],
    labels: ['Aug 1', 'Aug 8', 'Aug 15', 'Aug 22', 'Aug 29', 'Sep 1', 'Sep 3', 'Sep 4', 'Sep 5', 'Sep 6', 'Sep 7', 'Today'],
    best: 2680,
    delta: '+4.2%',
  },
  onion: {
    label: 'Onion · Nashik',
    points: [1520, 1480, 1505, 1550, 1580, 1610, 1595, 1620, 1650, 1680, 1710, 1740],
    labels: ['Aug 1', 'Aug 8', 'Aug 15', 'Aug 22', 'Aug 29', 'Sep 1', 'Sep 3', 'Sep 4', 'Sep 5', 'Sep 6', 'Sep 7', 'Today'],
    best: 1740,
    delta: '+3.1%',
  },
  tur: {
    label: 'Tur · Parbhani',
    points: [6200, 6220, 6180, 6250, 6300, 6280, 6320, 6350, 6400, 6420, 6450, 6480],
    labels: ['Aug 1', 'Aug 8', 'Aug 15', 'Aug 22', 'Aug 29', 'Sep 1', 'Sep 3', 'Sep 4', 'Sep 5', 'Sep 6', 'Sep 7', 'Today'],
    best: 6480,
    delta: '+2.4%',
  },
}

function buildPath(points, width, height, pad = 14) {
  const min = Math.min(...points)
  const max = Math.max(...points)
  const span = max - min || 1
  const innerW = width - pad * 2
  const innerH = height - pad * 2

  return points
    .map((value, index) => {
      const x = pad + (index / (points.length - 1)) * innerW
      const y = pad + (1 - (value - min) / span) * innerH
      return `${index === 0 ? 'M' : 'L'}${x.toFixed(1)} ${y.toFixed(1)}`
    })
    .join(' ')
}

function buildArea(points, width, height, pad = 14) {
  const line = buildPath(points, width, height, pad)
  return `${line} L${width - pad} ${height - pad} L${pad} ${height - pad} Z`
}

function cellTone(value, min, max) {
  const t = (value - min) / (max - min || 1)
  if (t > 0.82) return 'bg-farm-gold text-farm-ink'
  if (t > 0.55) return 'bg-farm-leaf/90 text-white'
  if (t > 0.3) return 'bg-farm-mid/80 text-farm-mist'
  return 'bg-farm-deep/70 text-white/70'
}

export default function LandingPriceGraph() {
  const [crop, setCrop] = useState('soybean')
  const [hoverCell, setHoverCell] = useState(null)
  const data = SERIES[crop]
  const width = 560
  const height = 150

  const { line, area, minP, maxP } = useMemo(() => {
    const min = Math.min(...data.points)
    const max = Math.max(...data.points)
    return {
      line: buildPath(data.points, width, height),
      area: buildArea(data.points, width, height),
      minP: min,
      maxP: max,
    }
  }, [data.points])

  const flat = MARKET_SURFACE.grid.flat()
  const matrixMin = Math.min(...flat)
  const matrixMax = Math.max(...flat)

  return (
    <div className="overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-[#0f2a20] via-[#123528] to-[#0a1c15] p-4 shadow-xl">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-[0.6rem] font-semibold uppercase tracking-[0.14em] text-farm-gold">Live price pulse</p>
          <h3 className="mt-0.5 text-lg font-semibold tracking-tight text-white">{data.label}</h3>
        </div>
        <div className="rounded-xl border border-farm-gold/30 bg-farm-gold/10 px-3 py-2 text-right">
          <strong className="block text-xl font-bold text-farm-gold">₹{data.best.toLocaleString('en-IN')}</strong>
          <span className="text-xs font-medium text-emerald-300">{data.delta} vs last week</span>
        </div>
      </div>

      <div className="mt-3 flex flex-wrap gap-1.5" role="tablist">
        {Object.entries(SERIES).map(([key, series]) => (
          <button
            key={key}
            type="button"
            role="tab"
            aria-selected={crop === key}
            onClick={() => setCrop(key)}
            className={`rounded-full px-3 py-1 text-xs font-semibold transition ${
              crop === key
                ? 'bg-farm-gold text-farm-ink'
                : 'border border-white/15 bg-white/5 text-white/75 hover:bg-white/10'
            }`}
          >
            {series.label.split(' · ')[0]}
          </button>
        ))}
      </div>

      <div className="relative mt-3 overflow-hidden rounded-xl border border-white/8 bg-black/20 p-1.5">
        <svg className="h-auto w-full" viewBox={`0 0 ${width} ${height}`} role="img" aria-label={`${data.label} price trend`}>
          <defs>
            <linearGradient id="farmlyAreaTw" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#d4a017" stopOpacity="0.45" />
              <stop offset="100%" stopColor="#d4a017" stopOpacity="0" />
            </linearGradient>
            <linearGradient id="farmlyStrokeTw" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#5ecf8e" />
              <stop offset="100%" stopColor="#d4a017" />
            </linearGradient>
          </defs>
          {[0.25, 0.5, 0.75].map((t) => (
            <line
              key={t}
              x1="14"
              x2={width - 14}
              y1={14 + t * (height - 28)}
              y2={14 + t * (height - 28)}
              stroke="rgba(255,255,255,0.06)"
            />
          ))}
          <path d={area} fill="url(#farmlyAreaTw)" />
          <path d={line} fill="none" stroke="url(#farmlyStrokeTw)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          {data.points.map((value, index) => {
            const x = 14 + (index / (data.points.length - 1)) * (width - 28)
            const y = 14 + (1 - (value - minP) / (maxP - minP || 1)) * (height - 28)
            const isLast = index === data.points.length - 1
            return <circle key={data.labels[index]} cx={x} cy={y} r={isLast ? 4.5 : 2.2} fill={isLast ? '#d4a017' : '#5ecf8e'} />
          })}
        </svg>
        <div className="flex justify-between px-2 pb-0.5 text-[0.58rem] uppercase tracking-wide text-white/40">
          <span>{data.labels[0]}</span>
          <span>Peak path</span>
          <span>{data.labels.at(-1)}</span>
        </div>
      </div>

      <div className="mt-4">
        <div className="mb-2 flex flex-wrap items-end justify-between gap-2">
          <div>
            <p className="text-[0.6rem] font-semibold uppercase tracking-[0.14em] text-emerald-300/90">Mandi × day matrix</p>
            <p className="text-xs text-white/55">Soybean · Maharashtra yards</p>
          </div>
          {hoverCell && (
            <p className="rounded-full border border-farm-gold/40 bg-farm-gold/15 px-2.5 py-0.5 text-xs font-semibold text-farm-gold">
              {hoverCell.mandi} · {hoverCell.day}: ₹{hoverCell.value.toLocaleString('en-IN')}
            </p>
          )}
        </div>

        <div className="overflow-x-auto">
          <div className="min-w-[420px]">
            <div
              className="mb-1 grid gap-1"
              style={{ gridTemplateColumns: `3.4rem repeat(${MARKET_SURFACE.days.length}, minmax(0, 1fr))` }}
            >
              <span />
              {MARKET_SURFACE.days.map((day) => (
                <span key={day} className="text-center text-[0.55rem] font-semibold uppercase tracking-wide text-white/45">
                  {day}
                </span>
              ))}
            </div>

            {MARKET_SURFACE.mandis.map((mandi, rowIndex) => (
              <div
                key={mandi}
                className="mb-1 grid gap-1"
                style={{ gridTemplateColumns: `3.4rem repeat(${MARKET_SURFACE.days.length}, minmax(0, 1fr))` }}
              >
                <span className="flex items-center text-[0.68rem] font-medium text-white/70">{mandi}</span>
                {MARKET_SURFACE.grid[rowIndex].map((value, colIndex) => (
                  <button
                    key={`${mandi}-${colIndex}`}
                    type="button"
                    onMouseEnter={() => setHoverCell({ mandi, day: MARKET_SURFACE.days[colIndex], value })}
                    onMouseLeave={() => setHoverCell(null)}
                    className={`rounded-md py-1.5 text-center text-[0.62rem] font-semibold transition hover:brightness-110 ${cellTone(value, matrixMin, matrixMax)}`}
                  >
                    {(value / 1000).toFixed(2)}k
                  </button>
                ))}
              </div>
            ))}
          </div>
        </div>

        <div className="mt-2 flex items-center gap-2 text-[0.58rem] text-white/45">
          <span className="h-2 w-2 rounded-sm bg-farm-deep/70" /> Low
          <span className="h-2 w-2 rounded-sm bg-farm-mid/80" /> Mid
          <span className="h-2 w-2 rounded-sm bg-farm-leaf" /> Strong
          <span className="h-2 w-2 rounded-sm bg-farm-gold" /> Peak
        </div>
      </div>
    </div>
  )
}
