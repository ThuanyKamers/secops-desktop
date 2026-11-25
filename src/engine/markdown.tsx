// Minimal Markdown renderer for Wiki pages: headings, paragraphs, lists, tables,
// blockquotes, **bold**, *italic*, `code` and [links](#page-id) between pages.
import type { ReactNode } from 'react'

type LinkHandler = (target: string) => void

function inline(text: string, onLink: LinkHandler, key = 0): ReactNode[] {
  const out: ReactNode[] = []
  const re = /(`[^`]+`|\*\*[^*]+\*\*|\*[^*]+\*|\[[^\]]+\]\([^)]+\))/g
  let last = 0
  let m: RegExpExecArray | null
  let i = 0
  while ((m = re.exec(text))) {
    if (m.index > last) out.push(text.slice(last, m.index))
    const tok = m[0]
    const k = `${key}-${i++}`
    if (tok.startsWith('`')) out.push(<code key={k}>{tok.slice(1, -1)}</code>)
    else if (tok.startsWith('**')) out.push(<strong key={k}>{inline(tok.slice(2, -2), onLink, i)}</strong>)
    else if (tok.startsWith('*')) out.push(<em key={k}>{inline(tok.slice(1, -1), onLink, i)}</em>)
    else {
      const lm = /^\[([^\]]+)\]\(([^)]+)\)$/.exec(tok)!
      const href = lm[2]
      if (href.startsWith('#')) {
        out.push(
          <a key={k} href={href} onClick={(e) => { e.preventDefault(); onLink(href.slice(1)) }}>
            {lm[1]}
          </a>,
        )
      } else {
        out.push(<a key={k} href={href} target="_blank" rel="noreferrer">{lm[1]}</a>)
      }
    }
    last = m.index + tok.length
  }
  if (last < text.length) out.push(text.slice(last))
  return out
}

export function Markdown({ source, onLink }: { source: string; onLink: LinkHandler }) {
  const lines = source.split('\n')
  const blocks: ReactNode[] = []
  let i = 0
  let k = 0
  while (i < lines.length) {
    const line = lines[i]
    if (!line.trim()) { i++; continue }
    const h = /^(#{1,3})\s+(.*)$/.exec(line)
    if (h) {
      const level = h[1].length
      const content = inline(h[2], onLink, k)
      blocks.push(level === 1 ? <h1 key={k++}>{content}</h1> : level === 2 ? <h2 key={k++}>{content}</h2> : <h3 key={k++}>{content}</h3>)
      i++
      continue
    }
    if (line.startsWith('|')) {
      const rows: string[][] = []
      while (i < lines.length && lines[i].startsWith('|')) {
        const cells = lines[i].trim().replace(/^\||\|$/g, '').split('|').map((c) => c.trim())
        if (!cells.every((c) => /^-+$/.test(c))) rows.push(cells)
        i++
      }
      const [head, ...body] = rows
      blocks.push(
        <table key={k++}>
          <thead><tr>{head.map((c, j) => <th key={j}>{inline(c, onLink, j)}</th>)}</tr></thead>
          <tbody>{body.map((r, ri) => <tr key={ri}>{r.map((c, j) => <td key={j}>{inline(c, onLink, j)}</td>)}</tr>)}</tbody>
        </table>,
      )
      continue
    }
    if (/^\s*([-*]|\d+\.)\s+/.test(line)) {
      const ordered = /^\s*\d+\./.test(line)
      const items: string[] = []
      while (i < lines.length && /^\s*([-*]|\d+\.)\s+/.test(lines[i])) {
        items.push(lines[i].replace(/^\s*([-*]|\d+\.)\s+/, ''))
        i++
      }
      const lis = items.map((it, j) => <li key={j}>{inline(it, onLink, j)}</li>)
      blocks.push(ordered ? <ol key={k++}>{lis}</ol> : <ul key={k++}>{lis}</ul>)
      continue
    }
    if (line.startsWith('>')) {
      const parts: string[] = []
      while (i < lines.length && lines[i].startsWith('>')) parts.push(lines[i++].replace(/^>\s?/, ''))
      blocks.push(<blockquote key={k++}>{inline(parts.join(' '), onLink, k)}</blockquote>)
      continue
    }
    const para: string[] = []
    while (i < lines.length && lines[i].trim() && !/^(#|\||>|\s*([-*]|\d+\.)\s)/.test(lines[i])) para.push(lines[i++])
    blocks.push(<p key={k++}>{para.map((p, j) => <span key={j}>{j > 0 && <br />}{inline(p, onLink, j)}</span>)}</p>)
  }
  return <div className="md">{blocks}</div>
}
