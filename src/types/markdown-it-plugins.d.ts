declare module 'markdown-it-link-attributes' {
    import type MarkdownIt from 'markdown-it'
    function plugin(md: MarkdownIt, opts?: unknown): void
    export default plugin
}

declare module 'markdown-it-katex' {
    import type MarkdownIt from 'markdown-it'
    function plugin(md: MarkdownIt, opts?: unknown): void
    export default plugin
}
