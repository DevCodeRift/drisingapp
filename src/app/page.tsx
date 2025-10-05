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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-destiny-darker via-destiny-dark to-black">
        <div className="relative">
          <div className="animate-spin rounded-full h-32 w-32 border-b-4 border-destiny-orange"></div>
          <div className="absolute inset-0 animate-ping rounded-full h-32 w-32 border border-destiny-orange opacity-20"></div>
        </div>
      </div>
    )
  }

  return (
    <main className="min-h-screen relative overflow-hidden bg-gradient-to-br from-destiny-darker via-destiny-dark to-black">
      {/* Sci-fi background effects */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-10 w-96 h-96 bg-destiny-orange rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-destiny-blue rounded-full blur-3xl"></div>
      </div>

      {/* Grid overlay */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAwIDEwIEwgNDAgMTAgTSAxMCAwIEwgMTAgNDAgTSAwIDIwIEwgNDAgMjAgTSAyMCAwIEwgMjAgNDAgTSAwIDMwIEwgNDAgMzAgTSAzMCAwIEwgMzAgNDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNDIsMTE0LDI3LDAuMSkiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-20"></div>

      <div className="relative z-10 max-w-6xl mx-auto px-8 py-20 text-center">
        {/* Hero section */}
        <div className="mb-16">
          <div className="inline-block mb-6">
            <div className="px-6 py-2 bg-destiny-orange/10 border border-destiny-orange/30 rounded-full backdrop-blur-sm">
              <span className="text-destiny-orange font-semibold tracking-wider uppercase text-sm">Destiny Rising</span>
            </div>
          </div>

          <h1 className="text-7xl md:text-8xl font-black mb-6 bg-gradient-to-r from-destiny-orange via-destiny-gold to-destiny-orange bg-clip-text text-transparent animate-pulse">
            TASK MANAGER
          </h1>

          <p className="text-2xl text-gray-300 mb-4 max-w-3xl mx-auto leading-relaxed">
            Command your operations. Track your missions. Conquer the cosmos.
          </p>

          <p className="text-lg text-gray-400 mb-12 max-w-2xl mx-auto">
            Stay ahead of every daily commission, weekly challenge, and seasonal event with precision tactical tracking.
          </p>

          <LoginButton />
        </div>

        {/* Task categories showcase */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-20">
          <div className="group relative bg-gradient-to-br from-destiny-dark/80 to-destiny-darker/80 p-8 rounded-xl border border-destiny-orange/20 backdrop-blur-sm hover:border-destiny-orange/50 transition-all duration-300 hover:transform hover:scale-105">
            <div className="absolute inset-0 bg-gradient-to-br from-destiny-orange/5 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="relative">
              <div className="text-4xl mb-4">☀️</div>
              <h2 className="text-2xl font-bold text-destiny-orange mb-3">Daily Ops</h2>
              <p className="text-gray-400">Monitor daily commissions and activities. Resets at 0200 UTC.</p>
            </div>
          </div>

          <div className="group relative bg-gradient-to-br from-destiny-dark/80 to-destiny-darker/80 p-8 rounded-xl border border-destiny-blue/20 backdrop-blur-sm hover:border-destiny-blue/50 transition-all duration-300 hover:transform hover:scale-105">
            <div className="absolute inset-0 bg-gradient-to-br from-destiny-blue/5 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="relative">
              <div className="text-4xl mb-4">📅</div>
              <h2 className="text-2xl font-bold text-destiny-blue mb-3">Weekly Missions</h2>
              <p className="text-gray-400">Execute weekly challenges and strategic objectives. Resets every Monday.</p>
            </div>
          </div>

          <div className="group relative bg-gradient-to-br from-destiny-dark/80 to-destiny-darker/80 p-8 rounded-xl border border-destiny-purple/20 backdrop-blur-sm hover:border-destiny-purple/50 transition-all duration-300 hover:transform hover:scale-105">
            <div className="absolute inset-0 bg-gradient-to-br from-destiny-purple/5 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="relative">
              <div className="text-4xl mb-4">🌟</div>
              <h2 className="text-2xl font-bold text-destiny-purple mb-3">Seasonal Events</h2>
              <p className="text-gray-400">Track time-limited operations and exclusive seasonal content.</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}