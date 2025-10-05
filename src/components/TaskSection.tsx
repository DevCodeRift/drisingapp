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
      return '☀️'
    case TaskCategory.WEEKLY:
      return '📅'
    case TaskCategory.MONTHLY:
      return '🗓️'
    case TaskCategory.SEASONAL:
      return '🌟'
    default:
      return '📋'
  }
}

const getColorClass = (color: string) => {
  switch (color) {
    case 'destiny-orange':
      return 'text-destiny-orange'
    case 'destiny-blue':
      return 'text-destiny-blue'
    case 'destiny-purple':
      return 'text-destiny-purple'
    case 'destiny-gold':
      return 'text-destiny-gold'
    default:
      return 'text-white'
  }
}

const getProgressBarColor = (color: string) => {
  switch (color) {
    case 'destiny-orange':
      return 'bg-destiny-orange'
    case 'destiny-blue':
      return 'bg-destiny-blue'
    case 'destiny-purple':
      return 'bg-destiny-purple'
    case 'destiny-gold':
      return 'bg-destiny-gold'
    default:
      return 'bg-white'
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
    <div className="bg-destiny-dark p-6 rounded-lg border border-gray-700">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className={`text-xl font-semibold flex items-center gap-2 ${getColorClass(color)}`}>
            <span>{getCategoryIcon(category)}</span>
            {title}
          </h2>
          <p className="text-gray-400 text-sm">{subtitle}</p>
        </div>
        <div className={`font-semibold ${getColorClass(color)}`}>
          {completedTasks}/{totalTasks}
        </div>
      </div>

      <div className="space-y-3">
        {tasks.length === 0 ? (
          <p className="text-gray-500 text-center py-4">No tasks available</p>
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
        <div className="mt-4">
          <div className="bg-destiny-darker rounded-full h-2">
            <div
              className={`h-2 rounded-full transition-all duration-300 ${getProgressBarColor(color)}`}
              style={{ width: `${(completedTasks / totalTasks) * 100}%` }}
            />
          </div>
        </div>
      )}
    </div>
  )
}