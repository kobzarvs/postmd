'use client'

import { getProviders, signIn, getSession } from 'next-auth/react'
import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { GithubMarkIcon } from '@/components/icons/GithubMarkIcon'

interface Provider {
  id: string
  name: string
  type: string
  signinUrl: string
  callbackUrl: string
}

export default function SignInClient() {
  const [providers, setProviders] = useState<Record<string, Provider> | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get('callbackUrl') || '/'

  useEffect(() => {
    const loadProviders = async () => {
      const session = await getSession()
      if (session) {
        router.push(callbackUrl)
        return
      }

      const providers = await getProviders()
      setProviders(providers)
      setLoading(false)
    }

    loadProviders()
  }, [router, callbackUrl])

  const getProviderIcon = (providerId: string) => {
    switch (providerId) {
      case 'github':
        return <GithubMarkIcon className="w-5 h-5" />
      case 'google':
        return '🔍'
      case 'twitter':
        return '🐦'
      default:
        return '🔐'
    }
  }

  const getProviderColor = (providerId: string) => {
    switch (providerId) {
      case 'github':
        return 'bg-gray-800 hover:bg-gray-900 text-white'
      case 'google':
        return 'bg-red-600 hover:bg-red-700 text-white'
      case 'twitter':
        return 'bg-blue-500 hover:bg-blue-600 text-white'
      default:
        return 'bg-gray-600 hover:bg-gray-700 text-white'
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <section className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">
            Вход в PostMD
          </h1>
          <p className="mt-2 text-gray-600">Загрузка способов входа...</p>
        </section>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h1 className="text-center text-3xl font-bold text-gray-900">
            Вход в PostMD
          </h1>
          <p className="mt-2 text-center text-gray-600">
            Выберите способ входа
          </p>
        </div>

        <div className="space-y-4">
          {providers && Object.keys(providers).length > 0 ? (
            Object.values(providers).map((provider) => (
              <button
                key={provider.name}
                onClick={() => signIn(provider.id, { callbackUrl })}
                className={`w-full flex items-center justify-center px-4 py-3 border border-transparent rounded-md shadow-sm font-medium transition-colors ${getProviderColor(
                  provider.id
                )}`}
              >
                <span className="mr-3 flex items-center">
                  {getProviderIcon(provider.id)}
                </span>
                Войти через {provider.name}
              </button>
            ))
          ) : (
            <div className="text-center p-8 bg-yellow-50 rounded-lg">
              <p className="text-yellow-800">
                Авторизация временно недоступна
              </p>
              <p className="text-sm text-yellow-600 mt-2">
                OAuth провайдеры не настроены. Вы можете создавать записи анонимно.
              </p>
            </div>
          )}
        </div>

        <div className="text-center">
          <Link
            href="/"
            className="text-blue-600 hover:text-blue-800 transition-colors"
          >
            ← Вернуться на главную
          </Link>
        </div>

        <div className="text-center text-gray-500">
          <p>
            Авторизация позволяет привязать записи к вашему аккаунту
            <br />
            и управлять ими без кодов доступа
          </p>
        </div>
      </div>
    </div>
  )
}
