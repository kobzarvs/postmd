'use client'

import { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import 'katex/dist/katex.min.css'
import { renderMarkdown } from '@/lib/markdown'
import MermaidHydrator from './MermaidHydrator'
import PlantUmlHydrator from './PlantUmlHydrator'

const MDEditor = dynamic(
  () => import('@uiw/react-md-editor').then((mod) => mod.default),
  { ssr: false }
)

interface MarkdownEditorProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  onSubmit?: () => void
}

export default function MarkdownEditor({
  value,
  onChange,
  placeholder = 'Введите текст в формате Markdown...',
  onSubmit,
}: MarkdownEditorProps) {
  const [mounted, setMounted] = useState(false)
  const [tab, setTab] = useState<'edit' | 'preview'>('edit')
  const [previewHtml, setPreviewHtml] = useState<string>('')

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter' && onSubmit) {
        e.preventDefault()
        onSubmit()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onSubmit])

  useEffect(() => {
    if (tab === 'preview') {
      // render markdown to html using same pipeline
      renderMarkdown(value).then(setPreviewHtml).catch(() => setPreviewHtml(''))
    }
  }, [tab, value])

  if (!mounted) {
    return (
      <div className="min-h-[500px] border border-gray-300 rounded-lg p-4">
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full h-full min-h-[500px] outline-none resize-none"
          style={{ fontSize: 24 }}
        />
      </div>
    )
  }

  return (
    <div className="w-full" data-color-mode="light">
      <div className="mb-2 flex gap-2">
        <button type="button" onClick={() => setTab('edit')} className={`px-3 py-1 rounded ${tab === 'edit' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>
          Редактирование
        </button>
        <button type="button" onClick={() => setTab('preview')} className={`px-3 py-1 rounded ${tab === 'preview' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>
          Предварительный просмотр
        </button>
      </div>
      {tab === 'edit' ? (
        <MDEditor
          value={value}
          onChange={(val?: string) => onChange(val || '')}
          preview="edit"
          // @ts-expect-error
          height="calc(100vh - 340px)"
          textareaProps={{ placeholder, style: { fontSize: 18 } }}
        />
      ) : (
        <div className="border border-gray-300 rounded-lg p-4 min-h-[500px] bg-white overflow-auto">
          <MermaidHydrator />
          <PlantUmlHydrator />
          <div className="prose prose-gray max-w-none" dangerouslySetInnerHTML={{ __html: previewHtml }} />
        </div>
      )}
    </div>
  )
}