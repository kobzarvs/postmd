import { notFound } from 'next/navigation'
import { prisma } from '@/lib/db'

interface PageProps {
  params: Promise<{ id: string }>
}

async function getEntry(id: string) {
  try {
    const entry = await prisma.entry.findUnique({
      where: { id },
      select: { content: true },
    })
    return entry
  } catch {
    return null
  }
}

export default async function RawPage({ params }: PageProps) {
  const { id } = await params
  const entry = await getEntry(id)

  if (!entry) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <pre className="whitespace-pre-wrap font-mono">
        {entry.content}
      </pre>
    </div>
  )
}