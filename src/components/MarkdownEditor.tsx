'use client'

import { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import MarkdownViewer from './MarkdownViewer'
import { markdown, markdownLanguage } from '@codemirror/lang-markdown'
import { languages } from '@codemirror/language-data'

const CodeMirror = dynamic(
  () => import('@uiw/react-codemirror').then((mod) => mod.default),
  { ssr: false }
)

const extensions = [markdown({ base: markdownLanguage, codeLanguages: languages })]

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

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === 'Enter' && onSubmit) {
        e.preventDefault()
        onSubmit()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onSubmit])

  if (!mounted) {
    return (
      <div className="min-h-[500px] border border-gray-300 rounded-lg p-4">
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full h-full min-h-[500px] outline-none resize-none"
        />
      </div>
    )
  }

  return (
    <div className="w-full">
      <div className="flex border-b mb-2">
        <button
          type="button"
          className={`px-4 py-2 -mb-px ${tab === 'edit' ? 'border-b-2 border-blue-500' : 'text-gray-500'}`}
          onClick={() => setTab('edit')}
        >
          Редактор
        </button>
        <button
          type="button"
          className={`px-4 py-2 -mb-px ${tab === 'preview' ? 'border-b-2 border-blue-500' : 'text-gray-500'}`}
          onClick={() => setTab('preview')}
        >
          Preview
        </button>
      </div>
      {tab === 'edit' ? (
        <CodeMirror
          value={value}
          height="500px"
          extensions={extensions}
          onChange={(val) => onChange(val)}
          placeholder={placeholder}
          className="border border-gray-300 rounded-lg"
        />
      ) : (
        <div className="min-h-[500px] border border-gray-300 rounded-lg p-4">
          <MarkdownViewer content={value} />
        </div>
      )}
    </div>
  )
}

