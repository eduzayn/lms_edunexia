import { VideoGeneratorService, videoGeneratorService } from '@/lib/services/video-generator-service';
import { videoQueueService } from '@/lib/services/video-queue-service';
import { createClient } from '@supabase/supabase-js';
import OpenAI from 'openai';

// Mock OpenAI
jest.mock('openai', () => {
  return jest.fn().mockImplementation(() => ({
    chat: {
      completions: {
        create: jest.fn()
      }
    }
  }));
});

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
    order: jest.fn().mockReturnThis()
  };
  
  return {
    createClient: jest.fn(() => mockSupabase)
  };
});

// Mock video-queue-service
jest.mock('@/lib/services/video-queue-service', () => ({
  videoQueueService: {
    createJob: jest.fn(),
    updateJobStatus: jest.fn(),
    listPendingJobs: jest.fn(),
    getJob: jest.fn()
  }
}));

describe('VideoGeneratorService', () => {
  let mockOpenAI: jest.Mocked<OpenAI>;
  let mockSupabase: ReturnType<typeof createClient>;
  
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Setup OpenAI mock
    mockOpenAI = new OpenAI() as jest.Mocked<OpenAI>;
    mockOpenAI.chat.completions.create = jest.fn().mockResolvedValue({
      choices: [
        {
          message: {
            content: 'Mock script content'
          }
        }
      ]
    });
    
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
    
    // Setup videoQueueService mock
    (videoQueueService.createJob as jest.Mock).mockResolvedValue({
      success: true,
      jobId: 'mock-job-id'
    });
    
    (videoQueueService.updateJobStatus as jest.Mock).mockResolvedValue({
      success: true
    });
    
    (videoQueueService.listPendingJobs as jest.Mock).mockResolvedValue({
      success: true,
      jobs: [
        {
          id: 'job-123',
          userId: 'user-123',
          request: {
            title: 'Test Video',
            description: 'Test Description',
            duration: 180
          },
          status: 'pending',
          createdAt: '2025-01-01T00:00:00Z',
          updatedAt: '2025-01-01T00:00:00Z'
        }
      ]
    });
  });
  
  describe('getInstance', () => {
    it('should return the same instance when called multiple times', () => {
      const instance1 = videoGeneratorService;
      const instance2 = videoGeneratorService;
      
      expect(instance1).toBe(instance2);
    });
  });
  
  describe('generateVideoScript', () => {
    it('should generate a script successfully', async () => {
      (mockOpenAI.chat.completions.create as jest.Mock).mockResolvedValueOnce({
        choices: [
          {
            message: {
              content: 'Generated script content'
            }
          }
        ]
      });
      
      const request = {
        title: 'Test Video',
        description: 'Test Description',
        duration: 180,
        style: 'educational' as const
      };
      
      const result = await videoGeneratorService.generateVideoScript(request);
      
      expect(result.success).toBe(true);
      expect(result.script).toBe('Generated script content');
      expect(mockOpenAI.chat.completions.create).toHaveBeenCalledWith(
        expect.objectContaining({
          model: 'gpt-4',
          messages: expect.arrayContaining([
            expect.objectContaining({ role: 'system' }),
            expect.objectContaining({ 
              role: 'user',
              content: expect.stringContaining('Test Video')
            })
          ])
        })
      );
    });
    
    it('should return the provided script if already included in request', async () => {
      const request = {
        title: 'Test Video',
        description: 'Test Description',
        script: 'Existing script content'
      };
      
      const result = await videoGeneratorService.generateVideoScript(request);
      
      expect(result.success).toBe(true);
      expect(result.script).toBe('Existing script content');
      expect(mockOpenAI.chat.completions.create).not.toHaveBeenCalled();
    });
    
    it('should handle errors gracefully', async () => {
      (mockOpenAI.chat.completions.create as jest.Mock).mockRejectedValueOnce(new Error('API error'));
      
      const request = {
        title: 'Test Video',
        description: 'Test Description'
      };
      
      const result = await videoGeneratorService.generateVideoScript(request);
      
      expect(result.success).toBe(false);
      expect(result.error).toBe('API error');
    });
    
    it('should return error if OpenAI is not configured', async () => {
      // Temporarily replace the openai property with null
      const originalOpenAI = (videoGeneratorService as any).openai;
      (videoGeneratorService as any).openai = null;
      
      const request = {
        title: 'Test Video',
        description: 'Test Description'
      };
      
      const result = await videoGeneratorService.generateVideoScript(request);
      
      expect(result.success).toBe(false);
      expect(result.error).toBe('OpenAI API key not configured');
      
      // Restore the original openai property
      (videoGeneratorService as any).openai = originalOpenAI;
    });
  });
  
  describe('generateAudioFromScript', () => {
    it('should generate audio successfully', async () => {
      const result = await videoGeneratorService.generateAudioFromScript('Test script');
      
      expect(result.success).toBe(true);
      expect(result.audioUrl).toBeDefined();
    });
    
    it('should handle errors gracefully', async () => {
      // Mock implementation to throw an error
      jest.spyOn(global.console, 'error').mockImplementation(() => {});
      jest.spyOn(global, 'setTimeout').mockImplementationOnce(() => {
        throw new Error('Audio generation error');
      });
      
      const result = await videoGeneratorService.generateAudioFromScript('Test script');
      
      expect(result.success).toBe(false);
      expect(result.error).toBe('Audio generation error');
      
      // Restore console.error
      (global.console.error as jest.Mock).mockRestore();
    });
  });
  
  describe('generateVideoWithAudio', () => {
    it('should generate video successfully', async () => {
      const result = await videoGeneratorService.generateVideoWithAudio('audio-url', 'Test Title');
      
      expect(result.success).toBe(true);
      expect(result.videoUrl).toBeDefined();
      expect(result.thumbnailUrl).toBeDefined();
    });
    
    it('should handle errors gracefully', async () => {
      // Mock implementation to throw an error
      jest.spyOn(global.console, 'error').mockImplementation(() => {});
      jest.spyOn(global, 'setTimeout').mockImplementationOnce(() => {
        throw new Error('Video generation error');
      });
      
      const result = await videoGeneratorService.generateVideoWithAudio('audio-url', 'Test Title');
      
      expect(result.success).toBe(false);
      expect(result.error).toBe('Video generation error');
      
      // Restore console.error
      (global.console.error as jest.Mock).mockRestore();
    });
  });
  
  describe('generateSubtitles', () => {
    it('should generate subtitles successfully', async () => {
      const result = await videoGeneratorService.generateSubtitles('audio-url');
      
      expect(result.success).toBe(true);
      expect(result.subtitlesUrl).toBeDefined();
    });
    
    it('should handle errors gracefully', async () => {
      // Mock implementation to throw an error
      jest.spyOn(global.console, 'error').mockImplementation(() => {});
      jest.spyOn(global, 'setTimeout').mockImplementationOnce(() => {
        throw new Error('Subtitles generation error');
      });
      
      const result = await videoGeneratorService.generateSubtitles('audio-url');
      
      expect(result.success).toBe(false);
      expect(result.error).toBe('Subtitles generation error');
      
      // Restore console.error
      (global.console.error as jest.Mock).mockRestore();
    });
  });
  
  describe('saveVideoMetadata', () => {
    it('should save new video metadata successfully', async () => {
      const mockData = { id: 'video-123', title: 'Test Video' };
      (mockSupabase.single as jest.Mock).mockResolvedValueOnce({
        data: mockData,
        error: null
      });
      
      const metadata = {
        title: 'Test Video',
        description: 'Test Description',
        duration: 180,
        videoUrl: 'video-url',
        scriptText: 'Script text',
        status: 'completed' as const,
        createdBy: 'user-123'
      };
      
      const result = await videoGeneratorService.saveVideoMetadata(metadata);
      
      expect(result.success).toBe(true);
      expect(result.data).toEqual(mockData);
      expect(mockSupabase.from).toHaveBeenCalledWith('content.videos');
      expect(mockSupabase.insert).toHaveBeenCalledWith(expect.objectContaining({
        title: 'Test Video',
        description: 'Test Description'
      }));
    });
    
    it('should update existing video metadata successfully', async () => {
      const mockData = { id: 'video-123', title: 'Updated Video' };
      (mockSupabase.single as jest.Mock).mockResolvedValueOnce({
        data: mockData,
        error: null
      });
      
      const metadata = {
        id: 'video-123',
        title: 'Updated Video',
        description: 'Updated Description',
        duration: 180,
        videoUrl: 'video-url',
        scriptText: 'Script text',
        status: 'completed' as const,
        createdBy: 'user-123'
      };
      
      const result = await videoGeneratorService.saveVideoMetadata(metadata);
      
      expect(result.success).toBe(true);
      expect(result.data).toEqual(mockData);
      expect(mockSupabase.from).toHaveBeenCalledWith('content.videos');
      expect(mockSupabase.update).toHaveBeenCalledWith(expect.objectContaining({
        title: 'Updated Video',
        description: 'Updated Description'
      }));
      expect(mockSupabase.eq).toHaveBeenCalledWith('id', 'video-123');
    });
    
    it('should handle database errors', async () => {
      (mockSupabase.single as jest.Mock).mockResolvedValueOnce({
        data: null,
        error: { message: 'Database error' }
      });
      
      const metadata = {
        title: 'Test Video',
        description: 'Test Description',
        duration: 180,
        videoUrl: 'video-url',
        scriptText: 'Script text',
        status: 'completed' as const,
        createdBy: 'user-123'
      };
      
      const result = await videoGeneratorService.saveVideoMetadata(metadata);
      
      expect(result.success).toBe(false);
      expect(result.error).toBe('Database error');
    });
  });
  
  describe('getVideo', () => {
    it('should get video successfully', async () => {
      const mockData = { id: 'video-123', title: 'Test Video' };
      (mockSupabase.single as jest.Mock).mockResolvedValueOnce({
        data: mockData,
        error: null
      });
      
      const result = await videoGeneratorService.getVideo('video-123');
      
      expect(result.success).toBe(true);
      expect(result.data).toEqual(mockData);
      expect(mockSupabase.from).toHaveBeenCalledWith('content.videos');
      expect(mockSupabase.select).toHaveBeenCalledWith('*');
      expect(mockSupabase.eq).toHaveBeenCalledWith('id', 'video-123');
    });
    
    it('should handle database errors', async () => {
      (mockSupabase.single as jest.Mock).mockResolvedValueOnce({
        data: null,
        error: { message: 'Database error' }
      });
      
      const result = await videoGeneratorService.getVideo('video-123');
      
      expect(result.success).toBe(false);
      expect(result.error).toBe('Database error');
    });
  });
  
  describe('listVideos', () => {
    it('should list videos successfully', async () => {
      const mockData = [
        { id: 'video-123', title: 'Test Video 1' },
        { id: 'video-456', title: 'Test Video 2' }
      ];
      (mockSupabase.order as jest.Mock).mockResolvedValueOnce({
        data: mockData,
        error: null
      });
      
      const result = await videoGeneratorService.listVideos();
      
      expect(result.success).toBe(true);
      expect(result.data).toEqual(mockData);
      expect(mockSupabase.from).toHaveBeenCalledWith('content.videos');
      expect(mockSupabase.select).toHaveBeenCalledWith('*');
      expect(mockSupabase.order).toHaveBeenCalledWith('created_at', { ascending: false });
    });
    
    it('should filter by courseId if provided', async () => {
      const mockData = [{ id: 'video-123', title: 'Test Video 1' }];
      (mockSupabase.order as jest.Mock).mockResolvedValueOnce({
        data: mockData,
        error: null
      });
      
      const result = await videoGeneratorService.listVideos('course-123');
      
      expect(result.success).toBe(true);
      expect(result.data).toEqual(mockData);
      expect(mockSupabase.eq).toHaveBeenCalledWith('course_id', 'course-123');
    });
    
    it('should filter by createdBy if provided', async () => {
      const mockData = [{ id: 'video-123', title: 'Test Video 1' }];
      (mockSupabase.order as jest.Mock).mockResolvedValueOnce({
        data: mockData,
        error: null
      });
      
      const result = await videoGeneratorService.listVideos(undefined, 'user-123');
      
      expect(result.success).toBe(true);
      expect(result.data).toEqual(mockData);
      expect(mockSupabase.eq).toHaveBeenCalledWith('created_by', 'user-123');
    });
    
    it('should handle database errors', async () => {
      (mockSupabase.order as jest.Mock).mockResolvedValueOnce({
        data: null,
        error: { message: 'Database error' }
      });
      
      const result = await videoGeneratorService.listVideos();
      
      expect(result.success).toBe(false);
      expect(result.error).toBe('Database error');
    });
  });
  
  describe('deleteVideo', () => {
    it('should delete video successfully', async () => {
      (mockSupabase.eq as jest.Mock).mockResolvedValueOnce({
        error: null
      });
      
      const result = await videoGeneratorService.deleteVideo('video-123');
      
      expect(result.success).toBe(true);
      expect(mockSupabase.from).toHaveBeenCalledWith('content.videos');
      expect(mockSupabase.delete).toHaveBeenCalled();
      expect(mockSupabase.eq).toHaveBeenCalledWith('id', 'video-123');
    });
    
    it('should handle database errors', async () => {
      (mockSupabase.eq as jest.Mock).mockResolvedValueOnce({
        error: { message: 'Database error' }
      });
      
      const result = await videoGeneratorService.deleteVideo('video-123');
      
      expect(result.success).toBe(false);
      expect(result.error).toBe('Database error');
    });
  });
  
  describe('generateVideo', () => {
    it('should create a job successfully', async () => {
      const request = {
        title: 'Test Video',
        description: 'Test Description'
      };
      
      const result = await videoGeneratorService.generateVideo(request, 'user-123');
      
      expect(result.success).toBe(true);
      expect(result.jobId).toBe('mock-job-id');
      expect(videoQueueService.createJob).toHaveBeenCalledWith('user-123', request);
    });
    
    it('should handle job creation errors', async () => {
      (videoQueueService.createJob as jest.Mock).mockResolvedValueOnce({
        success: false,
        error: 'Job creation error'
      });
      
      const request = {
        title: 'Test Video',
        description: 'Test Description'
      };
      
      const result = await videoGeneratorService.generateVideo(request, 'user-123');
      
      expect(result.success).toBe(false);
      expect(result.error).toBe('Job creation error');
    });
  });
  
  describe('processNextJob', () => {
    it('should process a job successfully', async () => {
      // Mock successful script generation
      jest.spyOn(videoGeneratorService, 'generateVideoScript').mockResolvedValueOnce({
        success: true,
        script: 'Generated script'
      });
      
      // Mock successful audio generation
      jest.spyOn(videoGeneratorService, 'generateAudioFromScript').mockResolvedValueOnce({
        success: true,
        audioUrl: 'audio-url'
      });
      
      // Mock successful video generation
      jest.spyOn(videoGeneratorService, 'generateVideoWithAudio').mockResolvedValueOnce({
        success: true,
        videoUrl: 'video-url',
        thumbnailUrl: 'thumbnail-url'
      });
      
      // Mock successful subtitles generation
      jest.spyOn(videoGeneratorService, 'generateSubtitles').mockResolvedValueOnce({
        success: true,
        subtitlesUrl: 'subtitles-url'
      });
      
      // Mock successful metadata saving
      jest.spyOn(videoGeneratorService, 'saveVideoMetadata').mockResolvedValueOnce({
        success: true,
        data: { id: 'video-123' }
      });
      
      const result = await videoGeneratorService.processNextJob();
      
      expect(result.success).toBe(true);
      expect(result.videoId).toBe('video-123');
      expect(videoQueueService.updateJobStatus).toHaveBeenCalledWith('job-123', 'processing');
      expect(videoQueueService.updateJobStatus).toHaveBeenCalledWith('job-123', 'completed', { videoId: 'video-123' });
    });
    
    it('should return early if no jobs are pending', async () => {
      (videoQueueService.listPendingJobs as jest.Mock).mockResolvedValueOnce({
        success: true,
        jobs: []
      });
      
      const result = await videoGeneratorService.processNextJob();
      
      expect(result.success).toBe(true);
      expect(videoQueueService.updateJobStatus).not.toHaveBeenCalled();
    });
    
    it('should handle script generation failure', async () => {
      // Mock failed script generation
      jest.spyOn(videoGeneratorService, 'generateVideoScript').mockResolvedValueOnce({
        success: false,
        error: 'Script generation error'
      });
      
      const result = await videoGeneratorService.processNextJob();
      
      expect(result.success).toBe(false);
      expect(result.error).toBe('Script generation error');
      expect(videoQueueService.updateJobStatus).toHaveBeenCalledWith(
        'job-123', 
        'failed', 
        null, 
        'Script generation error'
      );
    });
    
    it('should handle audio generation failure', async () => {
      // Mock successful script generation
      jest.spyOn(videoGeneratorService, 'generateVideoScript').mockResolvedValueOnce({
        success: true,
        script: 'Generated script'
      });
      
      // Mock failed audio generation
      jest.spyOn(videoGeneratorService, 'generateAudioFromScript').mockResolvedValueOnce({
        success: false,
        error: 'Audio generation error'
      });
      
      const result = await videoGeneratorService.processNextJob();
      
      expect(result.success).toBe(false);
      expect(result.error).toBe('Audio generation error');
      expect(videoQueueService.updateJobStatus).toHaveBeenCalledWith(
        'job-123', 
        'failed', 
        null, 
        'Audio generation error'
      );
    });
    
    it('should handle video generation failure', async () => {
      // Mock successful script generation
      jest.spyOn(videoGeneratorService, 'generateVideoScript').mockResolvedValueOnce({
        success: true,
        script: 'Generated script'
      });
      
      // Mock successful audio generation
      jest.spyOn(videoGeneratorService, 'generateAudioFromScript').mockResolvedValueOnce({
        success: true,
        audioUrl: 'audio-url'
      });
      
      // Mock failed video generation
      jest.spyOn(videoGeneratorService, 'generateVideoWithAudio').mockResolvedValueOnce({
        success: false,
        error: 'Video generation error'
      });
      
      const result = await videoGeneratorService.processNextJob();
      
      expect(result.success).toBe(false);
      expect(result.error).toBe('Video generation error');
      expect(videoQueueService.updateJobStatus).toHaveBeenCalledWith(
        'job-123', 
        'failed', 
        null, 
        'Video generation error'
      );
    });
    
    it('should handle metadata saving failure', async () => {
      // Mock successful script generation
      jest.spyOn(videoGeneratorService, 'generateVideoScript').mockResolvedValueOnce({
        success: true,
        script: 'Generated script'
      });
      
      // Mock successful audio generation
      jest.spyOn(videoGeneratorService, 'generateAudioFromScript').mockResolvedValueOnce({
        success: true,
        audioUrl: 'audio-url'
      });
      
      // Mock successful video generation
      jest.spyOn(videoGeneratorService, 'generateVideoWithAudio').mockResolvedValueOnce({
        success: true,
        videoUrl: 'video-url',
        thumbnailUrl: 'thumbnail-url'
      });
      
      // Mock failed metadata saving
      jest.spyOn(videoGeneratorService, 'saveVideoMetadata').mockResolvedValueOnce({
        success: false,
        error: 'Metadata saving error'
      });
      
      const result = await videoGeneratorService.processNextJob();
      
      expect(result.success).toBe(false);
      expect(result.error).toBe('Metadata saving error');
      expect(videoQueueService.updateJobStatus).toHaveBeenCalledWith(
        'job-123', 
        'failed', 
        null, 
        'Metadata saving error'
      );
    });
  });
});
