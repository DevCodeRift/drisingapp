'use client'

import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { useEffect } from 'react'
import LoginButton from '@/components/LoginButton'

export default function Home() {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (session) {
      router.push('/dashboard')
    }
  }, [session, router])

  if (status === 'loading') {
    return (
      <div className="min-h-screen p-8 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-destiny-orange"></div>
      </div>
    )
  }

  return (
    <main className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-6xl font-bold text-destiny-orange mb-8">
          Destiny Task Manager
        </h1>
        <p className="text-xl text-gray-300 mb-12">
          Track your daily, weekly, and seasonal Destiny 2 activities with ease
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-destiny-dark p-6 rounded-lg border border-destiny-orange/20">
            <h2 className="text-xl font-semibold text-destiny-orange mb-4">📅 Daily Tasks</h2>
            <p className="text-gray-400">Track commissions, bounties, and daily activities that reset at 2AM UTC</p>
          </div>

          <div className="bg-destiny-dark p-6 rounded-lg border border-destiny-blue/20">
            <h2 className="text-xl font-semibold text-destiny-blue mb-4">🗓️ Weekly Tasks</h2>
            <p className="text-gray-400">Manage weekly challenges, exchanges, and activities that reset on Monday</p>
          </div>

          <div className="bg-destiny-dark p-6 rounded-lg border border-destiny-purple/20">
            <h2 className="text-xl font-semibold text-destiny-purple mb-4">🌟 Seasonal</h2>
            <p className="text-gray-400">Keep track of time-limited seasonal content and triumphs</p>
          </div>
        </div>

        <div className="bg-destiny-dark p-8 rounded-lg border border-destiny-gold/20 mb-8">
          <h3 className="text-2xl font-semibold text-destiny-gold mb-4">Features</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
            <div className="flex items-center space-x-2">
              <span className="text-destiny-orange">✓</span>
              <span>Discord OAuth authentication</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-destiny-orange">✓</span>
              <span>Persistent task tracking</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-destiny-orange">✓</span>
              <span>Progress visualization</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-destiny-orange">✓</span>
              <span>Destiny-themed UI</span>
            </div>
          </div>
        </div>

        <LoginButton />
      </div>
    </main>
  )
}