import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import MarkdownViewer from '@/components/MarkdownViewer'
import ViewCounter from '@/components/ViewCounter'
import AuthButton from '@/components/AuthButton'
import DeleteEntryButton from '@/components/DeleteEntryButton'
import type { Session } from 'next-auth'

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

  // Get session to check if user owns this entry
  const session = await getServerSession(authOptions) as Session | null
  const isOwner = session?.user?.id && entry.userId === session.user.id

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-6xl mx-auto px-3 xs:px-4 py-4 xs:py-6 md:py-8">
        <header className="mb-4 xs:mb-6 md:mb-8">
          <div className="flex flex-col xs:flex-row xs:items-center xs:justify-between gap-3 xs:gap-4">
            <Link
              href="/"
              className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 transition-colors text-sm xs:text-base touch-target self-start"
            >
              ← Новая запись
            </Link>
            <div className="flex items-center gap-2 xs:gap-4 flex-wrap">
              <Link
                href={`/${id}/raw`}
                className="text-gray-600 hover:text-gray-800 dark:text-gray-300 dark:hover:text-gray-100 transition-colors text-sm xs:text-base touch-target"
              >
                Raw
              </Link>
              <Link
                href={`/${id}/edit`}
                className="text-gray-600 hover:text-gray-800 dark:text-gray-300 dark:hover:text-gray-100 transition-colors text-sm xs:text-base touch-target"
              >
                Редактировать
              </Link>
              {isOwner && (
                <DeleteEntryButton 
                  entryId={id}
                  className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 transition-colors text-sm xs:text-base touch-target"
                />
              )}
              <AuthButton />
            </div>
          </div>
        </header>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 xs:p-6 md:p-8">
          <div className="flex flex-col xs:flex-row xs:items-center xs:justify-between mb-4 xs:mb-6 gap-2 xs:gap-4">
            <span className="text-gray-500 dark:text-gray-400 text-xs xs:text-sm">
              Создано: {new Date(entry.createdAt).toLocaleString('ru-RU')}
            </span>
            <ViewCounter entryId={id} initialViews={entry.views} />
          </div>

          <MarkdownViewer content={entry.content} />

          {entry.updatedAt > entry.createdAt && (
            <div className="mt-6 xs:mt-8 pt-6 xs:pt-8 border-t border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400 text-xs xs:text-sm">
              Обновлено: {new Date(entry.updatedAt).toLocaleString('ru-RU')}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}