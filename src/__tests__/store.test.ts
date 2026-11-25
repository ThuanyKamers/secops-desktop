import { describe, expect, it } from 'vitest'
import { refreshRun } from '../core/store'
import { getMission } from '../content'
import { soc01 } from '../content/missions/soc-01-vpn-bruteforce/mission'

describe('refreshRun', () => {
  it('keeps progress but takes static content from the current build', () => {
    const m = getMission(soc01.id)!
    const old = m.data()
    old.contacts = [{ ...old.contacts[0], name: 'Old Name' }]
    old.alerts = old.alerts.map((a) => ({ ...a, assignee: 'you', status: 'in_progress' as const }))
    old.blockedIps = [...old.blockedIps, '203.0.113.45']
    old.employees = old.employees.map((e) => (e.username === 'l.moreau' ? { ...e, locked: true } : e))
    const run = refreshRun({ missionId: m.id, data: old, events: [], report: { verdict: 'tp' } })!
    expect(run.data.contacts).toEqual(m.data().contacts)
    expect(run.data.alerts.every((a) => a.assignee === 'you' && a.status === 'in_progress')).toBe(true)
    expect(run.data.blockedIps).toContain('203.0.113.45')
    expect(run.data.employees.find((e) => e.username === 'l.moreau')?.locked).toBe(true)
    expect(run.report.verdict).toBe('tp')
  })

  it('drops runs for missions that no longer exist', () => {
    expect(refreshRun({ missionId: 'gone', data: getMission(soc01.id)!.data(), events: [], report: {} })).toBeNull()
  })
})
