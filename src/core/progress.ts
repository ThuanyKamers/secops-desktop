import type { GameEvent, Lang, Mission, OsId } from './types'

/** One finished mission attempt. Kept locally and (later) sent to the server. */
export interface Attempt {
  /** random id, used to upload each attempt only once */
  id: string
  missionId: string
  score: number
  max: number
  pct: number
  /** ISO date when the report was submitted */
  at: string
  durationSec: number
  lang: Lang
  os: OsId
  /** facts about how the player worked, used by badges */
  flags: AttemptFlags
}

export interface AttemptFlags {
  /** opened a runbook (page id starting with "rb-") before the first containment action */
  runbookFirst: boolean
  /** blocked an IP and locked an account in the same attempt */
  contained: boolean
}

export function attemptFlags(events: GameEvent[]): AttemptFlags {
  let runbookFirst = false
  let acted = false
  let blocked = false
  let locked = false
  for (const e of events) {
    if (e.type === 'wiki.open' && e.page.startsWith('rb-') && !acted) runbookFirst = true
    if (e.type === 'fw.block') { acted = true; blocked = true }
    if (e.type === 'dir.lock') { acted = true; locked = true }
  }
  return { runbookFirst: runbookFirst && acted, contained: blocked && locked }
}

// ---- XP and levels ------------------------------------------------------

/** XP a mission is worth at 100%; only the best attempt per mission counts, so replays can't farm XP. */
export const MISSION_XP: Record<Mission['difficulty'], number> = { 1: 100, 2: 200, 3: 300 }
export const BADGE_XP = 25
/** Minimum score for a mission to count as completed */
export const PASS_PCT = 60

export function bestByMission(history: Attempt[]): Map<string, Attempt> {
  const best = new Map<string, Attempt>()
  for (const a of history) {
    const b = best.get(a.missionId)
    if (!b || a.pct > b.pct || (a.pct === b.pct && a.durationSec < b.durationSec)) best.set(a.missionId, a)
  }
  return best
}

/** XP thresholds: index = level - 1 */
export const LEVELS = [0, 100, 250, 450, 700, 1000, 1400, 1900, 2500, 3200]

export function levelOf(xp: number) {
  let level = 1
  for (let i = 0; i < LEVELS.length; i++) if (xp >= LEVELS[i]) level = i + 1
  const floor = LEVELS[level - 1]
  const next = LEVELS[level] ?? null
  return { level, floor, next, progress: next === null ? 1 : (xp - floor) / (next - floor) }
}

// ---- badges --------------------------------------------------------------

export interface Badge {
  id: string
  icon: string
  /** true when the badge is earned */
  test: (history: Attempt[], missions: Mission[]) => boolean
}

const passed = (h: Attempt[]) => h.filter((a) => a.pct >= PASS_PCT)

export const BADGES: Badge[] = [
  { id: 'first_steps', icon: '🎯', test: (h) => passed(h).length > 0 },
  { id: 'perfect', icon: '💯', test: (h) => h.some((a) => a.pct === 100) },
  {
    id: 'flawless',
    icon: '💎',
    test: (h) => {
      const seen = new Set<string>()
      return h.some((a) => {
        const first = !seen.has(a.missionId)
        seen.add(a.missionId)
        return first && a.pct === 100
      })
    },
  },
  { id: 'speed', icon: '⚡', test: (h) => h.some((a) => a.pct >= 80 && a.durationSec > 0 && a.durationSec <= 600) },
  { id: 'by_the_book', icon: '📘', test: (h) => passed(h).some((a) => a.flags.runbookFirst) },
  { id: 'contained', icon: '🧱', test: (h) => passed(h).some((a) => a.flags.contained) },
  { id: 'polyglot', icon: '🌍', test: (h) => new Set(passed(h).map((a) => a.lang)).size >= 2 },
  { id: 'cross_platform', icon: '💻', test: (h) => new Set(passed(h).map((a) => a.os)).size >= 3 },
  {
    id: 'soc_track',
    icon: '🛡️',
    test: (h, ms) => {
      const soc = ms.filter((m) => m.track === 'soc')
      const best = bestByMission(h)
      return soc.length > 0 && soc.every((m) => (best.get(m.id)?.pct ?? 0) >= 80)
    },
  },
]

export function earnedBadges(history: Attempt[], missions: Mission[]): string[] {
  return BADGES.filter((b) => b.test(history, missions)).map((b) => b.id)
}

export interface PlayerStats {
  xp: number
  level: ReturnType<typeof levelOf>
  badges: string[]
  completed: number
  attempts: number
  avgPct: number
}

export function playerStats(history: Attempt[], missions: Mission[]): PlayerStats {
  const best = bestByMission(history)
  let xp = 0
  for (const [id, a] of best) {
    const m = missions.find((x) => x.id === id)
    if (m) xp += Math.round((MISSION_XP[m.difficulty] * a.pct) / 100)
  }
  const badges = earnedBadges(history, missions)
  xp += badges.length * BADGE_XP
  const bests = [...best.values()]
  return {
    xp,
    level: levelOf(xp),
    badges,
    completed: bests.filter((a) => a.pct >= PASS_PCT).length,
    attempts: history.length,
    avgPct: bests.length ? Math.round(bests.reduce((s, a) => s + a.pct, 0) / bests.length) : 0,
  }
}
