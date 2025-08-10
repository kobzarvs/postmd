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
      <div className="max-w-6xl mx-auto px-3 xs:px-4 py-4 xs:py-6 md:py-8">
        <header className="mb-6 md:mb-8">
          <div className="flex flex-col xs:flex-row xs:items-start xs:justify-between gap-4">
            <div className="flex-1 min-w-0">
              <h1 className="text-2xl xs:text-3xl font-bold text-gray-900 break-words">PostMD</h1>
              <p className="text-gray-600 mt-1 xs:mt-2 text-sm xs:text-base leading-tight">
                Простой сервис для публикации постов в формате Markdown
              </p>
            </div>
            <div className="flex-shrink-0 self-start">
              <AuthButton />
            </div>
          </div>
        </header>

        {error && (
          <div className="mb-4 p-3 xs:p-4 bg-red-50 border border-red-200 rounded-md">
            <p className="text-red-600 text-sm xs:text-base">{error}</p>
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
