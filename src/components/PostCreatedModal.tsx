'use client'

import { useState } from 'react'

interface PostCreatedModalProps {
  isOpen: boolean
  onClose: () => void
  postId: string
  editCode: string | null
}

export default function PostCreatedModal({ isOpen, onClose, postId, editCode }: PostCreatedModalProps) {
  const [copiedField, setCopiedField] = useState<'url' | 'code' | null>(null)

  if (!isOpen) return null

  const postUrl = `${typeof window !== 'undefined' ? window.location.origin : ''}/${postId}`

  const copyToClipboard = async (text: string, field: 'url' | 'code') => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedField(field)
      setTimeout(() => setCopiedField(null), 3000)
    } catch (err) {
      console.error('Failed to copy to clipboard:', err)
    }
  }

  const CopyIcon = () => (
    <svg className="w-5 h-5 cursor-pointer" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
    </svg>
  )

  const CheckIcon = () => (
    <svg className="w-6 h-6" fill="none" stroke="green" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
    </svg>
  )

  return (
    <div className="fixed inset-0 bg-gray-500/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-8 w-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="font-semibold text-gray-900">Пост успешно создан!</h3>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
              aria-label="Закрыть"
            >
              <svg className="h-6 w-6 cursor-pointer" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="space-y-4">
            {/* URL поста */}
            <div>
              <label className="block font-medium text-gray-700 mb-2">
                Ссылка на пост:
              </label>
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  value={postUrl}
                  readOnly
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
                />
                <button
                  onClick={() => copyToClipboard(postUrl, 'url')}
                  className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded transition-colors"
                  title="Скопировать ссылку"
                >
                  {copiedField === 'url' ? <CheckIcon /> : <CopyIcon />}
                </button>
              </div>
            </div>

            {/* Код для редактирования */}
            {editCode && (
              <div>
                <label className="block font-medium text-gray-700 mb-2">
                  Код для редактирования:
                </label>
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={editCode}
                    readOnly
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md bg-gray-50 font-mono"
                  />
                  <button
                    onClick={() => copyToClipboard(editCode, 'code')}
                    className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded transition-colors"
                    title="Скопировать код"
                  >
                    {copiedField === 'code' ? <CheckIcon /> : <CopyIcon />}
                  </button>
                </div>
                <p className="text-gray-500 mt-2 italic">
                  Сохраните этот код для редактирования
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
