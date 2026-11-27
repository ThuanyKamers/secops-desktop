import { describe, expect, it } from 'vitest'
import { attemptFlags, earnedBadges, levelOf, playerStats, streaks, type Attempt } from '../core/progress'
import { MISSIONS } from '../content'
import { soc01 } from '../content/missions/soc-01-vpn-bruteforce/mission'

const base: Attempt = {
  id: '00000000-0000-4000-8000-000000000000',
  missionId: soc01.id, score: 10, max: 19, pct: 53, at: '2026-11-27T10:00:00Z', durationSec: 900,
  lang: 'en', os: 'linux', flags: { runbookFirst: false, contained: false },
}
const att = (o: Partial<Attempt>): Attempt => ({ ...base, ...o })

describe('progress', () => {
  it('levels follow the XP table', () => {
    expect(levelOf(0).level).toBe(1)
    expect(levelOf(99).level).toBe(1)
    expect(levelOf(100).level).toBe(2)
    expect(levelOf(99999)).toMatchObject({ level: 10, next: null, progress: 1 })
  })

  it('only the best attempt per mission gives XP, so replays cannot farm', () => {
    const one = playerStats([att({ pct: 100 })], MISSIONS)
    const many = playerStats([att({ pct: 100 }), att({ pct: 100 }), att({ pct: 40 })], MISSIONS)
    expect(many.xp).toBe(one.xp)
  })

  it('flawless needs 100% on the first attempt only', () => {
    expect(earnedBadges([att({ pct: 50 }), att({ pct: 100 })], MISSIONS)).not.toContain('flawless')
    expect(earnedBadges([att({ pct: 100 })], MISSIONS)).toContain('flawless')
  })

  it('a failed attempt earns no badges', () => {
    expect(earnedBadges([att({ pct: 30, flags: { runbookFirst: true, contained: true } })], MISSIONS)).toEqual([])
  })

  it('cross-platform and polyglot count different OS and languages', () => {
    const h = [att({ pct: 80, os: 'linux', lang: 'en' }), att({ pct: 80, os: 'macos', lang: 'pt' }), att({ pct: 80, os: 'windows' })]
    expect(earnedBadges(h, MISSIONS)).toEqual(expect.arrayContaining(['cross_platform', 'polyglot']))
  })

  it('flags: runbook must be opened before the first containment action', () => {
    expect(attemptFlags([{ type: 'wiki.open', page: 'rb-auth-01' }, { type: 'fw.block', ip: '203.0.113.45' }]).runbookFirst).toBe(true)
    expect(attemptFlags([{ type: 'fw.block', ip: '203.0.113.45' }, { type: 'wiki.open', page: 'rb-auth-01' }]).runbookFirst).toBe(false)
    expect(attemptFlags([{ type: 'fw.block', ip: '1.2.3.4' }, { type: 'dir.lock', username: 'l.moreau' }]).contained).toBe(true)
  })
})

describe('streaks', () => {
  const on = (d: string, pct = 80) => att({ at: new Date(`${d}T12:00:00`).toISOString(), pct })
  const now = new Date('2026-11-27T18:00:00')
  it('counts consecutive days ending today', () => {
    expect(streaks([on('2026-11-25'), on('2026-11-26'), on('2026-11-27')], now)).toMatchObject({ current: 3, best: 3, playedToday: true })
  })
  it('keeps the streak alive until the end of today', () => {
    expect(streaks([on('2026-11-25'), on('2026-11-26')], now)).toMatchObject({ current: 2, playedToday: false })
  })
  it('a missed day resets the current streak but not the best', () => {
    const h = [on('2026-11-01'), on('2026-11-02'), on('2026-11-03'), on('2026-11-04'), on('2026-11-27')]
    expect(streaks(h, now)).toMatchObject({ current: 1, best: 4 })
  })
  it('several missions on one day count once', () => {
    expect(streaks([on('2026-11-27'), on('2026-11-27')], now).current).toBe(1)
  })
})
