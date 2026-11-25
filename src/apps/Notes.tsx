import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useGame } from '../core/store'

// Plain-text scratchpad for the analyst. Kept outside missions on purpose:
// notes survive restarts and work the same in every track.
export function Notes() {
  const { t } = useTranslation()
  const notes = useGame((s) => s.notes)
  const setNotes = useGame((s) => s.setNotes)
  const [confirm, setConfirm] = useState(false)
  return (
    <div className="app notes-app">
      <textarea
        className="notes-area mono"
        value={notes}
        onChange={(e) => { setNotes(e.target.value); setConfirm(false) }}
        placeholder={t('notes.placeholder')}
        aria-label={t('apps.notes')}
        spellCheck={false}
        autoFocus
      />
      <div className="notes-bar">
        <span className="muted small">{t('notes.saved')} · {t('notes.chars', { count: notes.length })}</span>
        {confirm ? (
          <button className="btn small danger" onClick={() => { setNotes(''); setConfirm(false) }}>{t('notes.confirmClear')}</button>
        ) : (
          <button className="btn small ghost" disabled={!notes} onClick={() => setConfirm(true)}>{t('notes.clear')}</button>
        )}
      </div>
    </div>
  )
}
