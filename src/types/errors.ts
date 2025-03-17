export interface AppError {
  code: string
  message: string
  details?: Record<string, any>
}

export const appErrors = {
  UNEXPECTED_ERROR: {
    code: 'UNEXPECTED_ERROR',
    message: 'Ocorreu um erro inesperado',
  },
  INVALID_CREDENTIALS: {
    code: 'INVALID_CREDENTIALS',
    message: 'Email ou senha inválidos',
  },
  USER_NOT_FOUND: {
    code: 'USER_NOT_FOUND',
    message: 'Usuário não encontrado',
  },
  USER_ALREADY_EXISTS: {
    code: 'USER_ALREADY_EXISTS',
    message: 'Usuário já existe',
  },
  INVALID_TOKEN: {
    code: 'INVALID_TOKEN',
    message: 'Token inválido',
  },
  EXPIRED_TOKEN: {
    code: 'EXPIRED_TOKEN',
    message: 'Token expirado',
  },
  UNAUTHORIZED: {
    code: 'UNAUTHORIZED',
    message: 'Não autorizado',
  },
  FORBIDDEN: {
    code: 'FORBIDDEN',
    message: 'Acesso negado',
  },
  NOT_FOUND: {
    code: 'NOT_FOUND',
    message: 'Recurso não encontrado',
  },
  BAD_REQUEST: {
    code: 'BAD_REQUEST',
    message: 'Requisição inválida',
  },
  VALIDATION_ERROR: {
    code: 'VALIDATION_ERROR',
    message: 'Erro de validação',
  },
} as const satisfies Record<string, AppError> 