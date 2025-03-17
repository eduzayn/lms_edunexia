import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, AuthError } from '@supabase/supabase-js';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { Database } from '@/lib/supabase-types';

type Profile = Database['public']['Tables']['profiles']['Row'];

interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: AuthError | null }>;
  signUp: (email: string, password: string, role: string) => Promise<{ error: AuthError | null }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ error: AuthError | null }>;
  verifyEmail: (token: string) => Promise<{ error: AuthError | null }>;
  updateProfile: (data: Partial<Profile>) => Promise<{ error: Error | null }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const roleRedirects: Record<string, string> = {
  admin: '/admin/dashboard',
  student: '/aluno/dashboard',
  teacher: '/professor/dashboard',
  polo_manager: '/polo/dashboard'
};

// Credenciais temporárias para desenvolvimento
const TEMP_CREDENTIALS = {
  email: 'ana.diretoria@eduzayn.com.br',
  password: 'Zayn@2025'
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const signIn = async (email: string, password: string) => {
    // Bypass temporário de autenticação
    if (email === TEMP_CREDENTIALS.email && password === TEMP_CREDENTIALS.password) {
      const tempUser = {
        id: 'temp-user-id',
        email: TEMP_CREDENTIALS.email,
        role: 'authenticated'
      };

      const tempProfile = {
        id: 'temp-user-id',
        email: TEMP_CREDENTIALS.email,
        full_name: 'Ana Diretoria',
        role: 'admin',
        active: true,
        email_verified: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      setUser(tempUser as User);
      setProfile(tempProfile);
      navigate(roleRedirects['admin']);
      return { error: null };
    }

    return { error: { message: 'Credenciais inválidas' } as AuthError };
  };

  const signOut = async () => {
    setUser(null);
    setProfile(null);
    navigate('/');
  };

  // Funções não utilizadas no modo de desenvolvimento
  const signUp = async () => ({ error: null });
  const resetPassword = async () => ({ error: null });
  const verifyEmail = async () => ({ error: null });
  const updateProfile = async () => ({ error: null });

  const value = {
    user,
    profile,
    loading,
    signIn,
    signUp,
    signOut,
    resetPassword,
    verifyEmail,
    updateProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}