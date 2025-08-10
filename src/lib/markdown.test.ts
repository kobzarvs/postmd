import { describe, it, expect } from 'vitest'
import { renderMarkdown } from './markdown'

describe('renderMarkdown', () => {
  it('sanitizes basic XSS', async () => {
    const html = await renderMarkdown('<img src=x onerror=alert(1)><script>alert(2)</script>')
    // HTML теги экранируются markdown-it если html не включен
    expect(html).toMatch(/&lt;img/)
    expect(html).toMatch(/&lt;script/)
  })

  it('allows code blocks and syntax highlighting', async () => {
    const md = '```js\nconsole.log(123)\n```'
    const html = await renderMarkdown(md)
    expect(html).toMatch(/<pre class="hljs"/)
    expect(html).toMatch(/console/)
  })

  it('preserves links with safe href', async () => {
    const html = await renderMarkdown('[link](https://example.com)')
    expect(html).toMatch(/<a[^>]+href="https:\/\/example.com"/)
  })

  it('handles javascript: URLs safely', async () => {
    const html = await renderMarkdown('[bad](javascript:alert(1))')
    // markdown-it не создает ссылки из javascript: URL
    expect(html).toMatch(/\[bad\]\(javascript:alert/)
  })

  it('preserves tables', async () => {
    const md = '|a|b|\n|-|-|\n|1|2|'
    const html = await renderMarkdown(md)
    expect(html).toBe('<table>\n<thead>\n<tr>\n<th>a</th>\n<th>b</th>\n</tr>\n</thead>\n<tbody>\n<tr>\n<td>1</td>\n<td>2</td>\n</tr>\n</tbody>\n</table>\n')
  })

  it('preserves math expressions', async () => {
    const md = '$$x^2$$'
    const html = await renderMarkdown(md)
    expect(html).toMatch(/katex/)
  })

  it('preserves mermaid diagrams', async () => {
    const md = '```mermaid\ngraph TD; A-->B;\n```'
    const html = await renderMarkdown(md)
    expect(html).toMatch(/class="mermaid"/)
  })

  it('preserves plantuml diagrams', async () => {
    const md = '```plantuml\n@startuml\nA -> B\n@enduml\n```'
    const html = await renderMarkdown(md)
    expect(html).toMatch(/class="plantuml"/)
  })

  it('handles empty content', async () => {
    const html = await renderMarkdown('')
    expect(html).toBe('')
  })

  it('escapes HTML with event handlers', async () => {
    const html = await renderMarkdown('<a href="#" onclick="alert(1)">test</a>')
    // HTML теги экранируются
    expect(html).toMatch(/&lt;a/)
    expect(html).toMatch(/onclick/)
  })
})