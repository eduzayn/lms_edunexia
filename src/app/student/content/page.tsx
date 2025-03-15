'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@supabase/supabase-js';
import { ContentItem } from '../../../lib/services/content-editor-service';

export default function StudentContentListPage() {
  const router = useRouter();
  const [contents, setContents] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [, setUserId] = useState<string | null>(null);
  const [progress, setProgress] = useState<Record<string, number>>({});
  
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
  );
  
  useEffect(() => {
    const fetchContents = async () => {
      try {
        setLoading(true);
        
        // Get current user
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          setUserId(user.id);
        } else {
          // Redirect to login if not authenticated
          router.push('/login');
          return;
        }
        
        // Fetch all available content
        const { data, error } = await supabase
          .from('content')
          .select('*')
          .order('created_at', { ascending: false });
        
        if (error) {
          throw new Error(error.message);
        }
        
        setContents(data as ContentItem[]);
        
        // Fetch progress for all content
        const { data: progressData } = await supabase
          .from('analytics.student_progress')
          .select('content_id, progress_percentage')
          .eq('user_id', user.id);
        
        if (progressData) {
          const progressMap: Record<string, number> = {};
          progressData.forEach(item => {
            progressMap[item.content_id] = item.progress_percentage;
          });
          setProgress(progressMap);
        }
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching contents:', err);
        setError('Failed to load content. Please try again later.');
        setLoading(false);
      }
    };
    
    fetchContents();
  }, [router, supabase]);
  
  const getContentTypeIcon = (type: string) => {
    switch (type) {
      case 'text':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        );
      case 'video':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
        );
      case 'quiz':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case 'scorm':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
        );
      case 'lti':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
          </svg>
        );
      default:
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
          </svg>
        );
    }
  };
  
  const getProgressBadge = (contentId: string) => {
    const progressValue = progress[contentId] || 0;
    
    if (progressValue === 100) {
      return (
        <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
          Concluído
        </span>
      );
    } else if (progressValue > 0) {
      return (
        <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full">
          Em progresso ({progressValue}%)
        </span>
      );
    } else {
      return (
        <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded-full">
          Não iniciado
        </span>
      );
    }
  };
  
  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        <p className="ml-4 text-lg">Carregando conteúdo...</p>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center p-8 bg-red-50 rounded-lg">
        <p className="text-red-600 mb-4">{error}</p>
        <button 
          onClick={() => router.refresh()}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Tentar novamente
        </button>
      </div>
    );
  }
  
  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Conteúdo Disponível</h1>
          <p className="text-gray-600">Explore o conteúdo do curso</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {contents.map(content => (
          <div key={content.id} className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="p-4 border-b">
              <div className="flex justify-between items-start">
                <div className="flex items-center">
                  {getContentTypeIcon(content.type)}
                  <h3 className="text-lg font-semibold ml-2">{content.title}</h3>
                </div>
                {getProgressBadge(content.id)}
              </div>
            </div>
            
            <div className="p-4">
              <div className="flex justify-between text-sm mb-4">
                <span className="capitalize">{content.type}</span>
                <span>Atualizado: {new Date(content.updated_at).toLocaleDateString()}</span>
              </div>
              
              <Link 
                href={`/student/content/${content.id}`}
                className="block w-full text-center bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
              >
                {progress[content.id] ? 'Continuar' : 'Iniciar'}
              </Link>
            </div>
          </div>
        ))}
        
        {contents.length === 0 && (
          <div className="col-span-3 p-8 bg-gray-50 rounded-lg text-center">
            <p className="text-gray-600">Nenhum conteúdo disponível no momento.</p>
          </div>
        )}
      </div>
    </div>
  );
};
