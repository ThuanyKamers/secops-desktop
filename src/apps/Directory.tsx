import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useGame } from '../core/store'
import { NoMission, useRun } from './shared'

export function Directory() {
  const { t } = useTranslation()
  const { run } = useRun()
  const setLocked = useGame((s) => s.setLocked)
  const [q, setQ] = useState('')
  const [sel, setSel] = useState<string | null>(null)
  if (!run) return <NoMission />
  const needle = q.toLowerCase()
  const people = run.data.employees.filter((e) =>
    [e.name, e.username, e.department, e.location, e.device ?? ''].some((v) => v.toLowerCase().includes(needle)),
  )
  const p = run.data.employees.find((e) => e.username === sel)
  return (
    <div className="app dir-app">
      <div className="dir-list">
        <input className="grow" value={q} onChange={(e) => setQ(e.target.value)} placeholder={t('directory.search')} aria-label={t('directory.search')} />
        <div className="table-wrap">
          <table className="grid">
            <thead>
              <tr>
                <th>{t('directory.cols.name')}</th>
                <th>{t('directory.cols.user')}</th>
                <th>{t('directory.cols.dept')}</th>
                <th>{t('directory.cols.status')}</th>
              </tr>
            </thead>
            <tbody>
              {people.map((e) => (
                <tr key={e.username} className={sel === e.username ? 'selected' : ''} onClick={() => setSel(e.username)}>
                  <td>{e.name}</td>
                  <td className="mono">{e.username}</td>
                  <td>{e.department}</td>
                  <td><span className={`status ${e.locked ? 'st-locked' : 'st-active'}`}>{e.locked ? t('directory.locked') : t('directory.active')}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {p && (
        <aside className="dir-detail">
          <div className="avatar big" aria-hidden>{p.name.split(' ').map((x) => x[0]).join('')}</div>
          <h3>{p.name}</h3>
          <dl>
            <dt>{t('directory.cols.user')}</dt><dd className="mono">{p.username}</dd>
            <dt>{t('directory.email')}</dt><dd className="mono">{p.email}</dd>
            <dt>{t('directory.title')}</dt><dd>{p.title}</dd>
            <dt>{t('directory.cols.dept')}</dt><dd>{p.department}</dd>
            <dt>{t('directory.cols.location')}</dt><dd>{p.location}</dd>
            {p.device && (<><dt>{t('directory.cols.device')}</dt><dd className="mono">{p.device}</dd></>)}
          </dl>
          {p.locked ? (
            <button className="btn" onClick={() => setLocked(p.username, false)}>{t('directory.unlock')}</button>
          ) : (
            <button className="btn danger" onClick={() => setLocked(p.username, true)}>{t('directory.lock')}</button>
          )}
          <p className="muted small">{t('directory.lockNote')}</p>
        </aside>
      )}
    </div>
  )
}
