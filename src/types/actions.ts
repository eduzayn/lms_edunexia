import { AppError } from './errors'

export interface ActionError {
  code: string
  message: string
}

export interface ActionResponse<T = any> {
  success: boolean
  data?: T
  error?: AppError
} 