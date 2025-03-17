import React from 'react';
import { AuthForm } from '@/components/auth/auth-form';

export default function AdminLoginPage() {
  return (
    <AuthForm 
      mode="login" 
      title="Portal Administrativo"
      subtitle="Acesso restrito aos administradores do sistema"
      portalType="admin"
    />
  );
}