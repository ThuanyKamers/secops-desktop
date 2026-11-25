import { useEffect } from 'react'
import { useGame } from './core/store'
import i18n from './i18n'
import { Boot } from './os/Boot'
import { Desktop } from './os/Desktop'
import { Login } from './os/Login'
import { LaptopIntro } from './os/LaptopIntro'

export default function App() {
  const phase = useGame((s) => s.phase)
  const os = useGame((s) => s.os)
  const lang = useGame((s) => s.lang)
  useEffect(() => {
    void i18n.changeLanguage(lang)
    document.documentElement.lang = lang
  }, [lang])
  if (phase === 'desktop' && os) return <Desktop />
  if (phase === 'intro' && os) return <LaptopIntro />
  if (phase === 'login' && os) return <Login />
  return <Boot />
}
