'use client'

import { UserTask } from '@/types/tasks'

interface TaskCardProps {
  task: UserTask
  onToggle: (taskId: string) => void
}

export default function TaskCard({ task, onToggle }: TaskCardProps) {
  return (
    <div className={`p-4 rounded-lg border transition-all cursor-pointer ${
      task.completed
        ? 'bg-destiny-dark/50 border-destiny-gold/50 opacity-75'
        : 'bg-destiny-dark border-destiny-orange/20 hover:border-destiny-orange/50'
    }`}
    onClick={() => onToggle(task.id)}
    >
      <div className="flex items-center space-x-3">
        <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
          task.completed
            ? 'bg-destiny-gold border-destiny-gold'
            : 'border-destiny-orange'
        }`}>
          {task.completed && (
            <svg className="w-3 h-3 text-destiny-dark" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          )}
        </div>
        <div className="flex-1">
          <h3 className={`font-medium ${task.completed ? 'line-through text-gray-400' : 'text-white'}`}>
            {task.taskTemplate.title}
          </h3>
          {task.taskTemplate.description && (
            <p className={`text-sm ${task.completed ? 'text-gray-500' : 'text-gray-300'}`}>
              {task.taskTemplate.description}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}