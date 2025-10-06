'use client'

import { UserTask, TaskCategory } from '@/types/tasks'
import TaskCard from './TaskCard'
import { useTheme } from '@/contexts/ThemeContext'

interface TaskSectionProps {
  title: string
  subtitle: string
  tasks: UserTask[]
  category: TaskCategory
  color: string
  onToggleTask: (taskId: string) => void
}

const getCategoryIcon = (category: TaskCategory, colors: any) => {
  const iconColors = {
    [TaskCategory.DAILY]: { bg: '#fed7aa', dot: '#ea580c' },
    [TaskCategory.WEEKLY]: { bg: '#dbeafe', dot: '#2563eb' },
    [TaskCategory.MONTHLY]: { bg: '#fef3c7', dot: '#d97706' },
    [TaskCategory.SEASONAL]: { bg: '#ede9fe', dot: '#7c3aed' }
  };

  const iconColor = iconColors[category] || { bg: colors.surface, dot: colors.text.secondary };

  return (
    <div className="w-6 h-6 rounded flex items-center justify-center" style={{ backgroundColor: iconColor.bg }}>
      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: iconColor.dot }}></div>
    </div>
  )
}


export default function TaskSection({
  title,
  subtitle,
  tasks,
  category,
  color,
  onToggleTask
}: TaskSectionProps) {
  const { colors } = useTheme()
  const completedTasks = tasks.filter(task => task.completed).length
  const totalTasks = tasks.length

  const categoryColors = {
    'destiny-orange': colors.primary,
    'destiny-blue': '#2563eb',
    'destiny-purple': '#7c3aed',
    'destiny-gold': '#d97706'
  }

  const activeColor = categoryColors[color as keyof typeof categoryColors] || colors.primary

  return (
    <div className="p-6 rounded-xl shadow-sm border hover:shadow-md transition-shadow" style={{
      backgroundColor: colors.surface,
      borderColor: colors.border.primary
    }}>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-semibold flex items-center gap-3" style={{ color: activeColor }}>
            {getCategoryIcon(category, colors)}
            {title}
          </h2>
          <p className="text-sm mt-1" style={{ color: colors.text.secondary }}>{subtitle}</p>
        </div>
        <div className="text-right">
          <div className="text-lg font-bold" style={{ color: activeColor }}>
            {completedTasks}/{totalTasks}
          </div>
          <div className="text-xs" style={{ color: colors.text.muted }}>completed</div>
        </div>
      </div>

      <div className="space-y-2">
        {tasks.length === 0 ? (
          <div className="text-center py-8">
            <div className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3" style={{
              backgroundColor: colors.surface
            }}>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{
                color: colors.text.muted
              }}>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <p className="text-sm" style={{ color: colors.text.muted }}>No tasks available</p>
          </div>
        ) : (
          tasks.map(task => (
            <TaskCard
              key={task.id}
              task={task}
              onToggle={onToggleTask}
            />
          ))
        )}
      </div>

      {totalTasks > 0 && (
        <div className="mt-6">
          <div className="rounded-full h-2" style={{ backgroundColor: colors.border.secondary }}>
            <div
              className="h-2 rounded-full transition-all duration-500"
              style={{
                width: `${(completedTasks / totalTasks) * 100}%`,
                backgroundColor: activeColor
              }}
            />
          </div>
          <div className="flex justify-between text-xs mt-2" style={{ color: colors.text.muted }}>
            <span>{completedTasks} completed</span>
            <span>{Math.round((completedTasks / totalTasks) * 100)}%</span>
          </div>
        </div>
      )}
    </div>
  )
}