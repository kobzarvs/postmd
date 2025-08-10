import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { prisma } from '@/lib/db'
import { authOptions } from '@/lib/auth'
import type { Session } from 'next-auth'

export async function GET(
    _request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = (await getServerSession(authOptions)) as Session | null
        const { id } = await params

        const entry = await prisma.entry.findUnique({
            where: { id },
            select: { userId: true },
        })

        if (!entry) {
            return NextResponse.json(
                { error: 'Запись не найдена' },
                { status: 404 }
            )
        }

        const isOwner = Boolean(session?.user?.id && entry.userId && session.user.id === entry.userId)
        return NextResponse.json({ isOwner })
    } catch {
        return NextResponse.json(
            { error: 'Ошибка при определении владения' },
            { status: 500 }
        )
    }
}
