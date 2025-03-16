import { StudentFeedbackService, studentFeedbackService } from '@/lib/services/student-feedback-service';
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

describe('StudentFeedbackService', () => {
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
      const instance1 = studentFeedbackService;
      const instance2 = studentFeedbackService;
      
      expect(instance1).toBe(instance2);
    });
  });
  
  describe('submitFeedback', () => {
    it('should submit feedback successfully', async () => {
      const mockFeedback = {
        id: 'feedback-123',
        student_id: 'student-123',
        course_id: 'course-123',
        module_id: 'module-123',
        rating: 4,
        comments: 'Great course!',
        created_at: '2025-01-01T00:00:00Z'
      };
      
      (mockSupabase.single as jest.Mock).mockResolvedValueOnce({
        data: mockFeedback,
        error: null
      });
      
      const result = await studentFeedbackService.submitFeedback({
        student_id: 'student-123',
        course_id: 'course-123',
        module_id: 'module-123',
        rating: 4,
        comments: 'Great course!'
      });
      
      expect(result.success).toBe(true);
      expect(result.data).toEqual(mockFeedback);
      expect(mockSupabase.from).toHaveBeenCalledWith('feedback.student_feedback');
      expect(mockSupabase.insert).toHaveBeenCalledWith({
        student_id: 'student-123',
        course_id: 'course-123',
        module_id: 'module-123',
        rating: 4,
        comments: 'Great course!'
      });
    });
    
    it('should handle database errors', async () => {
      (mockSupabase.single as jest.Mock).mockResolvedValueOnce({
        data: null,
        error: { message: 'Database error' }
      });
      
      const result = await studentFeedbackService.submitFeedback({
        student_id: 'student-123',
        course_id: 'course-123',
        rating: 4
      });
      
      expect(result.success).toBe(false);
      expect(result.error).toBe('Database error');
    });
  });
  
  describe('getFeedback', () => {
    it('should get feedback by ID successfully', async () => {
      const mockFeedback = {
        id: 'feedback-123',
        student_id: 'student-123',
        course_id: 'course-123',
        rating: 4,
        comments: 'Great course!',
        created_at: '2025-01-01T00:00:00Z'
      };
      
      (mockSupabase.single as jest.Mock).mockResolvedValueOnce({
        data: mockFeedback,
        error: null
      });
      
      const result = await studentFeedbackService.getFeedback('feedback-123');
      
      expect(result.success).toBe(true);
      expect(result.data).toEqual(mockFeedback);
      expect(mockSupabase.from).toHaveBeenCalledWith('feedback.student_feedback');
      expect(mockSupabase.select).toHaveBeenCalledWith('*');
      expect(mockSupabase.eq).toHaveBeenCalledWith('id', 'feedback-123');
    });
    
    it('should handle database errors', async () => {
      (mockSupabase.single as jest.Mock).mockResolvedValueOnce({
        data: null,
        error: { message: 'Database error' }
      });
      
      const result = await studentFeedbackService.getFeedback('feedback-123');
      
      expect(result.success).toBe(false);
      expect(result.error).toBe('Database error');
    });
  });
  
  describe('updateFeedback', () => {
    it('should update feedback successfully', async () => {
      const mockFeedback = {
        id: 'feedback-123',
        student_id: 'student-123',
        course_id: 'course-123',
        rating: 5,
        comments: 'Updated comments',
        created_at: '2025-01-01T00:00:00Z',
        updated_at: '2025-01-02T00:00:00Z'
      };
      
      (mockSupabase.single as jest.Mock).mockResolvedValueOnce({
        data: mockFeedback,
        error: null
      });
      
      const result = await studentFeedbackService.updateFeedback('feedback-123', {
        rating: 5,
        comments: 'Updated comments'
      });
      
      expect(result.success).toBe(true);
      expect(result.data).toEqual(mockFeedback);
      expect(mockSupabase.from).toHaveBeenCalledWith('feedback.student_feedback');
      expect(mockSupabase.update).toHaveBeenCalledWith({
        rating: 5,
        comments: 'Updated comments',
        updated_at: expect.any(String)
      });
      expect(mockSupabase.eq).toHaveBeenCalledWith('id', 'feedback-123');
    });
    
    it('should handle database errors', async () => {
      (mockSupabase.single as jest.Mock).mockResolvedValueOnce({
        data: null,
        error: { message: 'Database error' }
      });
      
      const result = await studentFeedbackService.updateFeedback('feedback-123', {
        rating: 5
      });
      
      expect(result.success).toBe(false);
      expect(result.error).toBe('Database error');
    });
  });
  
  describe('deleteFeedback', () => {
    it('should delete feedback successfully', async () => {
      (mockSupabase.eq as jest.Mock).mockResolvedValueOnce({
        error: null
      });
      
      const result = await studentFeedbackService.deleteFeedback('feedback-123');
      
      expect(result.success).toBe(true);
      expect(mockSupabase.from).toHaveBeenCalledWith('feedback.student_feedback');
      expect(mockSupabase.delete).toHaveBeenCalled();
      expect(mockSupabase.eq).toHaveBeenCalledWith('id', 'feedback-123');
    });
    
    it('should handle database errors', async () => {
      (mockSupabase.eq as jest.Mock).mockResolvedValueOnce({
        error: { message: 'Database error' }
      });
      
      const result = await studentFeedbackService.deleteFeedback('feedback-123');
      
      expect(result.success).toBe(false);
      expect(result.error).toBe('Database error');
    });
  });
  
  describe('listFeedbackByCourse', () => {
    it('should list feedback by course successfully', async () => {
      const mockFeedbacks = [
        {
          id: 'feedback-123',
          student_id: 'student-123',
          course_id: 'course-123',
          rating: 4,
          comments: 'Great course!',
          created_at: '2025-01-01T00:00:00Z'
        },
        {
          id: 'feedback-456',
          student_id: 'student-456',
          course_id: 'course-123',
          rating: 5,
          comments: 'Excellent!',
          created_at: '2025-01-02T00:00:00Z'
        }
      ];
      
      (mockSupabase.order as jest.Mock).mockResolvedValueOnce({
        data: mockFeedbacks,
        error: null
      });
      
      const result = await studentFeedbackService.listFeedbackByCourse('course-123');
      
      expect(result.success).toBe(true);
      expect(result.data).toEqual(mockFeedbacks);
      expect(mockSupabase.from).toHaveBeenCalledWith('feedback.student_feedback');
      expect(mockSupabase.select).toHaveBeenCalledWith('*');
      expect(mockSupabase.eq).toHaveBeenCalledWith('course_id', 'course-123');
      expect(mockSupabase.order).toHaveBeenCalledWith('created_at', { ascending: false });
    });
    
    it('should handle database errors', async () => {
      (mockSupabase.order as jest.Mock).mockResolvedValueOnce({
        data: null,
        error: { message: 'Database error' }
      });
      
      const result = await studentFeedbackService.listFeedbackByCourse('course-123');
      
      expect(result.success).toBe(false);
      expect(result.error).toBe('Database error');
    });
  });
  
  describe('listFeedbackByStudent', () => {
    it('should list feedback by student successfully', async () => {
      const mockFeedbacks = [
        {
          id: 'feedback-123',
          student_id: 'student-123',
          course_id: 'course-123',
          rating: 4,
          comments: 'Great course!',
          created_at: '2025-01-01T00:00:00Z'
        },
        {
          id: 'feedback-789',
          student_id: 'student-123',
          course_id: 'course-456',
          rating: 3,
          comments: 'Good course',
          created_at: '2025-01-03T00:00:00Z'
        }
      ];
      
      (mockSupabase.order as jest.Mock).mockResolvedValueOnce({
        data: mockFeedbacks,
        error: null
      });
      
      const result = await studentFeedbackService.listFeedbackByStudent('student-123');
      
      expect(result.success).toBe(true);
      expect(result.data).toEqual(mockFeedbacks);
      expect(mockSupabase.from).toHaveBeenCalledWith('feedback.student_feedback');
      expect(mockSupabase.select).toHaveBeenCalledWith('*');
      expect(mockSupabase.eq).toHaveBeenCalledWith('student_id', 'student-123');
      expect(mockSupabase.order).toHaveBeenCalledWith('created_at', { ascending: false });
    });
    
    it('should handle database errors', async () => {
      (mockSupabase.order as jest.Mock).mockResolvedValueOnce({
        data: null,
        error: { message: 'Database error' }
      });
      
      const result = await studentFeedbackService.listFeedbackByStudent('student-123');
      
      expect(result.success).toBe(false);
      expect(result.error).toBe('Database error');
    });
  });
  
  describe('getAverageCourseRating', () => {
    it('should get average course rating successfully', async () => {
      const mockRating = { average_rating: 4.5 };
      
      (mockSupabase.single as jest.Mock).mockResolvedValueOnce({
        data: mockRating,
        error: null
      });
      
      const result = await studentFeedbackService.getAverageCourseRating('course-123');
      
      expect(result.success).toBe(true);
      expect(result.data).toEqual(mockRating);
      expect(mockSupabase.from).toHaveBeenCalledWith('feedback.course_ratings');
      expect(mockSupabase.select).toHaveBeenCalledWith('average_rating');
      expect(mockSupabase.eq).toHaveBeenCalledWith('course_id', 'course-123');
    });
    
    it('should handle database errors', async () => {
      (mockSupabase.single as jest.Mock).mockResolvedValueOnce({
        data: null,
        error: { message: 'Database error' }
      });
      
      const result = await studentFeedbackService.getAverageCourseRating('course-123');
      
      expect(result.success).toBe(false);
      expect(result.error).toBe('Database error');
    });
  });
});
