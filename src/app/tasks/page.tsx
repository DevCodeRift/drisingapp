'use client'

import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'
import { UserTask, TaskCategory } from '@/types/tasks'
import TaskSection from '@/components/TaskSection'
import LoginButton from '@/components/LoginButton'

export default function Dashboard() {
  const { data: session, status } = useSession()
  const [tasks, setTasks] = useState<UserTask[]>([])
  const [loading, setLoading] = useState(true)
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    if (session) {
      initializeUser()
      fetchTasks()
      checkAdminStatus()
    }
  }, [session])

  const checkAdminStatus = async () => {
    try {
      const response = await fetch('/api/admin/check')
      const data = await response.json()
      setIsAdmin(data.isAdmin)
    } catch (error) {
      setIsAdmin(false)
    }
  }

  const initializeUser = async () => {
    try {
      await fetch('/api/init-user', { method: 'POST' })
    } catch (error) {
      console.error('Error initializing user:', error)
    }
  }

  const fetchTasks = async () => {
    try {
      const response = await fetch('/api/tasks')
      if (response.ok) {
        const data = await response.json()
        setTasks(data)
      }
    } catch (error) {
      console.error('Error fetching tasks:', error)
    } finally {
      setLoading(false)
    }
  }

  const toggleTask = async (taskId: string) => {
    const task = tasks.find(t => t.id === taskId)
    if (!task) return

    try {
      const response = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          taskId,
          completed: !task.completed
        })
      })

      if (response.ok) {
        const updatedTask = await response.json()
        setTasks(prev => prev.map(t => t.id === taskId ? updatedTask : t))
      }
    } catch (error) {
      console.error('Error updating task:', error)
    }
  }

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen p-8 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-destiny-orange"></div>
      </div>
    )
  }

  if (!session) {
    return (
      <div className="min-h-screen p-8 flex flex-col items-center justify-center">
        <h1 className="text-4xl font-bold text-destiny-orange mb-8">
          Destiny Task Manager
        </h1>
        <p className="text-gray-300 mb-8 text-center max-w-md">
          Sign in with Discord to track your daily, weekly, and seasonal Destiny 2 activities
        </p>
        <LoginButton />
      </div>
    )
  }

  const dailyTasks = tasks.filter(t => t.taskTemplate.category === TaskCategory.DAILY)
  const weeklyTasks = tasks.filter(t => t.taskTemplate.category === TaskCategory.WEEKLY)
  const monthlyTasks = tasks.filter(t => t.taskTemplate.category === TaskCategory.MONTHLY)
  const seasonalTasks = tasks.filter(t => t.taskTemplate.category === TaskCategory.SEASONAL)

  return (
    <main className="min-h-screen p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-destiny-orange">
              Destiny Rising Task Manager
            </h1>
            <p className="text-gray-300 mt-2">
              Welcome back, {session.user?.name}
            </p>
          </div>
          <div className="flex items-center space-x-4">
            {isAdmin && (
              <a
                href="/admin"
                className="px-4 py-2 bg-destiny-purple text-white rounded-lg hover:bg-destiny-purple/80 transition-colors"
              >
                Admin Panel
              </a>
            )}
            <LoginButton />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          <TaskSection
            title="Daily Tasks"
            subtitle="Reset at 2AM UTC"
            tasks={dailyTasks}
            category={TaskCategory.DAILY}
            color="destiny-orange"
            onToggleTask={toggleTask}
          />

          <TaskSection
            title="Weekly Tasks"
            subtitle="Reset on Monday"
            tasks={weeklyTasks}
            category={TaskCategory.WEEKLY}
            color="destiny-blue"
            onToggleTask={toggleTask}
          />

          <TaskSection
            title="Monthly Tasks"
            subtitle="Reset monthly"
            tasks={monthlyTasks}
            category={TaskCategory.MONTHLY}
            color="destiny-gold"
            onToggleTask={toggleTask}
          />

          <TaskSection
            title="Seasonal Tasks"
            subtitle="Season of Daybreak"
            tasks={seasonalTasks}
            category={TaskCategory.SEASONAL}
            color="destiny-purple"
            onToggleTask={toggleTask}
          />
        </div>
      </div>
    </main>
  )
}