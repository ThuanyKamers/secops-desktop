import { describe, expect, it } from 'vitest'
import { soc01 } from '../content/missions/soc-01-vpn-bruteforce/mission'
import { search } from '../engine/query'
import type { GameEvent } from '../core/types'

describe('Mission soc-01', () => {
  it('logs contain the brute force and the successful login', () => {
    const d = soc01.data()
    expect(search(d.logs, 'src_ip=203.0.113.45 outcome=failure')).toHaveLength(212)
    const ok = search(d.logs, 'src_ip=203.0.113.45 outcome=success')
    expect(ok).toHaveLength(1)
    expect(ok[0].user).toBe('l.moreau')
    expect(search(d.logs, 'src_ip=10.8.0.23 dst_ip=10.10.5.20').length).toBeGreaterThan(0)
  })

  it('a perfect run scores 100%', () => {
    const data = soc01.data()
    data.blockedIps.push('203.0.113.45')
    data.employees.find((e) => e.username === 'l.moreau')!.locked = true
    const events: GameEvent[] = [
      { type: 'alert.assign', alertId: 'ALR-2041', to: 'you' },
      { type: 'siem.search', query: 'src_ip=203.0.113.45', hits: 213 },
      { type: 'siem.search', query: 'src_ip=203.0.113.45 outcome=success', hits: 1 },
      { type: 'intel.lookup', indicator: '203.0.113.45', found: true },
    ]
    const report = {
      verdict: 'true_positive', who: 'l.moreau', attacker_ip: '203.0.113.45', start_time: '08:07:02', end_time: '08:10:48',
      assets: 'fs-01 (10.10.5.20)', escalate_to: 'l.sagas',
      summary: 'Brute force from a malicious hosting IP against the VPN; 212 failures then a successful login as l.moreau without MFA. The session read finance files on fs-01. IP blocked, account locked.',
    }
    const r = soc01.grade({ data, events, report, me: 'you' })
    expect(r.score).toBe(r.max)
  })

  it('an empty run fails most checks and penalises wrong containment', () => {
    const data = soc01.data()
    data.blockedIps.push('198.51.100.77')
    data.employees.find((e) => e.username === 'j.becker')!.locked = true
    const r = soc01.grade({ data, events: [], report: {}, me: 'you' })
    expect(r.checks.find((c) => c.id === 'noWrongBlock')!.ok).toBe(false)
    expect(r.checks.find((c) => c.id === 'noWrongLock')!.ok).toBe(false)
    expect(r.score).toBe(0)
  })
})
