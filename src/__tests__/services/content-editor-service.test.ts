import { contentEditorService, ContentItem } from '@/lib/services/content-editor-service';
import { createServerSupabaseClient } from '@/lib/supabase/server';

// Mock the Supabase client
jest.mock('@/lib/supabase/server', () => ({
  createServerSupabaseClient: jest.fn()
}));

describe('ContentEditorService', () => {
  // Mock data
  const mockContentItems: ContentItem[] = [
    {
      id: 'content-1',
      title: 'Test Content 1',
      content: 'This is test content 1',
      type: 'text',
      created_at: '2025-01-01T00:00:00Z',
      updated_at: '2025-01-01T00:00:00Z'
    },
    {
      id: 'content-2',
      title: 'Test Content 2',
      content: 'This is test content 2',
      type: 'video',
      created_at: '2025-01-02T00:00:00Z',
      updated_at: '2025-01-02T00:00:00Z'
    }
  ];

  const mockContentItem: ContentItem = {
    id: 'content-1',
    title: 'Test Content 1',
    content: 'This is test content 1',
    type: 'text',
    created_at: '2025-01-01T00:00:00Z',
    updated_at: '2025-01-01T00:00:00Z'
  };

  // Mock Supabase methods
  const mockSelect = jest.fn();
  const mockOrder = jest.fn();
  const mockEq = jest.fn();
  const mockSingle = jest.fn();
  const mockInsert = jest.fn();
  const mockUpdate = jest.fn();
  const mockDelete = jest.fn();
  const mockFrom = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    
    // Reset mock chain
    mockSelect.mockReturnValue({ order: mockOrder });
    mockOrder.mockReturnValue({ data: mockContentItems, error: null });
    mockEq.mockReturnValue({ single: mockSingle });
    mockSingle.mockReturnValue({ data: mockContentItem, error: null });
    mockInsert.mockReturnValue({ select: mockSelect });
    mockUpdate.mockReturnValue({ eq: mockEq });
    mockDelete.mockReturnValue({ eq: mockEq });
    mockFrom.mockReturnValue({ 
      select: mockSelect,
      insert: mockInsert,
      update: mockUpdate,
      delete: mockDelete
    });
    
    // Mock Supabase client
    (createServerSupabaseClient as jest.Mock).mockReturnValue({
      from: mockFrom
    });
    
    // Mock console.error to prevent test output pollution
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('getContentItems', () => {
    it('should return content items when successful', async () => {
      const result = await contentEditorService.getContentItems();
      
      expect(createServerSupabaseClient).toHaveBeenCalled();
      expect(mockFrom).toHaveBeenCalledWith('content_items');
      expect(mockSelect).toHaveBeenCalledWith('*');
      expect(mockOrder).toHaveBeenCalledWith('created_at', { ascending: false });
      expect(result).toEqual(mockContentItems);
    });

    it('should return empty array when error occurs', async () => {
      mockOrder.mockReturnValue({ data: null, error: new Error('Database error') });
      
      const result = await contentEditorService.getContentItems();
      
      expect(console.error).toHaveBeenCalled();
      expect(result).toEqual([]);
    });
  });

  describe('getContentItem', () => {
    it('should return a content item when successful', async () => {
      const result = await contentEditorService.getContentItem('content-1');
      
      expect(createServerSupabaseClient).toHaveBeenCalled();
      expect(mockFrom).toHaveBeenCalledWith('content_items');
      expect(mockSelect).toHaveBeenCalledWith('*');
      expect(mockEq).toHaveBeenCalledWith('id', 'content-1');
      expect(mockSingle).toHaveBeenCalled();
      expect(result).toEqual(mockContentItem);
    });

    it('should return null when error occurs', async () => {
      mockSingle.mockReturnValue({ data: null, error: new Error('Database error') });
      
      const result = await contentEditorService.getContentItem('content-1');
      
      expect(console.error).toHaveBeenCalled();
      expect(result).toBeNull();
    });
  });

  describe('createContentItem', () => {
    it('should create a content item when successful', async () => {
      // Setup mock for insert chain
      mockSelect.mockReturnValue({ single: mockSingle });
      
      const newItem = {
        title: 'New Content',
        content: 'This is new content',
        type: 'text' as const
      };
      
      const result = await contentEditorService.createContentItem(newItem);
      
      expect(createServerSupabaseClient).toHaveBeenCalled();
      expect(mockFrom).toHaveBeenCalledWith('content_items');
      expect(mockInsert).toHaveBeenCalledWith(expect.objectContaining({
        title: 'New Content',
        content: 'This is new content',
        type: 'text',
        created_at: expect.any(String),
        updated_at: expect.any(String)
      }));
      expect(mockSelect).toHaveBeenCalled();
      expect(mockSingle).toHaveBeenCalled();
      expect(result).toEqual(mockContentItem);
    });

    it('should throw error when creation fails', async () => {
      // Setup mock for insert chain
      mockSelect.mockReturnValue({ single: jest.fn().mockReturnValue({ 
        data: null, 
        error: new Error('Database error') 
      })});
      
      const newItem = {
        title: 'New Content',
        content: 'This is new content',
        type: 'text' as const
      };
      
      await expect(contentEditorService.createContentItem(newItem))
        .rejects.toThrow('Failed to create content item: Database error');
      
      expect(console.error).toHaveBeenCalled();
    });
  });

  describe('updateContentItem', () => {
    it('should update a content item when successful', async () => {
      // Setup mock for update chain
      mockEq.mockReturnValue({ select: mockSelect });
      mockSelect.mockReturnValue({ single: mockSingle });
      
      const updates = {
        title: 'Updated Content',
        content: 'This is updated content'
      };
      
      const result = await contentEditorService.updateContentItem('content-1', updates);
      
      expect(createServerSupabaseClient).toHaveBeenCalled();
      expect(mockFrom).toHaveBeenCalledWith('content_items');
      expect(mockUpdate).toHaveBeenCalledWith(expect.objectContaining({
        title: 'Updated Content',
        content: 'This is updated content',
        updated_at: expect.any(String)
      }));
      expect(mockEq).toHaveBeenCalledWith('id', 'content-1');
      expect(mockSelect).toHaveBeenCalled();
      expect(mockSingle).toHaveBeenCalled();
      expect(result).toEqual(mockContentItem);
    });

    it('should throw error when update fails', async () => {
      // Setup mock for update chain
      mockEq.mockReturnValue({ select: mockSelect });
      mockSelect.mockReturnValue({ single: jest.fn().mockReturnValue({ 
        data: null, 
        error: new Error('Database error') 
      })});
      
      const updates = {
        title: 'Updated Content',
        content: 'This is updated content'
      };
      
      await expect(contentEditorService.updateContentItem('content-1', updates))
        .rejects.toThrow('Failed to update content item: Database error');
      
      expect(console.error).toHaveBeenCalled();
    });
  });

  describe('deleteContentItem', () => {
    it('should delete a content item when successful', async () => {
      // Setup mock for delete chain
      mockEq.mockReturnValue({ error: null });
      
      const result = await contentEditorService.deleteContentItem('content-1');
      
      expect(createServerSupabaseClient).toHaveBeenCalled();
      expect(mockFrom).toHaveBeenCalledWith('content_items');
      expect(mockDelete).toHaveBeenCalled();
      expect(mockEq).toHaveBeenCalledWith('id', 'content-1');
      expect(result).toBe(true);
    });

    it('should throw error when deletion fails', async () => {
      // Setup mock for delete chain
      mockEq.mockReturnValue({ error: new Error('Database error') });
      
      await expect(contentEditorService.deleteContentItem('content-1'))
        .rejects.toThrow('Failed to delete content item: Database error');
      
      expect(console.error).toHaveBeenCalled();
    });
  });

  describe('generateAIContent', () => {
    it('should return AI generated content', async () => {
      const result = await contentEditorService.generateAIContent('Test prompt', 'text');
      
      expect(result).toEqual({
        title: 'AI Generated text Content',
        content: 'This is AI-generated content based on your prompt: "Test prompt"',
        type: 'text'
      });
    });
  });

  describe('getAISuggestions', () => {
    it('should return AI suggestions', async () => {
      const result = await contentEditorService.getAISuggestions();
      
      expect(result).toEqual({
        success: true,
        suggestions: expect.arrayContaining([
          expect.any(String),
          expect.any(String),
          expect.any(String)
        ])
      });
    });
  });
});
