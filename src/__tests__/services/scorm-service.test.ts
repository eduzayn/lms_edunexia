import { scormService, ScormPackage, ScormTrackingData, ScormMetadata } from '@/lib/services/scorm-service';
import { createServerSupabaseClient } from '@/lib/supabase/server';

// Mock the Supabase client
jest.mock('@/lib/supabase/server', () => ({
  createServerSupabaseClient: jest.fn()
}));

describe('ScormService', () => {
  // Mock data
  const mockScormPackage: ScormPackage = {
    id: 'package-1',
    content_id: 'content-1',
    version: '1.2',
    package_url: 'https://example.com/scorm/package.zip',
    manifest_url: 'https://example.com/scorm/manifest.xml',
    entry_point: 'https://example.com/scorm/index.html',
    created_at: '2025-01-01T00:00:00Z',
    updated_at: '2025-01-01T00:00:00Z'
  };

  const mockScormTrackingData: ScormTrackingData = {
    id: 'tracking-1',
    user_id: 'user-1',
    content_id: 'content-1',
    scorm_package_id: 'package-1',
    completion_status: 'completed',
    success_status: 'passed',
    score_raw: 90,
    score_min: 0,
    score_max: 100,
    score_scaled: 0.9,
    total_time: '00:30:00',
    session_time: '00:15:00',
    created_at: '2025-01-01T00:00:00Z',
    updated_at: '2025-01-01T00:00:00Z'
  };

  const mockScormMetadata: ScormMetadata = {
    version: '1.2',
    packageUrl: 'https://example.com/scorm/package.zip',
    manifestUrl: 'https://example.com/scorm/manifest.xml',
    entryPoint: 'https://example.com/scorm/index.html'
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
    mockSelect.mockReturnValue({ order: jest.fn().mockReturnValue({ data: [mockScormPackage], error: null }) });
    mockEq.mockReturnValue({ single: mockSingle, select: mockSelect });
    mockSingle.mockReturnValue({ data: mockScormPackage, error: null });
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
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('getScormPackage', () => {
    it('should return a SCORM package when successful', async () => {
      const result = await scormService.getScormPackage('content-1');
      
      expect(createServerSupabaseClient).toHaveBeenCalled();
      expect(mockFrom).toHaveBeenCalledWith('scorm_packages');
      expect(mockSelect).toHaveBeenCalledWith('*');
      expect(mockEq).toHaveBeenCalledWith('content_id', 'content-1');
      expect(mockSingle).toHaveBeenCalled();
      expect(result).toEqual(mockScormPackage);
    });

    it('should return null when error occurs', async () => {
      mockSingle.mockReturnValue({ data: null, error: new Error('Database error') });
      
      const result = await scormService.getScormPackage('content-1');
      
      expect(console.error).toHaveBeenCalled();
      expect(result).toBeNull();
    });
  });

  describe('createScormPackage', () => {
    it('should create a SCORM package when successful', async () => {
      // Setup mock for insert chain
      mockSelect.mockReturnValue({ single: mockSingle });
      
      const result = await scormService.createScormPackage('content-1', mockScormMetadata);
      
      expect(createServerSupabaseClient).toHaveBeenCalled();
      expect(mockFrom).toHaveBeenCalledWith('scorm_packages');
      expect(mockInsert).toHaveBeenCalledWith(expect.objectContaining({
        content_id: 'content-1',
        version: '1.2',
        package_url: 'https://example.com/scorm/package.zip',
        manifest_url: 'https://example.com/scorm/manifest.xml',
        entry_point: 'https://example.com/scorm/index.html',
        created_at: expect.any(String),
        updated_at: expect.any(String)
      }));
      expect(mockSelect).toHaveBeenCalled();
      expect(mockSingle).toHaveBeenCalled();
      expect(result).toEqual(mockScormPackage);
    });

    it('should throw error when creation fails', async () => {
      // Setup mock for insert chain
      mockSelect.mockReturnValue({ single: jest.fn().mockReturnValue({ 
        data: null, 
        error: new Error('Database error') 
      })});
      
      await expect(scormService.createScormPackage('content-1', mockScormMetadata))
        .rejects.toThrow('Failed to create SCORM package: Database error');
      
      expect(console.error).toHaveBeenCalled();
    });
  });

  describe('updateScormPackage', () => {
    it('should update a SCORM package when successful', async () => {
      // Setup mock for update chain
      mockEq.mockReturnValue({ select: mockSelect });
      mockSelect.mockReturnValue({ single: mockSingle });
      
      const updates = {
        version: '2004' as const,
        entry_point: 'https://example.com/scorm/updated.html'
      };
      
      const result = await scormService.updateScormPackage('package-1', updates);
      
      expect(createServerSupabaseClient).toHaveBeenCalled();
      expect(mockFrom).toHaveBeenCalledWith('scorm_packages');
      expect(mockUpdate).toHaveBeenCalledWith(expect.objectContaining({
        version: '2004',
        entry_point: 'https://example.com/scorm/updated.html',
        updated_at: expect.any(String)
      }));
      expect(mockEq).toHaveBeenCalledWith('id', 'package-1');
      expect(mockSelect).toHaveBeenCalled();
      expect(mockSingle).toHaveBeenCalled();
      expect(result).toEqual(mockScormPackage);
    });

    it('should throw error when update fails', async () => {
      // Setup mock for update chain
      mockEq.mockReturnValue({ select: mockSelect });
      mockSelect.mockReturnValue({ single: jest.fn().mockReturnValue({ 
        data: null, 
        error: new Error('Database error') 
      })});
      
      const updates = {
        version: '2004' as const,
        entry_point: 'https://example.com/scorm/updated.html'
      };
      
      await expect(scormService.updateScormPackage('package-1', updates))
        .rejects.toThrow('Failed to update SCORM package: Database error');
      
      expect(console.error).toHaveBeenCalled();
    });
  });

  describe('deleteScormPackage', () => {
    it('should delete a SCORM package when successful', async () => {
      // Setup mock for delete chain
      mockEq.mockReturnValue({ error: null });
      
      const result = await scormService.deleteScormPackage('package-1');
      
      expect(createServerSupabaseClient).toHaveBeenCalled();
      expect(mockFrom).toHaveBeenCalledWith('scorm_packages');
      expect(mockDelete).toHaveBeenCalled();
      expect(mockEq).toHaveBeenCalledWith('id', 'package-1');
      expect(result).toBe(true);
    });

    it('should throw error when deletion fails', async () => {
      // Setup mock for delete chain
      mockEq.mockReturnValue({ error: new Error('Database error') });
      
      await expect(scormService.deleteScormPackage('package-1'))
        .rejects.toThrow('Failed to delete SCORM package: Database error');
      
      expect(console.error).toHaveBeenCalled();
    });
  });

  describe('getScormTrackingData', () => {
    it('should return SCORM tracking data when successful', async () => {
      mockSingle.mockReturnValue({ data: mockScormTrackingData, error: null });
      
      const result = await scormService.getScormTrackingData('user-1', 'content-1');
      
      expect(createServerSupabaseClient).toHaveBeenCalled();
      expect(mockFrom).toHaveBeenCalledWith('scorm_tracking');
      expect(mockSelect).toHaveBeenCalledWith('*');
      expect(mockEq).toHaveBeenCalledWith('user_id', 'user-1');
      expect(mockEq).toHaveBeenCalledWith('content_id', 'content-1');
      expect(mockSingle).toHaveBeenCalled();
      expect(result).toEqual(mockScormTrackingData);
    });

    it('should return null when error occurs', async () => {
      mockSingle.mockReturnValue({ data: null, error: new Error('Database error') });
      
      const result = await scormService.getScormTrackingData('user-1', 'content-1');
      
      expect(console.error).toHaveBeenCalled();
      expect(result).toBeNull();
    });
  });

  describe('saveScormTrackingData', () => {
    it('should update existing tracking data when it exists', async () => {
      // Setup mock for existing data
      mockSingle.mockReturnValue({ data: { id: 'tracking-1' }, error: null });
      
      // Setup mock for update chain
      mockEq.mockReturnValue({ select: mockSelect });
      mockSelect.mockReturnValue({ single: jest.fn().mockReturnValue({ 
        data: mockScormTrackingData, 
        error: null 
      })});
      
      const result = await scormService.saveScormTrackingData(mockScormTrackingData);
      
      expect(createServerSupabaseClient).toHaveBeenCalled();
      expect(mockFrom).toHaveBeenCalledWith('scorm_tracking');
      expect(mockSelect).toHaveBeenCalledWith('id');
      expect(mockEq).toHaveBeenCalledWith('user_id', 'user-1');
      expect(mockEq).toHaveBeenCalledWith('content_id', 'content-1');
      expect(mockSingle).toHaveBeenCalled();
      
      // Check update was called
      expect(mockUpdate).toHaveBeenCalledWith(expect.objectContaining({
        ...mockScormTrackingData,
        updated_at: expect.any(String)
      }));
      expect(mockEq).toHaveBeenCalledWith('id', 'tracking-1');
      expect(result).toEqual(mockScormTrackingData);
    });

    it('should insert new tracking data when it does not exist', async () => {
      // Setup mock for non-existing data
      mockSingle.mockReturnValue({ data: null, error: null });
      
      // Setup mock for insert chain
      mockSelect.mockReturnValue({ single: jest.fn().mockReturnValue({ 
        data: mockScormTrackingData, 
        error: null 
      })});
      
      const result = await scormService.saveScormTrackingData(mockScormTrackingData);
      
      expect(createServerSupabaseClient).toHaveBeenCalled();
      expect(mockFrom).toHaveBeenCalledWith('scorm_tracking');
      expect(mockSelect).toHaveBeenCalledWith('id');
      expect(mockEq).toHaveBeenCalledWith('user_id', 'user-1');
      expect(mockEq).toHaveBeenCalledWith('content_id', 'content-1');
      expect(mockSingle).toHaveBeenCalled();
      
      // Check insert was called
      expect(mockInsert).toHaveBeenCalledWith(expect.objectContaining({
        ...mockScormTrackingData,
        created_at: expect.any(String),
        updated_at: expect.any(String)
      }));
      expect(result).toEqual(mockScormTrackingData);
    });

    it('should throw error when update fails', async () => {
      // Setup mock for existing data
      mockSingle.mockReturnValue({ data: { id: 'tracking-1' }, error: null });
      
      // Setup mock for update chain
      mockEq.mockReturnValue({ select: mockSelect });
      mockSelect.mockReturnValue({ single: jest.fn().mockReturnValue({ 
        data: null, 
        error: new Error('Database error') 
      })});
      
      await expect(scormService.saveScormTrackingData(mockScormTrackingData))
        .rejects.toThrow('Failed to update SCORM tracking data: Database error');
      
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
      
      await expect(scormService.saveScormTrackingData(mockScormTrackingData))
        .rejects.toThrow('Failed to create SCORM tracking data: Database error');
      
      expect(console.error).toHaveBeenCalled();
    });
  });

  describe('getScormApiVersion', () => {
    it('should return SCORM API version when package exists', async () => {
      // Mock getScormPackage to return a package
      jest.spyOn(scormService, 'getScormPackage').mockResolvedValue(mockScormPackage);
      
      const result = await scormService.getScormApiVersion('content-1');
      
      expect(scormService.getScormPackage).toHaveBeenCalledWith('content-1');
      expect(result).toBe('1.2');
    });

    it('should return null when package does not exist', async () => {
      // Mock getScormPackage to return null
      jest.spyOn(scormService, 'getScormPackage').mockResolvedValue(null);
      
      const result = await scormService.getScormApiVersion('content-1');
      
      expect(scormService.getScormPackage).toHaveBeenCalledWith('content-1');
      expect(result).toBeNull();
    });
  });

  describe('trackScormCompletion', () => {
    it('should track completion status when successful', async () => {
      // Mock getScormPackage to return a package
      jest.spyOn(scormService, 'getScormPackage').mockResolvedValue(mockScormPackage);
      
      // Mock getScormTrackingData to return tracking data
      jest.spyOn(scormService, 'getScormTrackingData').mockResolvedValue(mockScormTrackingData);
      
      // Mock saveScormTrackingData
      jest.spyOn(scormService, 'saveScormTrackingData').mockResolvedValue(mockScormTrackingData);
      
      const result = await scormService.trackScormCompletion('user-1', 'content-1', 'completed');
      
      expect(scormService.getScormPackage).toHaveBeenCalledWith('content-1');
      expect(scormService.getScormTrackingData).toHaveBeenCalledWith('user-1', 'content-1');
      expect(scormService.saveScormTrackingData).toHaveBeenCalledWith(expect.objectContaining({
        ...mockScormTrackingData,
        completion_status: 'completed'
      }));
      expect(mockFrom).toHaveBeenCalledWith('analytics.student_progress');
      expect(mockUpsert).toHaveBeenCalledWith(expect.objectContaining({
        user_id: 'user-1',
        content_id: 'content-1',
        progress_percentage: 100,
        content_type: 'scorm'
      }), expect.any(Object));
      expect(result).toBe(true);
    });

    it('should create new tracking data when it does not exist', async () => {
      // Mock getScormPackage to return a package
      jest.spyOn(scormService, 'getScormPackage').mockResolvedValue(mockScormPackage);
      
      // Mock getScormTrackingData to return null
      jest.spyOn(scormService, 'getScormTrackingData').mockResolvedValue(null);
      
      // Mock saveScormTrackingData
      jest.spyOn(scormService, 'saveScormTrackingData').mockResolvedValue(mockScormTrackingData);
      
      const result = await scormService.trackScormCompletion('user-1', 'content-1', 'completed');
      
      expect(scormService.getScormPackage).toHaveBeenCalledWith('content-1');
      expect(scormService.getScormTrackingData).toHaveBeenCalledWith('user-1', 'content-1');
      expect(scormService.saveScormTrackingData).toHaveBeenCalledWith(expect.objectContaining({
        user_id: 'user-1',
        content_id: 'content-1',
        scorm_package_id: 'package-1',
        completion_status: 'completed'
      }));
      expect(result).toBe(true);
    });

    it('should return false when SCORM package does not exist', async () => {
      // Mock getScormPackage to return null
      jest.spyOn(scormService, 'getScormPackage').mockResolvedValue(null);
      
      const result = await scormService.trackScormCompletion('user-1', 'content-1', 'completed');
      
      expect(scormService.getScormPackage).toHaveBeenCalledWith('content-1');
      expect(console.error).toHaveBeenCalled();
      expect(result).toBe(false);
    });

    it('should return false when an error occurs', async () => {
      // Mock getScormPackage to throw an error
      jest.spyOn(scormService, 'getScormPackage').mockRejectedValue(new Error('Database error'));
      
      const result = await scormService.trackScormCompletion('user-1', 'content-1', 'completed');
      
      expect(scormService.getScormPackage).toHaveBeenCalledWith('content-1');
      expect(console.error).toHaveBeenCalled();
      expect(result).toBe(false);
    });
  });
});
