import { NextResponse } from 'next/server'
import { isAdmin } from '@/lib/auth-admin'

export async function GET() {
  try {
    const adminStatus = await isAdmin()
    return NextResponse.json({ isAdmin: adminStatus })
  } catch (error) {
    return NextResponse.json({ isAdmin: false }, { status: 500 })
  }
}
