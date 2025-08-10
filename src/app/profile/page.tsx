import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import Link from 'next/link'
import DeleteEntryButton from '@/components/DeleteEntryButton'
import type { Session } from 'next-auth'

export default async function ProfilePage() {
  let session: Session | null = null
  let authError = false

  try {
    session = await getServerSession(authOptions) as Session | null
  } catch (error) {
    console.error('Authentication error:', error)
    authError = true
  }

  if (authError) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <h1 className="text-xl font-semibold text-red-800 mb-2">
              Ошибка аутентификации
            </h1>
            <p className="text-red-700 mb-4">
              В настоящее время система аутентификации недоступна. Попробуйте позже.
            </p>
            <Link
              href="/"
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              На главную
            </Link>
          </div>
        </div>
      </div>
    )
  }

  if (!session) {
    redirect('/auth/signin?callbackUrl=/profile')
  }

  // Check if user ID exists in session
  if (!session.user?.id) {
    console.error('User ID not found in session for user:', session.user?.email || session.user?.name)
    redirect('/auth/signin?callbackUrl=/profile&error=authentication_required')
  }

  let userEntries
  let stats
  let dbError = false

  try {
    userEntries = await prisma.entry.findMany({
      where: {
        userId: session.user.id,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    stats = await prisma.entry.aggregate({
      where: {
        userId: session.user.id,
      },
      _count: { id: true },
      _sum: { views: true },
    })
  } catch (error) {
    console.error('Database error in profile page:', error)
    dbError = true
    // Return empty results in case of database error
    userEntries = []
    stats = { _count: { id: 0 }, _sum: { views: 0 } }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-4 xs:py-6 md:py-8">
      <div className="max-w-4xl mx-auto px-3 xs:px-4">
        <div className="mb-6 xs:mb-8">
          <div className="flex flex-col xs:flex-row xs:items-start xs:justify-between gap-4">
            <div className="flex-1 min-w-0">
              <h1 className="text-2xl xs:text-3xl font-bold text-gray-900 break-words">Мой профиль</h1>
              <p className="text-gray-600 mt-1 xs:mt-2 text-sm xs:text-base break-words">
                Добро пожаловать, {session.user.name || session.user.email}!
              </p>
            </div>
            <div className="flex-shrink-0">
              <Link
                href="/"
                className="inline-block px-3 xs:px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm xs:text-base touch-target"
              >
                Создать новую запись
              </Link>
            </div>
          </div>
        </div>

        {dbError && (
          <div className="mb-4 xs:mb-6 bg-yellow-50 border border-yellow-200 rounded-lg p-3 xs:p-4">
            <div className="flex">
              <div className="ml-3">
                <h3 className="text-sm font-medium text-yellow-800">
                  База данных недоступна
                </h3>
                <div className="mt-2 text-sm text-yellow-700">
                  <p>
                    В настоящее время база данных недоступна. Некоторые функции могут быть ограничены.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 xs:grid-cols-2 gap-4 xs:gap-6 mb-6 xs:mb-8">
          <div className="bg-white p-4 xs:p-6 rounded-lg shadow">
            <h3 className="font-semibold text-gray-900 text-sm xs:text-base">Моих записей</h3>
            <p className="text-2xl xs:text-3xl font-bold text-blue-600">{stats._count.id}</p>
          </div>
          <div className="bg-white p-4 xs:p-6 rounded-lg shadow">
            <h3 className="font-semibold text-gray-900 text-sm xs:text-base">Всего просмотров</h3>
            <p className="text-2xl xs:text-3xl font-bold text-green-600">{stats._sum.views || 0}</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-4 xs:px-6 py-3 xs:py-4 border-b border-gray-200">
            <h2 className="font-semibold text-gray-900 text-sm xs:text-base">Мои записи</h2>
          </div>

          {userEntries.length === 0 ? (
            <div className="p-8 xs:p-12 text-center">
              <p className="text-gray-500 mb-4 text-sm xs:text-base">У вас пока нет записей</p>
              <Link
                href="/"
                className="inline-flex items-center px-3 xs:px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm xs:text-base touch-target"
              >
                Создать первую запись
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
              {userEntries.map((entry: any) => (
                <div key={entry.id} className="p-4 xs:p-6">
                  <div className="flex flex-col xs:flex-row xs:items-start xs:justify-between gap-3 xs:gap-4">
                    <div className="flex-1 min-w-0">
                      <Link
                        href={`/${entry.id}`}
                        className="font-medium text-blue-600 hover:text-blue-800 transition-colors text-sm xs:text-base break-all"
                      >
                        {entry.id}
                      </Link>
                      <p className="text-gray-600 mt-1 line-clamp-2 text-sm xs:text-base break-words">
                        {entry.content.substring(0, 150)}
                        {entry.content.length > 150 && '...'}
                      </p>
                      <div className="flex flex-wrap items-center mt-2 xs:mt-3 text-gray-500 gap-2 xs:gap-4 text-xs xs:text-sm">
                        <span>{entry.views} просмотров</span>
                        <span>
                          {new Date(entry.createdAt).toLocaleDateString('ru-RU')}
                        </span>
                        <span>{entry.content.length} символов</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 xs:gap-3 xs:ml-4 xs:flex-shrink-0">
                      <Link
                        href={`/${entry.id}`}
                        className="text-blue-600 hover:text-blue-800 transition-colors text-sm touch-target"
                      >
                        Просмотр
                      </Link>
                      <Link
                        href={`/${entry.id}/edit`}
                        className="text-green-600 hover:text-green-800 transition-colors text-sm touch-target"
                      >
                        Редактировать
                      </Link>
                      <DeleteEntryButton 
                        entryId={entry.id}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}