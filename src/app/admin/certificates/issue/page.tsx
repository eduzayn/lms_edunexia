'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@supabase/supabase-js';
import CertificateService, { CertificateTemplate } from '@/lib/services/certificate-service';

interface Course {
  id: string;
  name: string;
}

interface Student {
  id: string;
  full_name: string;
  email: string;
}

export default function IssueCertificatePage() {
  const router = useRouter();
  const [courses, setCourses] = useState<Course[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [templates, setTemplates] = useState<CertificateTemplate[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<string>('');
  const [selectedStudent, setSelectedStudent] = useState<string>('');
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');
  const [metadata, setMetadata] = useState<Record<string, any>>({
    course_hours: '',
    signatory_name: '',
    signatory_title: '',
  });
  const [loading, setLoading] = useState(true);
  const [issuing, setIssuing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
  );
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch courses
        const { data: coursesData, error: coursesError } = await supabase
          .from('courses')
          .select('id, name')
          .order('name');
        
        if (coursesError) throw coursesError;
        
        // Fetch students
        const { data: studentsData, error: studentsError } = await supabase
          .from('profiles')
          .select('id, full_name, email')
          .eq('role', 'student')
          .order('full_name');
        
        if (studentsError) throw studentsError;
        
        // Fetch certificate templates
        const certificateService = CertificateService.getInstance();
        const templatesData = await certificateService.getTemplates();
        
        setCourses(coursesData || []);
        setStudents(studentsData || []);
        setTemplates(templatesData);
        
        // Set default template if available
        const defaultTemplate = templatesData.find(t => t.is_default);
        if (defaultTemplate) {
          setSelectedTemplate(defaultTemplate.id || '');
        }
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Ocorreu um erro ao carregar os dados. Por favor, tente novamente mais tarde.');
        setLoading(false);
      }
    };
    
    fetchData();
  }, [supabase]);
  
  const handleMetadataChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setMetadata(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedCourse || !selectedStudent) {
      setError('Por favor, selecione um curso e um aluno.');
      return;
    }
    
    try {
      setIssuing(true);
      setError(null);
      
      const certificateService = CertificateService.getInstance();
      
      // Issue certificate
      const certificate = await certificateService.issueCertificate(
        selectedStudent,
        selectedCourse,
        selectedTemplate || undefined,
        metadata
      );
      
      setSuccess(`Certificado emitido com sucesso! Número: ${certificate.certificate_number}`);
      setIssuing(false);
      
      // Redirect after 2 seconds
      setTimeout(() => {
        router.push(`/admin/certificates/${certificate.id}`);
      }, 2000);
    } catch (err) {
      console.error('Error issuing certificate:', err);
      setError('Ocorreu um erro ao emitir o certificado. Por favor, tente novamente mais tarde.');
      setIssuing(false);
    }
  };
  
  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        <p className="ml-4 text-lg">Carregando dados...</p>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Emitir Certificado</h1>
          <p className="text-gray-600 mt-2">
            Emita um certificado de conclusão para um aluno.
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
      
      {success && (
        <div className="p-4 bg-green-50 rounded-lg mb-6">
          <p className="text-green-600">{success}</p>
        </div>
      )}
      
      <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="course" className="block text-sm font-medium text-gray-700">
                Curso
              </label>
              <select
                id="course"
                value={selectedCourse}
                onChange={(e) => setSelectedCourse(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              >
                <option value="">Selecione um curso</option>
                {courses.map((course) => (
                  <option key={course.id} value={course.id}>
                    {course.name}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label htmlFor="student" className="block text-sm font-medium text-gray-700">
                Aluno
              </label>
              <select
                id="student"
                value={selectedStudent}
                onChange={(e) => setSelectedStudent(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              >
                <option value="">Selecione um aluno</option>
                {students.map((student) => (
                  <option key={student.id} value={student.id}>
                    {student.full_name} ({student.email})
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label htmlFor="template" className="block text-sm font-medium text-gray-700">
                Template de Certificado
              </label>
              <select
                id="template"
                value={selectedTemplate}
                onChange={(e) => setSelectedTemplate(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="">Template Padrão</option>
                {templates.map((template) => (
                  <option key={template.id} value={template.id || ''}>
                    {template.name} {template.is_default ? '(Padrão)' : ''}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label htmlFor="course_hours" className="block text-sm font-medium text-gray-700">
                Carga Horária (horas)
              </label>
              <input
                type="text"
                id="course_hours"
                name="course_hours"
                value={metadata.course_hours}
                onChange={handleMetadataChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            
            <div>
              <label htmlFor="signatory_name" className="block text-sm font-medium text-gray-700">
                Nome do Signatário
              </label>
              <input
                type="text"
                id="signatory_name"
                name="signatory_name"
                value={metadata.signatory_name}
                onChange={handleMetadataChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            
            <div>
              <label htmlFor="signatory_title" className="block text-sm font-medium text-gray-700">
                Cargo do Signatário
              </label>
              <input
                type="text"
                id="signatory_title"
                name="signatory_title"
                value={metadata.signatory_title}
                onChange={handleMetadataChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
          </div>
          
          <div className="flex justify-end space-x-3">
            <Link 
              href="/admin/certificates"
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Cancelar
            </Link>
            <button
              type="submit"
              disabled={issuing}
              className={`px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                issuing ? 'opacity-75 cursor-not-allowed' : ''
              }`}
            >
              {issuing ? 'Emitindo...' : 'Emitir Certificado'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
