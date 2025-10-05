import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { prisma } from '@/lib/prisma'
import { authOptions } from '../../auth/[...nextauth]/route'

export async function POST() {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get all users
    const users = await prisma.user.findMany()

    // Get all task templates
    const taskTemplates = await prisma.taskTemplate.findMany()

    if (taskTemplates.length === 0) {
      return NextResponse.json({
        error: 'No task templates found. Create some templates first.'
      }, { status: 400 })
    }

    let totalCreated = 0

    // For each user, ensure they have all task templates
    for (const user of users) {
      for (const template of taskTemplates) {
        try {
          // Try to create the user task (will fail if already exists)
          await prisma.userTask.create({
            data: {
              userId: user.id,
              taskTemplateId: template.id,
              completed: false
            }
          })
          totalCreated++
        } catch (error) {
          // Task already exists, skip
        }
      }
    }

    return NextResponse.json({
      message: 'Users reinitialized successfully',
      usersProcessed: users.length,
      taskTemplates: taskTemplates.length,
      newTasksCreated: totalCreated
    })
  } catch (error) {
    console.error('Error reinitializing users:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}