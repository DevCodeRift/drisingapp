import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { prisma } from '@/lib/prisma'
import { authOptions } from '../../../auth/[...nextauth]/route'

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await context.params

    // Delete associated user tasks first
    await prisma.userTask.deleteMany({
      where: { taskTemplateId: id }
    })

    // Delete the template
    await prisma.taskTemplate.delete({
      where: { id }
    })

    return NextResponse.json({ message: 'Task template deleted successfully' })
  } catch (error) {
    console.error('Error deleting task template:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}