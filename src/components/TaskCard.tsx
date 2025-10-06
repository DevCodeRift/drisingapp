'use client'

import { UserTask } from '@/types/tasks'
import { useTheme } from '@/contexts/ThemeContext'

interface TaskCardProps {
  task: UserTask
  onToggle: (taskId: string) => void
}

export default function TaskCard({ task, onToggle }: TaskCardProps) {
  const { colors } = useTheme()

  return (
    <div
      className="group p-3 rounded-lg border transition-all cursor-pointer"
      style={{
        backgroundColor: task.completed ? colors.surface : colors.background,
        borderColor: colors.border.primary
      }}
      onClick={() => onToggle(task.id)}
    >
      <div className="flex items-center space-x-3">
        <div
          className="w-5 h-5 rounded border-2 flex items-center justify-center transition-colors"
          style={{
            backgroundColor: task.completed ? '#10b981' : 'transparent',
            borderColor: task.completed ? '#10b981' : colors.border.secondary
          }}
        >
          {task.completed && (
            <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <h3
            className={`font-medium text-sm ${task.completed ? 'line-through' : ''}`}
            style={{
              color: task.completed ? colors.text.muted : colors.text.primary
            }}
          >
            {task.taskTemplate.title}
          </h3>
          {task.taskTemplate.description && (
            <p
              className={`text-xs mt-1 ${task.completed ? 'line-through' : ''}`}
              style={{
                color: task.completed ? colors.text.muted : colors.text.secondary
              }}
            >
              {task.taskTemplate.description}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}