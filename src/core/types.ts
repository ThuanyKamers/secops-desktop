// Core content model. Nothing here is tied to one security area:
// a Track groups Missions (SOC, pentest, forensics, cloud, GRC...),
// and each Mission declares which desktop apps it uses and the data those apps show.

export type OsId = 'windows' | 'macos' | 'linux'
export type Lang = 'en' | 'pt' | 'es' | 'de' | 'fr'

export type AppId =
  | 'missions'
  | 'profile'
  | 'wiki'
  | 'soc'
  | 'siem'
  | 'intel'
  | 'firewall'
  | 'directory'
  | 'notes'

export interface Track {
  id: string
  /** i18n key for the track name, in the "ui" namespace */
  nameKey: string
  descKey: string
  icon: string
  available: boolean
}

export type Severity = 'critical' | 'high' | 'medium' | 'low'
export type AlertStatus = 'new' | 'in_progress' | 'closed'
export type Verdict = 'true_positive' | 'false_positive'

export interface Alert {
  id: string
  /** i18n key inside the mission namespace */
  titleKey: string
  descKey: string
  severity: Severity
  /** ISO timestamp */
  time: string
  source: string
  status: AlertStatus
  assignee?: string
  verdict?: Verdict
  /** true for the alert(s) this mission is about */
  isMissionAlert?: boolean
}

export type LogEvent = Record<string, string | number> & {
  timestamp: string
  source: string
}

export interface IntelRecord {
  indicator: string
  type: 'ip' | 'domain' | 'hash' | 'url'
  score: number // 0 (clean) .. 100 (malicious)
  /** i18n key with the verdict summary */
  summaryKey: string
  tags: string[]
  reports: number
  asn?: string
  country?: string
  firstSeen?: string
}

export interface Employee {
  username: string
  name: string
  department: string
  title: string
  email: string
  location: string
  device?: string
  usualIp?: string
  locked?: boolean
}

export interface Contact {
  id: string
  name: string
  /** i18n key in "ui" namespace for the role */
  roleKey: string
  online: boolean
}

export interface WikiPage {
  id: string
  /** key in the mission namespace (or "ui") with the page title */
  titleKey: string
  /** key with the markdown body */
  bodyKey: string
  ns: string
}

export interface ReportField {
  id: string
  labelKey: string
  hintKey?: string
  kind: 'text' | 'textarea' | 'select'
  options?: { value: string; labelKey: string }[]
}

export interface MissionData {
  alerts: Alert[]
  logs: LogEvent[]
  intel: IntelRecord[]
  employees: Employee[]
  contacts: Contact[]
  wiki: WikiPage[]
  /** IPs already blocked when the mission starts */
  blockedIps: string[]
}

export interface Mission {
  id: string
  track: string
  order: number
  difficulty: 1 | 2 | 3
  /** i18n namespace holding this mission's texts */
  ns: string
  apps: AppId[]
  /** wiki page to open on start */
  startPage: string
  data: () => MissionData
  report: ReportField[]
  grade: (s: GameSnapshot) => GradeResult
}

// ---- runtime -----------------------------------------------------------

export type GameEvent =
  | { type: 'siem.search'; query: string; hits: number }
  | { type: 'intel.lookup'; indicator: string; found: boolean }
  | { type: 'fw.block'; ip: string }
  | { type: 'fw.unblock'; ip: string }
  | { type: 'dir.lock'; username: string }
  | { type: 'dir.unlock'; username: string }
  | { type: 'alert.assign'; alertId: string; to: string }
  | { type: 'alert.status'; alertId: string; status: AlertStatus }
  | { type: 'wiki.open'; page: string }

export interface GameSnapshot {
  data: MissionData
  events: GameEvent[]
  report: Record<string, string>
  me: string
}

export interface GradeCheck {
  id: string
  ok: boolean
  /** i18n key in mission namespace explaining the check (shown as feedback) */
  key: string
  points: number
}

export interface GradeResult {
  checks: GradeCheck[]
  score: number
  max: number
}
