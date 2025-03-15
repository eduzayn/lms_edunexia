'use client';

import React, { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import CertificateService from '@/lib/services/certificate-service';

interface CertificateDisplayProps {
  certificateId: string;
  printable?: boolean;
}

const CertificateDisplay: React.FC<CertificateDisplayProps> = ({
  certificateId,
  printable = false
}) => {
  const [html, setHtml] = useState<string>('');
  const [css, setCss] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchCertificate = async () => {
      try {
        setLoading(true);
        
        const certificateService = CertificateService.getInstance();
        const rendered = await certificateService.renderCertificate(certificateId);
        
        if (!rendered) {
          throw new Error('Falha ao renderizar o certificado');
        }
        
        setHtml(rendered.html);
        setCss(rendered.css);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching certificate:', err);
        setError('Não foi possível carregar o certificado. Por favor, tente novamente mais tarde.');
        setLoading(false);
      }
    };
    
    fetchCertificate();
  }, [certificateId]);
  
  const handlePrint = () => {
    window.print();
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
      </div>
    );
  }
  
  return (
    <div className={`certificate-container ${printable ? 'print:scale-100' : ''}`}>
      {!printable && (
        <div className="mb-4 flex justify-end">
          <button
            onClick={handlePrint}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M5 4v3H4a2 2 0 00-2 2v3a2 2 0 002 2h1v2a2 2 0 002 2h6a2 2 0 002-2v-2h1a2 2 0 002-2V9a2 2 0 00-2-2h-1V4a2 2 0 00-2-2H7a2 2 0 00-2 2zm8 0H7v3h6V4zm0 8H7v4h6v-4z" clipRule="evenodd" />
            </svg>
            Imprimir Certificado
          </button>
        </div>
      )}
      
      <style dangerouslySetInnerHTML={{ __html: css }} />
      
      <div 
        className="certificate-content"
        dangerouslySetInnerHTML={{ __html: html }}
      />
      
      <style jsx>{`
        .certificate-container {
          width: 100%;
          max-width: 1000px;
          margin: 0 auto;
          padding: 20px;
        }
        
        @media print {
          .certificate-container {
            padding: 0;
          }
          
          button {
            display: none;
          }
        }
      `}</style>
    </div>
  );
};

export default CertificateDisplay;
