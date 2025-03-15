'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';
// Using a more compatible approach without direct dependency on scorm-again
// Will implement a simplified SCORM API wrapper

interface ScormPlayerProps {
  contentId: string;
  scormVersion: '1.2' | '2004';
  entryPoint: string;
  manifestUrl: string;
  userId: string;
  onComplete?: () => void;
}

const ScormPlayer = ({
  contentId,
  scormVersion,
  entryPoint,
  manifestUrl,
  userId,
  onComplete
}: ScormPlayerProps) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const scormAPIRef = useRef<Record<string, unknown>>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
  );

  // Define tracking functions first
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
  
  // Define the setupScormEventListeners function
  const setupScormEventListeners = (API: Record<string, unknown>) => {
    // Type assertion to access methods
    const typedAPI = API as {
      on: (event: string, callback: (value: string) => void) => void;
    };
    
    // Listen for completion status changes
    typedAPI.on('LMSSetValue.cmi.core.lesson_status', async (value: string) => {
      if (value === 'completed' || value === 'passed') {
        await trackCompletion('completed');
        if (onComplete) onComplete();
      } else if (value === 'incomplete' || value === 'failed') {
        await trackCompletion('incomplete');
      }
    });
    
    // For SCORM 2004
    typedAPI.on('LMSSetValue.cmi.completion_status', async (value: string) => {
      if (value === 'completed') {
        await trackCompletion('completed');
        if (onComplete) onComplete();
      } else if (value === 'incomplete') {
        await trackCompletion('incomplete');
      }
    });
    
    // Track score
    typedAPI.on('LMSSetValue.cmi.core.score.raw', async (value: string) => {
      await trackScore(parseFloat(value));
    });
    
    // For SCORM 2004
    typedAPI.on('LMSSetValue.cmi.score.raw', async (value: string) => {
      await trackScore(parseFloat(value));
    });
  };
  
  useEffect(() => {
    // Initialize SCORM API
    const initScormAPI = async () => {
      try {
        setIsLoading(true);
        
        // Create a simplified SCORM API wrapper
        const createScormAPI = () => {
          // Basic SCORM data model
          const cmi = {
            core: {
              lesson_status: 'not attempted',
              score: {
                raw: 0
              }
            },
            completion_status: 'not attempted',
            success_status: 'unknown',
            score: {
              raw: 0,
              min: 0,
              max: 100,
              scaled: 0
            },
            suspend_data: '',
            time_tracked: 0
          };
          
          // Event listeners
          const listeners: Record<string, ((value: string) => void)[]> = {};
          
          // Basic SCORM API implementation
          const API = {
            // SCORM 1.2 methods
            LMSInitialize: () => 'true',
            LMSFinish: () => 'true',
            LMSGetValue: (element: string) => {
              console.log('LMSGetValue', element);
              if (element === 'cmi.core.lesson_status') return cmi.core.lesson_status;
              if (element === 'cmi.core.score.raw') return cmi.core.score.raw.toString();
              return '';
            },
            LMSSetValue: (element: string, value: string) => {
              console.log('LMSSetValue', element, value);
              if (element === 'cmi.core.lesson_status') {
                cmi.core.lesson_status = value;
                // Trigger event listeners
                if (listeners['LMSSetValue.cmi.core.lesson_status']) {
                  listeners['LMSSetValue.cmi.core.lesson_status'].forEach(callback => callback(value));
                }
              }
              if (element === 'cmi.core.score.raw') {
                cmi.core.score.raw = parseFloat(value);
                // Trigger event listeners
                if (listeners['LMSSetValue.cmi.core.score.raw']) {
                  listeners['LMSSetValue.cmi.core.score.raw'].forEach(callback => callback(value));
                }
              }
              return 'true';
            },
            LMSCommit: () => 'true',
            LMSGetLastError: () => '0',
            LMSGetErrorString: () => '',
            LMSGetDiagnostic: () => '',
            
            // SCORM 2004 methods
            Initialize: () => 'true',
            Terminate: () => 'true',
            GetValue: (element: string) => {
              console.log('GetValue', element);
              if (element === 'cmi.completion_status') return cmi.completion_status;
              if (element === 'cmi.success_status') return cmi.success_status;
              if (element === 'cmi.score.raw') return cmi.score.raw.toString();
              return '';
            },
            SetValue: (element: string, value: string) => {
              console.log('SetValue', element, value);
              if (element === 'cmi.completion_status') {
                cmi.completion_status = value;
                // Trigger event listeners
                if (listeners['LMSSetValue.cmi.completion_status']) {
                  listeners['LMSSetValue.cmi.completion_status'].forEach(callback => callback(value));
                }
              }
              if (element === 'cmi.score.raw') {
                cmi.score.raw = parseFloat(value);
                // Trigger event listeners
                if (listeners['LMSSetValue.cmi.score.raw']) {
                  listeners['LMSSetValue.cmi.score.raw'].forEach(callback => callback(value));
                }
              }
              return 'true';
            },
            Commit: () => 'true',
            GetLastError: () => '0',
            GetErrorString: () => '',
            GetDiagnostic: () => '',
            
            // Helper methods for our implementation
            on: (event: string, callback: (value: string) => void) => {
              if (!listeners[event]) {
                listeners[event] = [];
              }
              listeners[event].push(callback);
            },
            off: (event: string, callback: (value: string) => void) => {
              if (listeners[event]) {
                listeners[event] = listeners[event].filter(cb => cb !== callback);
              }
            },
            getCMI: () => cmi
          };
          
          return API;
        };
        
        // Create API based on SCORM version
        const API = createScormAPI();
        
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
      // No need to terminate our simplified API
    };
  }, [contentId, scormVersion]);
  
  // Handle iframe load event
  const handleIframeLoad = () => {
    if (iframeRef.current && scormAPIRef.current) {
      // Inject SCORM API into iframe
      const iframeWindow = iframeRef.current.contentWindow;
      if (iframeWindow) {
        if (scormVersion === '1.2') {
          // SCORM 1.2 API
          (iframeWindow as Window & typeof globalThis & { API: Record<string, unknown> }).API = scormAPIRef.current;
        } else {
          // SCORM 2004 API
          (iframeWindow as Window & typeof globalThis & { API_1484_11: Record<string, unknown> }).API_1484_11 = scormAPIRef.current;
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
