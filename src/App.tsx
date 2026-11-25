import { useEffect } from 'react'
import { useGame } from './core/store'
import i18n from './i18n'
import { Boot } from './os/Boot'
import { Desktop } from './os/Desktop'
import { Login } from './os/Login'

export default function App() {
  const phase = useGame((s) => s.phase)
  const os = useGame((s) => s.os)
  const lang = useGame((s) => s.lang)
  useEffect(() => {
    void i18n.changeLanguage(lang)
    document.documentElement.lang = lang
  }, [lang])
  if (phase === 'desktop' && os) return <Desktop />
  if (phase === 'login' && os) return <Login />
  return <Boot />
}
