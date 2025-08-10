'use client'

import { useEffect } from 'react'

// Encodes PlantUML text for Kroki server (expects text/plain content encoded with deflate+base64url)
// To keep it simple and lightweight on client, we use kroki's POST text API instead of URL encoding.
const KROKI_URL = (typeof process !== 'undefined' && process.env.NEXT_PUBLIC_KROKI_URL) || 'https://kroki.io/plantuml/svg'
async function renderWithKroki(source: string): Promise<string | null> {
  try {
  const resp = await fetch(KROKI_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain' },
      body: source,
      cache: 'no-store',
    })
    if (!resp.ok) return null
    const svg = await resp.text()
    return svg
  } catch {
    return null
  }
}

export default function PlantUmlHydrator() {
  useEffect(() => {
    let aborted = false
    const run = async () => {
      const blocks = Array.from(document.querySelectorAll<HTMLElement>('.plantuml'))
      for (const el of blocks) {
        const code = el.textContent || ''
        el.innerHTML = ''
        const svg = await renderWithKroki(code)
        if (aborted) return
        if (svg) {
          // Insert as inline SVG for better styling; Kroki output is sanitized SVG
          el.innerHTML = svg
        } else {
          el.textContent = '[PlantUML render failed]'
        }
      }
    }
    run()
    return () => {
      aborted = true
    }
  }, [])
  return null
}
