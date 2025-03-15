'use client';

import React, { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import CertificateList from '@/components/certificates/certificate-list';

export default function StudentCertificatesPage() {
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
  );
  
  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        
        const { data: { user } } = await supabase.auth.getUser();
        
        if (user) {
          setUserId(user.id);
        } else {
          setError('Usuário não autenticado. Por favor, faça login para visualizar seus certificados.');
        }
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching user:', err);
        setError('Ocorreu um erro ao carregar os dados do usuário. Por favor, tente novamente mais tarde.');
        setLoading(false);
      }
    };
    
    fetchUser();
  }, [supabase]);
  
  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        <p className="ml-4 text-lg">Carregando certificados...</p>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center p-8 bg-red-50 rounded-lg">
        <p className="text-red-600 mb-4">{error}</p>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Meus Certificados</h1>
        <p className="text-gray-600 mt-2">
          Visualize e baixe seus certificados de conclusão de cursos.
        </p>
      </div>
      
      {userId && <CertificateList studentId={userId} />}
    </div>
  );
}
