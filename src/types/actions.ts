import { AppError } from '@/lib/errors'

export type ActionResponse<T = any> = {
  success: boolean
  data?: T
  error?: AppError
} 