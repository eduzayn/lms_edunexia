'use client';

import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import CertificateService, { CertificateTemplate } from '@/lib/services/certificate-service';

interface CertificateTemplateEditorProps {
  templateId?: string;
  onSave: (template: CertificateTemplate) => void;
  onCancel: () => void;
}

const CertificateTemplateEditor: React.FC<CertificateTemplateEditorProps> = ({
  templateId,
  onSave,
  onCancel
}) => {
  const [template, setTemplate] = useState<Partial<CertificateTemplate>>({
    name: '',
    description: '',
    html_template: '',
    css_style: '',
    background_image_url: '',
    is_default: false
  });
  
  const [loading, setLoading] = useState(templateId ? true : false);
  const [error, setError] = useState<string | null>(null);
  const [previewHtml, setPreviewHtml] = useState<string>('');
  
  useEffect(() => {
    const fetchTemplate = async () => {
      if (!templateId) return;
      
      try {
        setLoading(true);
        
        const certificateService = CertificateService.getInstance();
        const data = await certificateService.getTemplate(templateId);
        
        if (data) {
          setTemplate(data);
          updatePreview(data.html_template);
        }
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching template:', err);
        setError('Não foi possível carregar o template. Por favor, tente novamente mais tarde.');
        setLoading(false);
      }
    };
    
    fetchTemplate();
  }, [templateId]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setTemplate(prev => ({ ...prev, [name]: checked }));
    } else {
      setTemplate(prev => ({ ...prev, [name]: value }));
      
      if (name === 'html_template') {
        updatePreview(value);
      }
    }
  };
  
  const updatePreview = (html: string) => {
    // Replace placeholders with sample data
    let preview = html;
    preview = preview.replace(/{{student_name}}/g, 'João da Silva');
    preview = preview.replace(/{{course_name}}/g, 'Desenvolvimento Web Avançado');
    preview = preview.replace(/{{course_hours}}/g, '40');
    preview = preview.replace(/{{completion_date}}/g, new Date().toLocaleDateString('pt-BR'));
    preview = preview.replace(/{{certificate_number}}/g, 'CERT-123456-7890');
    preview = preview.replace(/{{verification_url}}/g, 'https://edunexia.com/verify/abc123');
    preview = preview.replace(/{{logo_url}}/g, 'https://via.placeholder.com/150');
    preview = preview.replace(/{{signature_url}}/g, 'https://via.placeholder.com/200x100');
    preview = preview.replace(/{{signatory_name}}/g, 'Prof. Maria Oliveira');
    preview = preview.replace(/{{signatory_title}}/g, 'Diretora Acadêmica');
    
    setPreviewHtml(preview);
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const certificateService = CertificateService.getInstance();
      let savedTemplate;
      
      if (templateId) {
        savedTemplate = await certificateService.updateTemplate(templateId, template);
      } else {
        savedTemplate = await certificateService.createTemplate(template);
      }
      
      if (savedTemplate) {
        onSave(savedTemplate);
      } else {
        setError('Falha ao salvar o template. Por favor, tente novamente.');
      }
    } catch (err) {
      console.error('Error saving template:', err);
      setError('Ocorreu um erro ao salvar o template. Por favor, tente novamente mais tarde.');
    }
  };
  
  if (loading) {
    return (
      <div className="flex items-center justify-center h-48">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
        <p className="ml-4">Carregando template...</p>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      {error && (
        <div className="p-4 bg-red-50 rounded-lg">
          <p className="text-red-600">{error}</p>
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Nome do Template
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={template.name || ''}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>
            
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                Descrição
              </label>
              <textarea
                id="description"
                name="description"
                value={template.description || ''}
                onChange={handleChange}
                rows={3}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            
            <div>
              <label htmlFor="background_image_url" className="block text-sm font-medium text-gray-700">
                URL da Imagem de Fundo
              </label>
              <input
                type="text"
                id="background_image_url"
                name="background_image_url"
                value={template.background_image_url || ''}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            
            <div className="flex items-center">
              <input
                type="checkbox"
                id="is_default"
                name="is_default"
                checked={template.is_default || false}
                onChange={handleChange}
                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <label htmlFor="is_default" className="ml-2 block text-sm text-gray-700">
                Definir como Template Padrão
              </label>
            </div>
          </div>
          
          <div className="space-y-4">
            <div>
              <label htmlFor="html_template" className="block text-sm font-medium text-gray-700">
                HTML Template
              </label>
              <textarea
                id="html_template"
                name="html_template"
                value={template.html_template || ''}
                onChange={handleChange}
                rows={10}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 font-mono text-sm"
                required
              />
              <p className="mt-1 text-sm text-gray-500">
                Use {{student_name}}, {{course_name}}, {{course_hours}}, etc. como placeholders.
              </p>
            </div>
            
            <div>
              <label htmlFor="css_style" className="block text-sm font-medium text-gray-700">
                CSS Style
              </label>
              <textarea
                id="css_style"
                name="css_style"
                value={template.css_style || ''}
                onChange={handleChange}
                rows={10}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 font-mono text-sm"
              />
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-200 pt-6">
          <h3 className="text-lg font-medium">Pré-visualização</h3>
          <div className="mt-4 p-4 border border-gray-300 rounded-md">
            <style dangerouslySetInnerHTML={{ __html: template.css_style || '' }} />
            <div dangerouslySetInnerHTML={{ __html: previewHtml }} />
          </div>
        </div>
        
        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Salvar Template
          </button>
        </div>
      </form>
    </div>
  );
};

export default CertificateTemplateEditor;
