'use client';

import React from 'react';
import { ContentItem } from '@/lib/services/content-editor-service';
import ScormPlayer from './scorm-player';
import LtiPlayer from './lti-player';

interface ContentPreviewProps {
  content: ContentItem;
  userId: string;
  onComplete?: () => void;
}

const ContentPreview: React.FC<ContentPreviewProps> = ({
  content,
  userId,
  onComplete
}) => {
  if (!content) {
    return <div>No content to display</div>;
  }
  
  return (
    <div className="w-full">
      {content.type === 'text' && (
        <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: content.content }} />
      )}
      
      {content.type === 'video' && (
        <div className="aspect-video">
          <iframe 
            src={content.content} 
            className="w-full h-full" 
            allowFullScreen
            title={content.title}
          />
        </div>
      )}
      
      {content.type === 'quiz' && (
        <div className="p-4 bg-yellow-50 rounded-md">
          <p className="text-lg font-medium">Quiz Preview</p>
          <p>Quiz content would be displayed here.</p>
        </div>
      )}
      
      {content.type === 'scorm' && content.metadata?.scorm && (
        <ScormPlayer
          contentId={content.id}
          scormVersion={content.metadata.scorm.version}
          entryPoint={content.metadata.scorm.entryPoint}
          manifestUrl={content.metadata.scorm.manifestUrl}
          userId={userId}
          onComplete={onComplete}
        />
      )}
      
      {content.type === 'lti' && content.metadata?.lti && (
        <LtiPlayer
          contentId={content.id}
          launchUrl={content.metadata.lti.launchUrl}
          clientId={content.metadata.lti.clientId}
          deploymentId={content.metadata.lti.deploymentId}
          platformId={content.metadata.lti.platformId}
          userId={userId}
          onComplete={onComplete}
        />
      )}
    </div>
  );
};

export default ContentPreview;
