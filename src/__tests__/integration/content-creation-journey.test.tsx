import React from 'react';
import { render, screen, fireEvent, waitFor } from '../utils/test-utils';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import ContentCreatePage from '@/app/teacher/content/create/page';
import ContentPreviewPage from '@/app/teacher/content/[id]/preview/page';
import { scormService } from '@/lib/services/scorm-service';
import { ltiService } from '@/lib/services/lti-service';

// Mock the Supabase client
jest.mock('@/lib/supabase/server', () => ({
  createServerSupabaseClient: jest.fn()
}));

// Mock the SCORM and LTI services
jest.mock('@/lib/services/scorm-service', () => ({
  scormService: {
    createScormPackage: jest.fn(),
    getScormPackage: jest.fn(),
    trackScormCompletion: jest.fn()
  }
}));

jest.mock('@/lib/services/lti-service', () => ({
  ltiService: {
    createLtiTool: jest.fn(),
    getLtiTool: jest.fn(),
    createLtiSession: jest.fn(),
    trackLtiCompletion: jest.fn()
  }
}));

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(() => ({
    push: jest.fn(),
    back: jest.fn(),
    refresh: jest.fn()
  })),
  useParams: jest.fn(() => ({
    id: 'content-123'
  }))
}));

describe('Content Creation Journey', () => {
  // Mock data
  const mockContentId = 'content-123';
  const mockCourseId = 'course-123';
  const mockLessonId = 'lesson-123';
  const mockScormPackage = {
    id: 'package-1',
    content_id: mockContentId,
    version: '1.2',
    package_url: 'https://example.com/scorm/package.zip',
    manifest_url: 'https://example.com/scorm/manifest.xml',
    entry_point: 'https://example.com/scorm/index.html',
    created_at: '2025-01-01T00:00:00Z',
    updated_at: '2025-01-01T00:00:00Z'
  };
  const mockLtiTool = {
    id: 'tool-1',
    content_id: mockContentId,
    version: '1.3',
    name: 'Test LTI Tool',
    description: 'This is a test LTI tool',
    launch_url: 'https://example.com/lti/launch',
    client_id: 'client-123',
    deployment_id: 'deployment-123',
    platform_id: 'platform-123',
    created_at: '2025-01-01T00:00:00Z',
    updated_at: '2025-01-01T00:00:00Z'
  };

  // Mock Supabase methods
  const mockSelect = jest.fn();
  const mockEq = jest.fn();
  const mockSingle = jest.fn();
  const mockInsert = jest.fn();
  const mockFrom = jest.fn();
  const mockStorage = {
    from: jest.fn(() => ({
      upload: jest.fn(() => ({ error: null })),
      getPublicUrl: jest.fn(() => ({
        data: { publicUrl: 'https://example.com/storage/scorm/package.zip' }
      }))
    }))
  };

  beforeEach(() => {
    jest.clearAllMocks();
    
    // Reset mock chain
    mockSelect.mockReturnValue({ single: mockSingle });
    mockEq.mockReturnValue({ select: mockSelect });
    mockSingle.mockReturnValue({ data: { id: mockContentId }, error: null });
    mockInsert.mockReturnValue({ select: mockSelect });
    mockFrom.mockReturnValue({ 
      select: mockSelect,
      insert: mockInsert
    });
    
    // Mock Supabase client
    (createServerSupabaseClient as jest.Mock).mockReturnValue({
      from: mockFrom,
      storage: mockStorage
    });
    
    // Mock SCORM service
    (scormService.createScormPackage as jest.Mock).mockResolvedValue(mockScormPackage);
    (scormService.getScormPackage as jest.Mock).mockResolvedValue(mockScormPackage);
    (scormService.trackScormCompletion as jest.Mock).mockResolvedValue(true);
    
    // Mock LTI service
    (ltiService.createLtiTool as jest.Mock).mockResolvedValue(mockLtiTool);
    (ltiService.getLtiTool as jest.Mock).mockResolvedValue(mockLtiTool);
    (ltiService.createLtiSession as jest.Mock).mockResolvedValue({
      id: 'session-1',
      session_token: 'token-123'
    });
    (ltiService.trackLtiCompletion as jest.Mock).mockResolvedValue(true);
    
    // Mock console.error to prevent test output pollution
    jest.spyOn(console, 'error').mockImplementation(() => {});
    
    // Mock window.URL.createObjectURL
    global.URL.createObjectURL = jest.fn(() => 'blob:mock-url');
    global.URL.revokeObjectURL = jest.fn();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('SCORM Content Creation Flow', () => {
    it('should allow creating SCORM content', async () => {
      // Render the content creation page
      render(<ContentCreatePage courseId={mockCourseId} lessonId={mockLessonId} />);
      
      // Check if the page is rendered
      expect(screen.getByText(/Create New Content/i)).toBeInTheDocument();
      
      // Select SCORM content type
      const scormButton = screen.getByText(/SCORM Package/i);
      fireEvent.click(scormButton);
      
      // Fill in the form
      fireEvent.change(screen.getByLabelText(/Title/i), { target: { value: 'Test SCORM Content' } });
      
      // Select SCORM version
      const versionSelect = screen.getByLabelText(/SCORM Version/i);
      fireEvent.change(versionSelect, { target: { value: '1.2' } });
      
      // Upload SCORM package
      const file = new File(['dummy content'], 'scorm-package.zip', { type: 'application/zip' });
      const fileInput = screen.getByLabelText(/SCORM Package/i);
      Object.defineProperty(fileInput, 'files', { value: [file] });
      fireEvent.change(fileInput);
      
      // Wait for upload to complete
      await waitFor(() => {
        expect(mockStorage.from).toHaveBeenCalled();
      });
      
      // Save the content
      fireEvent.click(screen.getByText('Save'));
      
      // Wait for content to be saved
      await waitFor(() => {
        expect(mockFrom).toHaveBeenCalledWith('content_items');
        expect(mockInsert).toHaveBeenCalledWith(expect.objectContaining({
          title: 'Test SCORM Content',
          type: 'scorm',
          course_id: mockCourseId,
          lesson_id: mockLessonId
        }));
        expect(scormService.createScormPackage).toHaveBeenCalled();
      });
    });

    it('should allow previewing SCORM content', async () => {
      // Mock the content item
      mockSingle.mockReturnValue({
        data: {
          id: mockContentId,
          title: 'Test SCORM Content',
          type: 'scorm',
          metadata: {
            scorm: {
              version: '1.2',
              entryPoint: 'https://example.com/scorm/index.html'
            }
          }
        },
        error: null
      });
      
      // Render the content preview page
      render(<ContentPreviewPage />);
      
      // Check if the page is rendered
      await waitFor(() => {
        expect(screen.getByText(/Test SCORM Content/i)).toBeInTheDocument();
      });
      
      // Check if SCORM player is rendered
      expect(screen.getByTitle('SCORM Content')).toBeInTheDocument();
      expect(screen.getByTitle('SCORM Content')).toHaveAttribute('src', 'https://example.com/scorm/index.html');
      
      // Check if SCORM service was called
      expect(scormService.getScormPackage).toHaveBeenCalledWith(mockContentId);
    });
  });

  describe('LTI Content Creation Flow', () => {
    it('should allow creating LTI content', async () => {
      // Render the content creation page
      render(<ContentCreatePage courseId={mockCourseId} lessonId={mockLessonId} />);
      
      // Check if the page is rendered
      expect(screen.getByText(/Create New Content/i)).toBeInTheDocument();
      
      // Select LTI content type
      const ltiButton = screen.getByText(/LTI Tool/i);
      fireEvent.click(ltiButton);
      
      // Fill in the form
      fireEvent.change(screen.getByLabelText(/Title/i), { target: { value: 'Test LTI Content' } });
      fireEvent.change(screen.getByLabelText(/Launch URL/i), { target: { value: 'https://example.com/lti/launch' } });
      fireEvent.change(screen.getByLabelText(/Client ID/i), { target: { value: 'client-123' } });
      fireEvent.change(screen.getByLabelText(/Deployment ID/i), { target: { value: 'deployment-123' } });
      fireEvent.change(screen.getByLabelText(/Platform ID/i), { target: { value: 'platform-123' } });
      
      // Save the content
      fireEvent.click(screen.getByText('Save'));
      
      // Wait for content to be saved
      await waitFor(() => {
        expect(mockFrom).toHaveBeenCalledWith('content_items');
        expect(mockInsert).toHaveBeenCalledWith(expect.objectContaining({
          title: 'Test LTI Content',
          type: 'lti',
          course_id: mockCourseId,
          lesson_id: mockLessonId
        }));
        expect(ltiService.createLtiTool).toHaveBeenCalled();
      });
    });

    it('should allow previewing LTI content', async () => {
      // Mock the content item
      mockSingle.mockReturnValue({
        data: {
          id: mockContentId,
          title: 'Test LTI Content',
          type: 'lti',
          metadata: {
            lti: {
              version: '1.3',
              launchUrl: 'https://example.com/lti/launch',
              clientId: 'client-123',
              deploymentId: 'deployment-123',
              platformId: 'platform-123'
            }
          }
        },
        error: null
      });
      
      // Mock LTI session creation
      (ltiService.createLtiSession as jest.Mock).mockResolvedValue({
        id: 'session-1',
        session_token: 'token-123'
      });
      
      // Render the content preview page
      render(<ContentPreviewPage />);
      
      // Check if the page is rendered
      await waitFor(() => {
        expect(screen.getByText(/Test LTI Content/i)).toBeInTheDocument();
      });
      
      // Wait for LTI player to initialize
      await waitFor(() => {
        expect(ltiService.getLtiTool).toHaveBeenCalledWith(mockContentId);
        expect(ltiService.createLtiSession).toHaveBeenCalled();
      });
      
      // Check if LTI player is rendered
      expect(screen.getByTitle('LTI Content')).toBeInTheDocument();
      expect(screen.getByTitle('LTI Content')).toHaveAttribute('src', expect.stringContaining('https://example.com/lti/launch'));
    });
  });
});
