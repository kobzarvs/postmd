import NextAuth from 'next-auth'
import { authOptions } from '@/lib/auth'

// Проверяем критически важные переменные окружения
if (!process.env.NEXTAUTH_SECRET && process.env.NODE_ENV === 'production') {
  console.error('NEXTAUTH_SECRET is not set. Authentication will not work in production.')
}

if (!process.env.NEXTAUTH_URL) {
  console.warn('NEXTAUTH_URL is not set. Using default.')
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const handler = (NextAuth as any)(authOptions)

export { handler as GET, handler as POST }
