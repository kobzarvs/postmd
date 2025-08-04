'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import MarkdownEditor from '@/components/MarkdownEditor'

interface PageProps {
  params: Promise<{ id: string }>
}

export default function EditPage({}: PageProps) {
  const params = useParams()
  const id = params.id as string
  const router = useRouter()
  const { data: session } = useSession()
  const [content, setContent] = useState('')
  const [code, setCode] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [entryData, setEntryData] = useState<{ userId?: string } | null>(null)

  useEffect(() => {
    // Загружаем содержимое записи
    fetch(`/api/entries/${id}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.content) {
          setContent(data.content)
          setEntryData(data)
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
    const isOwner = session?.user?.id && entryData?.userId === session.user.id
    
    if (!isOwner && !code) {
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
        body: JSON.stringify({ 
          content, 
          ...(code && { code }) // Добавляем код только если он введен
        }),
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
          {/* Показываем поле кода только если пользователь не владелец записи */}
          {!(session?.user?.id && entryData?.userId === session.user.id) && (
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
          )}

          {/* Показываем информацию для владельца */}
          {session?.user?.id && entryData?.userId === session.user.id && (
            <div className="bg-green-50 border border-green-200 rounded-md p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-green-800">
                    Это ваша запись. Вы можете редактировать её без кода доступа.
                  </p>
                </div>
              </div>
            </div>
          )}

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
              disabled={
                isSubmitting || 
                (!(session?.user?.id && entryData?.userId === session.user.id) && !code)
              }
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