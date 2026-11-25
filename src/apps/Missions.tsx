import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useGame } from '../core/store'
import { TRACKS, missionsOf } from '../content'
import type { Mission } from '../core/types'

function MissionCard({ m }: { m: Mission }) {
  const { t } = useTranslation()
  const { t: mt } = useTranslation(m.ns)
  const run = useGame((s) => s.run)
  const best = useGame((s) => s.completed[m.id])
  const { startMission, openWiki, abandonMission } = useGame.getState()
  const [confirm, setConfirm] = useState(false)
  const active = run?.missionId === m.id
  return (
    <article className={`mission-card ${active ? 'active' : ''}`}>
      <div className="mc-head">
        <h4>{mt('hub.title')}</h4>
        <span className="difficulty" title={t('hub.difficulty')}>{'●'.repeat(m.difficulty)}{'○'.repeat(3 - m.difficulty)}</span>
      </div>
      <p>{mt('hub.summary')}</p>
      <p className="skills">{mt('hub.skills')}</p>
      {best !== undefined && <p className="best">{t('hub.best', { score: best })}</p>}
      <div className="mc-actions">
        {active ? (
          <>
            <button className="btn primary" onClick={() => openWiki(m.startPage)}>{t('hub.openBriefing')}</button>
            {confirm ? (
              <button className="btn danger" onClick={() => { startMission(m.id); setConfirm(false) }}>{t('hub.confirmRestart')}</button>
            ) : (
              <button className="btn" onClick={() => setConfirm(true)}>{t('hub.restart')}</button>
            )}
            <button className="btn ghost" onClick={abandonMission}>{t('hub.abandon')}</button>
          </>
        ) : (
          <button className="btn primary" onClick={() => startMission(m.id)}>{t('hub.start')}</button>
        )}
      </div>
    </article>
  )
}

export function Missions() {
  const { t } = useTranslation()
  return (
    <div className="app missions-app">
      <div className="hub-intro">
        <h2>{t('hub.title')}</h2>
        <p>{t('hub.intro')}</p>
      </div>
      {TRACKS.map((tr) => {
        const list = missionsOf(tr.id)
        return (
          <section key={tr.id} className={`track ${tr.available ? '' : 'locked'}`}>
            <h3><span aria-hidden>{tr.icon}</span> {t(tr.nameKey)}</h3>
            <p className="track-desc">{t(tr.descKey)}</p>
            {tr.available && list.length > 0 ? (
              <div className="mission-list">{list.map((m) => <MissionCard key={m.id} m={m} />)}</div>
            ) : (
              <span className="badge">{t('hub.comingSoon')}</span>
            )}
          </section>
        )
      })}
    </div>
  )
}
