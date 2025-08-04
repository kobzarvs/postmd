'use client'

import { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism'
import 'react-mde/lib/styles/css/react-mde-all.css'

const ReactMde = dynamic(() => import('react-mde'), { ssr: false })

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
  const [selectedTab, setSelectedTab] = useState<'write' | 'preview'>('write')

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
      <ReactMde
        value={value}
        onChange={(val) => onChange(val)}
        selectedTab={selectedTab}
        onTabChange={setSelectedTab}
        minEditorHeight={500}
        childProps={{
          textArea: {
            placeholder,
          },
        }}
        generateMarkdownPreview={(markdown) =>
          Promise.resolve(
            <div className="prose prose-gray max-w-none dark:prose-invert">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  code({ inline, className, children, ...props }: any) {
                    const match = /language-(\w+)/.exec(className || '')
                    return !inline && match ? (
                      <SyntaxHighlighter
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        style={oneDark as any}
                        language={match[1]}
                        PreTag="div"
                        {...props}
                      >
                        {String(children).replace(/\n$/, '')}
                      </SyntaxHighlighter>
                    ) : (
                      <code className={className} {...props}>
                        {children}
                      </code>
                    )
                  },
                }}
              >
                {markdown}
              </ReactMarkdown>
            </div>
          )
        }
      />
    </div>
  )
}