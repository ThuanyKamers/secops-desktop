import { useTranslation } from 'react-i18next'
import { useGame } from '../core/store'
import { Markdown } from '../engine/markdown'
import { NoMission, useRun } from './shared'

export function Wiki() {
  const { t } = useTranslation()
  const { run } = useRun()
  const page = useGame((s) => s.wikiPage)
  const openWiki = useGame((s) => s.openWiki)
  if (!run) return <NoMission />
  const pages = run.data.wiki
  const current = pages.find((p) => p.id === page) ?? pages[0]
  return (
    <div className="app wiki-app">
      <nav className="wiki-nav" aria-label={t('wikiNav')}>
        <div className="wiki-brand">Orbitae · Knowledge Base</div>
        {pages.map((p) => (
          <button key={p.id} className={p.id === current.id ? 'active' : ''} onClick={() => openWiki(p.id)}>
            {t(p.titleKey, { ns: p.ns })}
          </button>
        ))}
      </nav>
      <article className="wiki-page">
        <Markdown source={t(current.bodyKey, { ns: current.ns })} onLink={(id) => openWiki(id)} />
      </article>
    </div>
  )
}
