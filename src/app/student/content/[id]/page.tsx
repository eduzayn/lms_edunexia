'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';
import { ContentItem } from '../../../../lib/services/content-editor-service';
import ContentPreview from '../../../../components/content/content-preview';

export default function StudentContentPage() {
  const params = useParams();
  const router = useRouter();
  const [content, setContent] = useState<ContentItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
  );
  
  useEffect(() => {
    const fetchContent = async () => {
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
        
        // Fetch content
        const { data, error } = await supabase
          .from('content')
          .select('*')
          .eq('id', params.id)
          .single();
        
        if (error) {
          throw new Error(error.message);
        }
        
        setContent(data as ContentItem);
        
        // Track content view
        await supabase.from('analytics.content_views').insert({
          user_id: user.id,
          content_id: params.id,
          viewed_at: new Date().toISOString()
        });
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching content:', err);
        setError('Failed to load content. Please try again later.');
        setLoading(false);
      }
    };
    
    fetchContent();
  }, [params.id, router, supabase]);
  
  const handleContentComplete = async () => {
    // Update progress tracking
    if (userId && content) {
      try {
        // Update student progress
        await supabase.from('analytics.student_progress').upsert({
          user_id: userId,
          content_id: content.id,
          progress_percentage: 100,
          last_accessed: new Date().toISOString(),
          content_type: content.type,
          completed_at: new Date().toISOString()
        }, {
          onConflict: 'user_id,content_id'
        });
        
        // If content is part of a lesson, check if lesson is complete
        if (content.lesson_id) {
          // Get all content for this lesson
          const { data: lessonContent } = await supabase
            .from('content')
            .select('id')
            .eq('lesson_id', content.lesson_id);
          
          // Get completed content for this lesson
          const { data: completedContent } = await supabase
            .from('analytics.student_progress')
            .select('content_id')
            .eq('user_id', userId)
            .eq('progress_percentage', 100)
            .in('content_id', lessonContent?.map(c => c.id) || []);
          
          // If all content is complete, mark lesson as complete
          if (lessonContent && completedContent && lessonContent.length === completedContent.length) {
            await supabase.from('analytics.lesson_progress').upsert({
              user_id: userId,
              lesson_id: content.lesson_id,
              completed_at: new Date().toISOString(),
              progress_percentage: 100
            }, {
              onConflict: 'user_id,lesson_id'
            });
          }
        }
      } catch (err) {
        console.error('Error updating progress:', err);
      }
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
  
  if (error || !content) {
    return (
      <div className="flex flex-col items-center justify-center p-8 bg-red-50 rounded-lg">
        <p className="text-red-600 mb-4">{error || 'Conteúdo não encontrado'}</p>
        <button 
          onClick={() => router.back()}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Voltar
        </button>
      </div>
    );
  }
  
  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">{content.title}</h1>
          {content.course_id && (
            <p className="text-gray-600">
              Curso: {content.course_id}
            </p>
          )}
        </div>
        <button 
          onClick={() => router.back()}
          className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md"
        >
          Voltar
        </button>
      </div>
      
      <div className="bg-white rounded-lg shadow-sm p-6">
        {userId && (
          <ContentPreview 
            content={content} 
            userId={userId} 
            onComplete={handleContentComplete} 
          />
        )}
      </div>
      
      <div className="mt-8 flex justify-between">
        <button 
          className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md"
          onClick={() => router.back()}
        >
          Voltar
        </button>
        
        <button 
          className="bg-blue-600 text-white px-4 py-2 rounded-md"
          onClick={handleContentComplete}
        >
          Marcar como Concluído
        </button>
      </div>
    </div>
  );
};
