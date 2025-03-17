export interface AppError {
  code: string
  message: string
}

export const appErrors = {
  UNEXPECTED_ERROR: {
    code: 'app/unexpected-error',
    message: 'Ocorreu um erro inesperado',
  },
  INVALID_CREDENTIALS: {
    code: 'auth/invalid-credentials',
    message: 'Email ou senha inválidos',
  },
  SIGNUP_FAILED: {
    code: 'auth/signup-failed',
    message: 'Erro ao criar conta',
  },
  PROFILE_CREATION_FAILED: {
    code: 'auth/profile-creation-failed',
    message: 'Erro ao criar perfil',
  },
  RESET_PASSWORD_FAILED: {
    code: 'auth/reset-password-failed',
    message: 'Erro ao enviar email de redefinição de senha',
  },
  UPDATE_PASSWORD_FAILED: {
    code: 'auth/update-password-failed',
    message: 'Erro ao atualizar senha',
  },
} as const 