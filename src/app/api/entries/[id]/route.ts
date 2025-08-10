import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { prisma } from '@/lib/db'
import { updateEntrySchema } from '@/lib/validation'
import { authOptions } from '@/lib/auth'
import type { Session } from 'next-auth'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const entry = await prisma.entry.findUnique({
      where: { id },
    })

    if (!entry) {
      return NextResponse.json(
        { error: 'Запись не найдена' },
        { status: 404 }
      )
    }

    // Возвращаем запись без кодов доступа
    return NextResponse.json({
      id: entry.id,
      content: entry.content,
      views: entry.views,
      userId: entry.userId,
      createdAt: entry.createdAt,
      updatedAt: entry.updatedAt,
    })
  } catch {
    return NextResponse.json(
      { error: 'Ошибка при получении записи' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions) as Session | null
    const { id } = await params
    const body = await request.json()

    // Для авторизованных пользователей код не обязателен
    const schema = session?.user?.id
      ? updateEntrySchema.omit({ code: true }).extend({ code: updateEntrySchema.shape.code.optional() })
      : updateEntrySchema

    const validatedData = schema.parse(body)

    const entry = await prisma.entry.findUnique({
      where: { id },
    })

    if (!entry) {
      return NextResponse.json(
        { error: 'Запись не найдена' },
        { status: 404 }
      )
    }

    // Проверяем права доступа
    const isOwner = session?.user?.id && entry.userId === session.user.id
    const isEditAllowed = validatedData.code && validatedData.code === entry.editCode

    if (!isOwner && !isEditAllowed) {
      return NextResponse.json(
        { error: 'Нет прав для редактирования этой записи' },
        { status: 403 }
      )
    }

    const updatedEntry = await prisma.entry.update({
      where: { id },
      data: {
        content: validatedData.content,
      },
    })

    return NextResponse.json({
      id: updatedEntry.id,
      content: updatedEntry.content,
      updatedAt: updatedEntry.updatedAt,
    })
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      )
    }
    return NextResponse.json(
      { error: 'Ошибка при обновлении записи' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions) as Session | null
    const { id } = await params
    const { searchParams } = new URL(request.url)
    const code = searchParams.get('code')

    const entry = await prisma.entry.findUnique({
      where: { id },
    })

    if (!entry) {
      return NextResponse.json(
        { error: 'Запись не найдена' },
        { status: 404 }
      )
    }

    // Проверяем права доступа
    const isOwner = session?.user?.id && entry.userId === session.user.id
    const isCodeValid = code && code === entry.editCode

    if (!isOwner && !isCodeValid) {
      return NextResponse.json(
        { error: isOwner === false && !code 
          ? 'Код доступа обязателен' 
          : 'Нет прав для удаления этой записи' },
        { status: isOwner === false && !code ? 400 : 403 }
      )
    }

    await prisma.entry.delete({
      where: { id },
    })

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json(
      { error: 'Ошибка при удалении записи' },
      { status: 500 }
    )
  }
}