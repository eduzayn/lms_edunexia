'use client';

import React from 'react';

interface ContentTypeSelectorProps {
  onSelect: (type: string) => void;
}

const ContentTypeSelector: React.FC<ContentTypeSelectorProps> = ({ onSelect }) => {
  const contentTypes = [
    {
      id: 'text',
      title: 'Texto',
      description: 'Criar conteúdo textual com formatação rica',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
      color: 'bg-blue-100'
    },
    {
      id: 'video',
      title: 'Vídeo',
      description: 'Fazer upload ou incorporar vídeos',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
        </svg>
      ),
      color: 'bg-purple-100'
    },
    {
      id: 'quiz',
      title: 'Quiz',
      description: 'Criar questionários interativos',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      color: 'bg-green-100'
    },
    {
      id: 'scorm',
      title: 'SCORM',
      description: 'Importar pacotes SCORM 1.2 ou 2004',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
      ),
      color: 'bg-orange-100'
    },
    {
      id: 'lti',
      title: 'LTI',
      description: 'Integrar ferramentas externas via LTI 1.3',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
        </svg>
      ),
      color: 'bg-indigo-100'
    }
  ];
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {contentTypes.map((type) => (
        <div 
          key={type.id}
          className={`${type.color} rounded-lg p-6 cursor-pointer hover:shadow-md transition-shadow`}
          onClick={() => onSelect(type.id)}
        >
          <div className="flex flex-col items-center text-center">
            {type.icon}
            <h3 className="mt-4 text-xl font-semibold">{type.title}</h3>
            <p className="mt-2 text-gray-600">{type.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ContentTypeSelector;
