import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center px-4 py-12">
      <section className="max-w-lg text-center">
        <p className="text-sm font-semibold uppercase tracking-wide text-blue-600 dark:text-blue-400">
          404
        </p>
        <h1 className="mt-2 text-3xl font-bold text-gray-900 dark:text-gray-100">
          Страница не найдена
        </h1>
        <p className="mt-3 text-gray-600 dark:text-gray-300">
          Запрошенной записи или страницы не существует. Проверьте адрес или создайте новую запись.
        </p>
        <Link
          href="/"
          className="mt-6 inline-flex touch-target items-center justify-center rounded-md bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700"
        >
          Перейти на главную
        </Link>
      </section>
    </div>
  )
}
