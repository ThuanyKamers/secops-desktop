import type { Employee, GameSnapshot, GradeCheck, GradeResult, LogEvent, Mission, MissionData } from '../../../core/types'
import { BASE_EMPLOYEES, CONTACTS } from '../../company'

// Mission: brute force against the VPN that ends in a successful login.
// Every name, IP and domain is fictional; IPs come from documentation ranges (RFC 5737).

const DAY = '2026-03-16'
const ATTACKER = '203.0.113.45'
const VICTIM = 'l.moreau'
const VICTIM_VPN_IP = '10.8.0.23'
const FILESERVER = '10.10.5.20'
const ALERT_ID = 'ALR-2041'

const t = (hms: string) => `${DAY}T${hms}Z`

function addSeconds(hms: string, s: number): string {
  const [h, m, sec] = hms.split(':').map(Number)
  const total = h * 3600 + m * 60 + sec + s
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${pad(Math.floor(total / 3600))}:${pad(Math.floor((total % 3600) / 60))}:${pad(total % 60)}`
}

// deterministic pseudo-random so every player sees the same logs
function rng(seed: number) {
  return () => {
    seed = (seed * 1103515245 + 12345) & 0x7fffffff
    return seed / 0x7fffffff
  }
}

function buildLogs(employees: Employee[]): LogEvent[] {
  const logs: LogEvent[] = []
  const r = rng(42)

  // normal morning: staff connecting to the VPN from their usual IPs, browsing, file shares
  const remote = employees.filter((e) => e.usualIp)
  let clock = '07:31:10'
  for (const e of remote) {
    clock = addSeconds(clock, 60 + Math.floor(r() * 240))
    logs.push({
      timestamp: t(clock), source: 'vpn', host: 'vpn-gw-01', event: 'auth', user: e.username,
      src_ip: e.usualIp!, outcome: 'success', mfa: 'push_approved', assigned_ip: `10.8.0.${10 + Math.floor(r() * 9)}`,
    })
    logs.push({
      timestamp: t(addSeconds(clock, 40)), source: 'proxy', host: 'proxy-01', user: e.username,
      src_ip: `10.8.0.${10 + Math.floor(r() * 9)}`, url: 'https://intranet.orbitae.example/', action: 'allowed', status: 200,
    })
  }
  for (let i = 0; i < 18; i++) {
    const e = employees[Math.floor(r() * employees.length)]
    const hms = addSeconds('07:45:00', Math.floor(r() * 3000))
    logs.push({
      timestamp: t(hms), source: 'proxy', host: 'proxy-01', user: e.username, src_ip: e.device ? '10.20.1.' + (30 + i) : '10.20.1.99',
      url: ['https://mail.orbitae.example/', 'https://erp.orbitae.example/login', 'https://news.example.org/', 'https://maps.example.com/'][i % 4],
      action: 'allowed', status: 200,
    })
  }
  // one typo by a real employee: a single failure followed by success (normal behaviour)
  logs.push({ timestamp: t('07:58:12'), source: 'vpn', host: 'vpn-gw-01', event: 'auth', user: 'j.becker', src_ip: '198.51.100.77', outcome: 'failure', reason: 'bad_password' })

  // the attack: password spraying against common accounts, then a focused brute force on one user
  const spray = ['admin', 'administrator', 'test', 'vpn', 'root', 'backup']
  let at = '08:07:02'
  for (let i = 0; i < 30; i++) {
    logs.push({
      timestamp: t(at), source: 'vpn', host: 'vpn-gw-01', event: 'auth', user: spray[i % spray.length],
      src_ip: ATTACKER, outcome: 'failure', reason: i % 5 === 0 ? 'unknown_user' : 'bad_password', user_agent: 'python-requests/2.31',
    })
    at = addSeconds(at, 1)
  }
  for (let i = 0; i < 182; i++) {
    logs.push({
      timestamp: t(at), source: 'vpn', host: 'vpn-gw-01', event: 'auth', user: VICTIM,
      src_ip: ATTACKER, outcome: 'failure', reason: 'bad_password', user_agent: 'python-requests/2.31',
    })
    at = addSeconds(at, 1)
  }
  // last failure is at 08:10:33; then success
  logs.push({
    timestamp: t('08:10:48'), source: 'vpn', host: 'vpn-gw-01', event: 'auth', user: VICTIM, src_ip: ATTACKER,
    outcome: 'success', mfa: 'not_enrolled', assigned_ip: VICTIM_VPN_IP, user_agent: 'python-requests/2.31',
  })
  // what happened after the login: the attacker touches internal systems
  logs.push({ timestamp: t('08:11:30'), source: 'firewall', host: 'fw-core-01', src_ip: VICTIM_VPN_IP, dst_ip: FILESERVER, dst_port: 445, proto: 'tcp', action: 'allowed', rule: 'vpn-to-servers' })
  logs.push({ timestamp: t('08:11:52'), source: 'fileserver', host: 'fs-01', user: VICTIM, src_ip: VICTIM_VPN_IP, share: '\\\\fs-01\\finance', file: 'Q1-payroll.xlsx', event: 'file_read' })
  logs.push({ timestamp: t('08:12:05'), source: 'fileserver', host: 'fs-01', user: VICTIM, src_ip: VICTIM_VPN_IP, share: '\\\\fs-01\\finance', file: 'supplier-bank-details.csv', event: 'file_read' })
  logs.push({ timestamp: t('08:12:40'), source: 'firewall', host: 'fw-core-01', src_ip: VICTIM_VPN_IP, dst_ip: '10.10.5.31', dst_port: 3389, proto: 'tcp', action: 'denied', rule: 'block-rdp-from-vpn' })

  // the real Lucas is at the Lyon office: a normal login earlier, from the office network
  logs.push({ timestamp: t('07:52:31'), source: 'auth', host: 'dc-01', event: 'logon', user: VICTIM, workstation: 'LPT-FIN-014', src_ip: '10.30.2.14', outcome: 'success', logon_type: 'interactive' })
  logs.push({ timestamp: t('08:14:02'), source: 'email', host: 'mail-gw', from: 'it-alerts@orbitae.example', to: 'l.moreau@orbitae.example', subject: 'New VPN sign-in to your account', action: 'delivered' })

  return logs
}

function data(): MissionData {
  const employees = BASE_EMPLOYEES.map((e) => ({ ...e }))
  return {
    alerts: [
      { id: ALERT_ID, titleKey: 'alerts.a2041.title', descKey: 'alerts.a2041.desc', severity: 'high', time: t('08:12:00'), source: 'VPN Gateway (vpn-gw-01)', status: 'new', isMissionAlert: true },
      { id: 'ALR-2042', titleKey: 'alerts.a2042.title', descKey: 'alerts.a2042.desc', severity: 'low', time: t('08:15:20'), source: 'EDR', status: 'new' },
      { id: 'ALR-2038', titleKey: 'alerts.a2038.title', descKey: 'alerts.a2038.desc', severity: 'medium', time: t('07:40:11'), source: 'Proxy (proxy-01)', status: 'in_progress', assignee: 'a.silva' },
      { id: 'ALR-2035', titleKey: 'alerts.a2035.title', descKey: 'alerts.a2035.desc', severity: 'low', time: t('06:55:47'), source: 'Print server', status: 'closed', assignee: 'a.silva', verdict: 'false_positive' },
    ],
    logs: buildLogs(employees),
    intel: [
      { indicator: ATTACKER, type: 'ip', score: 94, summaryKey: 'intel.attacker', tags: ['brute-force', 'vpn-scanner', 'credential-stuffing'], reports: 341, asn: 'AS64500 (ExampleHost VPS)', country: 'NL', firstSeen: '2025-11-02' },
      { indicator: '198.51.100.77', type: 'ip', score: 0, summaryKey: 'intel.homeIsp', tags: ['residential'], reports: 0, asn: 'AS64511 (Example Broadband)', country: 'DE' },
      { indicator: '198.51.100.20', type: 'ip', score: 0, summaryKey: 'intel.homeIsp', tags: ['residential'], reports: 0, asn: 'AS64511 (Example Broadband)', country: 'FR' },
    ],
    employees,
    contacts: CONTACTS,
    wiki: [
      { id: 'soc01-briefing', ns: 'soc01', titleKey: 'wiki.briefing.title', bodyKey: 'wiki.briefing.body' },
      { id: 'rb-auth-01', ns: 'soc01', titleKey: 'wiki.runbook.title', bodyKey: 'wiki.runbook.body' },
      { id: 'triage', ns: 'wiki', titleKey: 'triage.title', bodyKey: 'triage.body' },
      { id: 'siem-guide', ns: 'wiki', titleKey: 'siem.title', bodyKey: 'siem.body' },
      { id: 'escalation', ns: 'wiki', titleKey: 'escalation.title', bodyKey: 'escalation.body' },
      { id: 'reporting', ns: 'wiki', titleKey: 'reporting.title', bodyKey: 'reporting.body' },
    ],
    blockedIps: ['192.0.2.200'],
  }
}

const norm = (s: string | undefined) => (s ?? '').toLowerCase().trim()

function grade(s: GameSnapshot): GradeResult {
  const ev = s.events
  const alert = s.data.alerts.find((a) => a.id === ALERT_ID)
  const rep = s.report
  const victim = s.data.employees.find((e) => e.username === VICTIM)
  const wrongLocks = s.data.employees.filter((e) => e.locked && e.username !== VICTIM)
  const wrongBlocks = s.data.blockedIps.filter((ip) => ip !== ATTACKER && ip !== '192.0.2.200')
  const timeOk = (v: string | undefined, accept: string[]) => accept.some((a) => norm(v).includes(a))

  const checks: GradeCheck[] = [
    { id: 'assigned', points: 1, key: 'grade.assigned', ok: ev.some((e) => e.type === 'alert.assign' && e.alertId === ALERT_ID && e.to === s.me) },
    { id: 'siem', points: 1, key: 'grade.siem', ok: ev.some((e) => e.type === 'siem.search' && e.query.includes(ATTACKER)) },
    { id: 'siemSuccess', points: 1, key: 'grade.siemSuccess', ok: ev.some((e) => e.type === 'siem.search' && /success|moreau/i.test(e.query)) },
    { id: 'intel', points: 1, key: 'grade.intel', ok: ev.some((e) => e.type === 'intel.lookup' && e.indicator === ATTACKER) },
    { id: 'block', points: 2, key: 'grade.block', ok: s.data.blockedIps.includes(ATTACKER) },
    { id: 'noWrongBlock', points: 1, key: 'grade.noWrongBlock', ok: wrongBlocks.length === 0 },
    { id: 'lock', points: 2, key: 'grade.lock', ok: !!victim?.locked },
    { id: 'noWrongLock', points: 1, key: 'grade.noWrongLock', ok: wrongLocks.length === 0 },
    { id: 'verdict', points: 2, key: 'grade.verdict', ok: rep.verdict === 'true_positive' || alert?.verdict === 'true_positive' },
    { id: 'escalate', points: 2, key: 'grade.escalate', ok: rep.escalate_to === 'm.lindqvist' },
    { id: 'who', points: 1, key: 'grade.who', ok: /moreau/.test(norm(rep.who)) },
    { id: 'where', points: 1, key: 'grade.where', ok: norm(rep.attacker_ip).includes(ATTACKER) },
    { id: 'when', points: 1, key: 'grade.when', ok: timeOk(rep.start_time, ['08:07']) && timeOk(rep.end_time, ['08:10', '08:11', '08:12']) },
    { id: 'assets', points: 1, key: 'grade.assets', ok: /10\.10\.5\.20|fs-01/.test(norm(rep.assets)) },
    { id: 'why', points: 1, key: 'grade.why', ok: norm(rep.summary).length >= 80 },
  ]
  const max = checks.reduce((n, c) => n + c.points, 0)
  const score = checks.reduce((n, c) => n + (c.ok ? c.points : 0), 0)
  return { checks, score, max }
}



export const soc01: Mission = {
  id: 'soc-01',
  track: 'soc',
  order: 1,
  difficulty: 1,
  ns: 'soc01',
  apps: ['soc', 'siem', 'intel', 'firewall', 'directory', 'wiki'],
  startPage: 'soc01-briefing',
  data,
  report: [
    { id: 'verdict', kind: 'select', labelKey: 'report.verdict', options: [
      { value: '', labelKey: 'report.choose' },
      { value: 'true_positive', labelKey: 'report.tp' },
      { value: 'false_positive', labelKey: 'report.fp' },
    ] },
    { id: 'who', kind: 'text', labelKey: 'report.who', hintKey: 'report.whoHint' },
    { id: 'attacker_ip', kind: 'text', labelKey: 'report.where', hintKey: 'report.whereHint' },
    { id: 'start_time', kind: 'text', labelKey: 'report.start', hintKey: 'report.timeHint' },
    { id: 'end_time', kind: 'text', labelKey: 'report.end', hintKey: 'report.timeHint' },
    { id: 'assets', kind: 'text', labelKey: 'report.assets', hintKey: 'report.assetsHint' },
    { id: 'summary', kind: 'textarea', labelKey: 'report.summary', hintKey: 'report.summaryHint' },
    { id: 'escalate_to', kind: 'select', labelKey: 'report.escalate', options: [
      { value: '', labelKey: 'report.noEscalation' },
      { value: 'm.lindqvist', labelKey: 'report.toL2' },
      { value: 'k.watanabe', labelKey: 'report.toEngineer' },
      { value: 'p.nair', labelKey: 'report.toManager' },
    ] },
  ],
  grade,
}

export const SOC01_FACTS = { ATTACKER, VICTIM, ALERT_ID, FILESERVER }
