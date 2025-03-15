'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';
import { ContentItem } from '@/lib/services/content-editor-service';
import TextEditor from '@/components/content/text-editor';
import VideoUploader from '@/components/content/video-uploader';
import QuizEditor from '@/components/content/quiz-editor';
import ScormLtiEditor from '@/components/content/scorm-lti-editor';

export default function EditContentPage() {
  const params = useParams();
  const router = useRouter();
  const [content, setContent] = useState<ContentItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
  );
  
  useEffect(() => {
    const fetchContent = async () => {
      try {
        setLoading(true);
        
        const { data, error } = await supabase
          .from('content')
          .select('*')
          .eq('id', params.id)
          .single();
        
        if (error) {
          throw new Error(error.message);
        }
        
        setContent(data as ContentItem);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching content:', err);
        setError('Failed to load content. Please try again later.');
        setLoading(false);
      }
    };
    
    fetchContent();
  }, [params.id]);
  
  const handleContentSave = async (updatedContent: ContentItem) => {
    try {
      const { error } = await supabase
        .from('content')
        .update({
          title: updatedContent.title,
          content: updatedContent.content,
          type: updatedContent.type,
          metadata: updatedContent.metadata,
          updated_at: new Date().toISOString()
        })
        .eq('id', params.id);
      
      if (error) {
        throw new Error(error.message);
      }
      
      router.push('/teacher/content');
    } catch (err) {
      console.error('Error updating content:', err);
      setError('Failed to update content. Please try again later.');
    }
  };
  
  const handleCancel = () => {
    router.push('/teacher/content');
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
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Editar Conteúdo</h1>
          <p className="text-muted-foreground">{content.title}</p>
        </div>
        <button 
          onClick={handleCancel}
          className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md"
        >
          Cancelar
        </button>
      </div>
      
      <div>
        {content.type === 'text' && (
          <TextEditor 
            initialContent={content} 
            onSave={handleContentSave} 
            onCancel={handleCancel} 
          />
        )}
        
        {content.type === 'video' && (
          <VideoUploader 
            initialContent={content} 
            onSave={handleContentSave} 
            onCancel={handleCancel} 
          />
        )}
        
        {content.type === 'quiz' && (
          <QuizEditor 
            initialContent={content} 
            onSave={handleContentSave} 
            onCancel={handleCancel} 
          />
        )}
        
        {(content.type === 'scorm' || content.type === 'lti') && (
          <ScormLtiEditor 
            initialContent={content} 
            contentId={content.id}
            courseId={content.course_id}
            lessonId={content.lesson_id}
            onSave={handleContentSave} 
            onCancel={handleCancel} 
          />
        )}
      </div>
    </div>
  );
}
