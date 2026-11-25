import { useRef, type ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { useGame, type WindowState } from '../core/store'
import { AppIcon } from './AppIcon'

export function Window({ win, children }: { win: WindowState; children: ReactNode }) {
  const { t } = useTranslation()
  const os = useGame((s) => s.os)
  const isTop = useGame((s) => s.zTop === win.z)
  const { focusApp, closeApp, toggleMin, toggleMax, moveApp } = useGame.getState()
  const drag = useRef<{ dx: number; dy: number } | null>(null)
  const small = typeof window !== 'undefined' && window.innerWidth < 760
  const maximized = win.maximized || small

  const onPointerDown = (e: React.PointerEvent) => {
    if (maximized || (e.target as HTMLElement).closest('button')) return
    drag.current = { dx: e.clientX - win.x, dy: e.clientY - win.y }
    ;(e.currentTarget as HTMLElement).setPointerCapture(e.pointerId)
  }
  const onPointerMove = (e: React.PointerEvent) => {
    if (!drag.current) return
    const x = Math.max(-win.w + 120, Math.min(window.innerWidth - 120, e.clientX - drag.current.dx))
    const y = Math.max(0, Math.min(window.innerHeight - 80, e.clientY - drag.current.dy))
    moveApp(win.app, x, y)
  }
  const onPointerUp = () => { drag.current = null }

  const controls = (
    <div className="win-controls">
      <button className="wc wc-min" aria-label={t('window.minimize')} title={t('window.minimize')} onClick={() => toggleMin(win.app)} />
      <button className="wc wc-max" aria-label={t('window.maximize')} title={t('window.maximize')} onClick={() => toggleMax(win.app)} />
      <button className="wc wc-close" aria-label={t('window.close')} title={t('window.close')} onClick={() => closeApp(win.app)} />
    </div>
  )

  return (
    <section
      className={`window ${isTop ? 'focused' : ''} ${maximized ? 'maximized' : ''}`}
      style={{ zIndex: win.z, display: win.minimized ? 'none' : undefined, ...(maximized ? {} : { left: win.x, top: win.y, width: win.w, height: win.h }) }}
      onPointerDown={() => focusApp(win.app)}
      role="dialog"
      aria-label={t(`apps.${win.app}`)}
    >
      <header
        className="win-title"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onDoubleClick={() => toggleMax(win.app)}
      >
        {os === 'macos' && controls}
        <AppIcon app={win.app} size={18} />
        <span className="win-name">{t(`apps.${win.app}`)}</span>
        {os !== 'macos' && controls}
      </header>
      <div className="win-body">{children}</div>
    </section>
  )
}
