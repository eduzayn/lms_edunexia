'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import CertificateDisplay from '@/components/certificates/certificate-display';
import CertificateService, { IssuedCertificate } from '@/lib/services/certificate-service';

export default function AdminCertificateDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [certificate, setCertificate] = useState<IssuedCertificate | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchCertificate = async () => {
      try {
        setLoading(true);
        
        const certificateService = CertificateService.getInstance();
        const certificateData = await certificateService.getCertificate(params.id as string);
        
        if (!certificateData) {
          setError('Certificado não encontrado.');
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
  }, [params.id]);
  
  const handleRevoke = async () => {
    if (!certificate) return;
    
    if (!window.confirm('Tem certeza que deseja revogar este certificado? Esta ação não pode ser desfeita.')) {
      return;
    }
    
    try {
      const certificateService = CertificateService.getInstance();
      await certificateService.revokeCertificate(
        certificate.id,
        'Revogado pelo administrador'
      );
      
      // Refresh certificate data
      const updatedCertificate = await certificateService.getCertificate(certificate.id);
      setCertificate(updatedCertificate);
      
      alert('Certificado revogado com sucesso.');
    } catch (err) {
      console.error('Error revoking certificate:', err);
      alert('Ocorreu um erro ao revogar o certificado. Por favor, tente novamente mais tarde.');
    }
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
        <Link 
          href="/admin/certificates"
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Voltar para Certificados
        </Link>
      </div>
    );
  }
  
  const isRevoked = certificate?.metadata && (certificate.metadata as any).revoked;
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Detalhes do Certificado</h1>
          <p className="text-gray-600 mt-2">
            {certificate?.certificate_number}
          </p>
        </div>
        <div className="flex space-x-3">
          <Link 
            href="/admin/certificates"
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
          >
            Voltar
          </Link>
          
          {!isRevoked && (
            <button 
              onClick={handleRevoke}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            >
              Revogar Certificado
            </button>
          )}
        </div>
      </div>
      
      {/* Certificate Info */}
      <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-medium mb-4">Informações do Certificado</h3>
            
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-500">Número do Certificado</p>
                <p className="font-medium">{certificate?.certificate_number}</p>
              </div>
              
              <div>
                <p className="text-sm text-gray-500">Data de Emissão</p>
                <p className="font-medium">
                  {certificate?.issue_date && new Date(certificate.issue_date).toLocaleDateString('pt-BR')}
                </p>
              </div>
              
              <div>
                <p className="text-sm text-gray-500">Hash de Verificação</p>
                <p className="font-medium text-sm break-all">{certificate?.verification_hash}</p>
              </div>
              
              <div>
                <p className="text-sm text-gray-500">Status</p>
                <p className={`font-medium ${isRevoked ? 'text-red-600' : 'text-green-600'}`}>
                  {isRevoked ? 'Revogado' : 'Válido'}
                </p>
              </div>
              
              {isRevoked && certificate?.metadata && (
                <div>
                  <p className="text-sm text-gray-500">Motivo da Revogação</p>
                  <p className="font-medium text-red-600">
                    {(certificate.metadata as any).revocation_reason}
                  </p>
                </div>
              )}
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-medium mb-4">Informações do Aluno e Curso</h3>
            
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-500">Aluno</p>
                <p className="font-medium">{(certificate as any)?.student?.full_name || 'N/A'}</p>
              </div>
              
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="font-medium">{(certificate as any)?.student?.email || 'N/A'}</p>
              </div>
              
              <div>
                <p className="text-sm text-gray-500">Curso</p>
                <p className="font-medium">{(certificate as any)?.course?.name || 'N/A'}</p>
              </div>
              
              <div>
                <p className="text-sm text-gray-500">Template</p>
                <p className="font-medium">{(certificate as any)?.template?.name || 'N/A'}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Certificate Preview */}
      <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
        <h3 className="text-lg font-medium mb-4">Visualização do Certificado</h3>
        
        {certificate && (
          <CertificateDisplay certificateId={certificate.id} printable={false} />
        )}
      </div>
    </div>
  );
}
