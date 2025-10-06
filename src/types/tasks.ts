export enum TaskCategory {
  DAILY = 'DAILY',
  WEEKLY = 'WEEKLY',
  MONTHLY = 'MONTHLY',
  SEASONAL = 'SEASONAL'
}

export enum ResetType {
  DAILY_2AM_UTC = 'DAILY_2AM_UTC',
  WEEKLY_MONDAY = 'WEEKLY_MONDAY',
  WEEKLY_FRIDAY = 'WEEKLY_FRIDAY',
  MONTHLY = 'MONTHLY',
  SEASONAL = 'SEASONAL',
  TIME_LIMITED_FRI_TO_MON = 'TIME_LIMITED_FRI_TO_MON'
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