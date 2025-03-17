import React from 'react';
import { AuthForm } from '@/components/auth/auth-form';

export default function AlunoLoginPage() {
  return (
    <AuthForm 
      mode="login" 
      title="Portal do Aluno"
      subtitle="Acesse sua área de estudos"
      portalType="aluno"
    />
  );
}