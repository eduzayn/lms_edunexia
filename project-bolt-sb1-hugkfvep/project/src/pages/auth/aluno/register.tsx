import React from 'react';
import { AuthForm } from '@/components/auth/auth-form';

export default function AlunoRegisterPage() {
  return (
    <AuthForm 
      mode="register" 
      title="Criar Conta de Aluno"
      subtitle="Comece sua jornada de aprendizado"
      portalType="aluno"
    />
  );
}