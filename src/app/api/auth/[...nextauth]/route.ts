import NextAuth from 'next-auth'
import { authOptions } from '@/lib/auth'

console.log('ns', process.env.NEXTAUTH_SECRET);
console.log('nu', process.env.NEXTAUTH_URL);

// Проверяем критически важные переменные окружения
if (!process.env.NEXTAUTH_SECRET) {
  console.error('NEXTAUTH_SECRET is not set. Authentication will not work.')
}

if (!process.env.NEXTAUTH_URL) {
  console.warn('NEXTAUTH_URL is not set. Using default.')
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const handler = (NextAuth as any)(authOptions)

export { handler as GET, handler as POST }
