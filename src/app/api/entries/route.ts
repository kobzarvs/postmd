import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { prisma } from '@/lib/db'
import { createEntrySchema } from '@/lib/validation'
import { generateId, generateCode } from '@/lib/utils'
import { authOptions } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    const body = await request.json()
    const validatedData = createEntrySchema.parse(body)

    const id = validatedData.customUrl && validatedData.customUrl.trim() !== '' 
      ? validatedData.customUrl 
      : generateId()
    
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
        editCode: validatedData.editCode && validatedData.editCode.trim() !== ''
          ? validatedData.editCode 
          : generateCode(),
        modifyCode: validatedData.modifyCode && validatedData.modifyCode.trim() !== ''
          ? validatedData.modifyCode 
          : undefined,
        userId: session?.user?.id || null,
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