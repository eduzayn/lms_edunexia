'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';
import CertificateDisplay from '@/components/certificates/certificate-display';
import CertificateService, { IssuedCertificate } from '@/lib/services/certificate-service';

export default function CertificateDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [certificate, setCertificate] = useState<IssuedCertificate | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
  );
  
  useEffect(() => {
    const fetchCertificate = async () => {
      try {
        setLoading(true);
        
        // Get current user
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          setError('Usuário não autenticado. Por favor, faça login para visualizar seus certificados.');
          setLoading(false);
          return;
        }
        
        setUserId(user.id);
        
        // Fetch certificate
        const certificateService = CertificateService.getInstance();
        const certificateData = await certificateService.getCertificate(params.id as string);
        
        if (!certificateData) {
          setError('Certificado não encontrado.');
          setLoading(false);
          return;
        }
        
        // Check if certificate belongs to current user
        if (certificateData.student_id !== user.id) {
          setError('Você não tem permissão para visualizar este certificado.');
          setLoading(false);
          return;
        }
        
        setCertificate(certificateData);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching certificate:', err);
        setError('Ocorreu um erro ao carregar o certificado. Por favor, tente novamente mais tarde.');
        setLoading(false);
      }
    };
    
    fetchCertificate();
  }, [params.id, supabase]);
  
  const handleBack = () => {
    router.push('/student/certificates');
  };
  
  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        <p className="ml-4 text-lg">Carregando certificado...</p>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center p-8 bg-red-50 rounded-lg">
        <p className="text-red-600 mb-4">{error}</p>
        <button 
          onClick={handleBack}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Voltar para Certificados
        </button>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Certificado</h1>
          <p className="text-gray-600 mt-2">
            {certificate?.certificate_number}
          </p>
        </div>
        <button 
          onClick={handleBack}
          className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
        >
          Voltar para Certificados
        </button>
      </div>
      
      {certificate && (
        <CertificateDisplay certificateId={certificate.id} printable={false} />
      )}
    </div>
  );
}
