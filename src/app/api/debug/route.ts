import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    // Test database connection
    await prisma.$connect()

    // Check if tables exist
    const tables = await prisma.$queryRaw`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public'
    `

    return NextResponse.json({
      status: 'Database connected',
      tables,
      env: {
        hasDiscordClientId: !!process.env.DISCORD_CLIENT_ID,
        hasDiscordClientSecret: !!process.env.DISCORD_CLIENT_SECRET,
        hasNextAuthUrl: !!process.env.NEXTAUTH_URL,
        hasNextAuthSecret: !!process.env.NEXTAUTH_SECRET,
        hasDatabaseUrl: !!process.env.DATABASE_URL,
      }
    })
  } catch (error) {
    return NextResponse.json({
      status: 'Database error',
      error: error instanceof Error ? error.message : 'Unknown error',
      env: {
        hasDiscordClientId: !!process.env.DISCORD_CLIENT_ID,
        hasDiscordClientSecret: !!process.env.DISCORD_CLIENT_SECRET,
        hasNextAuthUrl: !!process.env.NEXTAUTH_URL,
        hasNextAuthSecret: !!process.env.NEXTAUTH_SECRET,
        hasDatabaseUrl: !!process.env.DATABASE_URL,
      }
    }, { status: 500 })
  }
}