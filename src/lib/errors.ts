export class AppError extends Error {
  constructor(
    message: string,
    public code: string,
    public status: number = 400,
    public details?: any
  ) {
    super(message)
    this.name = 'AppError'
  }
}

export const appErrors = {
  UNEXPECTED_ERROR: new AppError(
    'Ocorreu um erro inesperado',
    'UNEXPECTED_ERROR',
    500
  ),
  INVALID_CREDENTIALS: new AppError(
    'Email ou senha inválidos',
    'INVALID_CREDENTIALS',
    401
  ),
  USER_NOT_FOUND: new AppError(
    'Usuário não encontrado',
    'USER_NOT_FOUND',
    404
  ),
  USER_ALREADY_EXISTS: new AppError(
    'Usuário já existe',
    'USER_ALREADY_EXISTS',
    409
  ),
  UNAUTHORIZED: new AppError(
    'Não autorizado',
    'UNAUTHORIZED',
    401
  ),
  FORBIDDEN: new AppError(
    'Acesso negado',
    'FORBIDDEN',
    403
  ),
  INVALID_TOKEN: new AppError(
    'Token inválido',
    'INVALID_TOKEN',
    401
  ),
  TOKEN_EXPIRED: new AppError(
    'Token expirado',
    'TOKEN_EXPIRED',
    401
  ),
  VALIDATION_ERROR: new AppError(
    'Erro de validação',
    'VALIDATION_ERROR',
    400
  ),
  RESOURCE_NOT_FOUND: new AppError(
    'Recurso não encontrado',
    'RESOURCE_NOT_FOUND',
    404
  ),
} as const 