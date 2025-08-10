// Use the CJS build explicitly to avoid Turbopack ESM tree-shaking bug (isSpace not defined)
import MarkdownIt from 'markdown-it/dist/index.cjs.js'
import type { Options as MarkdownItOptions } from 'markdown-it'
import mila from 'markdown-it-link-attributes'
import katex from 'markdown-it-katex'
import hljs from 'highlight.js'
import tables from 'markdown-it-multimd-table'

// Environment-driven toggle to allow raw HTML in markdown input (default: false)
const ALLOW_RAW_HTML = typeof process !== 'undefined' && process.env.NEXT_PUBLIC_MD_ALLOW_HTML === 'true'

// Fenced block wrappers for diagram languages
function fencedDiagramsPlugin(md: MarkdownIt) {
    const fence = md.renderer.rules.fence!
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    md.renderer.rules.fence = ((tokens: any, idx: number, options: MarkdownItOptions, env: unknown, self: any): string => {
        const token = tokens[idx] as { info: string; content: string }
        const lang = token.info.trim().toLowerCase()
        if (lang === 'mermaid') {
            const content = token.content
            return `<div class="mermaid">${content}</div>`
        }
        if (lang === 'plantuml' || lang === 'puml') {
            const content = token.content
            return `<div class="plantuml">${content}</div>`
        }
        return fence(tokens, idx, options, env, self)
    }) as typeof fence
}

export async function createMarkdown(): Promise<MarkdownIt> {
    const md: MarkdownIt = new MarkdownIt({
        // Disallow raw HTML in user input by default; plugins still output safe HTML
        html: ALLOW_RAW_HTML,
        linkify: true,
        breaks: false,
        highlight: (str: string, lang?: string): string => {
            const raw = (lang || '').toLowerCase()
            // Normalize common aliases
            const aliasMap: Record<string, string> = {
                ts: 'typescript',
                tsx: 'typescript',
                js: 'javascript',
                jsx: 'javascript',
                sh: 'bash',
                shell: 'bash',
                yml: 'yaml',
                plaintext: 'text',
                txt: 'text',
                md: 'markdown',
                html: 'xml',
            }
            const language = aliasMap[raw] || raw
            if (language && hljs.getLanguage(language)) {
                const { value } = hljs.highlight(str, { language })
                return `<pre class="hljs"><code class="language-${language}">${value}</code></pre>`
            }
            // Attempt auto-detection for unknown/missing languages
            try {
                const autod = hljs.highlightAuto(str, [
                    'typescript', 'javascript', 'json', 'bash', 'yaml',
                    'markdown', 'xml', 'html', 'css', 'python', 'go', 'rust'
                ])
                if (autod.language) {
                    return `<pre class=\"hljs\"><code class=\"language-${autod.language}\">${autod.value}</code></pre>`
                }
            } catch {
                // ignore and fall back to escaped
            }
            return `<pre class=\"hljs\"><code>${md.utils.escapeHtml(str)}</code></pre>`
        }
    })
        // Advanced tables with alignment and multiline cells
        .use(tables, { multiline: true, rowspan: true, headerless: false })
        .use(katex)
        .use(mila, { attrs: { target: '_blank', rel: 'noopener noreferrer' } })
        .use(fencedDiagramsPlugin)

    return md
}

export async function renderMarkdown(content: string) {
    const md = await createMarkdown()
    const html = md.render(content)
    return html
}
