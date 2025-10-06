'use client'

import { UserTask, TaskCategory } from '@/types/tasks'
import TaskCard from './TaskCard'

interface TaskSectionProps {
  title: string
  subtitle: string
  tasks: UserTask[]
  category: TaskCategory
  color: string
  onToggleTask: (taskId: string) => void
}

const getCategoryIcon = (category: TaskCategory) => {
  switch (category) {
    case TaskCategory.DAILY:
      return (
        <div className="w-6 h-6 rounded bg-destiny-solar/10 flex items-center justify-center">
          <div className="w-3 h-3 rounded-full bg-destiny-solar"></div>
        </div>
      )
    case TaskCategory.WEEKLY:
      return (
        <div className="w-6 h-6 rounded bg-destiny-arc/10 flex items-center justify-center">
          <div className="w-3 h-3 rounded-full bg-destiny-arc"></div>
        </div>
      )
    case TaskCategory.MONTHLY:
      return (
        <div className="w-6 h-6 rounded bg-destiny-gold/10 flex items-center justify-center">
          <div className="w-3 h-3 rounded-full bg-destiny-gold"></div>
        </div>
      )
    case TaskCategory.SEASONAL:
      return (
        <div className="w-6 h-6 rounded bg-destiny-void/10 flex items-center justify-center">
          <div className="w-3 h-3 rounded-full bg-destiny-void"></div>
        </div>
      )
    default:
      return (
        <div className="w-6 h-6 rounded bg-gray-100 flex items-center justify-center">
          <div className="w-3 h-3 rounded-full bg-gray-400"></div>
        </div>
      )
  }
}

const getColorClass = (color: string) => {
  switch (color) {
    case 'destiny-orange':
      return 'text-destiny-solar'
    case 'destiny-blue':
      return 'text-destiny-arc'
    case 'destiny-purple':
      return 'text-destiny-void'
    case 'destiny-gold':
      return 'text-destiny-gold'
    default:
      return 'text-text-primary'
  }
}

const getProgressBarColor = (color: string) => {
  switch (color) {
    case 'destiny-orange':
      return 'bg-destiny-solar'
    case 'destiny-blue':
      return 'bg-destiny-arc'
    case 'destiny-purple':
      return 'bg-destiny-void'
    case 'destiny-gold':
      return 'bg-destiny-gold'
    default:
      return 'bg-gray-400'
  }
}

export default function TaskSection({
  title,
  subtitle,
  tasks,
  category,
  color,
  onToggleTask
}: TaskSectionProps) {
  const completedTasks = tasks.filter(task => task.completed).length
  const totalTasks = tasks.length

  return (
    <div className="bg-white p-6 rounded-xl shadow-card border border-gray-200 hover:shadow-card-hover transition-shadow">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className={`text-lg font-semibold flex items-center gap-3 ${getColorClass(color)}`}>
            {getCategoryIcon(category)}
            {title}
          </h2>
          <p className="text-text-secondary text-sm mt-1">{subtitle}</p>
        </div>
        <div className="text-right">
          <div className={`text-lg font-bold ${getColorClass(color)}`}>
            {completedTasks}/{totalTasks}
          </div>
          <div className="text-xs text-text-muted">completed</div>
        </div>
      </div>

      <div className="space-y-2">
        {tasks.length === 0 ? (
          <div className="text-center py-8">
            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <p className="text-text-muted text-sm">No tasks available</p>
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
          <div className="bg-gray-200 rounded-full h-2">
            <div
              className={`h-2 rounded-full transition-all duration-500 ${getProgressBarColor(color)}`}
              style={{ width: `${(completedTasks / totalTasks) * 100}%` }}
            />
          </div>
          <div className="flex justify-between text-xs text-text-muted mt-2">
            <span>{completedTasks} completed</span>
            <span>{Math.round((completedTasks / totalTasks) * 100)}%</span>
          </div>
        </div>
      )}
    </div>
  )
}