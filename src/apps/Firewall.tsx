import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useGame } from '../core/store'
import { NoMission, isIPv4, isPrivateIp, useRun } from './shared'

export function Firewall() {
  const { t } = useTranslation()
  const { run } = useRun()
  const { blockIp, unblockIp } = useGame.getState()
  const [ip, setIp] = useState('')
  const [err, setErr] = useState('')
  if (!run) return <NoMission />
  const preexisting = new Set(['192.0.2.200'])

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    const v = ip.trim()
    if (!isIPv4(v)) { setErr(t('firewall.invalid')); return }
    if (isPrivateIp(v)) { setErr(t('firewall.internal')); return }
    setErr('')
    blockIp(v)
    setIp('')
  }

  return (
    <div className="app fw-app">
      <h3>{t('firewall.title')}</h3>
      <p className="muted">{t('firewall.intro')}</p>
      <form className="row" onSubmit={submit}>
        <input className="mono grow" value={ip} onChange={(e) => setIp(e.target.value)} placeholder={t('firewall.placeholder')} aria-label={t('firewall.placeholder')} spellCheck={false} />
        <button className="btn danger" type="submit">{t('firewall.block')}</button>
      </form>
      {err && <p className="error">{err}</p>}
      {run.data.blockedIps.length === 0 ? (
        <p className="muted">{t('firewall.empty')}</p>
      ) : (
        <table className="grid">
          <thead><tr><th>IP</th><th>{t('firewall.since')}</th><th /></tr></thead>
          <tbody>
            {run.data.blockedIps.map((b) => (
              <tr key={b}>
                <td className="mono">{b}</td>
                <td className="muted">{preexisting.has(b) ? t('firewall.preexisting') : t('firewall.now')}</td>
                <td className="right">{!preexisting.has(b) && <button className="btn small ghost" onClick={() => unblockIp(b)}>{t('firewall.unblock')}</button>}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}
