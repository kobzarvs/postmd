import { PrismaAdapter } from '@auth/prisma-adapter'
import { prisma } from './db'
import GitHubProvider from 'next-auth/providers/github'
import GoogleProvider from 'next-auth/providers/google'
import TwitterProvider from 'next-auth/providers/twitter'

// Создаём массив провайдеров только если есть соответствующие переменные окружения
const providers = []

// Используем префикс OAUTH_ чтобы избежать конфликта с зарезервированными именами GitHub
if (process.env.OAUTH_GITHUB_ID && process.env.OAUTH_GITHUB_SECRET) {
  providers.push(
    GitHubProvider({
      clientId: process.env.OAUTH_GITHUB_ID,
      clientSecret: process.env.OAUTH_GITHUB_SECRET,
    })
  )
}

if (process.env.OAUTH_GOOGLE_ID && process.env.OAUTH_GOOGLE_SECRET) {
  providers.push(
    GoogleProvider({
      clientId: process.env.OAUTH_GOOGLE_ID,
      clientSecret: process.env.OAUTH_GOOGLE_SECRET,
    })
  )
}

if (process.env.OAUTH_TWITTER_ID && process.env.OAUTH_TWITTER_SECRET) {
  providers.push(
    TwitterProvider({
      clientId: process.env.OAUTH_TWITTER_ID,
      clientSecret: process.env.OAUTH_TWITTER_SECRET,
      version: "2.0",
    })
  )
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const authOptions: any = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  adapter: PrismaAdapter(prisma) as any,
  providers,
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    jwt: async ({ token, user }: { token: any; user: any }) => {
      if (user) {
        token.id = user.id
      }
      return token
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    session: async ({ session, token }: { session: any; token: any }) => {
      if (token && session.user) {
        session.user.id = token.id as string
      }
      return session
    },
  },
  pages: {
    signIn: '/auth/signin',
  },
}