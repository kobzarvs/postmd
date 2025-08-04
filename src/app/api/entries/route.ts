import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { createEntrySchema } from '@/lib/validation'
import { generateId, generateCode } from '@/lib/utils'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = createEntrySchema.parse(body)

    const id = validatedData.customUrl || generateId()
    
    // Проверяем, не занят ли URL
    const existing = await prisma.entry.findUnique({
      where: { id },
    })

    if (existing) {
      return NextResponse.json(
        { error: 'Этот URL уже занят' },
        { status: 400 }
      )
    }

    const entry = await prisma.entry.create({
      data: {
        id,
        content: validatedData.content,
        editCode: validatedData.editCode || generateCode(),
        modifyCode: validatedData.modifyCode,
      },
    })

    return NextResponse.json({
      id: entry.id,
      editCode: entry.editCode,
      modifyCode: entry.modifyCode,
    })
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      )
    }
    return NextResponse.json(
      { error: 'Произошла ошибка при создании записи' },
      { status: 500 }
    )
  }
}