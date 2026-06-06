'use client'

import Link from 'next/link'

export default function ErrorPage({
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center px-4 py-12">
      <section className="max-w-lg text-center">
        <p className="text-sm font-semibold uppercase tracking-wide text-red-600 dark:text-red-400">
          Ошибка
        </p>
        <h1 className="mt-2 text-3xl font-bold text-gray-900 dark:text-gray-100">
          Не удалось загрузить страницу
        </h1>
        <p className="mt-3 text-gray-600 dark:text-gray-300">
          Попробуйте повторить запрос. Если ошибка сохраняется, вернитесь на главную страницу.
        </p>
        <div className="mt-6 flex flex-col items-center justify-center gap-3 xs:flex-row">
          <button
            type="button"
            onClick={reset}
            className="inline-flex touch-target items-center justify-center rounded-md bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700"
          >
            Повторить
          </button>
          <Link
            href="/"
            className="inline-flex touch-target items-center justify-center rounded-md border border-gray-300 px-4 py-2 font-medium text-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-800"
          >
            На главную
          </Link>
        </div>
      </section>
    </div>
  )
}
