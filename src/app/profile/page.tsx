import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import Link from 'next/link'
import type { Session } from 'next-auth'

export default async function ProfilePage() {
  const session = await getServerSession(authOptions) as Session | null

  if (!session) {
    redirect('/auth/signin?callbackUrl=/profile')
  }

  const userEntries = await prisma.entry.findMany({
    where: {
      userId: session!.user.id,
    },
    orderBy: {
      createdAt: 'desc',
    },
  })

  const stats = await prisma.entry.aggregate({
    where: {
      userId: session!.user.id,
    },
    _count: { id: true },
    _sum: { views: true },
  })

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Мой профиль</h1>
            <p className="text-gray-600 mt-2">
              Добро пожаловать, {session.user.name || session.user.email}!
            </p>
          </div>
          <Link
            href="/"
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Создать новую запись
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="font-semibold text-gray-900">Моих записей</h3>
            <p className="text-3xl font-bold text-blue-600">{stats._count.id}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="font-semibold text-gray-900">Всего просмотров</h3>
            <p className="text-3xl font-bold text-green-600">{stats._sum.views || 0}</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="font-semibold text-gray-900">Мои записи</h2>
          </div>

          {userEntries.length === 0 ? (
            <div className="p-12 text-center">
              <p className="text-gray-500 mb-4">У вас пока нет записей</p>
              <Link
                href="/"
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Создать первую запись
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {userEntries.map((entry) => (
                <div key={entry.id} className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <Link
                        href={`/${entry.id}`}
                        className="font-medium text-blue-600 hover:text-blue-800 transition-colors"
                      >
                        {entry.id}
                      </Link>
                      <p className="text-gray-600 mt-1 line-clamp-2">
                        {entry.content.substring(0, 150)}
                        {entry.content.length > 150 && '...'}
                      </p>
                      <div className="flex items-center mt-3 text-gray-500 space-x-4">
                        <span>{entry.views} просмотров</span>
                        <span>
                          {new Date(entry.createdAt).toLocaleDateString('ru-RU')}
                        </span>
                        <span>{entry.content.length} символов</span>
                      </div>
                    </div>
                    <div className="ml-4 flex-shrink-0 space-x-2">
                      <Link
                        href={`/${entry.id}`}
                        className="text-blue-600 hover:text-blue-800 transition-colors"
                      >
                        Просмотр
                      </Link>
                      <Link
                        href={`/${entry.id}/edit`}
                        className="text-green-600 hover:text-green-800 transition-colors"
                      >
                        Редактировать
                      </Link>
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