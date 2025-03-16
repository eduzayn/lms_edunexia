'use client';

import React, { useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import CertificateService, { IssuedCertificate } from '@/lib/services/certificate-service';

interface CertificateVerificationProps {
  initialHash?: string;
}

const CertificateVerification: React.FC<CertificateVerificationProps> = ({
  initialHash = ''
}) => {
  const [hash, setHash] = useState(initialHash);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<{
    isValid: boolean;
    certificate: IssuedCertificate | null;
  } | null>(null);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!hash.trim()) {
      setError('Por favor, insira um código de verificação.');
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      setResult(null);
      
      const certificateService = CertificateService.getInstance();
      const verificationResult = await certificateService.verifyCertificate(
        hash,
        undefined,
        undefined,
        navigator.userAgent
      );
      
      setResult(verificationResult);
      setLoading(false);
    } catch (err) {
      console.error('Error verifying certificate:', err);
      setError('Ocorreu um erro ao verificar o certificado. Por favor, tente novamente mais tarde.');
      setLoading(false);
    }
  };
  
  return (
    <div className="max-w-3xl mx-auto">
      <div className="bg-white shadow-sm rounded-lg p-6">
        <h1 className="text-2xl font-bold text-center mb-6">Verificação de Certificado</h1>
        
        <form onSubmit={handleSubmit} className="mb-8">
          <div className="flex flex-col md:flex-row gap-3">
            <input
              type="text"
              value={hash}
              onChange={(e) => setHash(e.target.value)}
              placeholder="Digite o código de verificação ou hash do certificado"
              className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              disabled={loading}
            />
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
              disabled={loading}
            >
              {loading ? 'Verificando...' : 'Verificar'}
            </button>
          </div>
          {error && (
            <p className="mt-2 text-sm text-red-600">{error}</p>
          )}
        </form>
        
        {result && (
          <div className={`p-6 rounded-lg ${result.isValid ? 'bg-green-50' : 'bg-red-50'}`}>
            {result.isValid ? (
              <div className="space-y-4">
                <div className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <h2 className="ml-3 text-xl font-semibold text-green-800">Certificado Válido</h2>
                </div>
                
                {result.certificate && (
                  <div className="mt-4 border-t border-green-200 pt-4">
                    <h3 className="text-lg font-medium">Detalhes do Certificado</h3>
                    <dl className="mt-2 grid grid-cols-1 gap-x-4 gap-y-4 sm:grid-cols-2">
                      <div>
                        <dt className="text-sm font-medium text-gray-500">Aluno</dt>
                        <dd className="mt-1 text-sm text-gray-900">{(result.certificate as any).student?.full_name || 'Nome não disponível'}</dd>
                      </div>
                      <div>
                        <dt className="text-sm font-medium text-gray-500">Curso</dt>
                        <dd className="mt-1 text-sm text-gray-900">{(result.certificate as any).course?.name || 'Nome não disponível'}</dd>
                      </div>
                      <div>
                        <dt className="text-sm font-medium text-gray-500">Data de Emissão</dt>
                        <dd className="mt-1 text-sm text-gray-900">{new Date(result.certificate.issue_date).toLocaleDateString('pt-BR')}</dd>
                      </div>
                      <div>
                        <dt className="text-sm font-medium text-gray-500">Número do Certificado</dt>
                        <dd className="mt-1 text-sm text-gray-900">{result.certificate.certificate_number}</dd>
                      </div>
                    </dl>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <div className="ml-3">
                  <h2 className="text-xl font-semibold text-red-800">Certificado Inválido</h2>
                  <p className="mt-1 text-red-700">O código de verificação fornecido não corresponde a nenhum certificado válido em nosso sistema.</p>
                </div>
              </div>
            )}
          </div>
        )}
        
        <div className="mt-8 border-t border-gray-200 pt-6">
          <h3 className="text-lg font-medium">Como verificar um certificado</h3>
          <p className="mt-2 text-gray-600">
            Para verificar a autenticidade de um certificado, insira o código de verificação que aparece no certificado ou o hash completo no campo acima e clique em "Verificar".
          </p>
          <p className="mt-2 text-gray-600">
            Todos os certificados emitidos pela nossa plataforma possuem um código único que pode ser usado para confirmar sua autenticidade.
          </p>
        </div>
      </div>
    </div>
  );
};

export default CertificateVerification;
