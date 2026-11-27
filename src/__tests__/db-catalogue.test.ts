import { describe, expect, it } from 'vitest'
import { MISSIONS } from '../content'
import { BADGES, MISSION_XP } from '../core/progress'
import sql from '../../supabase/migrations/0001_players.sql?raw'

// The database keeps its own copy of the mission and badge catalogue (used to validate
// scores and compute the ranking). These tests fail if the two drift apart.

describe('database catalogue', () => {
  it('lists every mission with the right max score and XP', () => {
    for (const m of MISSIONS) {
      const max = m.grade({ data: m.data(), events: [], report: {}, me: 'you' }).max
      expect(sql).toContain(`('${m.id}', '${m.track}', ${m.difficulty}, ${max}, ${MISSION_XP[m.difficulty]})`)
    }
  })

  it('lists every badge', () => {
    for (const b of BADGES) expect(sql).toContain(`('${b.id}')`)
  })
})
