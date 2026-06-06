import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Политика конфиденциальности',
  description: 'Как PostMD обрабатывает данные пользователей и опубликованные записи.',
  alternates: {
    canonical: '/privacy',
  },
}

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-3xl mx-auto px-4 py-8 xs:py-12">
        <Link
          href="/"
          className="inline-flex touch-target items-center text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
        >
          Назад на главную
        </Link>

        <article className="mt-6 rounded-lg bg-white p-5 shadow-sm dark:bg-gray-800 xs:p-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            Политика конфиденциальности
          </h1>
          <p className="mt-4 text-gray-600 dark:text-gray-300">
            PostMD хранит данные, которые нужны для публикации и редактирования Markdown-записей.
          </p>

          <h2 className="mt-8 text-xl font-semibold text-gray-900 dark:text-gray-100">
            Какие данные обрабатываются
          </h2>
          <p className="mt-3 text-gray-600 dark:text-gray-300">
            При создании записи сервис сохраняет текст записи, выбранный URL, код редактирования, время создания,
            время обновления и счётчик просмотров. Если вы входите через OAuth, запись может быть связана с вашим
            аккаунтом, чтобы вы могли управлять ею без кода доступа.
          </p>

          <h2 className="mt-8 text-xl font-semibold text-gray-900 dark:text-gray-100">
            Cookies и сессии
          </h2>
          <p className="mt-3 text-gray-600 dark:text-gray-300">
            Cookies используются для работы авторизации и пользовательской сессии. Необязательные рекламные cookies
            в приложении не используются.
          </p>

          <h2 className="mt-8 text-xl font-semibold text-gray-900 dark:text-gray-100">
            Доступ и удаление
          </h2>
          <p className="mt-3 text-gray-600 dark:text-gray-300">
            Авторизованные пользователи могут управлять своими записями из профиля. Анонимные записи редактируются
            или удаляются по коду доступа, если он был задан при создании.
          </p>
        </article>
      </div>
    </div>
  )
}
