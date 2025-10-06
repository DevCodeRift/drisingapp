'use client'

import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Suspense } from 'react'

function ErrorContent() {
  const searchParams = useSearchParams()
  const error = searchParams.get('error')

  return (
    <div className="min-h-screen p-8 flex flex-col items-center justify-center">
      <div className="max-w-md mx-auto text-center">
        <h1 className="text-4xl font-bold text-red-500 mb-4">
          Authentication Error
        </h1>

        <div className="bg-destiny-dark p-6 rounded-lg border border-red-500/20 mb-6">
          <p className="text-gray-300 mb-4">
            There was an error signing you in:
          </p>
          <p className="text-red-400 font-mono text-sm bg-destiny-darker p-3 rounded">
            {error || 'Unknown error'}
          </p>
        </div>

        <div className="space-y-4">
          <p className="text-gray-400">
            This might be due to:
          </p>
          <ul className="text-sm text-gray-500 text-left space-y-1">
            <li>• Discord application configuration</li>
            <li>• Environment variables not set</li>
            <li>• Database connection issues</li>
            <li>• Redirect URL mismatch</li>
          </ul>
        </div>

        <Link
          href="/"
          className="inline-block mt-6 px-6 py-3 bg-destiny-orange text-white rounded-lg hover:bg-destiny-orange/80 transition-colors"
        >
          Return Home
        </Link>
      </div>
    </div>
  )
}

export default function AuthError() {
  return (
    <Suspense fallback={
      <div className="min-h-screen p-8 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-destiny-orange"></div>
      </div>
    }>
      <ErrorContent />
    </Suspense>
  )
}