import type { Metadata } from 'next'
import './globals.css'
import Providers from '@/components/Providers'
import Navigation from '@/components/Navigation'
import { Analytics } from '@vercel/analytics/next'

export const metadata: Metadata = {
  title: 'Destiny Rising Community Hub',
  description: 'Track tasks, share builds, find groups, and connect with the Destiny Rising community.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="font-sans">
        <Providers>
          <Navigation />
          {children}
        </Providers>
        <Analytics />
      </body>
    </html>
  )
}