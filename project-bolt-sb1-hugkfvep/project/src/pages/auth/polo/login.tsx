import React from 'react';
import { AuthForm } from '@/components/auth/auth-form';

export default function PoloLoginPage() {
  return (
    <AuthForm 
      mode="login" 
      title="Portal do Polo"
      subtitle="Administre seu polo de ensino"
      portalType="polo"
    />
  );
}