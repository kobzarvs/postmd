import { notFound } from 'next/navigation'
import Link from 'next/link'
import { prisma } from '@/lib/db'
import MarkdownViewer from '@/components/MarkdownViewer'
import ViewCounter from '@/components/ViewCounter'

interface PageProps {
  params: Promise<{ id: string }>
}

async function getEntry(id: string) {
  try {
    const entry = await prisma.entry.findUnique({
      where: { id },
    })
    return entry
  } catch {
    return null
  }
}

export default async function EntryPage({ params }: PageProps) {
  const { id } = await params
  const entry = await getEntry(id)

  if (!entry) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <header className="px-8 mb-2 flex items-center justify-between">
          <Link
            href="/"
            className="text-blue-600 hover:text-blue-800 transition-colors"
          >
            Новая запись
          </Link>
          <div className="flex items-center gap-4">
            <Link
              href={`/${id}/raw`}
              className="text-gray-600 hover:text-gray-800 transition-colors"
            >
              Raw
            </Link>
            <Link
              href={`/${id}/edit`}
              className="text-gray-600 hover:text-gray-800 transition-colors"
            >
              Редактировать
            </Link>
          </div>
        </header>

        <div className="bg-white rounded-lg shadow-sm p-8">
          <div className="flex items-center justify-between mb-6 text-gray-500">
            <span>Создано: {new Date(entry.createdAt).toLocaleString('ru-RU')}</span>
            <ViewCounter entryId={id} initialViews={entry.views} />
          </div>

          <MarkdownViewer content={entry.content} />

          {entry.updatedAt > entry.createdAt && (
            <div className="mt-8 pt-8 border-t border-gray-300 text-gray-600">
              Обновлено: {new Date(entry.updatedAt).toLocaleString('ru-RU')}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}