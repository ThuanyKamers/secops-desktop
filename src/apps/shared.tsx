import { useTranslation } from 'react-i18next'
import { useGame } from '../core/store'
import { getMission } from '../content'

/** Active mission run plus a translator bound to the mission's namespace. */
export function useRun() {
  const run = useGame((s) => s.run)
  const mission = run ? getMission(run.missionId) : undefined
  const { t: mt } = useTranslation(mission?.ns ?? 'ui')
  return { run, mission, mt }
}

export function NoMission() {
  const { t } = useTranslation()
  const openApp = useGame((s) => s.openApp)
  return (
    <div className="empty">
      <p>{t('noMission')}</p>
      <button className="btn" onClick={() => openApp('missions')}>{t('apps.missions')}</button>
    </div>
  )
}

export function fmtTime(iso: string) {
  return iso.slice(11, 19)
}

export function fmtDateTime(iso: string) {
  return `${iso.slice(0, 10)} ${iso.slice(11, 19)}`
}

export const isIPv4 = (s: string) =>
  /^(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}$/.test(s.trim())

export const isPrivateIp = (s: string) => /^(10\.|192\.168\.|172\.(1[6-9]|2\d|3[01])\.|127\.)/.test(s.trim())
