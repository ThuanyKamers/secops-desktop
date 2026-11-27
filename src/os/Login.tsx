import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useGame } from '../core/store'
import { signInWithEmail, signInWithGitHub, signOut, useAccount } from '../core/cloud'

function initials(name: string) {
  return name.trim().split(/\s+/).filter(Boolean).slice(0, 2).map((p) => p[0]).join('').toUpperCase() || '?'
}

export function Login() {
  const { t, i18n } = useTranslation()
  const os = useGame((s) => s.os)
  const login = useGame((s) => s.login)
  const logout = useGame((s) => s.logout)
  const { status, profile, error, emailSent } = useAccount()
  const [email, setEmail] = useState('')
  const [now, setNow] = useState(() => new Date())
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 15000)
    return () => clearInterval(id)
  }, [])

  const name = profile?.display_name || (profile ? `@${profile.username}` : '')

  return (
    <main className={`login os-${os}`}>
      <div className="login-clock">
        <div className="lc-time">{now.toLocaleTimeString(i18n.language, { hour: '2-digit', minute: '2-digit' })}</div>
        <div className="lc-date">{now.toLocaleDateString(i18n.language, { weekday: 'long', day: 'numeric', month: 'long' })}</div>
      </div>

      <div className="login-box">
        {status === 'signedIn' ? (
          <>
            {profile?.avatar_url ? (
              <img className="avatar photo" src={profile.avatar_url} alt="" />
            ) : (
              <div className="avatar initials" aria-hidden>{initials(profile?.display_name || profile?.username || '?')}</div>
            )}
            <div className="login-user">{name || '…'}</div>
            {profile && profile.display_name && <div className="login-hint">@{profile.username}</div>}
            <button className="btn primary" autoFocus onClick={login}>{t('login.signIn')}</button>
            <button type="button" className="link" onClick={() => void signOut()}>{t('login.switchAccount')}</button>
          </>
        ) : (
          <>
            <div className="avatar" aria-hidden>👤</div>
            <div className="login-user">{t('login.user')}</div>
            <button className="btn primary" disabled={status === 'loading'} onClick={() => void signInWithGitHub()}>{t('account.github')}</button>
            <div className="login-or"><span>{t('login.or')}</span></div>
            <form className="login-email" onSubmit={(e) => { e.preventDefault(); if (email) void signInWithEmail(email) }}>
              <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder={t('account.emailPlaceholder')} aria-label={t('account.emailPlaceholder')} />
              <button className="btn ghost-light" type="submit" disabled={status === 'loading'}>{t('account.emailLink')}</button>
            </form>
            {emailSent && <p className="login-hint" role="status">{t('account.emailSent')}</p>}
            {error && <p className="login-error" role="alert">{error}</p>}
            <div className="login-or"><span>{t('login.or')}</span></div>
            <button className="btn ghost-light" onClick={login}>{t('login.guest')}</button>
            <p className="login-hint">{t('login.guestHint')}</p>
          </>
        )}
        <button type="button" className="link" onClick={logout}>{t('login.back')}</button>
      </div>
    </main>
  )
}
