import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useGame } from '../core/store'

export function Login() {
  const { t, i18n } = useTranslation()
  const os = useGame((s) => s.os)
  const login = useGame((s) => s.login)
  const logout = useGame((s) => s.logout)
  const [now, setNow] = useState(() => new Date())
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 15000)
    return () => clearInterval(id)
  }, [])
  return (
    <main className={`login os-${os}`}>
      <div className="login-clock">
        <div className="lc-time">{now.toLocaleTimeString(i18n.language, { hour: '2-digit', minute: '2-digit' })}</div>
        <div className="lc-date">{now.toLocaleDateString(i18n.language, { weekday: 'long', day: 'numeric', month: 'long' })}</div>
      </div>
      <form className="login-box" onSubmit={(e) => { e.preventDefault(); login() }}>
        <div className="avatar" aria-hidden>👤</div>
        <div className="login-user">{t('login.user')}</div>
        <input type="password" placeholder={t('login.password')} aria-label={t('login.password')} autoFocus />
        <button className="btn primary" type="submit">{t('login.signIn')}</button>
        <p className="login-hint">{t('login.hint')}</p>
        <button type="button" className="link" onClick={logout}>{t('login.back')}</button>
      </form>
    </main>
  )
}
