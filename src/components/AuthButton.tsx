'use client'

import { useSession, signIn, signOut } from 'next-auth/react'
import { useState } from 'react'
import Link from 'next/link'

export default function AuthButton() {
  const { data: session, status } = useSession()
  const [showDropdown, setShowDropdown] = useState(false)

  if (status === 'loading') {
    return (
      <div className="flex items-center space-x-2">
        <div className="w-4 h-4 bg-gray-300 animate-pulse rounded"></div>
        <div className="w-16 h-4 bg-gray-300 animate-pulse rounded"></div>
      </div>
    )
  }

  if (session) {
    return (
      <div className="relative">
        <button
          onClick={() => setShowDropdown(!showDropdown)}
          className="flex items-center space-x-2 text-gray-700 hover:text-gray-900 transition-colors"
        >
          {session.user?.image && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={session.user.image}
              alt={session.user.name || 'User'}
              className="w-8 h-8 rounded-full"
            />
          )}
          <span className="text-sm font-medium">
            {session.user?.name || session.user?.email}
          </span>
          <svg
            className={`w-4 h-4 transition-transform ${
              showDropdown ? 'rotate-180' : ''
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {showDropdown && (
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 border border-gray-200">
            <Link
              href="/profile"
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
              onClick={() => setShowDropdown(false)}
            >
              Мои записи
            </Link>
            <button
              onClick={() => {
                setShowDropdown(false)
                signOut()
              }}
              className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
            >
              Выйти
            </button>
          </div>
        )}
      </div>
    )
  }

  return (
    <button
      onClick={() => signIn()}
      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm font-medium"
    >
      Войти
    </button>
  )
}