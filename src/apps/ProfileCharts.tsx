import { useEffect, useMemo, useRef, useState, type KeyboardEvent } from 'react'
import { useTranslation } from 'react-i18next'
import { getMission } from '../content'
import { activityByDay, dayKey, type Attempt } from '../core/progress'

// ---- shared ---------------------------------------------------------------

function useWidth<T extends HTMLElement>(fallback = 560) {
  const ref = useRef<T>(null)
  const [w, setW] = useState(fallback)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const ro = new ResizeObserver(([e]) => setW(Math.max(240, Math.floor(e.contentRect.width))))
    ro.observe(el)
    return () => ro.disconnect()
  }, [])
  return [ref, w] as const
}

const DAY = 86_400_000

// ---- score over time --------------------------------------------------------

export type Range = 'week' | 'month' | 'year' | 'all'
const RANGE_DAYS: Record<Exclude<Range, 'all'>, number> = { week: 7, month: 30, year: 365 }

const H = 200
const PAD = { top: 12, right: 14, bottom: 26, left: 38 }

export function ScoreChart({ history }: { history: Attempt[] }) {
  const { t, i18n } = useTranslation()
  const [range, setRange] = useState<Range>('month')
  const [wrapRef, width] = useWidth<HTMLDivElement>()
  const [active, setActive] = useState<number | null>(null)

  const now = Date.now()
  const { points, x0, x1 } = useMemo(() => {
    const sorted = [...history].sort((a, b) => a.at.localeCompare(b.at))
    const start = range === 'all' ? (sorted.length ? new Date(sorted[0].at).getTime() : now - 30 * DAY) : now - RANGE_DAYS[range] * DAY
    const pts = sorted.filter((a) => new Date(a.at).getTime() >= start)
    const first = range === 'all' ? Math.min(start, now - DAY) : start
    return { points: pts, x0: first, x1: now }
  }, [history, range, now])

  const plotW = width - PAD.left - PAD.right
  const plotH = H - PAD.top - PAD.bottom
  const sx = (ms: number) => PAD.left + ((ms - x0) / Math.max(1, x1 - x0)) * plotW
  const sy = (pct: number) => PAD.top + (1 - pct / 100) * plotH
  const xy = points.map((a) => ({ a, x: sx(new Date(a.at).getTime()), y: sy(a.pct) }))
  const path = xy.map((p, i) => `${i ? 'L' : 'M'}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join('')

  // ~5 date ticks across the range
  const ticks = Array.from({ length: 5 }, (_, i) => x0 + ((x1 - x0) * i) / 4)
  const fmtTick = (ms: number) =>
    new Date(ms).toLocaleDateString(i18n.language, range === 'week' ? { weekday: 'short' } : range === 'month' ? { day: 'numeric', month: 'short' } : { month: 'short', year: '2-digit' })

  const nearest = (px: number) => {
    let best = -1
    let d = Infinity
    xy.forEach((p, i) => {
      const dd = Math.abs(p.x - px)
      if (dd < d) { d = dd; best = i }
    })
    return best < 0 ? null : best
  }

  const onKey = (e: KeyboardEvent) => {
    if (!xy.length) return
    if (e.key === 'ArrowLeft') { setActive((i) => Math.max(0, (i ?? xy.length) - 1)); e.preventDefault() }
    if (e.key === 'ArrowRight') { setActive((i) => Math.min(xy.length - 1, (i ?? -1) + 1)); e.preventDefault() }
    if (e.key === 'Escape') setActive(null)
  }

  const cur = active !== null ? xy[active] : null
  const avg = points.length ? Math.round(points.reduce((s, a) => s + a.pct, 0) / points.length) : null

  return (
    <section className="chart-card">
      <header className="chart-head">
        <div>
          <h4>{t('charts.scoreTitle')}</h4>
          <p className="muted small">
            {points.length ? t('charts.scoreSummary', { count: points.length, avg }) : t('charts.noData')}
          </p>
        </div>
        <div className="seg" role="group" aria-label={t('charts.range')}>
          {(['week', 'month', 'year', 'all'] as Range[]).map((r) => (
            <button key={r} className={range === r ? 'active' : ''} aria-pressed={range === r} onClick={() => { setRange(r); setActive(null) }}>
              {t(`charts.ranges.${r}`)}
            </button>
          ))}
        </div>
      </header>
      <div className="chart-wrap" ref={wrapRef}>
        <svg
          width={width}
          height={H}
          className="score-chart"
          role="img"
          tabIndex={0}
          aria-label={t('charts.scoreAria', { count: points.length, avg: avg ?? 0 })}
          onKeyDown={onKey}
          onPointerMove={(e) => {
            const r = (e.currentTarget as SVGSVGElement).getBoundingClientRect()
            setActive(nearest(e.clientX - r.left))
          }}
          onPointerLeave={() => setActive(null)}
          onBlur={() => setActive(null)}
        >
          {[0, 25, 50, 75, 100].map((v) => (
            <g key={v}>
              <line className="grid" x1={PAD.left} x2={width - PAD.right} y1={sy(v)} y2={sy(v)} />
              <text className="axis" x={PAD.left - 6} y={sy(v)} dy="0.32em" textAnchor="end">{v}%</text>
            </g>
          ))}
          {ticks.map((ms, i) => (
            <text key={i} className="axis" x={sx(ms)} y={H - 8} textAnchor={i === 0 ? 'start' : i === 4 ? 'end' : 'middle'}>{fmtTick(ms)}</text>
          ))}
          {cur && <line className="crosshair" x1={cur.x} x2={cur.x} y1={PAD.top} y2={PAD.top + plotH} />}
          {xy.length > 1 && <path className="series" d={path} />}
          {xy.map((p, i) => (
            <circle key={p.a.id} className={`dot ${i === active ? 'on' : ''}`} cx={p.x} cy={p.y} r={i === active ? 5.5 : 4} />
          ))}
        </svg>
        {cur && (
          <div className="chart-tip" style={{ left: Math.min(Math.max(cur.x, 70), width - 70), top: Math.max(cur.y - 12, 0) }} role="status">
            <strong>{cur.a.pct}%</strong>
            <span>{(() => { const m = getMission(cur.a.missionId); return m ? t('hub.title', { ns: m.ns }) : cur.a.missionId })()}</span>
            <span className="muted">{new Date(cur.a.at).toLocaleString(i18n.language, { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}</span>
          </div>
        )}
      </div>
    </section>
  )
}

// ---- activity calendar ------------------------------------------------------

const WEEKS = 26
const CELL = 12
const GAP = 3

export function ActivityCalendar({ history }: { history: Attempt[] }) {
  const { t, i18n } = useTranslation()
  const [tip, setTip] = useState<{ x: number; y: number; key: string; n: number } | null>(null)
  const byDay = useMemo(() => activityByDay(history), [history])
  const scrollRef = useRef<HTMLDivElement>(null)
  // on narrow screens, start scrolled to the most recent weeks
  useEffect(() => {
    const el = scrollRef.current
    if (el) el.scrollLeft = el.scrollWidth
  }, [])

  // grid starts on the Monday 25 weeks before this week's Monday
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const dow = (today.getDay() + 6) % 7 // Monday = 0
  const start = new Date(today)
  start.setDate(today.getDate() - dow - (WEEKS - 1) * 7)

  const cells: { key: string; date: Date; n: number; col: number; row: number; future: boolean }[] = []
  for (let i = 0; i < WEEKS * 7; i++) {
    const d = new Date(start)
    d.setDate(start.getDate() + i)
    const key = dayKey(d)
    cells.push({ key, date: d, n: byDay.get(key) ?? 0, col: Math.floor(i / 7), row: i % 7, future: d > today })
  }
  const active = new Set(cells.filter((c) => c.n > 0 && !c.future).map((c) => c.key)).size
  const level = (n: number) => (n === 0 ? 0 : n === 1 ? 1 : n === 2 ? 2 : n <= 4 ? 3 : 4)

  const left = 26
  const top = 16
  const w = left + WEEKS * (CELL + GAP)
  const h = top + 7 * (CELL + GAP)
  const months: { col: number; label: string }[] = []
  cells.forEach((c) => {
    if (c.row === 0 && c.date.getDate() <= 7) months.push({ col: c.col, label: c.date.toLocaleDateString(i18n.language, { month: 'short' }) })
  })
  const dayNames = [0, 2, 4].map((r) => new Date(2024, 0, 1 + r).toLocaleDateString(i18n.language, { weekday: 'short' }))

  return (
    <section className="chart-card">
      <header className="chart-head">
        <div>
          <h4>{t('charts.activityTitle')}</h4>
          <p className="muted small">{t('charts.activitySummary', { count: active })}</p>
        </div>
      </header>
      <div className="cal-wrap" ref={scrollRef}>
        <svg width={w} height={h} className="activity-cal" role="img" aria-label={t('charts.activitySummary', { count: active })} onPointerLeave={() => setTip(null)}>
          {months.map((m) => (
            <text key={m.col} className="axis" x={left + m.col * (CELL + GAP)} y={10}>{m.label}</text>
          ))}
          {dayNames.map((d, i) => (
            <text key={d} className="axis" x={0} y={top + i * 2 * (CELL + GAP) + CELL - 2}>{d}</text>
          ))}
          {cells.filter((c) => !c.future).map((c) => {
            const x = left + c.col * (CELL + GAP)
            const y = top + c.row * (CELL + GAP)
            return (
              <rect
                key={c.key}
                className={`cal-cell l${level(c.n)}`}
                x={x}
                y={y}
                width={CELL}
                height={CELL}
                rx={2.5}
                onPointerEnter={() => setTip({ x: x + CELL / 2, y, key: c.key, n: c.n })}
              />
            )
          })}
        </svg>
        {tip && (
          <div className="chart-tip" style={{ left: Math.min(Math.max(tip.x, 70), w - 70), top: tip.y - 6 }} role="status">
            <strong>{t('charts.attempts', { count: tip.n })}</strong>
            <span className="muted">{new Date(tip.key + 'T12:00:00').toLocaleDateString(i18n.language, { weekday: 'short', day: 'numeric', month: 'short' })}</span>
          </div>
        )}
      </div>
      <div className="cal-legend muted small" aria-hidden>
        <span>{t('charts.less')}</span>
        {[0, 1, 2, 3, 4].map((l) => <span key={l} className={`cal-swatch l${l}`} />)}
        <span>{t('charts.more')}</span>
      </div>
    </section>
  )
}
