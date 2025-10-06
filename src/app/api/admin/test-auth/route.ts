import { NextResponse } from 'next/server'
import { getServerSession } from '@/lib/auth-session'

export async function GET() {
  try {
    const session = await getServerSession()

    return NextResponse.json({
      success: true,
      hasSession: !!session,
      hasEmail: !!session?.user?.email,
      email: session?.user?.email,
      name: session?.user?.name
    })
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined
    }, { status: 500 })
  }
}
