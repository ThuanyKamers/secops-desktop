import { describe, expect, it } from 'vitest'
import { compile, QueryError, search, topValues } from '../engine/query'
import type { LogEvent } from '../core/types'

const logs: LogEvent[] = [
  { timestamp: '2026-03-16T08:00:00Z', source: 'vpn', user: 'admin', src_ip: '203.0.113.45', outcome: 'failure' },
  { timestamp: '2026-03-16T08:01:00Z', source: 'vpn', user: 'l.moreau', src_ip: '203.0.113.45', outcome: 'success' },
  { timestamp: '2026-03-16T08:02:00Z', source: 'firewall', src_ip: '10.8.0.23', dst_port: 445, action: 'allowed' },
]

describe('SIEM query engine', () => {
  it('matches field=value and implicit AND', () => {
    expect(search(logs, 'src_ip=203.0.113.45 outcome=success')).toHaveLength(1)
  })
  it('supports OR, NOT and wildcards', () => {
    expect(search(logs, 'user=admin OR source=firewall')).toHaveLength(2)
    expect(search(logs, 'source=vpn NOT outcome=failure')).toHaveLength(1)
    expect(search(logs, 'user=l.*')).toHaveLength(1)
  })
  it('supports numeric comparison and free text', () => {
    expect(search(logs, 'dst_port>400')).toHaveLength(1)
    expect(search(logs, '"moreau"')).toHaveLength(1)
  })
  it('filters by time range', () => {
    expect(search(logs, '', '2026-03-16T08:00:30Z', '2026-03-16T08:01:30Z')).toHaveLength(1)
  })
  it('rejects dangling operators', () => {
    expect(() => compile('user=admin OR')).toThrow(QueryError)
  })
  it('counts top values', () => {
    expect(topValues(logs, 'src_ip')[0]).toEqual(['203.0.113.45', 2])
  })
})
