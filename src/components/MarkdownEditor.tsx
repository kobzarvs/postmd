'use client'

import { useState, useEffect, useRef } from 'react'
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
      <div className="min-h-[400px] xs:min-h-[500px] border border-gray-300 rounded-lg p-3 xs:p-4">
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full h-full min-h-[400px] xs:min-h-[500px] outline-none resize-none text-sm xs:text-base"
        />
      </div>
    )
  }

  // Calculate responsive height for mobile-first approach
  const getEditorHeight = () => {
    if (typeof window !== 'undefined') {
      const vh = window.innerHeight
      if (vh <= 667) { // iPhone SE/6/7/8 and similar
        return 'calc(100vh - 280px)'
      } else if (vh <= 800) { // Most phones in landscape or small tablets
        return 'calc(100vh - 320px)'
      } else { // Tablets and desktop
        return 'calc(100vh - 340px)'
      }
    }
    return '400px' // Fallback
  }

  return (
    <div className="w-full" data-color-mode="light">
      <div className="mb-2 flex gap-1 xs:gap-2">
        <button 
          type="button" 
          onClick={() => setTab('edit')} 
          className={`px-2 xs:px-3 py-1 rounded text-xs xs:text-sm touch-target ${
            tab === 'edit' ? 'bg-blue-600 text-white' : 'bg-gray-200'
          }`}
        >
          Редактирование
        </button>
        <button 
          type="button" 
          onClick={() => setTab('preview')} 
          className={`px-2 xs:px-3 py-1 rounded text-xs xs:text-sm touch-target ${
            tab === 'preview' ? 'bg-blue-600 text-white' : 'bg-gray-200'
          }`}
        >
          Предварительный просмотр
        </button>
      </div>
      {tab === 'edit' ? (
        <EditorFocusWrapper>
          <MDEditor
            value={value}
            onChange={(val?: string) => onChange(val || '')}
            preview="edit"
            // @ts-expect-error -- MDEditor height expects a number, but we use a responsive CSS string (vh)
            height={getEditorHeight()}
            textareaProps={{ 
              placeholder, 
              style: { 
                fontSize: window.innerWidth <= 480 ? 16 : 18,
                lineHeight: 1.5
              } 
            }}
          />
        </EditorFocusWrapper>
      ) : (
        <div className="border border-gray-300 rounded-lg p-3 xs:p-4 min-h-[400px] xs:min-h-[500px] bg-white overflow-auto">
          <MermaidHydrator />
          <PlantUmlHydrator />
          <div className="prose prose-gray max-w-none" dangerouslySetInnerHTML={{ __html: previewHtml }} />
        </div>
      )}
    </div>
  )
}

// Wraps the editor and ensures any click focuses the underlying textarea
function EditorFocusWrapper({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement | null>(null)

  const handleMouseDownCapture: React.MouseEventHandler<HTMLDivElement> = (e) => {
    const target = e.target as HTMLElement
    // Don't steal focus from buttons/links inside the editor (e.g., toolbar)
    if (target.closest('button, a, [role="button"]')) return
    const root = ref.current
    if (!root) return
    const textarea = (root.querySelector('textarea, .w-md-editor-text-input textarea, .w-md-editor-textarea') as HTMLTextAreaElement | null)
    if (textarea) {
      // Stop default selection behavior that may blur the textarea when clicking empty space
      e.preventDefault()
      // Focus and move caret to end to avoid lost focus when clicking empty area
      textarea.focus()
      const len = textarea.value?.length ?? 0
      try { textarea.setSelectionRange(len, len) } catch { /* noop */ }
    }
  }

  return (
    <div ref={ref} onMouseDownCapture={handleMouseDownCapture} className="cursor-text">
      {children}
    </div>
  )
}