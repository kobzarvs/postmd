'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import MarkdownEditor from '@/components/MarkdownEditor'

interface PageProps {
  params: Promise<{ id: string }>
}

export default function EditPage({}: PageProps) {
  const params = useParams()
  const id = params.id as string
  const router = useRouter()
  const [content, setContent] = useState('')
  const [code, setCode] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Загружаем содержимое записи
    fetch(`/api/entries/${id}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.content) {
          setContent(data.content)
        } else {
          setError('Запись не найдена')
        }
      })
      .catch(() => {
        setError('Ошибка при загрузке записи')
      })
      .finally(() => {
        setIsLoading(false)
      })
  }, [id])

  const handleSubmit = async () => {
    if (!code) {
      setError('Введите код доступа')
      return
    }

    setIsSubmitting(true)
    setError(null)

    try {
      const response = await fetch(`/api/entries/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content, code }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Ошибка при обновлении записи')
      }

      router.push(`/${id}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Произошла неизвестная ошибка')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600">Загрузка...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <header className="mb-8 flex items-center justify-between">
          <Link 
            href={`/${id}`}
            className="text-blue-600 hover:text-blue-800 transition-colors"
          >
            ← Назад к записи
          </Link>
        </header>

        <h1 className="text-2xl font-bold text-gray-900 mb-6">
          Редактирование записи
        </h1>

        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
            <p className="text-red-600">{error}</p>
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label htmlFor="code" className="block text-sm font-medium text-gray-700 mb-1">
              Код доступа
            </label>
            <input
              type="text"
              id="code"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Введите код для редактирования или модификации"
              className="w-full md:w-96 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <MarkdownEditor
            value={content}
            onChange={setContent}
            onSubmit={handleSubmit}
          />

          <div className="flex justify-between items-center">
            <p className="text-sm text-gray-600">
              Нажмите Ctrl+Enter для быстрого сохранения
            </p>
            <button
              onClick={handleSubmit}
              disabled={isSubmitting || !code}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Сохранение...' : 'Сохранить изменения'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}