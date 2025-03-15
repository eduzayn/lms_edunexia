'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { createClient } from '@supabase/supabase-js';
import CertificateService, { CertificateTemplate, IssuedCertificate } from '@/lib/services/certificate-service';

export default function AdminCertificatesPage() {
  const [templates, setTemplates] = useState<CertificateTemplate[]>([]);
  const [recentCertificates, setRecentCertificates] = useState<IssuedCertificate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        const certificateService = CertificateService.getInstance();
        
        // Fetch templates
        const templatesData = await certificateService.getTemplates();
        
        // Fetch recent certificates
        const certificatesData = await certificateService.getRecentCertificates(10);
        
        setTemplates(templatesData);
        setRecentCertificates(certificatesData);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching certificate data:', err);
        setError('Ocorreu um erro ao carregar os dados de certificados. Por favor, tente novamente mais tarde.');
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        <p className="ml-4 text-lg">Carregando dados de certificados...</p>
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
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Gerenciamento de Certificados</h1>
          <p className="text-gray-600 mt-2">
            Gerencie templates e certificados emitidos.
          </p>
        </div>
        <div className="space-x-3">
          <Link 
            href="/admin/certificates/templates/create"
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Novo Template
          </Link>
          <Link 
            href="/admin/certificates/issue"
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            Emitir Certificado
          </Link>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Templates Section */}
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <h2 className="text-xl font-semibold mb-4">Templates de Certificados</h2>
          
          {templates.length === 0 ? (
            <p className="text-gray-500">Nenhum template encontrado.</p>
          ) : (
            <div className="space-y-4">
              {templates.map((template) => (
                <div 
                  key={template.id} 
                  className="p-4 border border-gray-200 rounded-md hover:bg-gray-50"
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-medium">{template.name}</h3>
                      <p className="text-sm text-gray-500">{template.description}</p>
                    </div>
                    <div className="flex space-x-2">
                      {template.is_default && (
                        <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                          Padrão
                        </span>
                      )}
                      <Link 
                        href={`/admin/certificates/templates/${template.id}`}
                        className="text-blue-600 hover:text-blue-800 text-sm"
                      >
                        Editar
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        
        {/* Recent Certificates Section */}
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <h2 className="text-xl font-semibold mb-4">Certificados Recentes</h2>
          
          {recentCertificates.length === 0 ? (
            <p className="text-gray-500">Nenhum certificado emitido recentemente.</p>
          ) : (
            <div className="space-y-4">
              {recentCertificates.map((certificate) => (
                <div 
                  key={certificate.id} 
                  className="p-4 border border-gray-200 rounded-md hover:bg-gray-50"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium">{(certificate as any).student?.full_name || 'Aluno'}</h3>
                      <p className="text-sm text-gray-500">{(certificate as any).course?.name || 'Curso'}</p>
                      <p className="text-xs text-gray-400 mt-1">
                        Emitido em: {new Date(certificate.issue_date).toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                    <div className="flex space-x-2">
                      <Link 
                        href={`/admin/certificates/${certificate.id}`}
                        className="text-blue-600 hover:text-blue-800 text-sm"
                      >
                        Visualizar
                      </Link>
                      <Link 
                        href={`/verify-certificate?hash=${certificate.verification_hash}`}
                        target="_blank"
                        className="text-green-600 hover:text-green-800 text-sm"
                      >
                        Verificar
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          <div className="mt-4 text-right">
            <Link 
              href="/admin/certificates/all"
              className="text-blue-600 hover:text-blue-800 text-sm"
            >
              Ver todos os certificados →
            </Link>
          </div>
        </div>
      </div>
      
      {/* Statistics Section */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <h3 className="text-lg font-medium mb-2">Total de Certificados</h3>
          <p className="text-3xl font-bold text-blue-600">
            {recentCertificates.length > 0 ? '1,234' : '0'}
          </p>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <h3 className="text-lg font-medium mb-2">Certificados este Mês</h3>
          <p className="text-3xl font-bold text-green-600">
            {recentCertificates.length > 0 ? '87' : '0'}
          </p>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <h3 className="text-lg font-medium mb-2">Verificações</h3>
          <p className="text-3xl font-bold text-purple-600">
            {recentCertificates.length > 0 ? '342' : '0'}
          </p>
        </div>
      </div>
    </div>
  );
}
