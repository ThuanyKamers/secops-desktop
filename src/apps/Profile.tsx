import { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useGame } from '../core/store'
import { MISSIONS, getMission } from '../content'
import { BADGES, BADGE_XP, LEVELS, playerStats, streaks } from '../core/progress'
import { ActivityCalendar, ScoreChart } from './ProfileCharts'
import {
  USERNAME_RE,
  deleteAccount,
  removeAvatar,
  uploadAvatar,
  fetchLeaderboard,
  signInWithEmail,
  signInWithGitHub,
  signOut,
  updateProfile,
  useAccount,
  type RankRow,
} from '../core/cloud'

type Tab = 'progress' | 'badges' | 'history' | 'ranking'

function initials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean)
  return (parts.length ? parts.slice(0, 2).map((p) => p[0]) : ['?']).join('').toUpperCase()
}

function fmtDuration(sec: number) {
  const m = Math.floor(sec / 60)
  const s = sec % 60
  return `${m}:${String(s).padStart(2, '0')}`
}

function AvatarPicker({ fallback }: { fallback: string }) {
  const { t } = useTranslation()
  const { status, profile } = useAccount()
  const [busy, setBusy] = useState(false)
  const url = profile?.avatar_url
  const face = url ? <img src={url} alt="" /> : <span aria-hidden>{fallback}</span>
  if (status !== 'signedIn') return <div className="pf-avatar" title={t('account.photoSignIn')}>{face}</div>
  return (
    <div className="pf-avatar-wrap">
      <label className={`pf-avatar editable ${busy ? 'busy' : ''}`} title={t('account.photoChange')}>
        {face}
        <span className="pf-avatar-edit" aria-hidden>📷</span>
        <input
          type="file"
          accept="image/png,image/jpeg,image/webp,image/gif"
          className="visually-hidden"
          aria-label={t('account.photoChange')}
          disabled={busy}
          onChange={async (e) => {
            const f = e.target.files?.[0]
            e.target.value = ''
            if (!f) return
            setBusy(true)
            await uploadAvatar(f)
            setBusy(false)
          }}
        />
      </label>
      {url && !busy && (
        <button className="link small" onClick={async () => { setBusy(true); await removeAvatar(); setBusy(false) }}>{t('account.photoRemove')}</button>
      )}
      <span className="muted small pf-photo-hint">{busy ? t('account.photoUploading') : t('account.photoHint')}</span>
    </div>
  )
}

