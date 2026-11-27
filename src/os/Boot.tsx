import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useGame } from '../core/store'
import type { OsId } from '../core/types'
import { LangSelect } from './Desktop'
import { OS_LIST } from './osList'


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
                <div className="laptop-screen"><svg viewBox="0 0 24 24" width="34" height="34"><path fill="currentColor" fillRule="evenodd" d={o.logo} /></svg></div>
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
