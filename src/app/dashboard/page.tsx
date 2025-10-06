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
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex items-center space-x-3">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-destiny-orange"></div>
          <span className="text-text-secondary">Loading your tasks...</span>
        </div>
      </div>
    )
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-background py-16 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-4xl font-bold text-text-primary mb-6">
            Destiny Rising Task Manager
          </h1>
          <p className="text-text-secondary mb-8 text-lg leading-relaxed">
            Track your daily, weekly, and seasonal Destiny Rising activities. Stay organized and never miss important tasks.
          </p>
          <div className="bg-white p-8 rounded-xl shadow-card border border-gray-200">
            <div className="mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-destiny-orange to-destiny-solar rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-text-primary mb-2">Ready to get started?</h2>
              <p className="text-text-secondary">Sign in with your Discord account to begin tracking your tasks.</p>
            </div>
            <LoginButton />
          </div>
        </div>
      </div>
    )
  }

  const dailyTasks = tasks.filter(t => t.taskTemplate.category === TaskCategory.DAILY)
  const weeklyTasks = tasks.filter(t => t.taskTemplate.category === TaskCategory.WEEKLY)
  const monthlyTasks = tasks.filter(t => t.taskTemplate.category === TaskCategory.MONTHLY)
  const seasonalTasks = tasks.filter(t => t.taskTemplate.category === TaskCategory.SEASONAL)

  return (
    <main className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-text-primary">
                Task Dashboard
              </h1>
              <p className="text-text-secondary mt-1">
                Welcome back, {session.user?.name}
              </p>
            </div>
            <div className="flex items-center space-x-3">
              {isAdmin && (
                <a
                  href="/admin"
                  className="inline-flex items-center px-4 py-2 bg-destiny-purple/10 text-destiny-purple rounded-lg hover:bg-destiny-purple/20 transition-colors text-sm font-medium"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  Admin Panel
                </a>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-3 gap-6">
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
            subtitle="Reset every Monday"
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