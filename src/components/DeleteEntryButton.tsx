'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface DeleteEntryButtonProps {
  entryId: string
  onSuccess?: () => void
  className?: string
  children?: React.ReactNode
}

export default function DeleteEntryButton({ 
  entryId, 
  onSuccess, 
  className = "text-red-600 hover:text-red-800 transition-colors",
  children = "Удалить"
}: DeleteEntryButtonProps) {
  const [isDeleting, setIsDeleting] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const router = useRouter()

  const handleDelete = async () => {
    if (!showConfirm) {
      setShowConfirm(true)
      return
    }

    setIsDeleting(true)
    try {
      const response = await fetch(`/api/entries/${entryId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        onSuccess?.()
        // If no custom success handler, redirect to profile
        if (!onSuccess) {
          router.push('/profile')
        }
      } else {
        const data = await response.json()
        alert(data.error || 'Ошибка при удалении записи')
      }
    } catch (error) {
      console.error('Delete error:', error)
      alert('Ошибка при удалении записи')
    } finally {
      setIsDeleting(false)
      setShowConfirm(false)
    }
  }

  const handleCancel = () => {
    setShowConfirm(false)
  }

  if (showConfirm) {
    return (
      <div className="flex items-center space-x-2">
        <button
          onClick={handleDelete}
          disabled={isDeleting}
          className="text-red-600 hover:text-red-800 font-medium transition-colors disabled:opacity-50"
        >
          {isDeleting ? 'Удаление...' : 'Подтвердить'}
        </button>
        <button
          onClick={handleCancel}
          disabled={isDeleting}
          className="text-gray-600 hover:text-gray-800 transition-colors disabled:opacity-50"
        >
          Отмена
        </button>
      </div>
    )
  }

  return (
    <button
      onClick={handleDelete}
      className={className}
      disabled={isDeleting}
    >
      {children}
    </button>
  )
}