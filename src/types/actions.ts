import type { AppError } from '@/lib/errors'

export interface ActionResponse<T = unknown> {
  data?: T
  error?: AppError
} 