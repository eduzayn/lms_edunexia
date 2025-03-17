import React from 'react';
import { AuthForm } from '@/components/auth/auth-form';

export default function ProfessorLoginPage() {
  return (
    <AuthForm 
      mode="login" 
      title="Portal do Professor"
      subtitle="Gerencie suas turmas e conteúdos"
      portalType="professor"
    />
  );
}