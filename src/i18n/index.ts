import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import type { Lang } from '../core/types'
import * as en from './locales/en'
import * as pt from './locales/pt'
import * as es from './locales/es'
import * as de from './locales/de'
import * as fr from './locales/fr'
import soc01en from '../content/missions/soc-01-vpn-bruteforce/locales/en'
import soc01pt from '../content/missions/soc-01-vpn-bruteforce/locales/pt'
import soc01es from '../content/missions/soc-01-vpn-bruteforce/locales/es'
import soc01de from '../content/missions/soc-01-vpn-bruteforce/locales/de'
import soc01fr from '../content/missions/soc-01-vpn-bruteforce/locales/fr'

export const LANGS: { id: Lang; label: string }[] = [
  { id: 'en', label: 'English' },
  { id: 'pt', label: 'Português' },
  { id: 'es', label: 'Español' },
  { id: 'de', label: 'Deutsch' },
  { id: 'fr', label: 'Français' },
]

// Namespaces: "ui" (interface), "wiki" (shared handbook pages), one per mission (e.g. "soc01").
// Logs, IPs and other technical data are never translated, like in a real SIEM.
const resources = {
  en: { ...en, soc01: soc01en },
  pt: { ...pt, soc01: soc01pt },
  es: { ...es, soc01: soc01es },
  de: { ...de, soc01: soc01de },
  fr: { ...fr, soc01: soc01fr },
}

void i18n.use(initReactI18next).init({
  resources,
  lng: 'en',
  fallbackLng: 'en',
  defaultNS: 'ui',
  ns: ['ui', 'wiki', 'soc01'],
  interpolation: { escapeValue: false },
})

export default i18n
