import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { PLAYER, useGame } from '../core/store'
import type { Alert, Severity } from '../core/types'
import { NoMission, fmtDateTime, fmtTime, useRun } from './shared'

const SEV_ORDER: Record<Severity, number> = { critical: 0, high: 1, medium: 2, low: 3 }
type Filter = 'all' | 'new' | 'mine' | 'open'

function Result() {
  const { t } = useTranslation()
  const { run, mission, mt } = useRun()
  const { startMission, openApp } = useGame.getState()
  if (!run?.result || !mission) return null
  const { score, max, checks } = run.result
  const pct = Math.round((score / max) * 100)
  return (
    <div className="result">
      <h3>{t('result.title')}</h3>
      <div className={`score-ring ${pct >= 85 ? 'great' : pct >= 60 ? 'good' : 'low'}`}>{pct}%</div>
      <p className="score-line">{t('result.score', { score, max, pct })}</p>
      <p>{t(pct >= 85 ? 'result.great' : pct >= 60 ? 'result.good' : 'result.low')}</p>
      <ul className="checks">
        {checks.map((c) => (
          <li key={c.id} className={c.ok ? 'ok' : 'miss'}>
            <span className="mark" aria-label={c.ok ? t('result.done') : t('result.missed')}>{c.ok ? '✓' : '✗'}</span>
            <div>
              <strong>{mt(`${c.key}.label`)}</strong>
              {!c.ok && <p>{mt(`${c.key}.tip`)}</p>}
            </div>
            <span className="pts">{c.ok ? c.points : 0}/{c.points}</span>
          </li>
        ))}
      </ul>
      <div className="row">
        <button className="btn primary" onClick={() => openApp('missions')}>{t('result.back')}</button>
        <button className="btn" onClick={() => startMission(mission.id)}>{t('result.retry')}</button>
      </div>
    </div>
  )
}

function ReportForm({ alert, onCancel }: { alert: Alert; onCancel: () => void }) {
  const { t } = useTranslation()
  const { run, mission, mt } = useRun()
  const { setReport, submitReport, setVerdict, setAlertStatus, assignAlert } = useGame.getState()
  const [error, setError] = useState('')
  if (!run || !mission) return null
  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    const v = run.report.verdict
    if (!v) { setError(t('soc.missingVerdict')); return }
    setVerdict(alert.id, v as never)
    if (run.report.escalate_to) assignAlert(alert.id, run.report.escalate_to)
    setAlertStatus(alert.id, 'closed')
    submitReport()
  }
  return (
    <form className="report" onSubmit={submit}>
      <h3>{t('soc.reportTitle', { id: alert.id })}</h3>
      {mission.report.map((f) => (
        <label key={f.id} className="field">
          <span>{mt(f.labelKey)}</span>
          {f.kind === 'select' ? (
            <select value={run.report[f.id] ?? ''} onChange={(e) => setReport(f.id, e.target.value)}>
              {f.options!.map((o) => <option key={o.value} value={o.value}>{mt(o.labelKey)}</option>)}
            </select>
          ) : f.kind === 'textarea' ? (
            <textarea rows={5} value={run.report[f.id] ?? ''} placeholder={f.hintKey ? mt(f.hintKey) : ''} onChange={(e) => setReport(f.id, e.target.value)} />
          ) : (
            <input value={run.report[f.id] ?? ''} placeholder={f.hintKey ? mt(f.hintKey) : ''} onChange={(e) => setReport(f.id, e.target.value)} />
          )}
        </label>
      ))}
      {error && <p className="error">{error}</p>}
      <div className="row">
        <button className="btn primary" type="submit">{t('soc.submit')}</button>
        <button className="btn ghost" type="button" onClick={onCancel}>{t('soc.cancel')}</button>
      </div>
    </form>
  )
}

