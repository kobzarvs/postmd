'use client'

import { useEffect, useState } from 'react'
import { renderMarkdown } from '@/lib/markdown'
import MermaidHydrator from './MermaidHydrator'
import PlantUmlHydrator from './PlantUmlHydrator'

interface MarkdownViewerClientProps { content: string }

export default function MarkdownViewerClient({ content }: MarkdownViewerClientProps) {
    const [html, setHtml] = useState('')

    useEffect(() => {
        let cancelled = false
        renderMarkdown(content)
            .then((h) => { if (!cancelled) setHtml(h) })
            .catch(() => { if (!cancelled) setHtml('') })
        return () => { cancelled = true }
    }, [content])

    return (
        <div className="prose prose-gray max-w-none dark:prose-invert">
            <MermaidHydrator />
            <PlantUmlHydrator />
            <div dangerouslySetInnerHTML={{ __html: html }} />
        </div>
    )
}
