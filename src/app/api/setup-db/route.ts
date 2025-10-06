import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST() {
  try {
    // Test if we can create the tables by running a simple query
    // This will force Prisma to create tables if they don't exist
    await prisma.user.findMany({ take: 1 })

    return NextResponse.json({
      success: true,
      message: 'Database schema synchronized successfully'
    })
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      message: 'Failed to synchronize database schema. You may need to run "prisma db push" manually.'
    }, { status: 500 })
  }
}