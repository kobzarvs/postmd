import { PrismaAdapter } from '@next-auth/prisma-adapter'
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

// Если нет ни одного провайдера, добавляем заглушку для предотвращения ошибок
if (providers.length === 0) {
  console.warn('No OAuth providers configured. Add OAUTH_* environment variables to enable authentication.')
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const authOptions: any = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  adapter: providers.length > 0 ? PrismaAdapter(prisma) as any : undefined,
  providers,
  session: {
    strategy: 'jwt',
  },
  // Allow deriving host from request headers when NEXTAUTH_URL is not set (useful in dev/local)
  trustHost: true,
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
  // Use explicit secret if provided; in development, fall back to a constant insecure secret
  // to avoid configuration crashes. In production, NEXTAUTH_SECRET must be set.
  secret: process.env.NEXTAUTH_SECRET ?? (process.env.NODE_ENV !== 'production' ? 'insecure-dev-secret-change-me' : undefined),
}