import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useGame } from '../core/store'
import type { AppId } from '../core/types'
import { LANGS } from '../i18n'
import { APP_COMPONENTS } from '../apps'
import { AppIcon } from './AppIcon'
import { Window } from './Window'

const ALL_APPS: AppId[] = ['missions', 'wiki', 'soc', 'siem', 'intel', 'firewall', 'directory']

function useClock() {
  const [now, setNow] = useState(() => new Date())
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 15000)
    return () => clearInterval(id)
  }, [])
  return now
}

export function LangSelect({ className = '' }: { className?: string }) {
  const { t } = useTranslation()
  const lang = useGame((s) => s.lang)
  const setLang = useGame((s) => s.setLang)
  return (
    <select className={`lang-select ${className}`} aria-label={t('taskbar.language')} value={lang} onChange={(e) => setLang(e.target.value as never)}>
      {LANGS.map((l) => <option key={l.id} value={l.id}>{l.label}</option>)}
    </select>
  )
}

function Clock({ withDate = false }: { withDate?: boolean }) {
  const now = useClock()
  const { i18n } = useTranslation()
  const time = now.toLocaleTimeString(i18n.language, { hour: '2-digit', minute: '2-digit' })
  const date = now.toLocaleDateString(i18n.language, { day: '2-digit', month: 'short' })
  return <span className="clock">{withDate ? `${date}  ${time}` : time}</span>
}

function WindowsTaskbar() {
  const { t } = useTranslation()
  const windows = useGame((s) => s.windows)
  const zTop = useGame((s) => s.zTop)
  const { toggleMin, openApp, logout } = useGame.getState()
  const [menu, setMenu] = useState(false)
  return (
    <>
      {menu && (
        <div className="start-menu" onMouseLeave={() => setMenu(false)}>
          <div className="start-apps">
            {ALL_APPS.map((a) => (
              <button key={a} onClick={() => { openApp(a); setMenu(false) }}>
                <AppIcon app={a} size={32} />
                <span>{t(`apps.${a}`)}</span>
              </button>
            ))}
          </div>
          <div className="start-foot">
            <span className="user-chip">👤 {t('login.user')}</span>
            <LangSelect />
            <button onClick={logout}>⏻ {t('taskbar.logout')}</button>
          </div>
        </div>
      )}
      <footer className="taskbar win-taskbar">
        <div className="tb-center">
          <button className="tb-start" aria-label={t('taskbar.start')} onClick={() => setMenu((m) => !m)}>
            <svg viewBox="0 0 24 24" width="20" height="20"><path fill="#38bdf8" d="M3 3h8.5v8.5H3zM12.5 3H21v8.5h-8.5zM3 12.5h8.5V21H3zM12.5 12.5H21V21h-8.5z" /></svg>
          </button>
          {ALL_APPS.map((a) => {
            const w = windows.find((x) => x.app === a)
            return (
              <button key={a} className={`tb-app ${w ? 'open' : ''} ${w && !w.minimized && w.z === zTop ? 'active' : ''}`} title={t(`apps.${a}`)} onClick={() => (w ? toggleMin(a) : openApp(a))}>
                <AppIcon app={a} size={26} />
              </button>
            )
          })}
        </div>
        <div className="tb-right">
          <LangSelect className="compact" />
          <Clock withDate />
        </div>
      </footer>
    </>
  )
}

function MacBars() {
  const { t } = useTranslation()
  const windows = useGame((s) => s.windows)
  const zTop = useGame((s) => s.zTop)
  const { toggleMin, openApp, logout } = useGame.getState()
  const top = windows.find((w) => w.z === zTop && !w.minimized)
  return (
    <>
      <header className="menubar mac-menubar">
        <div className="mb-left">
          <button className="mb-logo" onClick={logout} title={t('taskbar.logout')}>
            <svg viewBox="0 0 24 24" width="15" height="15"><path fill="currentColor" d="M12 2 4 5v6c0 5 3.4 9.4 8 11 4.6-1.6 8-6 8-11V5l-8-3z" /></svg>
          </button>
          <strong>{top ? t(`apps.${top.app}`) : 'Finder'}</strong>
        </div>
        <div className="mb-right">
          <LangSelect className="compact" />
          <Clock withDate />
        </div>
      </header>
      <footer className="dock mac-dock">
        {ALL_APPS.map((a) => {
          const w = windows.find((x) => x.app === a)
          return (
            <button key={a} className={`dock-app ${w ? 'open' : ''}`} title={t(`apps.${a}`)} onClick={() => (w ? toggleMin(a) : openApp(a))}>
              <AppIcon app={a} size={44} />
            </button>
          )
        })}
      </footer>
    </>
  )
}

function LinuxBars() {
  const { t } = useTranslation()
  const windows = useGame((s) => s.windows)
  const { toggleMin, openApp, logout } = useGame.getState()
  return (
    <>
      <header className="menubar linux-topbar">
        <div className="mb-left"><span className="activities">{t('taskbar.start')}</span></div>
        <div className="mb-center"><Clock withDate /></div>
        <div className="mb-right">
          <LangSelect className="compact" />
          <button className="mb-power" onClick={logout} title={t('taskbar.logout')}>⏻</button>
        </div>
      </header>
      <nav className="dock linux-dock">
        {ALL_APPS.map((a) => {
          const w = windows.find((x) => x.app === a)
          return (
            <button key={a} className={`dock-app ${w ? 'open' : ''}`} title={t(`apps.${a}`)} onClick={() => (w ? toggleMin(a) : openApp(a))}>
              <AppIcon app={a} size={40} />
            </button>
          )
        })}
      </nav>
    </>
  )
}

export function Desktop() {
  const { t } = useTranslation()
  const os = useGame((s) => s.os)!
  const windows = useGame((s) => s.windows)
  const openApp = useGame((s) => s.openApp)
  return (
    <div className={`desktop os-${os}`}>
      <div className="desktop-icons">
        {ALL_APPS.map((a) => (
          <button key={a} className="desk-icon" onDoubleClick={() => openApp(a)} onClick={(e) => { if (e.detail === 0 || window.matchMedia('(pointer: coarse)').matches) openApp(a) }}>
            <AppIcon app={a} size={46} />
            <span>{t(`apps.${a}`)}</span>
          </button>
        ))}
      </div>
      {windows.map((w) => {
        const C = APP_COMPONENTS[w.app]
        return (
          <Window key={w.app} win={w}>
            <C />
          </Window>
        )
      })}
      {os === 'windows' && <WindowsTaskbar />}
      {os === 'macos' && <MacBars />}
      {os === 'linux' && <LinuxBars />}
    </div>
  )
}
