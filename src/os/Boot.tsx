import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useGame } from '../core/store'
import type { OsId } from '../core/types'
import { LangSelect } from './Desktop'

const OS_LIST: { id: OsId; logo: string }[] = [
  { id: 'windows', logo: 'M3 3h8.5v8.5H3zM12.5 3H21v8.5h-8.5zM3 12.5h8.5V21H3zM12.5 12.5H21V21h-8.5z' },
  { id: 'macos', logo: 'M16.4 12.6c0-2.4 2-3.5 2-3.6-1.1-1.6-2.8-1.8-3.4-1.8-1.4-.2-2.8.8-3.5.8-.7 0-1.8-.8-3-.8-1.5 0-3 .9-3.8 2.3-1.6 2.8-.4 7 1.2 9.3.8 1.1 1.7 2.4 2.9 2.3 1.2 0 1.6-.7 3-.7s1.8.7 3 .7c1.3 0 2.1-1.1 2.8-2.3.9-1.3 1.3-2.6 1.3-2.6s-2.5-1-2.5-3.6zM14.1 5.6c.6-.8 1.1-1.9 1-3-1 0-2.1.6-2.8 1.4-.6.7-1.1 1.8-1 2.9 1.1.1 2.1-.5 2.8-1.3z' },
  { id: 'linux', logo: 'M12 2c-2.2 0-3.6 1.9-3.6 4.6 0 1.3.3 2.2-.4 3.4-.9 1.4-2.6 3.3-2.6 6 0 .8.2 1.6.6 2.2-.8.4-1.6 1-1.6 1.8 0 1.2 2 1.3 3.7 1.6 1.2.2 2.3.4 3.9.4s2.7-.2 3.9-.4c1.7-.3 3.7-.4 3.7-1.6 0-.8-.8-1.4-1.6-1.8.4-.6.6-1.4.6-2.2 0-2.7-1.7-4.6-2.6-6-.7-1.2-.4-2.1-.4-3.4C15.6 3.9 14.2 2 12 2zm-1.5 4.3c.5 0 .8.5.8 1.1s-.3 1.1-.8 1.1-.8-.5-.8-1.1.4-1.1.8-1.1zm3 0c.5 0 .8.5.8 1.1s-.3 1.1-.8 1.1-.8-.5-.8-1.1.3-1.1.8-1.1zM12 9.2l1.8 1-1.8 1-1.8-1 1.8-1z' },
]

export function Boot() {
  const { t } = useTranslation()
  const saved = useGame((s) => s.os)
  const chooseOs = useGame((s) => s.chooseOs)
  const [os, setOs] = useState<OsId>(saved ?? 'windows')
  return (
    <main className="boot">
      <div className="boot-card">
        <div className="boot-head">
          <svg viewBox="0 0 64 64" width="56" height="56" aria-hidden><path d="M32 6 54 14v16c0 14-9.5 24-22 28C19.5 54 10 44 10 30V14z" fill="none" stroke="#38bdf8" strokeWidth="4" /><path d="m22 32 7 7 13-14" fill="none" stroke="#38bdf8" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" /></svg>
          <h1>{t('boot.title')}</h1>
          <p>{t('boot.subtitle')}</p>
        </div>
        <label className="boot-lang">
          <span>{t('boot.language')}</span>
          <LangSelect />
        </label>
        <h2>{t('boot.chooseOs')}</h2>
        <div className="os-grid" role="radiogroup" aria-label={t('boot.chooseOs')}>
          {OS_LIST.map((o) => (
            <button key={o.id} role="radio" aria-checked={os === o.id} className={`os-card os-card-${o.id} ${os === o.id ? 'selected' : ''}`} onClick={() => setOs(o.id)}>
              <div className="laptop">
                <div className="laptop-screen"><svg viewBox="0 0 24 24" width="34" height="34"><path fill="currentColor" d={o.logo} /></svg></div>
                <div className="laptop-base" />
              </div>
              <span>{t(`boot.os.${o.id}`)}</span>
            </button>
          ))}
        </div>
        <button className="btn primary big" onClick={() => chooseOs(os)}>{t('boot.start')}</button>
        <footer className="boot-foot">
          <a href="https://github.com/ThuanyKamers" target="_blank" rel="noreferrer">{t('boot.footer')}</a>
        </footer>
      </div>
    </main>
  )
}
