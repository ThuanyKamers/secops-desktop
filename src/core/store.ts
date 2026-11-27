import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import type {
  AlertStatus,
  AppId,
  GameEvent,
  GradeResult,
  Lang,
  MissionData,
  OsId,
  Verdict,
} from './types'
import { MISSIONS, getMission } from '../content'
import { attemptFlags, earnedBadges, playerStats, streaks, type Attempt } from './progress'

export const PLAYER = 'you'

export interface WindowState {
  app: AppId
  z: number
  minimized: boolean
  maximized: boolean
  x: number
  y: number
  w: number
  h: number
}

interface MissionRun {
  missionId: string
  data: MissionData
  events: GameEvent[]
  report: Record<string, string>
  escalatedTo?: string
  result?: GradeResult
  /** epoch ms when the mission started */
  startedAt?: number
  /** badges earned by this attempt's report */
  newBadges?: string[]
  /** what this attempt changed, for the celebration on the results screen */
  reward?: { xpGained: number; levelBefore: number; levelAfter: number; streak: number; firstToday: boolean }
}

interface GameState {
  os: OsId | null
  lang: Lang
  phase: 'boot' | 'intro' | 'login' | 'desktop'
  windows: WindowState[]
  zTop: number
  wikiPage: string | null
  run: MissionRun | null
  completed: Record<string, number>
  notes: string
  setNotes: (v: string) => void
  history: Attempt[]
  playerName: string
  setPlayerName: (v: string) => void

  setLang: (l: Lang) => void
  chooseOs: (os: OsId) => void
  finishIntro: () => void
  login: () => void
  logout: () => void

  openApp: (app: AppId) => void
  closeApp: (app: AppId) => void
  focusApp: (app: AppId) => void
  toggleMin: (app: AppId) => void
  toggleMax: (app: AppId) => void
  moveApp: (app: AppId, x: number, y: number) => void

  openWiki: (page: string) => void

  startMission: (id: string) => void
  abandonMission: () => void
  log: (e: GameEvent) => void
  assignAlert: (alertId: string, to: string) => void
  setAlertStatus: (alertId: string, status: AlertStatus) => void
  setVerdict: (alertId: string, v: Verdict) => void
  blockIp: (ip: string) => void
  unblockIp: (ip: string) => void
  setLocked: (username: string, locked: boolean) => void
  setReport: (field: string, value: string) => void
  submitReport: () => GradeResult | null
}

const DEFAULT_SIZE: Partial<Record<AppId, { w: number; h: number }>> = {
  missions: { w: 760, h: 520 },
  wiki: { w: 720, h: 560 },
  soc: { w: 960, h: 600 },
  siem: { w: 1000, h: 620 },
  intel: { w: 640, h: 520 },
  firewall: { w: 640, h: 480 },
  directory: { w: 760, h: 500 },
  notes: { w: 460, h: 440 },
  profile: { w: 640, h: 560 },
}

function fitWindow(app: AppId, index: number) {
  const vw = typeof window !== 'undefined' ? window.innerWidth : 1280
  const vh = typeof window !== 'undefined' ? window.innerHeight : 800
  const size = DEFAULT_SIZE[app] ?? { w: 700, h: 500 }
  const w = Math.min(size.w, vw - 24)
  const h = Math.min(size.h, vh - 110)
  const x = Math.max(8, Math.min(60 + index * 32, vw - w - 8))
  const y = Math.max(40, Math.min(56 + index * 28, vh - h - 60))
  return { x, y, w, h }
}

/**
 * Saved runs keep the player's progress, but static mission content (team, logs, wiki, intel)
 * always comes from the current build, so renamed characters or fixed texts show up after an update.
 */
export function refreshRun(run: MissionRun | null | undefined): MissionRun | null {
  if (!run) return null
  const m = getMission(run.missionId)
  if (!m) return null
  const fresh = m.data()
  const saved = run.data
  return {
    ...run,
    data: {
      ...fresh,
      blockedIps: saved?.blockedIps ?? fresh.blockedIps,
      alerts: fresh.alerts.map((a) => {
        const old = saved?.alerts?.find((x) => x.id === a.id)
        return old ? { ...a, assignee: old.assignee, status: old.status, verdict: old.verdict } : a
      }),
      employees: fresh.employees.map((e) => {
        const old = saved?.employees?.find((x) => x.username === e.username)
        return old ? { ...e, locked: old.locked } : e
      }),
    },
  }
}

