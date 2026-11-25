import { describe, expect, it } from 'vitest'
import * as en from '../i18n/locales/en'
import * as pt from '../i18n/locales/pt'
import * as es from '../i18n/locales/es'
import * as de from '../i18n/locales/de'
import * as fr from '../i18n/locales/fr'
import m_en from '../content/missions/soc-01-vpn-bruteforce/locales/en'
import m_pt from '../content/missions/soc-01-vpn-bruteforce/locales/pt'
import m_es from '../content/missions/soc-01-vpn-bruteforce/locales/es'
import m_de from '../content/missions/soc-01-vpn-bruteforce/locales/de'
import m_fr from '../content/missions/soc-01-vpn-bruteforce/locales/fr'

function keys(o: unknown, prefix = ''): string[] {
  if (typeof o !== 'object' || o === null) return [prefix]
  return Object.entries(o).flatMap(([k, v]) => keys(v, prefix ? `${prefix}.${k}` : k)).sort()
}

describe('translations', () => {
  const sets = { pt: [pt, m_pt], es: [es, m_es], de: [de, m_de], fr: [fr, m_fr] } as const
  for (const [lang, [ui, mission]] of Object.entries(sets)) {
    it(`${lang} has the same keys as English`, () => {
      expect(keys(ui)).toEqual(keys(en))
      expect(keys(mission)).toEqual(keys(m_en))
    })
  }
})
