'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';
import { ContentItem } from '@/lib/services/content-editor-service';
import ContentPreview from '@/components/content/content-preview';

export default function ContentPreviewPage() {
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
        setLoading(false);
      } catch (err) {
        console.error('Error fetching content:', err);
        setError('Failed to load content. Please try again later.');
        setLoading(false);
      }
    };
    
    fetchContent();
  }, [params.id]);
  
  const handleContentComplete = async () => {
    // Update analytics
    if (userId && content) {
      await supabase.from('analytics.student_progress').upsert({
        user_id: userId,
        content_id: content.id,
        progress_percentage: 100,
        last_accessed: new Date().toISOString(),
        content_type: content.type
      }, {
        onConflict: 'user_id,content_id'
      });
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
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">{content.title}</h1>
          <p className="text-muted-foreground">Visualização de conteúdo</p>
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
    </div>
  );
}
