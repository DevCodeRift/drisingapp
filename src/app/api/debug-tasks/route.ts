import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { prisma } from '@/lib/prisma'
import { authOptions } from '../auth/[...nextauth]/route'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    // Check task templates
    const taskTemplates = await prisma.taskTemplate.findMany()

    // Check if user exists
    let user = null
    if (session?.user?.email) {
      user = await prisma.user.findUnique({
        where: { email: session.user.email }
      })
    }

    // Check user tasks
    let userTasks: any[] = []
    if (user) {
      userTasks = await prisma.userTask.findMany({
        where: { userId: user.id },
        include: { taskTemplate: true }
      })
    }

    return NextResponse.json({
      session: {
        exists: !!session,
        email: session?.user?.email,
        name: session?.user?.name
      },
      user: {
        exists: !!user,
        id: user?.id
      },
      taskTemplates: {
        count: taskTemplates.length,
        templates: taskTemplates.map(t => ({
          id: t.id,
          title: t.title,
          category: t.category
        }))
      },
      userTasks: {
        count: userTasks.length,
        tasks: userTasks.map(t => ({
          id: t.id,
          completed: t.completed,
          template: t.taskTemplate.title
        }))
      }
    })
  } catch (error) {
    return NextResponse.json({
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}