export function SocDashboard() {
  const { t } = useTranslation()
  const { run, mt } = useRun()
  const [filter, setFilter] = useState<Filter>('all')
  const [selected, setSelected] = useState<string | null>(null)
  const [reporting, setReporting] = useState(false)
  const { assignAlert, setAlertStatus } = useGame.getState()

  const alerts = useMemo(() => {
    if (!run) return []
    return run.data.alerts
      .filter((a) =>
        filter === 'all' ? true : filter === 'new' ? a.status === 'new' : filter === 'mine' ? a.assignee === PLAYER : a.status !== 'closed',
      )
      .sort((a, b) => SEV_ORDER[a.severity] - SEV_ORDER[b.severity] || a.time.localeCompare(b.time))
  }, [run, filter])

  if (!run) return <NoMission />
  if (run.result) return <div className="app soc-app"><Result /></div>

  const contacts = run.data.contacts
  const nameOf = (id?: string) => (!id ? t('soc.unassigned') : id === PLAYER ? t('soc.you') : contacts.find((c) => c.id === id)?.name ?? id)
  const alert = run.data.alerts.find((a) => a.id === selected)
  const mine = alert?.assignee === PLAYER

  return (
    <div className="app soc-app">
      <div className="soc-main">
        <div className="soc-toolbar">
          <h3>{t('soc.queue')}</h3>
          <div className="seg">
            {(['all', 'new', 'mine', 'open'] as Filter[]).map((f) => (
              <button key={f} className={filter === f ? 'active' : ''} onClick={() => setFilter(f)}>{t(`soc.filters.${f}`)}</button>
            ))}
          </div>
        </div>
        <div className="table-wrap">
          <table className="grid alerts">
            <thead>
              <tr>
                <th>{t('soc.cols.severity')}</th>
                <th>{t('soc.cols.id')}</th>
                <th>{t('soc.cols.title')}</th>
                <th>{t('soc.cols.status')}</th>
                <th>{t('soc.cols.assignee')}</th>
                <th>{t('soc.cols.time')}</th>
              </tr>
            </thead>
            <tbody>
              {alerts.map((a) => (
                <tr key={a.id} className={selected === a.id ? 'selected' : ''} onClick={() => { setSelected(a.id); setReporting(false) }}>
                  <td><span className={`sev sev-${a.severity}`}>{t(`severity.${a.severity}`)}</span></td>
                  <td className="mono">{a.id}</td>
                  <td>{mt(a.titleKey)}</td>
                  <td><span className={`status st-${a.status}`}>{t(`status.${a.status}`)}</span></td>
                  <td>{nameOf(a.assignee)}</td>
                  <td className="mono">{fmtTime(a.time)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="team">
          <h4>{t('soc.team')}</h4>
          <ul>
            {contacts.map((c) => (
              <li key={c.id}>
                <span className={`dot ${c.online ? 'on' : 'off'}`} title={t(`presence.${c.online ? 'online' : 'offline'}`)} />
                <strong>{c.name}</strong> <span className="muted">{t(c.roleKey)}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <aside className="soc-detail">
        {!alert ? (
          <p className="muted">{t('soc.select')}</p>
        ) : reporting && mine && alert.status !== 'closed' ? (
          <ReportForm alert={alert} onCancel={() => setReporting(false)} />
        ) : (
          <div className="alert-detail">
            <div className="row between">
              <span className={`sev sev-${alert.severity}`}>{t(`severity.${alert.severity}`)}</span>
              <span className="mono muted">{alert.id}</span>
            </div>
            <h3>{mt(alert.titleKey)}</h3>
            <dl>
              <dt>{t('soc.cols.time')}</dt><dd className="mono">{fmtDateTime(alert.time)}</dd>
              <dt>{t('soc.source')}</dt><dd>{alert.source}</dd>
              <dt>{t('soc.cols.status')}</dt><dd><span className={`status st-${alert.status}`}>{t(`status.${alert.status}`)}</span></dd>
              <dt>{t('soc.cols.assignee')}</dt><dd>{nameOf(alert.assignee)}</dd>
              {alert.verdict && (<><dt>{t('soc.verdict')}</dt><dd>{t(`verdict.${alert.verdict}`)}</dd></>)}
            </dl>
            <h4>{t('soc.description')}</h4>
            <p>{mt(alert.descKey)}</p>
            {alert.status !== 'closed' && (
              <div className="actions">
                {!alert.assignee && <button className="btn primary" onClick={() => assignAlert(alert.id, PLAYER)}>{t('soc.assignToMe')}</button>}
                {mine && alert.status === 'new' && <button className="btn" onClick={() => setAlertStatus(alert.id, 'in_progress')}>{t('soc.startWork')}</button>}
                {mine && <button className="btn primary" onClick={() => setReporting(true)}>{t('soc.writeReport')}</button>}
                {alert.assignee && !mine && <p className="muted">{t('soc.notMine')}</p>}
              </div>
            )}
          </div>
        )}
      </aside>
    </div>
  )
}
