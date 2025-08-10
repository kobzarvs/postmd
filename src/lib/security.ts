// Security utilities and DOMPurify config for markdown sanitization
import type { Config } from 'isomorphic-dompurify'

export const ALLOWED_TAGS = [
  'a', 'b', 'i', 'u', 'em', 'strong', 'code', 'pre', 'blockquote', 'ul', 'ol', 'li', 'p', 'br', 'hr', 'span', 'div',
  'table', 'thead', 'tbody', 'tr', 'th', 'td', 'img', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
  // For diagrams and math
  'svg', 'math', 'mi', 'mn', 'mo', 'ms', 'mtext', 'mrow', 'mermaid', 'plantuml'
]

export const ALLOWED_ATTRS = [
  'href', 'target', 'rel', 'title', 'src', 'alt', 'class', 'id', 'style', 'align', 'rowspan', 'colspan',
  // For code blocks and diagrams
  'data-language', 'data-processed', 'data-source', 'data-type', 'data-id', 'data-math', 'data-mermaid', 'data-plantuml'
]

export const ALLOWED_URI_SCHEMES = ['http', 'https', 'mailto']

export const domPurifyConfig: Config = {
  ALLOWED_TAGS,
  ALLOWED_ATTR: ALLOWED_ATTRS,
  ALLOWED_URI_REGEXP: /^(https?|mailto):/i,
  RETURN_DOM: false,
  RETURN_DOM_FRAGMENT: false,
  FORCE_BODY: false,
  ADD_TAGS: ['span', 'div'],
  ADD_ATTR: ['class', 'id', 'style'],
}

// Utility: validate URLs (for href/src)
export function isSafeUrl(url: string): boolean {
  try {
    const u = new URL(url, 'http://localhost')
    return ALLOWED_URI_SCHEMES.includes(u.protocol.replace(':', ''))
  } catch {
    return false
  }
}

// Utility: sanitize attribute values
export function sanitizeAttr(attr: string): string {
  // Remove event handlers and javascript: URLs
  if (/^on/i.test(attr) || /^javascript:/i.test(attr)) return ''
  return attr
}
