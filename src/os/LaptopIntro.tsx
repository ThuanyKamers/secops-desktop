import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useGame } from '../core/store'
import { Login } from './Login'
import { OS_LIST } from './osList'

// Intro after "Power on": a 3D laptop opens its lid, boots, the camera swings round to
// face the display, then zooms in until the display becomes the real login screen.
type Step = 'closed' | 'open' | 'boot' | 'login' | 'front' | 'zoom'

const TIMELINE: [Step, number][] = [
  ['open', 60],
  ['boot', 1300],
  ['login', 2700],
  ['front', 3100],
  ['zoom', 4100],
]
const DONE_AT = 5300

// keyboard rows: relative key widths
const ROWS: number[][] = [
  Array(14).fill(1),
  [1.5, ...Array(12).fill(1), 1.5],
  [1.8, ...Array(11).fill(1), 2.2],
  [2.3, ...Array(10).fill(1), 2.7],
  [1, 1, 1.2, 1.4, 5.6, 1.4, 1.2, 1, 1, 1],
]

function Keyboard() {
  return (
    <div className="kb">
      {ROWS.map((row, r) => (
        <div key={r} className="kb-row">
          {row.map((w, k) => <span key={k} className="key" style={{ flexGrow: w }} />)}
        </div>
      ))}
    </div>
  )
}

export function LaptopIntro() {
  const { t } = useTranslation()
  const os = useGame((s) => s.os)!
  const finish = useGame((s) => s.finishIntro)
  const [step, setStep] = useState<Step>('closed')
  const [vp] = useState(() => ({ w: window.innerWidth, h: window.innerHeight }))
  const camRef = useRef<HTMLDivElement>(null)
  const screenRef = useRef<HTMLDivElement>(null)
  const [zoom, setZoom] = useState<{ t: string; o: string } | undefined>()

  // the display keeps the viewport's aspect ratio, so the zoom lands exactly on it
  const scale = Math.min(vp.w < 700 ? 0.74 : 0.46, (vp.h * 0.42) / vp.h)
  const screenW = Math.round(vp.w * scale)
  const screenH = Math.round(vp.h * scale)
  const bezel = Math.max(8, Math.round(screenW * 0.028))
  const lidW = screenW + bezel * 2
  const lidH = screenH + bezel * 2 + Math.round(bezel * 0.6)
  const baseD = Math.round(lidW * 0.66)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      finish()
      return
    }
    const timers = TIMELINE.map(([s, ms]) => setTimeout(() => setStep(s), ms))
    timers.push(setTimeout(finish, DONE_AT))
    const skip = (e: KeyboardEvent) => e.key === 'Escape' && finish()
    window.addEventListener('keydown', skip)
    return () => {
      timers.forEach(clearTimeout)
      window.removeEventListener('keydown', skip)
    }
  }, [finish])

  useLayoutEffect(() => {
    if (step !== 'zoom' || !camRef.current || !screenRef.current) return
    // the laptop now faces the camera with no rotation, so the display's box is exact
    const cam = camRef.current.getBoundingClientRect()
    const scr = screenRef.current.getBoundingClientRect()
    const cx = scr.left + scr.width / 2
    const cy = scr.top + scr.height / 2
    const k = vp.w / scr.width
    setZoom({
      o: `${cx - cam.left}px ${cy - cam.top}px`,
      t: `translate(${vp.w / 2 - cx}px, ${vp.h / 2 - cy}px) scale(${k})`,
    })
  }, [step, vp])

  const logo = OS_LIST.find((o) => o.id === os)!.logo
  const showLogin = step === 'login' || step === 'front' || step === 'zoom'

  return (
    <main className={`intro intro-${os} step-${step}`} onClick={finish} aria-label={t('boot.start')}>
      <div className="intro-cam" ref={camRef} style={zoom ? { transform: zoom.t, transformOrigin: zoom.o } : undefined}>
        <div className="scene">
          <div className="laptop3d" style={{ width: lidW, height: lidH }}>
            <div className="lid" style={{ width: lidW, height: lidH }}>
              <div className="lid-front" style={{ padding: bezel, paddingBottom: bezel + Math.round(bezel * 0.6) }}>
                <span className="webcam" style={{ top: bezel * 0.35 }} />
                <div className="display" ref={screenRef} style={{ width: screenW, height: screenH }}>
                  {step === 'boot' && (
                    <div className={`boot-splash splash-${os}`}>
                      <svg viewBox="0 0 24 24" width={screenH * 0.16} height={screenH * 0.16} aria-hidden><path fill="currentColor" d={logo} /></svg>
                      {os === 'macos' ? <div className="splash-bar"><span /></div> : <div className="splash-dots"><i /><i /><i /><i /><i /></div>}
                    </div>
                  )}
                  {showLogin && (
                    <div className="intro-login" style={{ width: vp.w, height: vp.h, transform: `scale(${scale})` }}>
                      <Login />
                    </div>
                  )}
                  <span className="glare" />
                </div>
                <span className="lid-brand">ORBITAE</span>
              </div>
              <div className="lid-back"><span className="lid-logo" /></div>
            </div>
            <div className="base" style={{ width: lidW, height: baseD }}>
              <div className="base-top">
                <div className="speaker" />
                <Keyboard />
                <div className="trackpad" />
              </div>
              <div className="base-front" />
            </div>
            <div className="shadow" style={{ width: lidW * 1.1, height: baseD }} />
          </div>
        </div>
      </div>
      <p className="intro-skip">Esc</p>
    </main>
  )
}
