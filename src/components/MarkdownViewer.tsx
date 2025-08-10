import 'katex/dist/katex.min.css'
import { renderMarkdown } from '@/lib/markdown'
import MermaidHydrator from './MermaidHydrator'
import PlantUmlHydrator from './PlantUmlHydrator'

interface MarkdownViewerProps {
  content: string
}

export default async function MarkdownViewer({ content }: MarkdownViewerProps) {
  const html = await renderMarkdown(content)
  return (
    <div className="prose prose-gray max-w-none dark:prose-invert">
      <MermaidHydrator />
  <PlantUmlHydrator />
      <div dangerouslySetInnerHTML={{ __html: html }} />
    </div>
  )
}