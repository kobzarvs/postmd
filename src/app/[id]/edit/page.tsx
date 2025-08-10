'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import MarkdownEditor from '@/components/MarkdownEditor'
import type { Session } from 'next-auth'

interface PageProps {
  params: Promise<{ id: string }>
}

export default function EditPage({ }: PageProps) {
  const params = useParams()
  const id = params.id as string
  const router = useRouter()
  const { data: session } = useSession() as { data: Session | null }
  const [content, setContent] = useState('')
  const [code, setCode] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isOwner, setIsOwner] = useState<boolean>(false)

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

  useEffect(() => {
    // Определяем владение отдельным запросом (без раскрытия userId)
    fetch(`/api/entries/${id}/ownership`)
      .then((res) => res.ok ? res.json() : Promise.resolve({ isOwner: false }))
      .then((data) => setIsOwner(Boolean(data.isOwner)))
      .catch(() => setIsOwner(false))
  }, [id])

  const handleSubmit = async () => {
    const owner = Boolean(isOwner || (session?.user?.id && isOwner))

    if (!owner && !code) {
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
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto px-3 xs:px-4 py-4 xs:py-6 md:py-8">
        <header className="mb-4 xs:mb-6">
          <Link
            href={`/${id}`}
            className="text-blue-600 hover:text-blue-800 transition-colors text-sm xs:text-base touch-target"
          >
            ← Назад к записи
          </Link>
        </header>

        <div className="mb-4 xs:mb-6">
          <h1 className="text-xl xs:text-2xl font-bold text-gray-900">
            Редактирование записи
          </h1>
        </div>

        {error && (
          <div className="mb-4 p-3 xs:p-4 bg-red-50 border border-red-200 rounded-md">
            <p className="text-red-600 text-sm xs:text-base">{error}</p>
          </div>
        )}

        <div className="space-y-4">
          {/* Показываем информацию для владельца */}
          {isOwner && (
            <div className="bg-green-50 border border-green-200 rounded-md p-3 xs:p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-green-800 text-sm xs:text-base">
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

          <div className="space-y-3 xs:space-y-0 xs:flex xs:justify-between xs:items-center">
            <p className="text-gray-600 text-xs xs:text-sm order-2 xs:order-1">
              Нажмите Ctrl+Enter для быстрого сохранения
            </p>

            <div className="flex flex-col xs:flex-row xs:items-center gap-3 xs:gap-4 order-1 xs:order-2">
              {/* Показываем поле кода только если пользователь не владелец записи */}
              {!isOwner && (
                <input
                  type="text"
                  id="code"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="Введите код для редактирования"
                  className="w-full xs:w-72 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm xs:text-base touch-target"
                />
              )}

              <button
                onClick={handleSubmit}
                disabled={
                  isSubmitting ||
                  (!isOwner && !code)
                }
                className="w-full xs:w-auto px-4 xs:px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-sm xs:text-base touch-target font-medium"
              >
                {isSubmitting ? 'Сохранение...' : 'Сохранить изменения'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}