import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const entry = await prisma.entry.update({
      where: { id },
      data: {
        views: {
          increment: 1,
        },
      },
    })

    return NextResponse.json({ views: entry.views })
  } catch {
    return NextResponse.json(
      { error: 'Ошибка при обновлении счетчика просмотров' },
      { status: 500 }
    )
  }
}