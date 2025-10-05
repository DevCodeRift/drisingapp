export enum TaskCategory {
  DAILY = 'DAILY',
  WEEKLY = 'WEEKLY',
  FORTNIGHT = 'FORTNIGHT',
  MONTHLY = 'MONTHLY',
  SEASONAL = 'SEASONAL'
}

export enum ResetType {
  DAILY_2AM_UTC = 'DAILY_2AM_UTC',
  WEEKLY_MONDAY = 'WEEKLY_MONDAY',
  FORTNIGHT = 'FORTNIGHT',
  MONTHLY = 'MONTHLY',
  SEASONAL = 'SEASONAL'
}

export interface TaskTemplate {
  id: string
  title: string
  description?: string
  category: TaskCategory
  resetType: ResetType
}

export interface UserTask {
  id: string
  userId: string
  taskTemplateId: string
  completed: boolean
  completedAt?: Date
  resetAt?: Date
  taskTemplate: TaskTemplate
}