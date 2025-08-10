'use client'

import { useEffect } from 'react'
import mermaid from 'mermaid'

export default function MermaidHydrator() {
  useEffect(() => {
    try {
      mermaid.initialize({
        startOnLoad: false,
        securityLevel: 'loose',
        theme: 'neutral',
        themeVariables: { fontFamily: 'inherit' },
      })
      const blocks = Array.from(document.querySelectorAll<HTMLElement>('.mermaid'))
      blocks.forEach(async (el, idx) => {
        const id = `mermaid-${idx}`
        const code = el.textContent || ''
        // Validate first to avoid giant inline error SVGs
        try {
          ;(mermaid as unknown as { parse: (src: string) => void }).parse(code)
        } catch {
          // fallback: show raw code block
          const pre = document.createElement('pre')
          const codeEl = document.createElement('code')
          codeEl.className = 'language-mermaid'
          codeEl.textContent = code
          pre.appendChild(codeEl)
          el.replaceWith(pre)
          return
        }
        try {
          const { svg } = await mermaid.render(id, code)
          el.innerHTML = svg
        } catch {
          // ignore, leave as-is
        }
      })
    } catch {
      // ignore
    }
  }, [])
  return null
}
