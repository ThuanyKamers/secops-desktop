import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useGame } from '../core/store'
import { Login } from './Login'
import { OS_LIST } from './osList'

// Intro after "Power on": the whole laptop is on screen, it boots, then the camera
// zooms into the display until the display becomes the real login screen.
type Step = 'off' | 'boot' | 'login' | 'zoom'

const TIMINGS = { boot: 700, login: 2300, zoom: 3100, done: 4300 }

function viewport() {
  return { w: window.innerWidth, h: window.innerHeight }
}

export function LaptopIntro() {
  const { t } = useTranslation()
  const os = useGame((s) => s.os)!
  const finish = useGame((s) => s.finishIntro)
  const [step, setStep] = useState<Step>('off')
  const [vp] = useState(viewport)
  const lidRef = useRef<HTMLDivElement>(null)
  const screenRef = useRef<HTMLDivElement>(null)
  const [zoom, setZoom] = useState<string | undefined>()

  // the screen keeps the viewport's aspect ratio, so the zoom lands exactly on it
  const scale = Math.min((vp.w * (vp.w < 700 ? 0.8 : 0.56)) / vp.w, (vp.h * 0.55) / vp.h)
  const screenW = Math.round(vp.w * scale)
  const screenH = Math.round(vp.h * scale)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      finish()
      return
    }
    const timers = [
      setTimeout(() => setStep('boot'), TIMINGS.boot),
      setTimeout(() => setStep('login'), TIMINGS.login),
      setTimeout(() => setStep('zoom'), TIMINGS.zoom),
      setTimeout(finish, TIMINGS.done),
    ]
    const skip = (e: KeyboardEvent) => e.key === 'Escape' && finish()
    window.addEventListener('keydown', skip)
    return () => {
      timers.forEach(clearTimeout)
      window.removeEventListener('keydown', skip)
    }
  }, [finish])

  useLayoutEffect(() => {
    if (step !== 'zoom' || !lidRef.current || !screenRef.current) return
    const lid = lidRef.current.getBoundingClientRect()
    const scr = screenRef.current.getBoundingClientRect()
    // move the screen's centre to the viewport's centre and scale it to fill it
    const k = vp.w / scr.width
    const ox = scr.left + scr.width / 2 - lid.left
    const oy = scr.top + scr.height / 2 - lid.top
    const dx = vp.w / 2 - (scr.left + scr.width / 2)
    const dy = vp.h / 2 - (scr.top + scr.height / 2)
    lidRef.current.style.transformOrigin = `${ox}px ${oy}px`
    setZoom(`translate(${dx}px, ${dy}px) scale(${k})`)
  }, [step, vp])

  const logo = OS_LIST.find((o) => o.id === os)!.logo

  return (
    <main className={`intro intro-${os} step-${step}`} onClick={finish} aria-label={t('boot.start')}>
      <div className="intro-laptop" ref={lidRef} style={{ transform: zoom }}>
        <div className="intro-lid" style={{ padding: Math.max(8, screenW * 0.025) }}>
          <span className="intro-cam" />
          <div className="intro-screen" ref={screenRef} style={{ width: screenW, height: screenH }}>
            {step === 'boot' && (
              <div className={`boot-splash splash-${os}`}>
                <svg viewBox="0 0 24 24" width={screenH * 0.16} height={screenH * 0.16} aria-hidden><path fill="currentColor" d={logo} /></svg>
                {os === 'macos' ? <div className="splash-bar"><span /></div> : <div className="splash-dots"><i /><i /><i /><i /><i /></div>}
              </div>
            )}
            {(step === 'login' || step === 'zoom') && (
              <div className="intro-login" style={{ width: vp.w, height: vp.h, transform: `scale(${scale})` }}>
                <Login />
              </div>
            )}
          </div>
        </div>
        <div className="intro-base" style={{ width: screenW * 1.22 + Math.max(8, screenW * 0.025) * 2 }} />
      </div>
      <p className="intro-skip">Esc</p>
    </main>
  )
}
