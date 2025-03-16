'use client';

import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import CertificateVerification from '@/components/certificates/certificate-verification';

export default function VerifyCertificatePage() {
  const searchParams = useSearchParams();
  const hash = searchParams.get('hash') || '';
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold">Verificação de Certificado</h1>
        <p className="text-gray-600 mt-2">
          Verifique a autenticidade de um certificado emitido pela nossa plataforma.
        </p>
      </div>
      
      <CertificateVerification initialHash={hash} />
      
      <div className="mt-12 text-center">
        <p className="text-sm text-gray-500">
          Todos os certificados emitidos pela Edunexia possuem um código de verificação único que pode ser usado para confirmar sua autenticidade.
        </p>
      </div>
    </div>
  );
}
