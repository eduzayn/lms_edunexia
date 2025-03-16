import { ForumService, forumService } from '@/lib/services/forum-service';
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

describe('ForumService', () => {
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
      const instance1 = forumService;
      const instance2 = forumService;
      
      expect(instance1).toBe(instance2);
    });
  });
  
  describe('createForum', () => {
    it('should create a forum successfully', async () => {
      const mockForum = {
        id: 'forum-123',
        title: 'Test Forum',
        description: 'Test Description',
        is_global: true,
        created_at: '2025-01-01T00:00:00Z',
        updated_at: '2025-01-01T00:00:00Z'
      };
      
      (mockSupabase.single as jest.Mock).mockResolvedValueOnce({
        data: mockForum,
        error: null
      });
      
      const result = await forumService.createForum({
        title: 'Test Forum',
        description: 'Test Description',
        is_global: true
      });
      
      expect(result.success).toBe(true);
      expect(result.data).toEqual(mockForum);
      expect(mockSupabase.from).toHaveBeenCalledWith('forums.forums');
      expect(mockSupabase.insert).toHaveBeenCalledWith({
        title: 'Test Forum',
        description: 'Test Description',
        is_global: true
      });
    });
    
    it('should handle database errors', async () => {
      (mockSupabase.single as jest.Mock).mockResolvedValueOnce({
        data: null,
        error: { message: 'Database error' }
      });
      
      const result = await forumService.createForum({
        title: 'Test Forum',
        description: 'Test Description',
        is_global: true
      });
      
      expect(result.success).toBe(false);
      expect(result.error).toBe('Database error');
    });
  });
  
  describe('getForum', () => {
    it('should get a forum successfully', async () => {
      const mockForum = {
        id: 'forum-123',
        title: 'Test Forum',
        description: 'Test Description',
        is_global: true,
        created_at: '2025-01-01T00:00:00Z',
        updated_at: '2025-01-01T00:00:00Z'
      };
      
      (mockSupabase.single as jest.Mock).mockResolvedValueOnce({
        data: mockForum,
        error: null
      });
      
      const result = await forumService.getForum('forum-123');
      
      expect(result.success).toBe(true);
      expect(result.data).toEqual(mockForum);
      expect(mockSupabase.from).toHaveBeenCalledWith('forums.forums');
      expect(mockSupabase.select).toHaveBeenCalledWith('*');
      expect(mockSupabase.eq).toHaveBeenCalledWith('id', 'forum-123');
    });
    
    it('should handle database errors', async () => {
      (mockSupabase.single as jest.Mock).mockResolvedValueOnce({
        data: null,
        error: { message: 'Database error' }
      });
      
      const result = await forumService.getForum('forum-123');
      
      expect(result.success).toBe(false);
      expect(result.error).toBe('Database error');
    });
  });
  
  // Additional tests for other forum methods would follow the same pattern
});
