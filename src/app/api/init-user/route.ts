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

    // Get all task templates
    const taskTemplates = await prisma.taskTemplate.findMany()

    if (taskTemplates.length === 0) {
      return NextResponse.json({
        error: 'No task templates found. Please seed the database first.',
        taskTemplatesCount: 0
      }, { status: 400 })
    }

    // Check if user already has tasks
    const existingTasks = await prisma.userTask.findMany({
      where: { userId: user.id }
    })

    if (existingTasks.length > 0) {
      return NextResponse.json({
        message: 'User already initialized',
        existingTasksCount: existingTasks.length,
        taskTemplatesCount: taskTemplates.length
      })
    }

    // Create user tasks for all templates using individual creates to handle conflicts
    const created = []
    for (const template of taskTemplates) {
      try {
        const userTask = await prisma.userTask.create({
          data: {
            userId: user.id,
            taskTemplateId: template.id,
            completed: false
          }
        })
        created.push(userTask)
      } catch (error) {
        // Skip if already exists
        console.log(`Task ${template.id} already exists for user ${user.id}`)
      }
    }

    return NextResponse.json({
      message: 'User tasks initialized successfully',
      createdTasksCount: created.length,
      taskTemplatesCount: taskTemplates.length
    })
  } catch (error) {
    console.error('Error initializing user:', error)
    return NextResponse.json({
      error: 'Failed to initialize user',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}