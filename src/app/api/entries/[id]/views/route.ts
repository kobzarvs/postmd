import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

// Simple in-memory rate limit: one increment per 60s per ip:entryId
const viewRateLimit = new Map<string, number>()
const WINDOW_MS = 60_000

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const ip =
      request.headers.get('x-real-ip')?.trim() ||
      request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
      'unknown'
    const key = `${ip}:${id}`
    const now = Date.now()
    const last = viewRateLimit.get(key) || 0
    if (now - last < WINDOW_MS) {
      // return current views without increment
      const current = await prisma.entry.findUnique({ where: { id }, select: { views: true } })
      if (!current) {
        return NextResponse.json({ error: 'Запись не найдена' }, { status: 404 })
      }
      return NextResponse.json({ views: current.views })
    }
    const entry = await prisma.entry.update({
      where: { id },
      data: {
        views: {
          increment: 1,
        },
      },
    })
    viewRateLimit.set(key, now)

    return NextResponse.json({ views: entry.views })
  } catch {
    return NextResponse.json(
      { error: 'Ошибка при обновлении счетчика просмотров' },
      { status: 500 }
    )
  }
}