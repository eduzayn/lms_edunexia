'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { createClient } from '@supabase/supabase-js';
import CertificateService, { IssuedCertificate } from '@/lib/services/certificate-service';

interface CertificateListProps {
  studentId: string;
}

const CertificateList: React.FC<CertificateListProps> = ({ studentId }) => {
  const [certificates, setCertificates] = useState<IssuedCertificate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchCertificates = async () => {
      try {
        setLoading(true);
        
        const certificateService = CertificateService.getInstance();
        const data = await certificateService.getStudentCertificates(studentId);
        
        setCertificates(data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching certificates:', err);
        setError('Não foi possível carregar os certificados. Por favor, tente novamente mais tarde.');
        setLoading(false);
      }
    };
    
    fetchCertificates();
  }, [studentId]);
  
  if (loading) {
    return (
      <div className="flex items-center justify-center h-48">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
        <p className="ml-4">Carregando certificados...</p>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="p-4 bg-red-50 rounded-lg">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }
  
  if (certificates.length === 0) {
    return (
      <div className="p-6 bg-gray-50 rounded-lg text-center">
        <p className="text-gray-600">Você ainda não possui certificados.</p>
        <p className="text-gray-600 mt-2">Complete um curso para receber seu certificado.</p>
      </div>
    );
  }
  
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Meus Certificados</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {certificates.map((certificate) => (
          <div 
            key={certificate.id} 
            className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
          >
            <div className="p-4">
              <h3 className="font-medium text-lg">{(certificate as any).course?.name || 'Curso'}</h3>
              <p className="text-gray-500 text-sm">
                Emitido em: {new Date(certificate.issue_date).toLocaleDateString('pt-BR')}
              </p>
              
              <div className="mt-4 flex justify-between items-center">
                <Link 
                  href={`/student/certificates/${certificate.id}`}
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                >
                  Visualizar
                </Link>
                
                <Link 
                  href={`/verify-certificate?hash=${certificate.verification_hash}`}
                  target="_blank"
                  className="text-green-600 hover:text-green-800 text-sm font-medium"
                >
                  Verificar
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CertificateList;
