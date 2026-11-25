import type { Mission, Track } from '../core/types'
import { soc01 } from './missions/soc-01-vpn-bruteforce/mission'

// Tracks are the career areas. Add a mission to a track by creating a folder under
// content/missions/ and listing it below; the desktop and apps pick it up automatically.
export const TRACKS: Track[] = [
  { id: 'soc', nameKey: 'tracks.soc.name', descKey: 'tracks.soc.desc', icon: '🛡️', available: true },
  { id: 'pentest', nameKey: 'tracks.pentest.name', descKey: 'tracks.pentest.desc', icon: '🗡️', available: false },
  { id: 'forensics', nameKey: 'tracks.forensics.name', descKey: 'tracks.forensics.desc', icon: '🔬', available: false },
  { id: 'cloud', nameKey: 'tracks.cloud.name', descKey: 'tracks.cloud.desc', icon: '☁️', available: false },
  { id: 'grc', nameKey: 'tracks.grc.name', descKey: 'tracks.grc.desc', icon: '📋', available: false },
]

export const MISSIONS: Mission[] = [soc01]

export function getMission(id: string): Mission | undefined {
  return MISSIONS.find((m) => m.id === id)
}

export function missionsOf(track: string): Mission[] {
  return MISSIONS.filter((m) => m.track === track).sort((a, b) => a.order - b.order)
}