/** true when the page was opened by a sign-in redirect (GitHub / email link) */
const AUTH_RETURN = typeof window !== 'undefined' && /[?&#](code|access_token|error_description)=/.test(window.location.search + window.location.hash)

function mapRun(s: GameState, f: (r: MissionRun) => MissionRun): Partial<GameState> {
  return s.run ? { run: f(s.run) } : {}
}

export const useGame = create<GameState>()(
  persist(
    (set, get) => ({
      os: null,
      lang: 'en',
      phase: 'boot',
      windows: [],
      zTop: 10,
      wikiPage: null,
      run: null,
      completed: {},
      notes: '',
      setNotes: (notes) => set({ notes }),
      history: [],
      playerName: '',
      setPlayerName: (playerName) => set({ playerName: playerName.slice(0, 24) }),

      setLang: (lang) => set({ lang }),
      chooseOs: (os) => set({ os, phase: 'intro' }),
      finishIntro: () => set((s) => (s.phase === 'intro' ? { phase: 'login' } : {})),
      login: () => {
        set({ phase: 'desktop' })
        if (get().windows.length === 0) get().openApp('missions')
      },
      logout: () => set({ phase: 'boot', windows: [] }),

      openApp: (app) =>
        set((s) => {
          const existing = s.windows.find((w) => w.app === app)
          const z = s.zTop + 1
          if (existing) {
            return {
              zTop: z,
              windows: s.windows.map((w) => (w.app === app ? { ...w, z, minimized: false } : w)),
            }
          }
          return {
            zTop: z,
            windows: [
              ...s.windows,
              { app, z, minimized: false, maximized: false, ...fitWindow(app, s.windows.length) },
            ],
          }
        }),
      closeApp: (app) => set((s) => ({ windows: s.windows.filter((w) => w.app !== app) })),
      focusApp: (app) =>
        set((s) => {
          const top = s.windows.find((w) => w.app === app)
          if (top && top.z === s.zTop) return {}
          const z = s.zTop + 1
          return { zTop: z, windows: s.windows.map((w) => (w.app === app ? { ...w, z } : w)) }
        }),
      toggleMin: (app) =>
        set((s) => {
          const target = s.windows.find((w) => w.app === app)
          if (!target) return {}
          // clicking the taskbar on a background window brings it forward instead of hiding it
          if (!target.minimized && target.z !== s.zTop) {
            const z = s.zTop + 1
            return { zTop: z, windows: s.windows.map((w) => (w.app === app ? { ...w, z } : w)) }
          }
          const z = s.zTop + 1
          return {
            zTop: z,
            windows: s.windows.map((w) =>
              w.app === app ? { ...w, minimized: !w.minimized, z: w.minimized ? z : w.z } : w,
            ),
          }
        }),
      toggleMax: (app) =>
        set((s) => ({
          windows: s.windows.map((w) => (w.app === app ? { ...w, maximized: !w.maximized } : w)),
        })),
      moveApp: (app, x, y) =>
        set((s) => ({ windows: s.windows.map((w) => (w.app === app ? { ...w, x, y } : w)) })),

      openWiki: (page) => {
        set({ wikiPage: page })
        get().openApp('wiki')
        get().log({ type: 'wiki.open', page })
      },

      startMission: (id) => {
        const m = getMission(id)
        if (!m) return
        set({
          run: { missionId: id, data: m.data(), events: [], report: {}, startedAt: Date.now() },
          windows: get().windows.filter((w) => w.app === 'missions'),
        })
        get().openWiki(m.startPage)
      },
      abandonMission: () => set({ run: null, windows: get().windows.filter((w) => w.app === 'missions') }),

      log: (e) => set((s) => mapRun(s, (r) => ({ ...r, events: [...r.events, e] }))),

      assignAlert: (alertId, to) => {
        set((s) =>
          mapRun(s, (r) => ({
            ...r,
            escalatedTo: to !== PLAYER && r.data.alerts.find((a) => a.id === alertId)?.isMissionAlert ? to : r.escalatedTo,
            data: {
              ...r.data,
              alerts: r.data.alerts.map((a) => (a.id === alertId ? { ...a, assignee: to } : a)),
            },
          })),
        )
        get().log({ type: 'alert.assign', alertId, to })
      },
      setAlertStatus: (alertId, status) => {
        set((s) =>
          mapRun(s, (r) => ({
            ...r,
            data: { ...r.data, alerts: r.data.alerts.map((a) => (a.id === alertId ? { ...a, status } : a)) },
          })),
        )
        get().log({ type: 'alert.status', alertId, status })
      },
      setVerdict: (alertId, verdict) =>
        set((s) =>
          mapRun(s, (r) => ({
            ...r,
            data: { ...r.data, alerts: r.data.alerts.map((a) => (a.id === alertId ? { ...a, verdict } : a)) },
          })),
        ),
      blockIp: (ip) => {
        set((s) =>
          mapRun(s, (r) =>
            r.data.blockedIps.includes(ip) ? r : { ...r, data: { ...r.data, blockedIps: [...r.data.blockedIps, ip] } },
          ),
        )
        get().log({ type: 'fw.block', ip })
      },
      unblockIp: (ip) => {
        set((s) =>
          mapRun(s, (r) => ({ ...r, data: { ...r.data, blockedIps: r.data.blockedIps.filter((x) => x !== ip) } })),
        )
        get().log({ type: 'fw.unblock', ip })
      },
      setLocked: (username, locked) => {
        set((s) =>
          mapRun(s, (r) => ({
            ...r,
            data: {
              ...r.data,
              employees: r.data.employees.map((e) => (e.username === username ? { ...e, locked } : e)),
            },
          })),
        )
        get().log({ type: locked ? 'dir.lock' : 'dir.unlock', username })
      },
      setReport: (field, value) => set((s) => mapRun(s, (r) => ({ ...r, report: { ...r.report, [field]: value } }))),
      submitReport: () => {
        const r = get().run
        if (!r) return null
        const m = getMission(r.missionId)
        if (!m) return null
        const result = m.grade({ data: r.data, events: r.events, report: r.report, me: PLAYER })
        const pct = Math.round((result.score / result.max) * 100)
        const s0 = get()
        const attempt: Attempt = {
          id: crypto.randomUUID(),
          missionId: r.missionId,
          score: result.score,
          max: result.max,
          pct,
          at: new Date().toISOString(),
          durationSec: r.startedAt ? Math.max(0, Math.round((Date.now() - r.startedAt) / 1000)) : 0,
          lang: s0.lang,
          os: s0.os ?? 'windows',
          flags: attemptFlags(r.events),
        }
        const history = [...s0.history, attempt]
        const before = new Set(earnedBadges(s0.history, MISSIONS))
        const newBadges = earnedBadges(history, MISSIONS).filter((b) => !before.has(b))
        const sBefore = playerStats(s0.history, MISSIONS)
        const sAfter = playerStats(history, MISSIONS)
        const reward = {
          xpGained: sAfter.xp - sBefore.xp,
          levelBefore: sBefore.level.level,
          levelAfter: sAfter.level.level,
          streak: streaks(history).current,
          firstToday: !streaks(s0.history).playedToday,
        }
        set((s) => ({
          run: s.run ? { ...s.run, result, newBadges, reward } : null,
          history,
          completed: { ...s.completed, [r.missionId]: Math.max(pct, s.completed[r.missionId] ?? 0) },
        }))
        return result
      },
    }),
    {
      name: 'secops-desktop',
      version: 1,
      storage: createJSONStorage(() => {
        try {
          const k = '__probe__'
          localStorage.setItem(k, k)
          localStorage.removeItem(k)
          return localStorage
        } catch {
          const mem = new Map<string, string>()
          return {
            getItem: (k: string) => mem.get(k) ?? null,
            setItem: (k: string, v: string) => void mem.set(k, v),
            removeItem: (k: string) => void mem.delete(k),
          }
        }
      }),
      merge: (persisted, current) => {
        const p = (persisted ?? {}) as Partial<GameState>
        return { ...current, ...p, run: refreshRun(p.run), phase: AUTH_RETURN && p.os ? 'login' : current.phase }
      },
      partialize: (s) => ({ notes: s.notes, history: s.history, playerName: s.playerName, os: s.os, lang: s.lang, completed: s.completed, run: s.run, wikiPage: s.wikiPage }),
    },
  ),
)
