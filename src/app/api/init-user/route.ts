import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { prisma } from '@/lib/prisma'

export async function POST() {
  try {
    const session = await getServerSession()

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Check if user already has tasks
    const existingTasks = await prisma.userTask.findMany({
      where: { userId: user.id }
    })

    if (existingTasks.length > 0) {
      return NextResponse.json({ message: 'User already initialized' })
    }

    // Get all task templates
    const taskTemplates = await prisma.taskTemplate.findMany()

    // Create user tasks for all templates
    const userTasks = taskTemplates.map(template => ({
      userId: user.id,
      taskTemplateId: template.id,
      completed: false
    }))

    await prisma.userTask.createMany({
      data: userTasks
    })

    return NextResponse.json({ message: 'User tasks initialized successfully' })
  } catch (error) {
    console.error('Error initializing user:', error)
    return NextResponse.json({ error: 'Failed to initialize user' }, { status: 500 })
  }
}