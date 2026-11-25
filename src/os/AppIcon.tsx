import type { AppId } from '../core/types'

const ICONS: Record<AppId, { bg: string; path: string }> = {
  missions: { bg: 'linear-gradient(135deg,#6366f1,#8b5cf6)', path: 'M12 3 2 8l10 5 8-4v6h2V8L12 3zm-6 9.2V16c0 1.7 2.7 3 6 3s6-1.3 6-3v-3.8l-6 3-6-3z' },
  wiki: { bg: 'linear-gradient(135deg,#0ea5e9,#2563eb)', path: 'M5 3h10l4 4v14H5V3zm9 1.5V8h3.5L14 4.5zM8 11h8v1.5H8V11zm0 3h8v1.5H8V14zm0 3h5v1.5H8V17z' },
  soc: { bg: 'linear-gradient(135deg,#ef4444,#b91c1c)', path: 'M12 2 4 5v6c0 5 3.4 9.4 8 11 4.6-1.6 8-6 8-11V5l-8-3zm-1 5h2v6h-2V7zm0 8h2v2h-2v-2z' },
  siem: { bg: 'linear-gradient(135deg,#10b981,#047857)', path: 'M10 2a8 8 0 0 1 6.3 12.9l5.4 5.4-1.4 1.4-5.4-5.4A8 8 0 1 1 10 2zm0 2a6 6 0 1 0 0 12 6 6 0 0 0 0-12zM6 11h2v3H6v-3zm3-3h2v6H9V8zm3 2h2v4h-2v-4z' },
  intel: { bg: 'linear-gradient(135deg,#f59e0b,#b45309)', path: 'M12 4C6.5 4 2.7 8.4 1.5 12c1.2 3.6 5 8 10.5 8s9.3-4.4 10.5-8C21.3 8.4 17.5 4 12 4zm0 13a5 5 0 1 1 0-10 5 5 0 0 1 0 10zm0-2.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z' },
  firewall: { bg: 'linear-gradient(135deg,#f97316,#c2410c)', path: 'M3 4h18v4H3V4zm0 6h8v4H3v-4zm10 0h8v4h-8v-4zM3 16h18v4H3v-4zM9 4v4M15 16v4' },
  notes: { bg: 'linear-gradient(135deg,#facc15,#ca8a04)', path: 'M5 3h11l3 3v15H5V3zm3 5v1.5h8V8H8zm0 3.5V13h8v-1.5H8zm0 3.5v1.5h5V15H8z' },
  directory: { bg: 'linear-gradient(135deg,#64748b,#334155)', path: 'M9 11a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm-7 9c0-3.9 3.1-7 7-7s7 3.1 7 7H2zm15.5-9a3 3 0 1 0 0-6v6zm1.3 2.2A6.9 6.9 0 0 1 22 20h-4.2c0-2.7-1-5.1-2.6-6.8.9-.3 1.9-.2 3.6 0z' },
}

export function AppIcon({ app, size = 40 }: { app: AppId; size?: number }) {
  const ic = ICONS[app]
  return (
    <span className="app-icon" style={{ width: size, height: size, background: ic.bg }} aria-hidden>
      <svg viewBox="0 0 24 24" width={size * 0.6} height={size * 0.6} fill="#fff">
        <path d={ic.path} />
      </svg>
    </span>
  )
}
