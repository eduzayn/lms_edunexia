import { VideoQueueService, videoQueueService } from '@/lib/services/video-queue-service';
import { createClient } from '@supabase/supabase-js';

// Mock Supabase
jest.mock('@supabase/supabase-js', () => {
  const mockSupabase = {
    from: jest.fn().mockReturnThis(),
    select: jest.fn().mockReturnThis(),
    insert: jest.fn().mockReturnThis(),
    update: jest.fn().mockReturnThis(),
    delete: jest.fn().mockReturnThis(),
    eq: jest.fn().mockReturnThis(),
    single: jest.fn().mockReturnThis(),
    order: jest.fn().mockReturnThis(),
    limit: jest.fn().mockReturnThis()
  };
  
  return {
    createClient: jest.fn(() => mockSupabase)
  };
});

describe('VideoQueueService', () => {
  let mockSupabase: ReturnType<typeof createClient>;
  
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Setup Supabase mock
    mockSupabase = createClient('', '');
    (mockSupabase.from as jest.Mock).mockReturnValue(mockSupabase);
    (mockSupabase.select as jest.Mock).mockReturnValue(mockSupabase);
    (mockSupabase.insert as jest.Mock).mockReturnValue(mockSupabase);
    (mockSupabase.update as jest.Mock).mockReturnValue(mockSupabase);
    (mockSupabase.delete as jest.Mock).mockReturnValue(mockSupabase);
    (mockSupabase.eq as jest.Mock).mockReturnValue(mockSupabase);
    (mockSupabase.single as jest.Mock).mockReturnValue(mockSupabase);
    (mockSupabase.order as jest.Mock).mockReturnValue(mockSupabase);
    (mockSupabase.limit as jest.Mock).mockReturnValue(mockSupabase);
  });
  
  describe('getInstance', () => {
    it('should return the same instance when called multiple times', () => {
      const instance1 = videoQueueService;
      const instance2 = videoQueueService;
      
      expect(instance1).toBe(instance2);
    });
  });
  
  describe('createJob', () => {
    it('should create a job successfully', async () => {
      const mockJob = {
        id: 'job-123',
        user_id: 'user-123',
        request: { title: 'Test Video' },
        status: 'pending',
        created_at: '2025-01-01T00:00:00Z',
        updated_at: '2025-01-01T00:00:00Z'
      };
      
      (mockSupabase.single as jest.Mock).mockResolvedValueOnce({
        data: mockJob,
        error: null
      });
      
      const userId = 'user-123';
      const request = { title: 'Test Video' };
      
      const result = await videoQueueService.createJob(userId, request);
      
      expect(result.success).toBe(true);
      expect(result.jobId).toBe('job-123');
      expect(mockSupabase.from).toHaveBeenCalledWith('content.video_jobs');
      expect(mockSupabase.insert).toHaveBeenCalledWith({
        user_id: userId,
        request: request,
        status: 'pending'
      });
    });
    
    it('should handle database errors', async () => {
      (mockSupabase.single as jest.Mock).mockResolvedValueOnce({
        data: null,
        error: { message: 'Database error' }
      });
      
      const userId = 'user-123';
      const request = { title: 'Test Video' };
      
      const result = await videoQueueService.createJob(userId, request);
      
      expect(result.success).toBe(false);
      expect(result.error).toBe('Database error');
    });
  });
  
  describe('updateJobStatus', () => {
    it('should update job status successfully', async () => {
      (mockSupabase.eq as jest.Mock).mockResolvedValueOnce({
        error: null
      });
      
      const result = await videoQueueService.updateJobStatus('job-123', 'processing');
      
      expect(result.success).toBe(true);
      expect(mockSupabase.from).toHaveBeenCalledWith('content.video_jobs');
      expect(mockSupabase.update).toHaveBeenCalledWith({
        status: 'processing',
        updated_at: expect.any(String)
      });
      expect(mockSupabase.eq).toHaveBeenCalledWith('id', 'job-123');
    });
    
    it('should include result data if provided', async () => {
      (mockSupabase.eq as jest.Mock).mockResolvedValueOnce({
        error: null
      });
      
      const resultData = { videoId: 'video-123' };
      
      const result = await videoQueueService.updateJobStatus('job-123', 'completed', resultData);
      
      expect(result.success).toBe(true);
      expect(mockSupabase.update).toHaveBeenCalledWith({
        status: 'completed',
        result: resultData,
        updated_at: expect.any(String)
      });
    });
    
    it('should include error message if provided', async () => {
      (mockSupabase.eq as jest.Mock).mockResolvedValueOnce({
        error: null
      });
      
      const result = await videoQueueService.updateJobStatus('job-123', 'failed', null, 'Processing error');
      
      expect(result.success).toBe(true);
      expect(mockSupabase.update).toHaveBeenCalledWith({
        status: 'failed',
        error_message: 'Processing error',
        updated_at: expect.any(String)
      });
    });
    
    it('should handle database errors', async () => {
      (mockSupabase.eq as jest.Mock).mockResolvedValueOnce({
        error: { message: 'Database error' }
      });
      
      const result = await videoQueueService.updateJobStatus('job-123', 'processing');
      
      expect(result.success).toBe(false);
      expect(result.error).toBe('Database error');
    });
  });
  
  describe('getJob', () => {
    it('should get a job successfully', async () => {
      const mockJob = {
        id: 'job-123',
        user_id: 'user-123',
        request: { title: 'Test Video' },
        status: 'pending',
        created_at: '2025-01-01T00:00:00Z',
        updated_at: '2025-01-01T00:00:00Z'
      };
      
      (mockSupabase.single as jest.Mock).mockResolvedValueOnce({
        data: mockJob,
        error: null
      });
      
      const result = await videoQueueService.getJob('job-123');
      
      expect(result.success).toBe(true);
      expect(result.job).toEqual(mockJob);
      expect(mockSupabase.from).toHaveBeenCalledWith('content.video_jobs');
      expect(mockSupabase.select).toHaveBeenCalledWith('*');
      expect(mockSupabase.eq).toHaveBeenCalledWith('id', 'job-123');
    });
    
    it('should handle database errors', async () => {
      (mockSupabase.single as jest.Mock).mockResolvedValueOnce({
        data: null,
        error: { message: 'Database error' }
      });
      
      const result = await videoQueueService.getJob('job-123');
      
      expect(result.success).toBe(false);
      expect(result.error).toBe('Database error');
    });
  });
  
  describe('listPendingJobs', () => {
    it('should list pending jobs successfully', async () => {
      const mockJobs = [
        {
          id: 'job-123',
          user_id: 'user-123',
          request: { title: 'Test Video 1' },
          status: 'pending',
          created_at: '2025-01-01T00:00:00Z',
          updated_at: '2025-01-01T00:00:00Z'
        },
        {
          id: 'job-456',
          user_id: 'user-456',
          request: { title: 'Test Video 2' },
          status: 'pending',
          created_at: '2025-01-02T00:00:00Z',
          updated_at: '2025-01-02T00:00:00Z'
        }
      ];
      
      (mockSupabase.order as jest.Mock).mockResolvedValueOnce({
        data: mockJobs,
        error: null
      });
      
      const result = await videoQueueService.listPendingJobs();
      
      expect(result.success).toBe(true);
      expect(result.jobs).toEqual(mockJobs);
      expect(mockSupabase.from).toHaveBeenCalledWith('content.video_jobs');
      expect(mockSupabase.select).toHaveBeenCalledWith('*');
      expect(mockSupabase.eq).toHaveBeenCalledWith('status', 'pending');
      expect(mockSupabase.order).toHaveBeenCalledWith('created_at', { ascending: true });
    });
    
    it('should handle database errors', async () => {
      (mockSupabase.order as jest.Mock).mockResolvedValueOnce({
        data: null,
        error: { message: 'Database error' }
      });
      
      const result = await videoQueueService.listPendingJobs();
      
      expect(result.success).toBe(false);
      expect(result.error).toBe('Database error');
    });
  });
  
  describe('deleteJob', () => {
    it('should delete a job successfully', async () => {
      (mockSupabase.eq as jest.Mock).mockResolvedValueOnce({
        error: null
      });
      
      const result = await videoQueueService.deleteJob('job-123');
      
      expect(result.success).toBe(true);
      expect(mockSupabase.from).toHaveBeenCalledWith('content.video_jobs');
      expect(mockSupabase.delete).toHaveBeenCalled();
      expect(mockSupabase.eq).toHaveBeenCalledWith('id', 'job-123');
    });
    
    it('should handle database errors', async () => {
      (mockSupabase.eq as jest.Mock).mockResolvedValueOnce({
        error: { message: 'Database error' }
      });
      
      const result = await videoQueueService.deleteJob('job-123');
      
      expect(result.success).toBe(false);
      expect(result.error).toBe('Database error');
    });
  });
});
