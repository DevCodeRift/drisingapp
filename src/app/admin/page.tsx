'use client'

import { useSession } from 'next-auth/react'
import { useState, useEffect } from 'react'
import { TaskCategory, ResetType } from '@/types/tasks'

interface TaskTemplate {
  id: string
  title: string
  description?: string
  category: TaskCategory
  resetType: ResetType
}

export default function AdminPage() {
  const { data: session } = useSession()
  const [templates, setTemplates] = useState<TaskTemplate[]>([])
  const [loading, setLoading] = useState(true)
  const [isAdmin, setIsAdmin] = useState(false)
  const [checkingAdmin, setCheckingAdmin] = useState(true)
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    category: TaskCategory.DAILY,
    resetType: ResetType.DAILY_2AM_UTC
  })

  useEffect(() => {
    checkAdminStatus()
  }, [session])

  useEffect(() => {
    if (isAdmin) {
      fetchTemplates()
    }
  }, [isAdmin])

  const checkAdminStatus = async () => {
    if (!session) {
      setCheckingAdmin(false)
      return
    }

    try {
      const response = await fetch('/api/admin/check')
      const data = await response.json()
      setIsAdmin(data.isAdmin)
    } catch (error) {
      console.error('Error checking admin status:', error)
      setIsAdmin(false)
    } finally {
      setCheckingAdmin(false)
    }
  }

  const fetchTemplates = async () => {
    try {
      const response = await fetch('/api/admin/tasks')
      if (response.ok) {
        const data = await response.json()
        setTemplates(data)
      }
    } catch (error) {
      console.error('Error fetching templates:', error)
    } finally {
      setLoading(false)
    }
  }

  const createTask = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await fetch('/api/admin/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTask)
      })
      if (response.ok) {
        setNewTask({
          title: '',
          description: '',
          category: TaskCategory.DAILY,
          resetType: ResetType.DAILY_2AM_UTC
        })
        fetchTemplates()
      }
    } catch (error) {
      console.error('Error creating task:', error)
    }
  }

  const deleteTask = async (id: string) => {
    if (!confirm('Are you sure you want to delete this task?')) return

    try {
      const response = await fetch(`/api/admin/tasks/${id}`, {
        method: 'DELETE'
      })
      if (response.ok) {
        fetchTemplates()
      }
    } catch (error) {
      console.error('Error deleting task:', error)
    }
  }

  const reinitializeAllUsers = async () => {
    if (!confirm('This will reinitialize tasks for ALL users. Continue?')) return

    try {
      const response = await fetch('/api/admin/reinitialize-users', {
        method: 'POST'
      })
      if (response.ok) {
        alert('All users reinitialized successfully!')
      }
    } catch (error) {
      console.error('Error reinitializing users:', error)
    }
  }

  if (checkingAdmin || loading) {
    return (
      <div className="min-h-screen p-8 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-destiny-orange"></div>
      </div>
    )
  }

  if (!session) {
    return (
      <div className="min-h-screen p-8 flex items-center justify-center">
        <p className="text-gray-300">Please sign in to access admin panel</p>
      </div>
    )
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen p-8 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-destiny-orange mb-4">Access Denied</h1>
          <p className="text-gray-300">You do not have permission to access the admin panel.</p>
          <a href="/dashboard" className="mt-4 inline-block px-6 py-3 bg-destiny-orange text-white rounded-lg hover:bg-destiny-orange/80 transition-colors">
            Go to Dashboard
          </a>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-destiny-orange">
            Admin - Task Management
          </h1>
          <button
            onClick={reinitializeAllUsers}
            className="px-4 py-2 bg-destiny-purple text-white rounded-lg hover:bg-destiny-purple/80 transition-colors"
          >
            Reinitialize All Users
          </button>
        </div>

        {/* Create New Task */}
        <div className="bg-destiny-dark p-6 rounded-lg border border-destiny-orange/20 mb-8">
          <h2 className="text-2xl font-semibold text-destiny-orange mb-4">
            Create New Task Template
          </h2>
          <form onSubmit={createTask} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Title
                </label>
                <input
                  type="text"
                  value={newTask.title}
                  onChange={(e) => setNewTask({...newTask, title: e.target.value})}
                  className="w-full p-3 bg-destiny-darker rounded border border-gray-600 text-white"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Description (optional)
                </label>
                <input
                  type="text"
                  value={newTask.description}
                  onChange={(e) => setNewTask({...newTask, description: e.target.value})}
                  className="w-full p-3 bg-destiny-darker rounded border border-gray-600 text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Category
                </label>
                <select
                  value={newTask.category}
                  onChange={(e) => setNewTask({...newTask, category: e.target.value as TaskCategory})}
                  className="w-full p-3 bg-destiny-darker rounded border border-gray-600 text-white"
                >
                  <option value={TaskCategory.DAILY}>Daily</option>
                  <option value={TaskCategory.WEEKLY}>Weekly</option>
                  <option value={TaskCategory.MONTHLY}>Monthly</option>
                  <option value={TaskCategory.SEASONAL}>Seasonal</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Reset Type
                </label>
                <select
                  value={newTask.resetType}
                  onChange={(e) => setNewTask({...newTask, resetType: e.target.value as ResetType})}
                  className="w-full p-3 bg-destiny-darker rounded border border-gray-600 text-white"
                >
                  <option value={ResetType.DAILY_2AM_UTC}>Daily 2AM UTC</option>
                  <option value={ResetType.WEEKLY_MONDAY}>Weekly Monday</option>
                  <option value={ResetType.WEEKLY_FRIDAY}>Weekly Friday</option>
                  <option value={ResetType.MONTHLY}>Monthly</option>
                  <option value={ResetType.SEASONAL}>Seasonal</option>
                  <option value={ResetType.TIME_LIMITED_FRI_TO_MON}>Time Limited (Friday to Monday)</option>
                </select>
              </div>
            </div>
            <button
              type="submit"
              className="px-6 py-3 bg-destiny-orange text-white rounded-lg hover:bg-destiny-orange/80 transition-colors"
            >
              Create Task
            </button>
          </form>
        </div>

        {/* Task Templates List */}
        <div className="bg-destiny-dark p-6 rounded-lg border border-destiny-blue/20">
          <h2 className="text-2xl font-semibold text-destiny-blue mb-4">
            Existing Task Templates ({templates.length})
          </h2>

          {loading ? (
            <p className="text-gray-400">Loading...</p>
          ) : templates.length === 0 ? (
            <p className="text-gray-400">No task templates found</p>
          ) : (
            <div className="space-y-4">
              {Object.values(TaskCategory).map(category => {
                const categoryTasks = templates.filter(t => t.category === category)
                if (categoryTasks.length === 0) return null

                return (
                  <div key={category} className="border border-gray-700 rounded p-4">
                    <h3 className="text-lg font-semibold text-destiny-gold mb-3">
                      {category} Tasks ({categoryTasks.length})
                    </h3>
                    <div className="space-y-2">
                      {categoryTasks.map(task => (
                        <div key={task.id} className="flex justify-between items-center p-3 bg-destiny-darker rounded">
                          <div>
                            <h4 className="text-white font-medium">{task.title}</h4>
                            {task.description && (
                              <p className="text-gray-400 text-sm">{task.description}</p>
                            )}
                            <p className="text-gray-500 text-xs">{task.resetType}</p>
                          </div>
                          <button
                            onClick={() => deleteTask(task.id)}
                            className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                          >
                            Delete
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}