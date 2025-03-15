'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import CertificateTemplateEditor from '@/components/certificates/certificate-template-editor';
import CertificateService, { CertificateTemplate } from '@/lib/services/certificate-service';

export default function EditCertificateTemplatePage() {
  const params = useParams();
  const router = useRouter();
  const [template, setTemplate] = useState<CertificateTemplate | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchTemplate = async () => {
      try {
        setLoading(true);
        
        const certificateService = CertificateService.getInstance();
        const templateData = await certificateService.getTemplate(params.id as string);
        
        if (!templateData) {
          setError('Template não encontrado.');
          setLoading(false);
          return;
        }
        
        setTemplate(templateData);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching template:', err);
        setError('Ocorreu um erro ao carregar o template. Por favor, tente novamente mais tarde.');
        setLoading(false);
      }
    };
    
    fetchTemplate();
  }, [params.id]);
  
  const handleSave = (updatedTemplate: CertificateTemplate) => {
    router.push('/admin/certificates');
  };
  
  const handleCancel = () => {
    router.push('/admin/certificates');
  };
  
  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        <p className="ml-4 text-lg">Carregando template...</p>
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
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Editar Template de Certificado</h1>
          <p className="text-gray-600 mt-2">
            {template?.name}
          </p>
        </div>
        <Link 
          href="/admin/certificates"
          className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
        >
          Voltar
        </Link>
      </div>
      
      <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
        {template && (
          <CertificateTemplateEditor
            templateId={template.id}
            onSave={handleSave}
            onCancel={handleCancel}
          />
        )}
      </div>
    </div>
  );
}
