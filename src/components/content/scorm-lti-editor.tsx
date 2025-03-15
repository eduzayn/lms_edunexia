'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';
import { ContentItem } from '../../lib/services/content-editor-service';


interface ScormLtiEditorProps {
  contentId?: string;
  courseId?: string;
  lessonId?: string;
  onSave?: (content: ContentItem) => void;
  onCancel?: () => void;
  initialContent?: ContentItem;
}

const ScormLtiEditor: React.FC<ScormLtiEditorProps> = ({
  contentId,
  courseId,
  lessonId,
  onSave,
  onCancel,
  initialContent
}) => {
  const [activeTab, setActiveTab] = useState<'scorm' | 'lti'>('scorm');
  const [title, setTitle] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  // SCORM specific state
  const [scormVersion, setScormVersion] = useState<'1.2' | '2004'>('1.2');
  const [scormPackage, setScormPackage] = useState<File | null>(null);
  const [scormPackageUrl, setScormPackageUrl] = useState('');
  const [scormManifestUrl, setScormManifestUrl] = useState('');
  const [scormEntryPoint, setScormEntryPoint] = useState('');
  
  // LTI specific state
  const [ltiVersion, setLtiVersion] = useState<'1.3'>('1.3');
  const [ltiLaunchUrl, setLtiLaunchUrl] = useState('');
  const [ltiClientId, setLtiClientId] = useState('');
  const [ltiDeploymentId, setLtiDeploymentId] = useState('');
  const [ltiPlatformId, setLtiPlatformId] = useState('');
  
  const router = useRouter();
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
  );
  
  useEffect(() => {
    if (initialContent) {
      setTitle(initialContent.title);
      
      if (initialContent.type === 'scorm' && initialContent.metadata?.scorm) {
        setActiveTab('scorm');
        setScormVersion(initialContent.metadata.scorm.version);
        setScormManifestUrl(initialContent.metadata.scorm.manifestUrl);
        setScormEntryPoint(initialContent.metadata.scorm.entryPoint);
      } else if (initialContent.type === 'lti' && initialContent.metadata?.lti) {
        setActiveTab('lti');
        setLtiVersion(initialContent.metadata.lti.version);
        setLtiLaunchUrl(initialContent.metadata.lti.launchUrl);
        setLtiClientId(initialContent.metadata.lti.clientId);
        setLtiDeploymentId(initialContent.metadata.lti.deploymentId);
        setLtiPlatformId(initialContent.metadata.lti.platformId);
      }
    }
  }, [initialContent]);
  
  const handleScormPackageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setScormPackage(file);
    
    // Upload the SCORM package
    try {
      setIsLoading(true);
      setError(null);
      
      const fileName = `scorm/${Date.now()}_${file.name}`;
      const { data, error } = await supabase.storage
        .from('content')
        .upload(fileName, file);
      
      if (error) {
        throw new Error(`Failed to upload SCORM package: ${error.message}`);
      }
      
      // Get the public URL
      const { data: urlData } = await supabase.storage
        .from('content')
        .getPublicUrl(fileName);
      
      if (urlData) {
        setScormPackageUrl(urlData.publicUrl);
        
        // For simplicity, we'll use the same URL for manifest and entry point
        // In a real implementation, you would extract these from the SCORM package
        const baseUrl = urlData.publicUrl.substring(0, urlData.publicUrl.lastIndexOf('/'));
        setScormManifestUrl(`${baseUrl}/imsmanifest.xml`);
        setScormEntryPoint(`${baseUrl}/index.html`);
      }
      
      setSuccess('SCORM package uploaded successfully');
      setIsLoading(false);
    } catch (err) {
      console.error('Error uploading SCORM package:', err);
      setError(err instanceof Error ? err.message : 'Failed to upload SCORM package');
      setIsLoading(false);
    }
  };
  
  const handleSave = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      if (!title) {
        throw new Error('Title is required');
      }
      
      let contentType: 'scorm' | 'lti' = activeTab;
      let metadata: any = {};
      
      if (activeTab === 'scorm') {
        if (!scormManifestUrl || !scormEntryPoint) {
          throw new Error('SCORM package is required');
        }
        
        metadata = {
          scorm: {
            version: scormVersion,
            manifestUrl: scormManifestUrl,
            entryPoint: scormEntryPoint,
            packageUrl: scormPackageUrl
          }
        };
      } else if (activeTab === 'lti') {
        if (!ltiLaunchUrl || !ltiClientId) {
          throw new Error('LTI launch URL and client ID are required');
        }
        
        metadata = {
          lti: {
            version: ltiVersion,
            launchUrl: ltiLaunchUrl,
            clientId: ltiClientId,
            deploymentId: ltiDeploymentId,
            platformId: ltiPlatformId
          }
        };
      }
      
      const content: ContentItem = {
        id: contentId || crypto.randomUUID(),
        title,
        content: '',
        type: contentType,
        course_id: courseId,
        lesson_id: lessonId,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        metadata
      };
      
      if (onSave) {
        onSave(content);
      } else {
        // Save directly to database if no onSave callback
        const { error } = await supabase
          .from('content')
          .upsert({
            id: content.id,
            title: content.title,
            content: content.content,
            type: content.type,
            course_id: content.course_id,
            lesson_id: content.lesson_id,
            metadata: content.metadata,
            created_at: content.created_at,
            updated_at: content.updated_at
          });
        
        if (error) {
          throw new Error(`Failed to save content: ${error.message}`);
        }
        
        // Redirect to content page
        router.push(`/teacher/content`);
      }
      
      setSuccess('Content saved successfully');
      setIsLoading(false);
    } catch (err) {
      console.error('Error saving content:', err);
      setError(err instanceof Error ? err.message : 'Failed to save content');
      setIsLoading(false);
    }
  };
  
  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="border rounded-lg shadow-sm p-6">
        <div className="mb-6">
          <h2 className="text-2xl font-bold">{contentId ? 'Edit' : 'Create'} Learning Technology Content</h2>
          <p className="text-gray-500">
            Add SCORM packages or LTI tools to your course
          </p>
        </div>
        
        <div className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="title" className="block text-sm font-medium">Title</label>
            <input
              id="title"
              className="w-full px-3 py-2 border rounded-md"
              placeholder="Enter a title for this content"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          
          <div className="border-b mb-4">
            <div className="flex space-x-4">
              <button
                className={`pb-2 px-1 ${activeTab === 'scorm' ? 'border-b-2 border-blue-500 font-medium' : 'text-gray-500'}`}
                onClick={() => setActiveTab('scorm')}
              >
                SCORM Package
              </button>
              <button
                className={`pb-2 px-1 ${activeTab === 'lti' ? 'border-b-2 border-blue-500 font-medium' : 'text-gray-500'}`}
                onClick={() => setActiveTab('lti')}
              >
                LTI Tool
              </button>
            </div>
          </div>
          
          {activeTab === 'scorm' && (
            <div className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="scorm-version" className="block text-sm font-medium">SCORM Version</label>
                <select
                  id="scorm-version"
                  className="w-full px-3 py-2 border rounded-md"
                  value={scormVersion}
                  onChange={(e) => setScormVersion(e.target.value as '1.2' | '2004')}
                >
                  <option value="1.2">SCORM 1.2</option>
                  <option value="2004">SCORM 2004</option>
                </select>
              </div>
              
              <div className="space-y-2">
                <label htmlFor="scorm-package" className="block text-sm font-medium">SCORM Package (.zip)</label>
                <div className="flex items-center gap-2">
                  <input
                    id="scorm-package"
                    type="file"
                    accept=".zip"
                    onChange={handleScormPackageUpload}
                    disabled={isLoading}
                    className="w-full px-3 py-2 border rounded-md"
                  />
                  {isLoading && <span>Loading...</span>}
                  {scormPackageUrl && <span className="text-green-500">✓</span>}
                </div>
              </div>
              
              <div className="space-y-2">
                <label htmlFor="scorm-entry-point" className="block text-sm font-medium">Entry Point URL</label>
                <input
                  id="scorm-entry-point"
                  className="w-full px-3 py-2 border rounded-md"
                  placeholder="URL to the main HTML file"
                  value={scormEntryPoint}
                  onChange={(e) => setScormEntryPoint(e.target.value)}
                />
                <p className="text-sm text-gray-500">
                  This is typically index.html or launch.html in the SCORM package
                </p>
              </div>
            </div>
          )}
          
          {activeTab === 'lti' && (
            <div className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="lti-version" className="block text-sm font-medium">LTI Version</label>
                <select
                  id="lti-version"
                  className="w-full px-3 py-2 border rounded-md"
                  value={ltiVersion}
                  onChange={(e) => setLtiVersion(e.target.value as '1.3')}
                >
                  <option value="1.3">LTI 1.3</option>
                </select>
              </div>
              
              <div className="space-y-2">
                <label htmlFor="lti-launch-url" className="block text-sm font-medium">Launch URL</label>
                <input
                  id="lti-launch-url"
                  className="w-full px-3 py-2 border rounded-md"
                  placeholder="https://tool.example.com/launch"
                  value={ltiLaunchUrl}
                  onChange={(e) => setLtiLaunchUrl(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="lti-client-id" className="block text-sm font-medium">Client ID</label>
                <input
                  id="lti-client-id"
                  className="w-full px-3 py-2 border rounded-md"
                  placeholder="client-id-from-tool-provider"
                  value={ltiClientId}
                  onChange={(e) => setLtiClientId(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="lti-deployment-id" className="block text-sm font-medium">Deployment ID</label>
                <input
                  id="lti-deployment-id"
                  className="w-full px-3 py-2 border rounded-md"
                  placeholder="deployment-id-from-tool-provider"
                  value={ltiDeploymentId}
                  onChange={(e) => setLtiDeploymentId(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="lti-platform-id" className="block text-sm font-medium">Platform ID</label>
                <input
                  id="lti-platform-id"
                  className="w-full px-3 py-2 border rounded-md"
                  placeholder="https://your-platform.example.com"
                  value={ltiPlatformId}
                  onChange={(e) => setLtiPlatformId(e.target.value)}
                />
              </div>
            </div>
          )}
          
          {error && (
            <div className="bg-red-50 p-4 rounded-md text-red-600">
              {error}
            </div>
          )}
          
          {success && (
            <div className="bg-green-50 p-4 rounded-md text-green-600">
              {success}
            </div>
          )}
        </div>
        
        <div className="mt-6 flex justify-between">
          <button 
            className="px-4 py-2 border rounded-md hover:bg-gray-50"
            onClick={onCancel}
          >
            Cancel
          </button>
          <button 
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
            onClick={handleSave} 
            disabled={isLoading}
          >
            {isLoading ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ScormLtiEditor;
