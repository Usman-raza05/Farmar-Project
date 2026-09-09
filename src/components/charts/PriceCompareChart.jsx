import { useMemo } from 'react'
import { rankChannels } from '../../lib/enr'

export default function PriceCompareChart({ title = 'Expected net realisation', subtitle = 'Gross price vs costs — ranked by ENR' }) {
  const ranked = useMemo(() => rankChannels(), [])
  const maxPrice = Math.max(...ranked.map((r) => r.price))
  const best = ranked[0]

  return (
    <div className="enr-chart">
      <div className="enr-chart-head">
        <div>
          <p className="eyebrow">Price compare</p>
          <h2>{title}</h2>
          <p className="enr-sub">{subtitle}</p>
        </div>
        <div className="enr-winner">
          <span>Best ENR</span>
          <strong>₹{best.enr.toLocaleString('en-IN')}/qtl</strong>
          <small>{best.label}</small>
        </div>
      </div>

      <div className="enr-bars" role="list">
        {ranked.map((row) => (
          <div key={row.id} className={`enr-row ${row.rank === 1 ? 'is-best' : ''}`} role="listitem">
            <div className="enr-row-meta">
              <span className="enr-rank">#{row.rank}</span>
              <div>
                <strong>{row.label}</strong>
                <small>{row.channel}</small>
              </div>
            </div>

            <div className="enr-track">
              <div className="enr-track-gross" style={{ width: `${(row.price / maxPrice) * 100}%` }} title={`Gross ₹${row.price}`}>
                <span className="enr-fill-label">Gross ₹{row.price.toLocaleString('en-IN')}</span>
              </div>
              <div className="enr-track-net" style={{ width: `${(row.enr / maxPrice) * 100}%` }} title={`ENR ₹${row.enr}`}>
                <span className="enr-fill-label">Net ₹{row.enr.toLocaleString('en-IN')}</span>
              </div>
            </div>

            <div className="enr-costs">
              <span>−₹{row.costs}</span>
              <em>costs & risk</em>
            </div>
          </div>
        ))}
      </div>

      <p className="enr-footnote">
        ENR = price − transport − storage − commission − quality penalty − payment risk. Always compare net, not board price alone.
      </p>
    </div>
  )
}
