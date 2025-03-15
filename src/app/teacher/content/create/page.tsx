'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import ContentTypeSelector from '@/components/content/content-type-selector';
// These components will be implemented later
// import TextEditor from '@/components/content/text-editor';
// import VideoUploader from '@/components/content/video-uploader';
// import QuizEditor from '@/components/content/quiz-editor';
import ScormLtiEditor from '@/components/content/scorm-lti-editor';
import { ContentItem } from '@/lib/services/content-editor-service';

export default function CreateContentPage() {
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const router = useRouter();
  
  const handleContentSave = (contentItem: ContentItem) => {
    // After saving, redirect to content list
    router.push('/teacher/content');
  };
  
  const handleCancel = () => {
    router.push('/teacher/content');
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Criar Novo Conteúdo</h1>
          <p className="text-muted-foreground">Selecione o tipo de conteúdo que deseja criar</p>
        </div>
        <Link 
          href="/teacher/content" 
          className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md"
        >
          Voltar
        </Link>
      </div>
      
      {!selectedType ? (
        <ContentTypeSelector onSelect={setSelectedType} />
      ) : (
        <div className="mt-6">
          {selectedType === 'text' && (
            <div className="p-4 bg-gray-100 rounded">
              <p>Text Editor component will be implemented here</p>
            </div>
          )}
          
          {selectedType === 'video' && (
            <div className="p-4 bg-gray-100 rounded">
              <p>Video Uploader component will be implemented here</p>
            </div>
          )}
          
          {selectedType === 'quiz' && (
            <div className="p-4 bg-gray-100 rounded">
              <p>Quiz Editor component will be implemented here</p>
            </div>
          )}
          
          {(selectedType === 'scorm' || selectedType === 'lti') && (
            <ScormLtiEditor 
              onSave={handleContentSave} 
              onCancel={handleCancel}
            />
          )}
        </div>
      )}
    </div>
  );
}
