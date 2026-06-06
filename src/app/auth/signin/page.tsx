import { Suspense } from 'react'
import SignInClient from './signin-client'

function SignInLoading() {
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

export default function SignInPage() {
  return (
    <Suspense fallback={<SignInLoading />}>
      <SignInClient />
    </Suspense>
  )
}
