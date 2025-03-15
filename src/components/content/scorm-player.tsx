'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';
import { Scorm12API, Scorm2004API } from 'scorm-again';

interface ScormPlayerProps {
  contentId: string;
  scormVersion: '1.2' | '2004';
  entryPoint: string;
  manifestUrl: string;
  userId: string;
  onComplete?: () => void;
}

const ScormPlayer: React.FC<ScormPlayerProps> = ({
  contentId,
  scormVersion,
  entryPoint,
  manifestUrl,
  userId,
  onComplete
}) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const scormAPIRef = useRef<Scorm12API | Scorm2004API | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
  );

  useEffect(() => {
    // Initialize SCORM API
    const initScormAPI = async () => {
      try {
        setIsLoading(true);
        
        // Create SCORM API instance based on version
        const API = scormVersion === '1.2' 
          ? new Scorm12API({
              autocommit: true,
              logLevel: process.env.NODE_ENV === 'development' ? 4 : 1
            })
          : new Scorm2004API({
              autocommit: true,
              logLevel: process.env.NODE_ENV === 'development' ? 4 : 1
            });
        
        // Initialize the API
        API.initialize('', '', true);
        
        // Store the API reference
        scormAPIRef.current = API;
        
        // Set up event listeners for SCORM tracking
        setupScormEventListeners(API);
        
        setIsLoading(false);
      } catch (err) {
        console.error('Error initializing SCORM API:', err);
        setError('Failed to initialize SCORM content. Please try again later.');
        setIsLoading(false);
      }
    };
    
    initScormAPI();
    
    // Cleanup function
    return () => {
      if (scormAPIRef.current) {
        // Save final state before unmounting
        try {
          scormAPIRef.current.terminate('', true);
        } catch (err) {
          console.error('Error terminating SCORM API:', err);
        }
      }
    };
  }, [contentId, scormVersion]);
  
  const setupScormEventListeners = (API: Scorm12API | Scorm2004API) => {
    // Listen for completion status changes
    API.on('LMSSetValue.cmi.core.lesson_status', async (value: string) => {
      if (value === 'completed' || value === 'passed') {
        await trackCompletion('completed');
        if (onComplete) onComplete();
      } else if (value === 'incomplete' || value === 'failed') {
        await trackCompletion('incomplete');
      }
    });
    
    // For SCORM 2004
    API.on('LMSSetValue.cmi.completion_status', async (value: string) => {
      if (value === 'completed') {
        await trackCompletion('completed');
        if (onComplete) onComplete();
      } else if (value === 'incomplete') {
        await trackCompletion('incomplete');
      }
    });
    
    // Track score
    API.on('LMSSetValue.cmi.core.score.raw', async (value: string) => {
      await trackScore(parseFloat(value));
    });
    
    // For SCORM 2004
    API.on('LMSSetValue.cmi.score.raw', async (value: string) => {
      await trackScore(parseFloat(value));
    });
  };
  
  const trackCompletion = async (status: 'not attempted' | 'incomplete' | 'completed') => {
    try {
      // Save to database
      const { error } = await supabase.from('scorm_tracking').upsert({
        user_id: userId,
        content_id: contentId,
        completion_status: status,
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'user_id,content_id'
      });
      
      if (error) {
        console.error('Error tracking SCORM completion:', error);
      }
      
      // Also update analytics
      await supabase.from('analytics.student_progress').upsert({
        user_id: userId,
        content_id: contentId,
        progress_percentage: status === 'completed' ? 100 : 
                             status === 'incomplete' ? 50 : 0,
        last_accessed: new Date().toISOString(),
        content_type: 'scorm'
      }, {
        onConflict: 'user_id,content_id'
      });
      
    } catch (err) {
      console.error('Error tracking completion:', err);
    }
  };
  
  const trackScore = async (score: number) => {
    try {
      // Save to database
      const { error } = await supabase.from('scorm_tracking').upsert({
        user_id: userId,
        content_id: contentId,
        score_raw: score,
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'user_id,content_id'
      });
      
      if (error) {
        console.error('Error tracking SCORM score:', error);
      }
    } catch (err) {
      console.error('Error tracking score:', err);
    }
  };
  
  // Handle iframe load event
  const handleIframeLoad = () => {
    if (iframeRef.current && scormAPIRef.current) {
      // Inject SCORM API into iframe
      const iframeWindow = iframeRef.current.contentWindow;
      if (iframeWindow) {
        if (scormVersion === '1.2') {
          // SCORM 1.2 API
          (iframeWindow as any).API = scormAPIRef.current;
        } else {
          // SCORM 2004 API
          (iframeWindow as any).API_1484_11 = scormAPIRef.current;
        }
      }
    }
  };

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center p-8 bg-red-50 rounded-lg">
        <p className="text-red-600 mb-4">{error}</p>
        <button 
          onClick={() => router.back()}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Go Back
        </button>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        <p className="ml-4 text-lg">Loading SCORM content...</p>
      </div>
    );
  }

  return (
    <div className="w-full h-full">
      <iframe
        ref={iframeRef}
        src={entryPoint}
        onLoad={handleIframeLoad}
        className="w-full h-[calc(100vh-200px)] min-h-[500px] border-0"
        title="SCORM Content"
        allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
        sandbox="allow-same-origin allow-scripts allow-forms allow-pointer-lock allow-popups allow-modals"
      />
    </div>
  );
};

export default ScormPlayer;
