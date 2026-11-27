import type { ComponentType } from 'react'
import type { AppId } from '../core/types'
import { Missions } from './Missions'
import { Wiki } from './Wiki'
import { SocDashboard } from './SocDashboard'
import { Siem } from './Siem'
import { ThreatIntel } from './ThreatIntel'
import { Firewall } from './Firewall'
import { Directory } from './Directory'
import { Notes } from './Notes'
import { Profile } from './Profile'

export const APP_COMPONENTS: Record<AppId, ComponentType> = {
  missions: Missions,
  wiki: Wiki,
  soc: SocDashboard,
  siem: Siem,
  intel: ThreatIntel,
  firewall: Firewall,
  directory: Directory,
  notes: Notes,
  profile: Profile,
}
