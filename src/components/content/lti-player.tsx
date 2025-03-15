'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';

interface LtiPlayerProps {
  contentId: string;
  launchUrl: string;
  clientId: string;
  deploymentId: string;
  platformId: string;
  userId: string;
  onComplete?: () => void;
}

const LtiPlayer: React.FC<LtiPlayerProps> = ({
  contentId,
  launchUrl,
  clientId,
  deploymentId,
  platformId,
  userId,
  onComplete
}) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sessionToken, setSessionToken] = useState<string | null>(null);
  const router = useRouter();
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
  );

  // Define handler functions before using them in useEffect
  const handleLtiCompletion = async (data: Record<string, unknown>) => {
    try {
      const status = data.status === 'completed' ? 'completed' : 
                     data.status === 'incomplete' ? 'incomplete' : 'not attempted';
      
      // Save to database
      const { error } = await supabase.from('lti_progress').upsert({
        user_id: userId,
        content_id: contentId,
        completion_status: status,
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'user_id,content_id'
      });
      
      if (error) {
        console.error('Error tracking LTI completion:', error);
      }
      
      // Also update analytics
      await supabase.from('analytics.student_progress').upsert({
        user_id: userId,
        content_id: contentId,
        progress_percentage: status === 'completed' ? 100 : 
                             status === 'incomplete' ? 50 : 0,
        last_accessed: new Date().toISOString(),
        content_type: 'lti'
      }, {
        onConflict: 'user_id,content_id'
      });
      
      if (status === 'completed' && onComplete) {
        onComplete();
      }
    } catch (err) {
      console.error('Error handling LTI completion:', err);
    }
  };
  
  const handleLtiScore = async (data: Record<string, unknown>) => {
    try {
      if (typeof data.score !== 'number') {
        return;
      }
      
      // Save to database
      const { error } = await supabase.from('lti_progress').upsert({
        user_id: userId,
        content_id: contentId,
        score: data.score,
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'user_id,content_id'
      });
      
      if (error) {
        console.error('Error tracking LTI score:', error);
      }
    } catch (err) {
      console.error('Error handling LTI score:', err);
    }
  };
  
  useEffect(() => {
    // Initialize LTI session
    const initLtiSession = async () => {
      try {
        setIsLoading(true);
        
        // Create LTI session
        const { data, error } = await supabase.rpc('create_lti_session', {
          p_user_id: userId,
          p_content_id: contentId,
          p_client_id: clientId,
          p_deployment_id: deploymentId
        });
        
        if (error) {
          throw new Error(error.message);
        }
        
        if (data && data.session_token) {
          setSessionToken(data.session_token);
        } else {
          throw new Error('Failed to create LTI session');
        }
        
        setIsLoading(false);
      } catch (err) {
        console.error('Error initializing LTI session:', err);
        setError('Failed to initialize LTI content. Please try again later.');
        setIsLoading(false);
      }
    };
    
    initLtiSession();
    
    // Set up message event listener for LTI communication
    const handleLtiMessage = (event: MessageEvent) => {
      // Verify origin for security
      const allowedOrigins = [new URL(launchUrl).origin];
      if (!allowedOrigins.includes(event.origin)) {
        return;
      }
      
      // Handle LTI messages
      if (event.data && typeof event.data === 'object') {
        const eventData = event.data as Record<string, unknown>;
        if (eventData.subject === 'lti.completion') {
          handleLtiCompletion(eventData);
        } else if (eventData.subject === 'lti.score') {
          handleLtiScore(eventData);
        }
      }
    };
    
    window.addEventListener('message', handleLtiMessage);
    
    // Cleanup function
    return () => {
      window.removeEventListener('message', handleLtiMessage);
    };
  // handleLtiCompletion and handleLtiScore are now defined above the useEffect

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

  if (isLoading || !sessionToken) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        <p className="ml-4 text-lg">Loading LTI content...</p>
      </div>
    );
  }

  // Construct the LTI launch URL with session token
  const fullLaunchUrl = `${launchUrl}?token=${sessionToken}&platform=${encodeURIComponent(platformId)}`;

  return (
    <div className="w-full h-full">
      <iframe
        ref={iframeRef}
        src={fullLaunchUrl}
        className="w-full h-[calc(100vh-200px)] min-h-[500px] border-0"
        title="LTI Content"
        allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
        sandbox="allow-same-origin allow-scripts allow-forms allow-pointer-lock allow-popups allow-modals"
      />
    </div>
  );
};

export default LtiPlayer;