function AccountCard() {
  const { t } = useTranslation()
  const { status, profile, error, emailSent, syncing } = useAccount()
  const [email, setEmail] = useState('')
  const [username, setUsername] = useState('')
  const [editing, setEditing] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)
  const errText = error === 'username_taken' ? t('account.usernameTaken') : error?.startsWith('avatar_') ? t(`account.${error.replace('avatar_', 'avatarErr.')}`) : error

  if (status === 'loading') return <section className="account-card muted small">{t('account.loading')}</section>

  if (status === 'signedOut')
    return (
      <section className="account-card">
        <p><strong>{t('account.joinTitle')}</strong></p>
        <p className="muted small">{t('account.joinText')}</p>
        <div className="row wrap">
          <button className="btn primary" onClick={() => void signInWithGitHub()}>{t('account.github')}</button>
        </div>
        <form className="row wrap" onSubmit={(e) => { e.preventDefault(); if (email) void signInWithEmail(email) }}>
          <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder={t('account.emailPlaceholder')} aria-label={t('account.emailPlaceholder')} />
          <button className="btn" type="submit">{t('account.emailLink')}</button>
        </form>
        {emailSent && <p className="success small">{t('account.emailSent')}</p>}
        {errText && <p className="error small" role="alert">{errText}</p>}
        <p className="muted small">{t('account.privacy')}</p>
      </section>
    )

  return (
    <section className="account-card">
      <div className="row wrap between">
        {editing ? (
          <form className="row wrap" onSubmit={async (e) => { e.preventDefault(); if (await updateProfile({ username })) setEditing(false) }}>
            <span>@</span>
            <input value={username} onChange={(e) => setUsername(e.target.value.toLowerCase())} pattern={USERNAME_RE.source} maxLength={20} aria-label={t('account.username')} title={t('account.usernameRule')} autoFocus />
            <button className="btn small primary" type="submit" disabled={!USERNAME_RE.test(username)}>{t('account.save')}</button>
            <button className="btn small ghost" type="button" onClick={() => setEditing(false)}>{t('account.cancel')}</button>
          </form>
        ) : (
          <p>
            <strong>@{profile?.username ?? '…'}</strong>{' '}
            <button className="btn small ghost" onClick={() => { setUsername(profile?.username ?? ''); setEditing(true) }}>{t('account.edit')}</button>
          </p>
        )}
        <span className="muted small">{syncing ? t('account.syncing') : t('account.synced')}</span>
      </div>
      {errText && <p className="error small" role="alert">{errText}</p>}
      <div className="row wrap">
        <button className="btn small" onClick={() => void signOut()}>{t('account.signOut')}</button>
        {confirmDelete ? (
          <button className="btn small danger" onClick={() => void deleteAccount()}>{t('account.confirmDelete')}</button>
        ) : (
          <button className="btn small ghost" onClick={() => setConfirmDelete(true)}>{t('account.delete')}</button>
        )}
      </div>
    </section>
  )
}

