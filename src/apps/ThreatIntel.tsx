import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useGame } from '../core/store'
import type { IntelRecord } from '../core/types'
import { NoMission, useRun } from './shared'

export function ThreatIntel() {
  const { t } = useTranslation()
  const { run, mt } = useRun()
  const log = useGame((s) => s.log)
  const [q, setQ] = useState('')
  const [res, setRes] = useState<{ q: string; rec?: IntelRecord } | null>(null)
  if (!run) return <NoMission />

  const lookup = (e: React.FormEvent) => {
    e.preventDefault()
    const v = q.trim()
    if (!v) return
    const rec = run.data.intel.find((r) => r.indicator.toLowerCase() === v.toLowerCase())
    setRes({ q: v, rec })
    log({ type: 'intel.lookup', indicator: v, found: !!rec })
  }

  const r = res?.rec
  const level = r ? (r.score >= 70 ? 'malicious' : r.score >= 30 ? 'suspicious' : 'clean') : null
  return (
    <div className="app intel-app">
      <p className="muted">{t('intel.intro')}</p>
      <form className="row" onSubmit={lookup}>
        <input className="mono grow" value={q} onChange={(e) => setQ(e.target.value)} placeholder={t('intel.placeholder')} aria-label={t('intel.placeholder')} spellCheck={false} />
        <button className="btn primary" type="submit">{t('intel.lookup')}</button>
      </form>
      {res && !r && <p className="muted">{t('intel.notFound', { q: res.q })}</p>}
      {r && level && (
        <div className={`intel-card lvl-${level}`}>
          <div className="intel-head">
            <div className="gauge" style={{ ['--v' as string]: r.score }}>
              <span>{r.score}</span>
            </div>
            <div>
              <div className="mono big">{r.indicator}</div>
              <div className={`lvl lvl-${level}`}>{t(`intel.${level}`)}</div>
              <p>{mt(r.summaryKey)}</p>
            </div>
          </div>
          <dl>
            <dt>{t('intel.score')}</dt><dd>{r.score}/100</dd>
            <dt>{t('intel.reports')}</dt><dd>{r.reports}</dd>
            {r.asn && (<><dt>{t('intel.asn')}</dt><dd>{r.asn}</dd></>)}
            {r.country && (<><dt>{t('intel.country')}</dt><dd>{r.country}</dd></>)}
            {r.firstSeen && (<><dt>{t('intel.firstSeen')}</dt><dd>{r.firstSeen}</dd></>)}
            <dt>{t('intel.tags')}</dt><dd>{r.tags.map((tag) => <span key={tag} className="tag">{tag}</span>)}</dd>
          </dl>
        </div>
      )}
    </div>
  )
}
