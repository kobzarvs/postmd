'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import EntryForm from '@/components/EntryForm'
import AuthButton from '@/components/AuthButton'
import PostCreatedModal from '@/components/PostCreatedModal'
import { type CreateEntryInput } from '@/lib/validation'

export default function HomePage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showModal, setShowModal] = useState(false)
  const [createdPost, setCreatedPost] = useState<{ id: string; editCode: string | null; content: string } | null>(null)

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
      // Показываем модалку с ссылкой и кодом, редирект выполним после закрытия
      setCreatedPost({ id: result.id, editCode: result.editCode, content: data.content })
      setShowModal(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Произошла неизвестная ошибка')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <header className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">PostMD</h1>
            <p className="text-gray-600 mt-2">
              Простой сервис для публикации постов в формате Markdown
            </p>
          </div>
          <AuthButton />
        </header>

        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
            <p className="text-red-600">{error}</p>
          </div>
        )}

        <EntryForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />

        {createdPost && (
          <PostCreatedModal
            isOpen={showModal}
            onClose={() => {
              setShowModal(false)
              // Редирект на опубликованный пост после закрытия модалки
              router.push(`/${createdPost.id}`)
            }}
            postId={createdPost.id}
            editCode={createdPost.editCode}
          />
        )}
      </div>
    </div>
  )
}
