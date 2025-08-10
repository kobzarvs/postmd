import { renderMarkdown } from './markdown'

describe('renderMarkdown', () => {
  it('sanitizes basic XSS', async () => {
    const html = await renderMarkdown('<img src=x onerror=alert(1)><script>alert(2)</script>')
    expect(html).not.toMatch(/onerror|<script>/)
  })

  it('allows code blocks and syntax highlighting', async () => {
    const md = '```js\nconsole.log(123)\n```'
    const html = await renderMarkdown(md)
    expect(html).toMatch(/<pre.*hljs.*<code.*console\.log/)
  })

  it('preserves links with safe href', async () => {
    const html = await renderMarkdown('[link](https://example.com)')
    expect(html).toMatch(/<a[^>]+href="https:\/\/example.com"/)
  })

  it('removes javascript: URLs', async () => {
    const html = await renderMarkdown('[bad](javascript:alert(1))')
    expect(html).not.toMatch(/javascript:/)
  })

  it('preserves tables', async () => {
    const md = '|a|b|\n|-|-|\n|1|2|'
    const html = await renderMarkdown(md)
    expect(html).toMatch(/<table.*<tr.*<td.*1.*<td.*2/)
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

  it('removes event handlers from attributes', async () => {
    const html = await renderMarkdown('<a href="#" onclick="alert(1)">test</a>')
    expect(html).not.toMatch(/onclick/)
  })
})
