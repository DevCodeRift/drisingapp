import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { prisma } from '@/lib/prisma'
import { TaskCategory, ResetType } from '@/types/tasks'
import { authOptions } from '@/lib/auth'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const templates = await prisma.taskTemplate.findMany({
      orderBy: [
        { category: 'asc' },
        { title: 'asc' }
      ]
    })

    return NextResponse.json(templates)
  } catch (error) {
    console.error('Error fetching task templates:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { title, description, category, resetType } = await request.json()

    if (!title || !category || !resetType) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Validate category and resetType
    if (!Object.values(TaskCategory).includes(category)) {
      return NextResponse.json({ error: 'Invalid category' }, { status: 400 })
    }

    if (!Object.values(ResetType).includes(resetType)) {
      return NextResponse.json({ error: 'Invalid reset type' }, { status: 400 })
    }

    const template = await prisma.taskTemplate.create({
      data: {
        title,
        description: description || null,
        category,
        resetType
      }
    })

    return NextResponse.json(template)
  } catch (error) {
    console.error('Error creating task template:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}