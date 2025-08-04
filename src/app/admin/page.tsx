import { prisma } from '@/lib/db'
import Link from 'next/link'

export default async function AdminPage() {
  const entries = await prisma.entry.findMany({
    orderBy: { createdAt: 'desc' },
    take: 50, // последние 50 записей
  })

  const stats = await prisma.entry.aggregate({
    _count: { id: true },
    _sum: { views: true },
  })

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Админ панель</h1>
          <Link href="/" className="text-blue-600 hover:text-blue-800">
            ← На главную
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-900">Всего записей</h3>
            <p className="text-3xl font-bold text-blue-600">{stats._count.id}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-900">Всего просмотров</h3>
            <p className="text-3xl font-bold text-green-600">{stats._sum.views || 0}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-900">Средний размер</h3>
            <p className="text-3xl font-bold text-purple-600">
              {Math.round(
                entries.reduce((acc, entry) => acc + entry.content.length, 0) / entries.length || 0
              )}
              <span className="text-sm text-gray-500"> символов</span>
            </p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Последние записи</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Содержимое
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Просмотры
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Создано
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Действия
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {entries.map((entry) => (
                  <tr key={entry.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">
                      <Link href={`/${entry.id}`} className="hover:text-blue-800">
                        {entry.id}
                      </Link>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 max-w-xs">
                      <div className="truncate">
                        {entry.content.substring(0, 100)}
                        {entry.content.length > 100 && '...'}
                      </div>
                      <div className="text-xs text-gray-500">
                        {entry.content.length} символов
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {entry.views}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(entry.createdAt).toLocaleString('ru-RU')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <Link
                        href={`/${entry.id}`}
                        className="text-blue-600 hover:text-blue-800 mr-3"
                      >
                        Просмотр
                      </Link>
                      <Link
                        href={`/${entry.id}/edit`}
                        className="text-green-600 hover:text-green-800"
                      >
                        Редактировать
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {entries.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">Записей пока нет</p>
          </div>
        )}
      </div>
    </div>
  )
}