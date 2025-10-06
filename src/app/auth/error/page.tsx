'use client'

import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Suspense } from 'react'
import { useTheme } from '@/contexts/ThemeContext'

function ErrorContent() {
  const { colors } = useTheme()
  const searchParams = useSearchParams()
  const error = searchParams.get('error')

  return (
    <div className="min-h-screen p-8 flex flex-col items-center justify-center" style={{ backgroundColor: colors.background }}>
      <div className="max-w-md mx-auto text-center">
        <h1 className="text-4xl font-bold mb-4" style={{ color: '#ef4444' }}>
          Authentication Error
        </h1>

        <div className="p-6 rounded-lg border mb-6" style={{
          backgroundColor: colors.surface,
          borderColor: '#ef444420'
        }}>
          <p className="mb-4" style={{ color: colors.text.secondary }}>
            There was an error signing you in:
          </p>
          <p className="font-mono text-sm p-3 rounded" style={{
            color: '#ef4444',
            backgroundColor: colors.background
          }}>
            {error || 'Unknown error'}
          </p>
        </div>

        <div className="space-y-4">
          <p style={{ color: colors.text.muted }}>
            This might be due to:
          </p>
          <ul className="text-sm text-left space-y-1" style={{ color: colors.text.muted }}>
            <li>• Discord application configuration</li>
            <li>• Environment variables not set</li>
            <li>• Database connection issues</li>
            <li>• Redirect URL mismatch</li>
          </ul>
        </div>

        <Link
          href="/"
          className="inline-block mt-6 px-6 py-3 text-white rounded-lg transition-colors"
          style={{ backgroundColor: colors.primary }}
          onMouseOver={(e) => e.currentTarget.style.backgroundColor = colors.accent}
          onMouseOut={(e) => e.currentTarget.style.backgroundColor = colors.primary}
        >
          Return Home
        </Link>
      </div>
    </div>
  )
}

export default function AuthError() {
  const { colors } = useTheme()

  return (
    <Suspense fallback={
      <div className="min-h-screen p-8 flex items-center justify-center" style={{ backgroundColor: colors.background }}>
        <div className="animate-spin rounded-full h-32 w-32 border-b-2" style={{ borderColor: colors.primary }}></div>
      </div>
    }>
      <ErrorContent />
    </Suspense>
  )
}