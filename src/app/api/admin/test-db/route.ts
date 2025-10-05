import { NextResponse } from 'next/server'
import { getServerSession } from '@/lib/auth-session'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const session = await getServerSession()

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Test database connection
    const templateCount = await prisma.taskTemplate.count()

    return NextResponse.json({
      success: true,
      templateCount,
      session: {
        email: session.user.email,
        name: session.user.name
      }
    })
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined
    }, { status: 500 })
  }
}
