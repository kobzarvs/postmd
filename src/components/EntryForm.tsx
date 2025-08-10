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
          <p className="text-red-500 dark:text-red-400 mt-1 text-sm">{errors.content.message}</p>
        )}
      </div>

      <div className="space-y-4 md:space-y-0 md:grid md:grid-cols-2 md:gap-4">
        <div>
          <label htmlFor="customUrl" className="block font-medium text-gray-700 dark:text-gray-300 mb-1 text-sm xs:text-base">
            Кастомный URL (опционально)
          </label>
          <input
            {...register('customUrl')}
            type="text"
            id="customUrl"
            placeholder="my-custom-url"
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 text-sm xs:text-base touch-target"
          />
          {errors.customUrl && (
            <p className="text-red-500 dark:text-red-400 mt-1 text-sm">{errors.customUrl.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="editCode" className="block font-medium text-gray-700 dark:text-gray-300 mb-1 text-sm xs:text-base">
            Код для редактирования (опционально)
          </label>
          <input
            {...register('editCode')}
            type="text"
            id="editCode"
            placeholder="secret-edit-code"
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 text-sm xs:text-base touch-target"
          />
          {errors.editCode && (
            <p className="text-red-500 dark:text-red-400 mt-1 text-sm">{errors.editCode.message}</p>
          )}
        </div>
      </div>

      <div className="flex flex-col xs:flex-row xs:justify-between xs:items-center gap-3 xs:gap-4">
        <p className="text-gray-600 dark:text-gray-400 text-xs xs:text-sm order-2 xs:order-1">
          Нажмите Ctrl+Enter (или Cmd+Enter на Mac) для быстрой отправки
        </p>
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-4 xs:px-6 py-2 bg-blue-600 dark:bg-blue-500 text-white rounded-md hover:bg-blue-700 dark:hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 disabled:opacity-50 disabled:cursor-not-allowed touch-target text-sm xs:text-base font-medium order-1 xs:order-2"
        >
          {isSubmitting ? 'Создание...' : 'Создать запись'}
        </button>
      </div>
    </form>
  )
}