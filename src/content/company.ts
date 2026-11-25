import type { Contact, Employee } from '../core/types'

// Orbitae Logistics: the fictional company every mission takes place in.
export const COMPANY = { name: 'Orbitae Logistics', domain: 'orbitae.example' }

const e = (
  username: string, name: string, department: string, title: string, location: string,
  device?: string, usualIp?: string,
): Employee => ({ username, name, department, title, email: `${username}@${COMPANY.domain}`, location, device, usualIp })

export const BASE_EMPLOYEES: Employee[] = [
  e('l.moreau', 'Lucas Moreau', 'Finance', 'Accounts Payable Specialist', 'Lyon office', 'LPT-FIN-014'),
  e('j.becker', 'Jana Becker', 'Sales', 'Account Manager', 'Remote (Hamburg)', 'LPT-SAL-007', '198.51.100.77'),
  e('r.costa', 'Rafael Costa', 'Engineering', 'Backend Developer', 'Remote (Porto)', 'LPT-ENG-021', '198.51.100.31'),
  e('s.dubois', 'Sophie Dubois', 'Human Resources', 'HR Business Partner', 'Lyon office', 'LPT-HR-003'),
  e('m.garcia', 'Marta García', 'Operations', 'Fleet Coordinator', 'Remote (Valencia)', 'LPT-OPS-011', '198.51.100.52'),
  e('t.okafor', 'Tobi Okafor', 'IT Support', 'Service Desk Analyst', 'Lyon office', 'LPT-IT-002'),
  e('e.nowak', 'Ewa Nowak', 'Finance', 'Finance Manager', 'Remote (Kraków)', 'LPT-FIN-002', '198.51.100.64'),
  e('h.yilmaz', 'Hakan Yılmaz', 'Operations', 'Warehouse Lead', 'Lyon warehouse', 'PC-WH-005'),
]

export const CONTACTS: Contact[] = [
  { id: 'a.silva', name: 'Ana Silva', roleKey: 'roles.l1', online: true },
  { id: 'm.lindqvist', name: 'Mara Lindqvist', roleKey: 'roles.l2', online: true },
  { id: 't.kamers', name: 'Thuany Kamers', roleKey: 'roles.engineer', online: true },
  { id: 'p.nair', name: 'Priya Nair', roleKey: 'roles.manager', online: false },
]
