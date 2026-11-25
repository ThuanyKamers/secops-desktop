import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useGame } from '../core/store'
import type { LogEvent } from '../core/types'
import { QueryError, search, topValues } from '../engine/query'
import { NoMission, useRun } from './shared'

const FIELDS = ['source', 'user', 'src_ip', 'outcome', 'action', 'dst_ip', 'assigned_ip']
const MAX_ROWS = 250

function Histogram({ events }: { events: LogEvent[] }) {
  const buckets = useMemo(() => {
    const m = new Map<string, number>()
    for (const e of events) {
      const k = e.timestamp.slice(11, 16)
      m.set(k, (m.get(k) ?? 0) + 1)
    }
    return [...m.entries()].sort((a, b) => a[0].localeCompare(b[0]))
  }, [events])
  if (buckets.length === 0) return null
  const max = Math.max(...buckets.map((b) => b[1]))
  return (
    <div className="histogram" aria-hidden>
      {buckets.map(([k, v]) => (
        <div key={k} className="bar" style={{ height: `${Math.max(6, (v / max) * 100)}%` }} title={`${k} UTC · ${v}`} />
      ))}
      <span className="h-from">{buckets[0][0]}</span>
      <span className="h-to">{buckets[buckets.length - 1][0]}</span>
    </div>
  )
}

export function Siem() {
  const { t } = useTranslation()
  const { run } = useRun()
  const log = useGame((s) => s.log)
  const openWiki = useGame((s) => s.openWiki)
  const [input, setInput] = useState('')
  const [from, setFrom] = useState('')
  const [to, setTo] = useState('')
  const [query, setQuery] = useState<{ q: string; from: string; to: string } | null>(null)
  const [expanded, setExpanded] = useState<number | null>(null)

  const result = useMemo(() => {
    if (!run || !query) return null
    const day = run.data.logs[0]?.timestamp.slice(0, 10) ?? ''
    const iso = (hm: string, end: boolean) => (hm ? `${day}T${hm.length === 5 ? hm + (end ? ':59' : ':00') : hm}Z` : undefined)
    try {
      return { events: search(run.data.logs, query.q, iso(query.from, false), iso(query.to, true)), error: '' }
    } catch (e) {
      return { events: [], error: e instanceof QueryError ? e.message : String(e) }
    }
  }, [run, query])

  if (!run) return <NoMission />

  const run_ = (q: string) => {
    setInput(q)
    setQuery({ q, from, to })
    setExpanded(null)
    try {
      const hits = search(run.data.logs, q).length
      log({ type: 'siem.search', query: q, hits })
    } catch {
      log({ type: 'siem.search', query: q, hits: 0 })
    }
  }
  const addTerm = (field: string, value: string) => {
    const term = `${field}=${value}`
    run_(input.includes(term) ? input : `${input.trim()} ${term}`.trim())
  }

  const events = result?.events ?? []
  return (
    <div className="app siem-app">
      <form className="siem-bar" onSubmit={(e) => { e.preventDefault(); run_(input) }}>
        <input className="mono" value={input} onChange={(e) => setInput(e.target.value)} placeholder={t('siem.placeholder')} aria-label={t('siem.search')} spellCheck={false} />
        <label className="time-in">{t('siem.from')} <input type="time" step={1} value={from} onChange={(e) => setFrom(e.target.value)} /></label>
        <label className="time-in">{t('siem.to')} <input type="time" step={1} value={to} onChange={(e) => setTo(e.target.value)} /></label>
        <button className="btn primary" type="submit">{t('siem.search')}</button>
        <button className="btn ghost" type="button" onClick={() => { setInput(''); setFrom(''); setTo(''); setQuery(null) }}>{t('siem.clear')}</button>
        <button className="btn ghost" type="button" onClick={() => openWiki('siem-guide')}>{t('siem.help')}</button>
      </form>
      {result?.error && <p className="error">{t('siem.error', { msg: result.error })}</p>}
      {!query && (
        <div className="siem-empty">
          <p className="muted">{t('siem.examples')}</p>
          {['source=vpn outcome=failure', 'source=firewall action=denied', 'user=j.becker'].map((q) => (
            <button key={q} className="chip mono" onClick={() => run_(q)}>{q}</button>
          ))}
        </div>
      )}
      {query && !result?.error && (
        <div className="siem-results">
          <aside className="siem-fields">
            <h4>{t('siem.fields')}</h4>
            <p className="muted small">{t('siem.pickField')}</p>
            {FIELDS.map((f) => {
              const vals = topValues(events, f)
              if (vals.length === 0) return null
              return (
                <div key={f} className="field-group">
                  <div className="mono fname">{f}</div>
                  {vals.map(([v, n]) => (
                    <button key={v} className="fval" onClick={() => addTerm(f, v)}>
                      <span className="mono">{v}</span><span className="count">{n}</span>
                    </button>
                  ))}
                </div>
              )
            })}
          </aside>
          <div className="siem-events">
            <div className="row between">
              <strong>{t('siem.results', { count: events.length })}</strong>
            </div>
            <Histogram events={events} />
            {events.length === 0 ? (
              <p className="muted">{t('siem.noResults')}</p>
            ) : (
              <ol className="events">
                {events.slice(0, MAX_ROWS).map((e, i) => {
                  const { timestamp, source, ...rest } = e
                  return (
                    <li key={i} className={expanded === i ? 'open' : ''} onClick={() => setExpanded(expanded === i ? null : i)}>
                      <span className="mono ts">{timestamp.replace('T', ' ').replace('Z', '')}</span>
                      <span className={`src src-${source}`}>{source}</span>
                      <span className="kv mono">
                        {Object.entries(rest).map(([k, v]) => (
                          <span key={k} className={k === 'outcome' || k === 'action' ? `kv-${v}` : ''}>
                            <span className="k">{k}=</span>{String(v)}{' '}
                          </span>
                        ))}
                      </span>
                      {expanded === i && <pre className="raw">{JSON.stringify(e, null, 2)}</pre>}
                    </li>
                  )
                })}
              </ol>
            )}
            {events.length > MAX_ROWS && <p className="muted small">+{events.length - MAX_ROWS}</p>}
          </div>
        </div>
      )}
    </div>
  )
}