function Ranking() {
  const { t } = useTranslation()
  const { status, profile } = useAccount()
  const [rows, setRows] = useState<RankRow[] | null>(null)
  const [failed, setFailed] = useState(false)
  useEffect(() => {
    let alive = true
    fetchLeaderboard().then((r) => alive && setRows(r)).catch(() => alive && setFailed(true))
    return () => { alive = false }
  }, [])
  if (failed) return <p className="muted pf-empty">{t('ranking.error')}</p>
  if (!rows) return <p className="muted pf-empty">{t('account.loading')}</p>
  return (
    <div>
      {status !== 'signedIn' && <p className="muted small">{t('ranking.signIn')}</p>}
      {rows.length === 0 ? (
        <p className="muted pf-empty">{t('ranking.empty')}</p>
      ) : (
        <table className="pf-history">
          <thead>
            <tr><th>#</th><th>{t('ranking.player')}</th><th>XP</th><th>{t('profile.stats.completed')}</th><th>{t('profile.stats.badges')}</th></tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.username} className={r.username === profile?.username ? 'me' : ''}>
                <td>{r.rank}</td>
                <td className="rk-player">
                  {r.avatar_url ? <img className="rk-avatar" src={r.avatar_url} alt="" loading="lazy" /> : <span className="rk-avatar" aria-hidden>{initials(r.display_name || r.username)}</span>}
                  {r.display_name || r.username} <span className="muted small">@{r.username}</span>
                </td>
                <td>{r.xp}</td>
                <td>{r.missions}</td>
                <td>{r.badges}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}

export function Profile() {
  const { t, i18n } = useTranslation()
  const history = useGame((s) => s.history)
  const name = useGame((s) => s.playerName)
  const setName = useGame((s) => s.setPlayerName)
  const stats = useMemo(() => playerStats(history, MISSIONS), [history])
  const streak = useMemo(() => streaks(history), [history])
  const [tab, setTab] = useState<Tab>('progress')
  const { level, next, progress } = stats.level
  const levelIdx = Math.min(level, LEVELS.length) - 1

  return (
    <div className="app profile-app">
      <header className="pf-head">
        <AvatarPicker fallback={initials(name || t('profile.defaultName'))} />
        <div className="pf-id">
          <input
            className="pf-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onBlur={() => {
              const p = useAccount.getState().profile
              if (p && (p.display_name ?? '') !== name.trim() && name.trim()) void updateProfile({ display_name: name.trim() })
            }}
            placeholder={t('profile.defaultName')}
            aria-label={t('profile.nameLabel')}
            maxLength={24}
          />
          <p className="pf-level">
            {t('profile.level', { level })} · <strong>{t(`levels.${levelIdx}`)}</strong>
            {streak.current > 0 && (
              <span className={`streak-chip ${streak.playedToday ? '' : 'at-risk'}`} title={streak.playedToday ? t('streak.safe') : t('streak.atRisk')}>
                🔥 {t('streak.days', { count: streak.current })}
              </span>
            )}
          </p>
          <div className="xp-bar" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(progress * 100)} aria-label={t('profile.xpLabel')}>
            <span style={{ width: `${Math.round(progress * 100)}%` }} />
          </div>
          <p className="muted small">{next === null ? t('profile.maxLevel', { xp: stats.xp }) : t('profile.xpToNext', { xp: stats.xp, next })}</p>
        </div>
      </header>

      <AccountCard />

      <dl className="pf-stats">
        <div><dt>{t('profile.stats.xp')}</dt><dd>{stats.xp}</dd></div>
        <div><dt>{t('profile.stats.completed')}</dt><dd>{stats.completed}/{MISSIONS.length}</dd></div>
        <div><dt>{t('profile.stats.avg')}</dt><dd>{stats.avgPct}%</dd></div>
        <div><dt>{t('profile.stats.badges')}</dt><dd>{stats.badges.length}/{BADGES.length}</dd></div>
      </dl>

      <div className="pf-tabs" role="tablist">
        {(['progress', 'badges', 'history', 'ranking'] as Tab[]).map((x) => (
          <button key={x} role="tab" aria-selected={tab === x} className={tab === x ? 'on' : ''} onClick={() => setTab(x)}>
            {t(`profile.tabs.${x}`)}
          </button>
        ))}
      </div>

      {tab === 'progress' && (
        <div className="pf-progress">
          {!streak.playedToday && <p className="streak-nudge">{streak.current > 0 ? t('streak.keepGoing', { count: streak.current }) : t('streak.start')}</p>}
          <ScoreChart history={history} />
          <ActivityCalendar history={history} />
          <p className="muted small">{t('streak.best', { count: streak.best })}</p>
        </div>
      )}

      {tab === 'badges' && (
        <ul className="badge-grid">
          {BADGES.map((b) => {
            const has = stats.badges.includes(b.id)
            return (
              <li key={b.id} className={has ? 'earned' : 'locked'}>
                <span className="bd-icon" aria-hidden>{b.icon}</span>
                <strong>{t(`badges.${b.id}.name`)}</strong>
                <span className="small">{t(`badges.${b.id}.desc`)}</span>
                <span className="bd-state small">{has ? `+${BADGE_XP} XP` : t('profile.locked')}</span>
              </li>
            )
          })}
        </ul>
      )}

      {tab === 'history' &&
        (history.length === 0 ? (
          <p className="muted pf-empty">{t('profile.noHistory')}</p>
        ) : (
          <table className="pf-history">
            <thead>
              <tr><th>{t('profile.cols.date')}</th><th>{t('profile.cols.mission')}</th><th>{t('profile.cols.score')}</th><th>{t('profile.cols.time')}</th></tr>
            </thead>
            <tbody>
              {[...history].reverse().map((a) => {
                const m = getMission(a.missionId)
                return (
                  <tr key={a.at}>
                    <td>{new Date(a.at).toLocaleDateString(i18n.language, { day: '2-digit', month: 'short', year: 'numeric' })}</td>
                    <td>{m ? t('hub.title', { ns: m.ns }) : a.missionId}</td>
                    <td>{a.pct}%</td>
                    <td className="mono">{fmtDuration(a.durationSec)}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        ))}

      {tab === 'ranking' && (
        <Ranking />
      )}
    </div>
  )
}
