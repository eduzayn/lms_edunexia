'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import CertificateTemplateEditor from '@/components/certificates/certificate-template-editor';
import { CertificateTemplate } from '@/lib/services/certificate-service';

export default function CreateCertificateTemplatePage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  
  const handleSave = (template: CertificateTemplate) => {
    router.push('/admin/certificates');
  };
  
  const handleCancel = () => {
    router.push('/admin/certificates');
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Criar Novo Template de Certificado</h1>
          <p className="text-gray-600 mt-2">
            Crie um novo template para certificados de conclusão de cursos.
          </p>
        </div>
        <Link 
          href="/admin/certificates"
          className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
        >
          Voltar
        </Link>
      </div>
      
      {error && (
        <div className="p-4 bg-red-50 rounded-lg mb-6">
          <p className="text-red-600">{error}</p>
        </div>
      )}
      
      <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
        <CertificateTemplateEditor
          onSave={handleSave}
          onCancel={handleCancel}
        />
      </div>
    </div>
  );
}
