'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import EntryForm from '@/components/EntryForm'
import { type CreateEntryInput } from '@/lib/validation'

export default function HomePage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (data: CreateEntryInput) => {
    setIsSubmitting(true)
    setError(null)

    try {
      const response = await fetch('/api/entries', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Ошибка при создании записи')
      }

      const result = await response.json()
      
      // Перенаправляем на страницу записи
      router.push(`/${result.id}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Произошла неизвестная ошибка')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">PostMD</h1>
          <p className="text-gray-600 mt-2">
            Простой сервис для публикации текстов в формате Markdown
          </p>
        </header>

        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
            <p className="text-red-600">{error}</p>
          </div>
        )}

        <EntryForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />

        <div className="mt-12 text-sm text-gray-600">
          <h2 className="font-semibold text-lg text-gray-800 mb-4">Возможности:</h2>
          <ul className="list-disc list-inside space-y-2">
            <li>Поддержка полного синтаксиса Markdown с живым превью</li>
            <li>Кастомные URL для ваших записей</li>
            <li>Коды доступа для редактирования и модификации</li>
            <li>Подсветка синтаксиса кода</li>
            <li>Записи хранятся постоянно</li>
            <li>Лимит текста: 200,000 символов</li>
          </ul>
        </div>
      </div>
    </div>
  )
}