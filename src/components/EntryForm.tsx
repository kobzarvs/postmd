'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { createEntrySchema, type CreateEntryInput } from '@/lib/validation'
import MarkdownEditor from './MarkdownEditor'

interface EntryFormProps {
  onSubmit: (data: CreateEntryInput) => Promise<void>
  isSubmitting?: boolean
}

export default function EntryForm({ onSubmit, isSubmitting }: EntryFormProps) {
  const [content, setContent] = useState('')
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<CreateEntryInput>({
    resolver: zodResolver(createEntrySchema),
  })

  const handleFormSubmit = handleSubmit(async (data) => {
    await onSubmit({ ...data, content })
  })

  return (
    <form onSubmit={handleFormSubmit} className="space-y-4">
      <div>
        <MarkdownEditor
          value={content}
          onChange={(value) => {
            setContent(value)
            setValue('content', value)
          }}
          onSubmit={() => handleFormSubmit()}
        />
        {errors.content && (
          <p className="text-red-500 text-sm mt-1">{errors.content.message}</p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label htmlFor="customUrl" className="block text-sm font-medium text-gray-700 mb-1">
            Кастомный URL (опционально)
          </label>
          <input
            {...register('customUrl')}
            type="text"
            id="customUrl"
            placeholder="my-custom-url"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.customUrl && (
            <p className="text-red-500 text-sm mt-1">{errors.customUrl.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="editCode" className="block text-sm font-medium text-gray-700 mb-1">
            Код для редактирования (опционально)
          </label>
          <input
            {...register('editCode')}
            type="text"
            id="editCode"
            placeholder="secret-edit-code"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.editCode && (
            <p className="text-red-500 text-sm mt-1">{errors.editCode.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="modifyCode" className="block text-sm font-medium text-gray-700 mb-1">
            Код для модификации (опционально)
          </label>
          <input
            {...register('modifyCode')}
            type="text"
            id="modifyCode"
            placeholder="modify-code"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.modifyCode && (
            <p className="text-red-500 text-sm mt-1">{errors.modifyCode.message}</p>
          )}
        </div>
      </div>

      <div className="flex justify-between items-center">
        <p className="text-sm text-gray-600">
          Нажмите Ctrl+Enter для быстрой отправки
        </p>
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'Создание...' : 'Создать запись'}
        </button>
      </div>
    </form>
  )
}