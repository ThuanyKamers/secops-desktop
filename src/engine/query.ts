// A tiny SIEM-style query language that runs in memory over a mission's logs.
//
//   src_ip=203.0.113.45 AND outcome=failure
//   user=l.moreau OR user=admin
//   source=vpn NOT outcome=success
//   "brute"                       (free text, matches any field)
//   bytes>1000                     (numeric comparison: > < >= <=)
//   user=l.*                       (* wildcard)
//
// Operators: AND (default between terms), OR, NOT. AND binds tighter than OR.

import type { LogEvent } from '../core/types'

type Term = { neg: boolean; test: (e: LogEvent) => boolean }

export class QueryError extends Error {}

function tokenize(q: string): string[] {
  const out: string[] = []
  const re = /\s*("([^"]*)"|[^\s"]+)/g
  let m: RegExpExecArray | null
  while ((m = re.exec(q))) out.push(m[2] !== undefined ? `"${m[2]}"` : m[1])
  return out
}

function wildcard(pattern: string): RegExp {
  const esc = pattern.replace(/[.+?^${}()|[\]\\]/g, '\\$&').replace(/\*/g, '.*')
  return new RegExp(`^${esc}$`, 'i')
}

function makeTest(tok: string): (e: LogEvent) => boolean {
  if (tok.startsWith('"')) {
    const needle = tok.slice(1, -1).toLowerCase()
    return (e) => Object.values(e).some((v) => String(v).toLowerCase().includes(needle))
  }
  const cmp = /^([\w.]+)(>=|<=|!=|=|>|<)(.*)$/.exec(tok)
  if (!cmp) {
    const needle = tok.toLowerCase()
    return (e) => Object.values(e).some((v) => String(v).toLowerCase().includes(needle))
  }
  const [, field, op, raw] = cmp
  const value = raw.replace(/^"|"$/g, '')
  if (op === '=' || op === '!=') {
    const rx = wildcard(value)
    return (e) => {
      const has = e[field] !== undefined && rx.test(String(e[field]))
      return op === '=' ? has : !has
    }
  }
  const num = Number(value)
  if (Number.isNaN(num)) throw new QueryError(`"${value}" is not a number`)
  return (e) => {
    const v = Number(e[field])
    if (Number.isNaN(v)) return false
    if (op === '>') return v > num
    if (op === '<') return v < num
    if (op === '>=') return v >= num
    return v <= num
  }
}

/** Returns a predicate; an empty query matches everything. */
export function compile(query: string): (e: LogEvent) => boolean {
  const tokens = tokenize(query.trim())
  if (tokens.length === 0) return () => true
  const groups: Term[][] = [[]]
  let neg = false
  for (const tok of tokens) {
    const up = tok.toUpperCase()
    if (up === 'AND') continue
    if (up === 'OR') {
      if (groups[groups.length - 1].length === 0) throw new QueryError('OR needs a term on both sides')
      groups.push([])
      continue
    }
    if (up === 'NOT') {
      neg = !neg
      continue
    }
    groups[groups.length - 1].push({ neg, test: makeTest(tok) })
    neg = false
  }
  if (groups[groups.length - 1].length === 0) throw new QueryError('Query ends with an operator')
  return (e) => groups.some((g) => g.every((t) => t.test(e) !== t.neg))
}

export function search(logs: LogEvent[], query: string, from?: string, to?: string): LogEvent[] {
  const pred = compile(query)
  return logs
    .filter((e) => (!from || e.timestamp >= from) && (!to || e.timestamp <= to) && pred(e))
    .sort((a, b) => a.timestamp.localeCompare(b.timestamp))
}

/** Count values of one field across events, most frequent first (for the field sidebar). */
export function topValues(events: LogEvent[], field: string, limit = 5): [string, number][] {
  const counts = new Map<string, number>()
  for (const e of events) {
    if (e[field] === undefined) continue
    const k = String(e[field])
    counts.set(k, (counts.get(k) ?? 0) + 1)
  }
  return [...counts.entries()].sort((a, b) => b[1] - a[1]).slice(0, limit)
}
