import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { updateEntrySchema } from '@/lib/validation'

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
    const { id } = await params
    const body = await request.json()
    const validatedData = updateEntrySchema.parse(body)

    const entry = await prisma.entry.findUnique({
      where: { id },
    })

    if (!entry) {
      return NextResponse.json(
        { error: 'Запись не найдена' },
        { status: 404 }
      )
    }

    // Проверяем код доступа
    const isEditAllowed = validatedData.code === entry.editCode
    const isModifyAllowed = validatedData.code === entry.modifyCode

    if (!isEditAllowed && !isModifyAllowed) {
      return NextResponse.json(
        { error: 'Неверный код доступа' },
        { status: 403 }
      )
    }

    // modifyCode позволяет только изменять текст
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
    const { id } = await params
    const { searchParams } = new URL(request.url)
    const code = searchParams.get('code')

    if (!code) {
      return NextResponse.json(
        { error: 'Код доступа обязателен' },
        { status: 400 }
      )
    }

    const entry = await prisma.entry.findUnique({
      where: { id },
    })

    if (!entry) {
      return NextResponse.json(
        { error: 'Запись не найдена' },
        { status: 404 }
      )
    }

    if (code !== entry.editCode) {
      return NextResponse.json(
        { error: 'Неверный код доступа' },
        { status: 403 }
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