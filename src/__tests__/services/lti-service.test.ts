import { ltiService, LtiTool, LtiSession, LtiProgress, LtiMetadata } from '@/lib/services/lti-service';
import { createServerSupabaseClient } from '@/lib/supabase/server';

// Mock the Supabase client
jest.mock('@/lib/supabase/server', () => ({
  createServerSupabaseClient: jest.fn()
}));

describe('LtiService', () => {
  // Mock data
  const mockLtiTool: LtiTool = {
    id: 'tool-1',
    content_id: 'content-1',
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

  const mockLtiSession: LtiSession = {
    id: 'session-1',
    user_id: 'user-1',
    content_id: 'content-1',
    lti_tool_id: 'tool-1',
    session_token: 'token-123',
    state: 'state-123',
    created_at: '2025-01-01T00:00:00Z',
    expires_at: '2025-01-01T01:00:00Z'
  };

  const mockLtiProgress: LtiProgress = {
    id: 'progress-1',
    user_id: 'user-1',
    content_id: 'content-1',
    lti_tool_id: 'tool-1',
    completion_status: 'completed',
    score: 90,
    time_spent: 1800,
    created_at: '2025-01-01T00:00:00Z',
    updated_at: '2025-01-01T00:00:00Z'
  };

  const mockLtiMetadata: LtiMetadata = {
    version: '1.3',
    name: 'Test LTI Tool',
    description: 'This is a test LTI tool',
    launchUrl: 'https://example.com/lti/launch',
    clientId: 'client-123',
    deploymentId: 'deployment-123',
    platformId: 'platform-123'
  };

  // Mock Supabase methods
  const mockSelect = jest.fn();
  const mockEq = jest.fn();
  const mockSingle = jest.fn();
  const mockInsert = jest.fn();
  const mockUpdate = jest.fn();
  const mockDelete = jest.fn();
  const mockFrom = jest.fn();
  const mockUpsert = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    
    // Reset mock chain
    mockSelect.mockReturnValue({ order: jest.fn().mockReturnValue({ data: [mockLtiTool], error: null }) });
    mockEq.mockReturnValue({ single: mockSingle, select: mockSelect });
    mockSingle.mockReturnValue({ data: mockLtiTool, error: null });
    mockInsert.mockReturnValue({ select: mockSelect });
    mockUpdate.mockReturnValue({ eq: mockEq });
    mockDelete.mockReturnValue({ eq: mockEq });
    mockUpsert.mockReturnValue({ error: null });
    mockFrom.mockReturnValue({ 
      select: mockSelect,
      insert: mockInsert,
      update: mockUpdate,
      delete: mockDelete,
      upsert: mockUpsert
    });
    
    // Mock Supabase client
    (createServerSupabaseClient as jest.Mock).mockReturnValue({
      from: mockFrom,
      rpc: jest.fn().mockReturnValue({ data: {}, error: null })
    });
    
    // Mock console.error to prevent test output pollution
    jest.spyOn(console, 'error').mockImplementation(() => {});
    
    // Mock Math.random for deterministic tests
    jest.spyOn(Math, 'random').mockReturnValue(0.123456789);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('getLtiTool', () => {
    it('should return an LTI tool when successful', async () => {
      const result = await ltiService.getLtiTool('content-1');
      
      expect(createServerSupabaseClient).toHaveBeenCalled();
      expect(mockFrom).toHaveBeenCalledWith('lti_tools');
      expect(mockSelect).toHaveBeenCalledWith('*');
      expect(mockEq).toHaveBeenCalledWith('content_id', 'content-1');
      expect(mockSingle).toHaveBeenCalled();
      expect(result).toEqual(mockLtiTool);
    });

    it('should return null when error occurs', async () => {
      mockSingle.mockReturnValue({ data: null, error: new Error('Database error') });
      
      const result = await ltiService.getLtiTool('content-1');
      
      expect(console.error).toHaveBeenCalled();
      expect(result).toBeNull();
    });
  });

  describe('createLtiTool', () => {
    it('should create an LTI tool when successful', async () => {
      // Setup mock for insert chain
      mockSelect.mockReturnValue({ single: mockSingle });
      
      const result = await ltiService.createLtiTool('content-1', mockLtiMetadata);
      
      expect(createServerSupabaseClient).toHaveBeenCalled();
      expect(mockFrom).toHaveBeenCalledWith('lti_tools');
      expect(mockInsert).toHaveBeenCalledWith(expect.objectContaining({
        content_id: 'content-1',
        version: '1.3',
        name: 'Test LTI Tool',
        description: 'This is a test LTI tool',
        launch_url: 'https://example.com/lti/launch',
        client_id: 'client-123',
        deployment_id: 'deployment-123',
        platform_id: 'platform-123',
        created_at: expect.any(String),
        updated_at: expect.any(String)
      }));
      expect(mockSelect).toHaveBeenCalled();
      expect(mockSingle).toHaveBeenCalled();
      expect(result).toEqual(mockLtiTool);
    });

    it('should throw error when creation fails', async () => {
      // Setup mock for insert chain
      mockSelect.mockReturnValue({ single: jest.fn().mockReturnValue({ 
        data: null, 
        error: new Error('Database error') 
      })});
      
      await expect(ltiService.createLtiTool('content-1', mockLtiMetadata))
        .rejects.toThrow('Failed to create LTI tool: Database error');
      
      expect(console.error).toHaveBeenCalled();
    });
  });

  describe('updateLtiTool', () => {
    it('should update an LTI tool when successful', async () => {
      // Setup mock for update chain
      mockEq.mockReturnValue({ select: mockSelect });
      mockSelect.mockReturnValue({ single: mockSingle });
      
      const updates = {
        name: 'Updated LTI Tool',
        description: 'This is an updated LTI tool'
      };
      
      const result = await ltiService.updateLtiTool('tool-1', updates);
      
      expect(createServerSupabaseClient).toHaveBeenCalled();
      expect(mockFrom).toHaveBeenCalledWith('lti_tools');
      expect(mockUpdate).toHaveBeenCalledWith(expect.objectContaining({
        name: 'Updated LTI Tool',
        description: 'This is an updated LTI tool',
        updated_at: expect.any(String)
      }));
      expect(mockEq).toHaveBeenCalledWith('id', 'tool-1');
      expect(mockSelect).toHaveBeenCalled();
      expect(mockSingle).toHaveBeenCalled();
      expect(result).toEqual(mockLtiTool);
    });

    it('should throw error when update fails', async () => {
      // Setup mock for update chain
      mockEq.mockReturnValue({ select: mockSelect });
      mockSelect.mockReturnValue({ single: jest.fn().mockReturnValue({ 
        data: null, 
        error: new Error('Database error') 
      })});
      
      const updates = {
        name: 'Updated LTI Tool',
        description: 'This is an updated LTI tool'
      };
      
      await expect(ltiService.updateLtiTool('tool-1', updates))
        .rejects.toThrow('Failed to update LTI tool: Database error');
      
      expect(console.error).toHaveBeenCalled();
    });
  });

  describe('deleteLtiTool', () => {
    it('should delete an LTI tool when successful', async () => {
      // Setup mock for delete chain
      mockEq.mockReturnValue({ error: null });
      
      const result = await ltiService.deleteLtiTool('tool-1');
      
      expect(createServerSupabaseClient).toHaveBeenCalled();
      expect(mockFrom).toHaveBeenCalledWith('lti_tools');
      expect(mockDelete).toHaveBeenCalled();
      expect(mockEq).toHaveBeenCalledWith('id', 'tool-1');
      expect(result).toBe(true);
    });

    it('should throw error when deletion fails', async () => {
      // Setup mock for delete chain
      mockEq.mockReturnValue({ error: new Error('Database error') });
      
      await expect(ltiService.deleteLtiTool('tool-1'))
        .rejects.toThrow('Failed to delete LTI tool: Database error');
      
      expect(console.error).toHaveBeenCalled();
    });
  });

  describe('createLtiSession', () => {
    it('should create an LTI session when successful', async () => {
      // Setup mock for insert chain
      mockSelect.mockReturnValue({ single: jest.fn().mockReturnValue({ 
        data: mockLtiSession, 
        error: null 
      })});
      
      const result = await ltiService.createLtiSession('user-1', 'content-1', 'tool-1');
      
      expect(createServerSupabaseClient).toHaveBeenCalled();
      expect(mockFrom).toHaveBeenCalledWith('lti_sessions');
      expect(mockInsert).toHaveBeenCalledWith(expect.objectContaining({
        user_id: 'user-1',
        content_id: 'content-1',
        lti_tool_id: 'tool-1',
        session_token: expect.any(String),
        state: expect.any(String),
        created_at: expect.any(String),
        expires_at: expect.any(String)
      }));
      expect(mockSelect).toHaveBeenCalled();
      expect(result).toEqual(mockLtiSession);
    });

    it('should throw error when creation fails', async () => {
      // Setup mock for insert chain
      mockSelect.mockReturnValue({ single: jest.fn().mockReturnValue({ 
        data: null, 
        error: new Error('Database error') 
      })});
      
      await expect(ltiService.createLtiSession('user-1', 'content-1', 'tool-1'))
        .rejects.toThrow('Failed to create LTI session: Database error');
      
      expect(console.error).toHaveBeenCalled();
    });
  });

  describe('getLtiSession', () => {
    it('should return an LTI session when successful', async () => {
      // Setup mock for select chain
      mockSingle.mockReturnValue({ data: mockLtiSession, error: null });
      
      const result = await ltiService.getLtiSession('token-123');
      
      expect(createServerSupabaseClient).toHaveBeenCalled();
      expect(mockFrom).toHaveBeenCalledWith('lti_sessions');
      expect(mockSelect).toHaveBeenCalledWith('*');
      expect(mockEq).toHaveBeenCalledWith('session_token', 'token-123');
      expect(mockSingle).toHaveBeenCalled();
      expect(result).toEqual(mockLtiSession);
    });

    it('should return null when error occurs', async () => {
      mockSingle.mockReturnValue({ data: null, error: new Error('Database error') });
      
      const result = await ltiService.getLtiSession('token-123');
      
      expect(console.error).toHaveBeenCalled();
      expect(result).toBeNull();
    });
  });

  describe('getLtiProgress', () => {
    it('should return LTI progress when successful', async () => {
      mockSingle.mockReturnValue({ data: mockLtiProgress, error: null });
      
      const result = await ltiService.getLtiProgress('user-1', 'content-1');
      
      expect(createServerSupabaseClient).toHaveBeenCalled();
      expect(mockFrom).toHaveBeenCalledWith('lti_progress');
      expect(mockSelect).toHaveBeenCalledWith('*');
      expect(mockEq).toHaveBeenCalledWith('user_id', 'user-1');
      expect(mockEq).toHaveBeenCalledWith('content_id', 'content-1');
      expect(mockSingle).toHaveBeenCalled();
      expect(result).toEqual(mockLtiProgress);
    });

    it('should return null when error occurs', async () => {
      mockSingle.mockReturnValue({ data: null, error: new Error('Database error') });
      
      const result = await ltiService.getLtiProgress('user-1', 'content-1');
      
      expect(console.error).toHaveBeenCalled();
      expect(result).toBeNull();
    });
  });

  describe('saveLtiProgress', () => {
    it('should update existing progress data when it exists', async () => {
      // Setup mock for existing data
      mockSingle.mockReturnValue({ data: { id: 'progress-1' }, error: null });
      
      // Setup mock for update chain
      mockEq.mockReturnValue({ select: mockSelect });
      mockSelect.mockReturnValue({ single: jest.fn().mockReturnValue({ 
        data: mockLtiProgress, 
        error: null 
      })});
      
      const result = await ltiService.saveLtiProgress(mockLtiProgress);
      
      expect(createServerSupabaseClient).toHaveBeenCalled();
      expect(mockFrom).toHaveBeenCalledWith('lti_progress');
      expect(mockSelect).toHaveBeenCalledWith('id');
      expect(mockEq).toHaveBeenCalledWith('user_id', 'user-1');
      expect(mockEq).toHaveBeenCalledWith('content_id', 'content-1');
      expect(mockSingle).toHaveBeenCalled();
      
      // Check update was called
      expect(mockUpdate).toHaveBeenCalledWith(expect.objectContaining({
        ...mockLtiProgress,
        updated_at: expect.any(String)
      }));
      expect(mockEq).toHaveBeenCalledWith('id', 'progress-1');
      expect(result).toEqual(mockLtiProgress);
    });

    it('should insert new progress data when it does not exist', async () => {
      // Setup mock for non-existing data
      mockSingle.mockReturnValue({ data: null, error: null });
      
      // Setup mock for insert chain
      mockSelect.mockReturnValue({ single: jest.fn().mockReturnValue({ 
        data: mockLtiProgress, 
        error: null 
      })});
      
      const result = await ltiService.saveLtiProgress(mockLtiProgress);
      
      expect(createServerSupabaseClient).toHaveBeenCalled();
      expect(mockFrom).toHaveBeenCalledWith('lti_progress');
      expect(mockSelect).toHaveBeenCalledWith('id');
      expect(mockEq).toHaveBeenCalledWith('user_id', 'user-1');
      expect(mockEq).toHaveBeenCalledWith('content_id', 'content-1');
      expect(mockSingle).toHaveBeenCalled();
      
      // Check insert was called
      expect(mockInsert).toHaveBeenCalledWith(expect.objectContaining({
        ...mockLtiProgress,
        created_at: expect.any(String),
        updated_at: expect.any(String)
      }));
      expect(result).toEqual(mockLtiProgress);
    });

    it('should throw error when update fails', async () => {
      // Setup mock for existing data
      mockSingle.mockReturnValue({ data: { id: 'progress-1' }, error: null });
      
      // Setup mock for update chain
      mockEq.mockReturnValue({ select: mockSelect });
      mockSelect.mockReturnValue({ single: jest.fn().mockReturnValue({ 
        data: null, 
        error: new Error('Database error') 
      })});
      
      await expect(ltiService.saveLtiProgress(mockLtiProgress))
        .rejects.toThrow('Failed to update LTI progress data: Database error');
      
      expect(console.error).toHaveBeenCalled();
    });

    it('should throw error when insert fails', async () => {
      // Setup mock for non-existing data
      mockSingle.mockReturnValue({ data: null, error: null });
      
      // Setup mock for insert chain
      mockSelect.mockReturnValue({ single: jest.fn().mockReturnValue({ 
        data: null, 
        error: new Error('Database error') 
      })});
      
      await expect(ltiService.saveLtiProgress(mockLtiProgress))
        .rejects.toThrow('Failed to create LTI progress data: Database error');
      
      expect(console.error).toHaveBeenCalled();
    });
  });

  describe('trackLtiCompletion', () => {
    it('should track completion status when successful', async () => {
      // Mock getLtiTool to return a tool
      jest.spyOn(ltiService, 'getLtiTool').mockResolvedValue(mockLtiTool);
      
      // Mock getLtiProgress to return progress data
      jest.spyOn(ltiService, 'getLtiProgress').mockResolvedValue(mockLtiProgress);
      
      // Mock saveLtiProgress
      jest.spyOn(ltiService, 'saveLtiProgress').mockResolvedValue(mockLtiProgress);
      
      const result = await ltiService.trackLtiCompletion('user-1', 'content-1', 'completed', 95);
      
      expect(ltiService.getLtiTool).toHaveBeenCalledWith('content-1');
      expect(ltiService.getLtiProgress).toHaveBeenCalledWith('user-1', 'content-1');
      expect(ltiService.saveLtiProgress).toHaveBeenCalledWith(expect.objectContaining({
        ...mockLtiProgress,
        completion_status: 'completed',
        score: 95
      }));
      expect(mockFrom).toHaveBeenCalledWith('analytics.student_progress');
      expect(mockUpsert).toHaveBeenCalledWith(expect.objectContaining({
        user_id: 'user-1',
        content_id: 'content-1',
        progress_percentage: 100,
        content_type: 'lti'
      }), expect.any(Object));
      expect(result).toBe(true);
    });

    it('should create new progress data when it does not exist', async () => {
      // Mock getLtiTool to return a tool
      jest.spyOn(ltiService, 'getLtiTool').mockResolvedValue(mockLtiTool);
      
      // Mock getLtiProgress to return null
      jest.spyOn(ltiService, 'getLtiProgress').mockResolvedValue(null);
      
      // Mock saveLtiProgress
      jest.spyOn(ltiService, 'saveLtiProgress').mockResolvedValue(mockLtiProgress);
      
      const result = await ltiService.trackLtiCompletion('user-1', 'content-1', 'completed', 95);
      
      expect(ltiService.getLtiTool).toHaveBeenCalledWith('content-1');
      expect(ltiService.getLtiProgress).toHaveBeenCalledWith('user-1', 'content-1');
      expect(ltiService.saveLtiProgress).toHaveBeenCalledWith(expect.objectContaining({
        user_id: 'user-1',
        content_id: 'content-1',
        lti_tool_id: 'tool-1',
        completion_status: 'completed',
        score: 95
      }));
      expect(result).toBe(true);
    });

    it('should return false when LTI tool does not exist', async () => {
      // Mock getLtiTool to return null
      jest.spyOn(ltiService, 'getLtiTool').mockResolvedValue(null);
      
      const result = await ltiService.trackLtiCompletion('user-1', 'content-1', 'completed', 95);
      
      expect(ltiService.getLtiTool).toHaveBeenCalledWith('content-1');
      expect(console.error).toHaveBeenCalled();
      expect(result).toBe(false);
    });

    it('should return false when an error occurs', async () => {
      // Mock getLtiTool to throw an error
      jest.spyOn(ltiService, 'getLtiTool').mockRejectedValue(new Error('Database error'));
      
      const result = await ltiService.trackLtiCompletion('user-1', 'content-1', 'completed', 95);
      
      expect(ltiService.getLtiTool).toHaveBeenCalledWith('content-1');
      expect(console.error).toHaveBeenCalled();
      expect(result).toBe(false);
    });
  });

  describe('generateSessionToken', () => {
    it('should generate a session token with expected format', () => {
      // Access private method using type assertion
      const generateSessionToken = (ltiService as any).generateSessionToken.bind(ltiService);
      const token = generateSessionToken();
      
      expect(token).toMatch(/^lti_[a-z0-9]+_[a-z0-9]+$/);
      expect(token).toContain('lti_');
    });
  });

  describe('generateState', () => {
    it('should generate a state string with expected format', () => {
      // Access private method using type assertion
      const generateState = (ltiService as any).generateState.bind(ltiService);
      const state = generateState();
      
      expect(state).toMatch(/^[a-z0-9]+$/);
      expect(state.length).toBeGreaterThan(5);
    });
  });
});
