import { analyticsService } from '@/lib/services/analytics-service';
import { createServerSupabaseClient } from '@/lib/supabase/server';

// Mock the Supabase client
jest.mock('@/lib/supabase/server', () => ({
  createServerSupabaseClient: jest.fn()
}));

describe('AnalyticsService', () => {
  // Get the singleton instance
  const analyticsServiceInstance = analyticsService;
  
  // Mock data
  const mockCourseAnalytics = {
    courseId: 'course-1',
    totalStudents: 50,
    activeStudents: 35,
    completionRate: 75,
    averageScore: 85,
    studentProgress: [
      { studentId: 'student-1', progress: 80, lastActivity: '2025-01-01T00:00:00Z' }
    ],
    moduleCompletion: [
      { moduleId: 'module-1', title: 'Module 1', completionRate: 70 }
    ],
    assessmentPerformance: [
      { assessmentId: 'assessment-1', title: 'Assessment 1', averageScore: 85, completionRate: 90 }
    ]
  };
  
  const mockStudentAnalytics = {
    studentId: 'student-1',
    enrolledCourses: 3,
    completedCourses: 1,
    averageScore: 85,
    totalTimeSpent: 3600,
    courseProgress: [
      { courseId: 'course-1', title: 'Course 1', progress: 80, score: 85, lastActivity: '2025-01-01T00:00:00Z' }
    ],
    assessmentPerformance: [
      { assessmentId: 'assessment-1', title: 'Assessment 1', score: 85, completedAt: '2025-01-01T00:00:00Z' }
    ],
    strengths: ['Bom desempenho em Múltipla Escolha'],
    areasForImprovement: ['Precisa melhorar em Dissertação']
  };
  
  const mockAssessmentAnalytics = {
    assessmentId: 'assessment-1',
    totalSubmissions: 30,
    averageScore: 85,
    passRate: 90,
    averageTimeSpent: 1800,
    questionPerformance: [
      { questionId: 'question-1', averageScore: 4.5, correctRate: 90 }
    ],
    scoreDistribution: [0, 0, 0, 5, 10, 15, 20, 25, 15, 10]
  };
  
  const mockContentAnalytics = {
    contentId: 'content-1',
    views: 100,
    uniqueViews: 50,
    averageTimeSpent: 300,
    completionRate: 80,
    engagementRate: 75,
    feedback: {
      rating: 4.5,
      comments: ['Great content!', 'Very helpful']
    }
  };

  // Mock Supabase methods
  const mockSelect = jest.fn();
  const mockEq = jest.fn();
  const mockOrder = jest.fn();
  const mockLimit = jest.fn();
  const mockSingle = jest.fn();
  const mockInsert = jest.fn();
  const mockFrom = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    
    // Reset mock chain
    mockSingle.mockReturnValue({ data: { data: mockCourseAnalytics }, error: null });
    mockLimit.mockReturnValue({ single: mockSingle });
    mockOrder.mockReturnValue({ limit: mockLimit });
    mockEq.mockReturnValue({ order: mockOrder, single: mockSingle });
    mockSelect.mockReturnValue({ eq: mockEq });
    mockInsert.mockReturnValue({ error: null });
    mockFrom.mockReturnValue({ 
      select: mockSelect,
      insert: mockInsert
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

  describe('getInstance', () => {
    it('should be a singleton instance', () => {
      const instance1 = analyticsService;
      const instance2 = analyticsService;
      
      expect(instance1).toBe(instance2);
    });
  });

  describe('getCourseAnalytics', () => {
    it('should return course analytics when data exists', async () => {
      const result = await analyticsServiceInstance.getCourseAnalytics('course-1');
      
      expect(createServerSupabaseClient).toHaveBeenCalled();
      expect(mockFrom).toHaveBeenCalledWith('analytics');
      expect(mockSelect).toHaveBeenCalledWith('*');
      expect(mockEq).toHaveBeenCalledWith('type', 'course');
      expect(mockEq).toHaveBeenCalledWith('entity_id', 'course-1');
      expect(mockOrder).toHaveBeenCalledWith('created_at', { ascending: false });
      expect(mockLimit).toHaveBeenCalledWith(1);
      expect(mockSingle).toHaveBeenCalled();
      expect(result).toEqual(mockCourseAnalytics);
    });

    it('should generate course analytics when data does not exist', async () => {
      // Mock error response for analytics query
      mockSingle.mockReturnValueOnce({ data: null, error: new Error('Not found') });
      
      // Mock course data
      mockSingle.mockReturnValueOnce({ 
        data: { id: 'course-1', title: 'Course 1' }, 
        error: null 
      });
      
      // Mock enrollments data
      mockEq.mockReturnValueOnce({ 
        data: [{ student_id: 'student-1', course_id: 'course-1' }], 
        error: null 
      });
      
      // Mock modules data
      mockEq.mockReturnValueOnce({ 
        data: [{ id: 'module-1', title: 'Module 1', course_id: 'course-1' }], 
        error: null 
      });
      
      // Mock assessments data
      mockEq.mockReturnValueOnce({ 
        data: [{ id: 'assessment-1', title: 'Assessment 1', course_id: 'course-1' }], 
        error: null 
      });
      
      // Mock generateCourseAnalytics implementation
      jest.spyOn(analyticsServiceInstance, 'generateCourseAnalytics').mockResolvedValue(mockCourseAnalytics);
      
      const result = await analyticsServiceInstance.getCourseAnalytics('course-1');
      
      expect(createServerSupabaseClient).toHaveBeenCalled();
      expect(mockFrom).toHaveBeenCalledWith('analytics');
      expect(analyticsServiceInstance.generateCourseAnalytics).toHaveBeenCalledWith('course-1');
      expect(result).toEqual(mockCourseAnalytics);
    });

    it('should handle errors gracefully', async () => {
      // Mock error response for analytics query
      mockSingle.mockReturnValueOnce({ data: null, error: new Error('Database error') });
      
      // Mock generateCourseAnalytics to return null on error
      jest.spyOn(analyticsServiceInstance, 'generateCourseAnalytics').mockResolvedValue(null);
      
      const result = await analyticsServiceInstance.getCourseAnalytics('course-1');
      
      expect(createServerSupabaseClient).toHaveBeenCalled();
      expect(console.error).toHaveBeenCalled();
      expect(analyticsServiceInstance.generateCourseAnalytics).toHaveBeenCalledWith('course-1');
      expect(result).toBeNull();
    });
  });

  describe('getStudentAnalytics', () => {
    it('should return student analytics when data exists', async () => {
      // Mock student analytics data
      mockSingle.mockReturnValue({ data: { data: mockStudentAnalytics }, error: null });
      
      const result = await analyticsServiceInstance.getStudentAnalytics('student-1');
      
      expect(createServerSupabaseClient).toHaveBeenCalled();
      expect(mockFrom).toHaveBeenCalledWith('analytics');
      expect(mockSelect).toHaveBeenCalledWith('*');
      expect(mockEq).toHaveBeenCalledWith('type', 'student');
      expect(mockEq).toHaveBeenCalledWith('entity_id', 'student-1');
      expect(mockOrder).toHaveBeenCalledWith('created_at', { ascending: false });
      expect(mockLimit).toHaveBeenCalledWith(1);
      expect(mockSingle).toHaveBeenCalled();
      expect(result).toEqual(mockStudentAnalytics);
    });

    it('should generate student analytics when data does not exist', async () => {
      // Mock error response for analytics query
      mockSingle.mockReturnValueOnce({ data: null, error: new Error('Not found') });
      
      // Mock generateStudentAnalytics implementation
      jest.spyOn(analyticsServiceInstance, 'generateStudentAnalytics').mockResolvedValue(mockStudentAnalytics);
      
      const result = await analyticsServiceInstance.getStudentAnalytics('student-1');
      
      expect(createServerSupabaseClient).toHaveBeenCalled();
      expect(mockFrom).toHaveBeenCalledWith('analytics');
      expect(analyticsServiceInstance.generateStudentAnalytics).toHaveBeenCalledWith('student-1');
      expect(result).toEqual(mockStudentAnalytics);
    });

    it('should handle errors gracefully', async () => {
      // Mock error response for analytics query
      mockSingle.mockReturnValueOnce({ data: null, error: new Error('Database error') });
      
      // Mock generateStudentAnalytics to return null on error
      jest.spyOn(analyticsServiceInstance, 'generateStudentAnalytics').mockResolvedValue(null);
      
      const result = await analyticsServiceInstance.getStudentAnalytics('student-1');
      
      expect(createServerSupabaseClient).toHaveBeenCalled();
      expect(console.error).toHaveBeenCalled();
      expect(analyticsServiceInstance.generateStudentAnalytics).toHaveBeenCalledWith('student-1');
      expect(result).toBeNull();
    });
  });

  describe('getAssessmentAnalytics', () => {
    it('should return assessment analytics when data exists', async () => {
      // Mock assessment analytics data
      mockSingle.mockReturnValue({ data: { data: mockAssessmentAnalytics }, error: null });
      
      const result = await analyticsServiceInstance.getAssessmentAnalytics('assessment-1');
      
      expect(createServerSupabaseClient).toHaveBeenCalled();
      expect(mockFrom).toHaveBeenCalledWith('analytics');
      expect(mockSelect).toHaveBeenCalledWith('*');
      expect(mockEq).toHaveBeenCalledWith('type', 'assessment');
      expect(mockEq).toHaveBeenCalledWith('entity_id', 'assessment-1');
      expect(mockOrder).toHaveBeenCalledWith('created_at', { ascending: false });
      expect(mockLimit).toHaveBeenCalledWith(1);
      expect(mockSingle).toHaveBeenCalled();
      expect(result).toEqual(mockAssessmentAnalytics);
    });

    it('should generate assessment analytics when data does not exist', async () => {
      // Mock error response for analytics query
      mockSingle.mockReturnValueOnce({ data: null, error: new Error('Not found') });
      
      // Mock generateAssessmentAnalytics implementation
      jest.spyOn(analyticsServiceInstance, 'generateAssessmentAnalytics').mockResolvedValue(mockAssessmentAnalytics);
      
      const result = await analyticsServiceInstance.getAssessmentAnalytics('assessment-1');
      
      expect(createServerSupabaseClient).toHaveBeenCalled();
      expect(mockFrom).toHaveBeenCalledWith('analytics');
      expect(analyticsServiceInstance.generateAssessmentAnalytics).toHaveBeenCalledWith('assessment-1');
      expect(result).toEqual(mockAssessmentAnalytics);
    });

    it('should handle errors gracefully', async () => {
      // Mock error response for analytics query
      mockSingle.mockReturnValueOnce({ data: null, error: new Error('Database error') });
      
      // Mock generateAssessmentAnalytics to return null on error
      jest.spyOn(analyticsServiceInstance, 'generateAssessmentAnalytics').mockResolvedValue(null);
      
      const result = await analyticsServiceInstance.getAssessmentAnalytics('assessment-1');
      
      expect(createServerSupabaseClient).toHaveBeenCalled();
      expect(console.error).toHaveBeenCalled();
      expect(analyticsServiceInstance.generateAssessmentAnalytics).toHaveBeenCalledWith('assessment-1');
      expect(result).toBeNull();
    });
  });

  describe('getContentAnalytics', () => {
    it('should return content analytics when data exists', async () => {
      // Mock content analytics data
      mockSingle.mockReturnValue({ data: { data: mockContentAnalytics }, error: null });
      
      const result = await analyticsServiceInstance.getContentAnalytics('content-1');
      
      expect(createServerSupabaseClient).toHaveBeenCalled();
      expect(mockFrom).toHaveBeenCalledWith('analytics');
      expect(mockSelect).toHaveBeenCalledWith('*');
      expect(mockEq).toHaveBeenCalledWith('type', 'content');
      expect(mockEq).toHaveBeenCalledWith('entity_id', 'content-1');
      expect(mockOrder).toHaveBeenCalledWith('created_at', { ascending: false });
      expect(mockLimit).toHaveBeenCalledWith(1);
      expect(mockSingle).toHaveBeenCalled();
      expect(result).toEqual(mockContentAnalytics);
    });

    it('should generate content analytics when data does not exist', async () => {
      // Mock error response for analytics query
      mockSingle.mockReturnValueOnce({ data: null, error: new Error('Not found') });
      
      // Mock generateContentAnalytics implementation
      jest.spyOn(analyticsServiceInstance, 'generateContentAnalytics').mockResolvedValue(mockContentAnalytics);
      
      const result = await analyticsServiceInstance.getContentAnalytics('content-1');
      
      expect(createServerSupabaseClient).toHaveBeenCalled();
      expect(mockFrom).toHaveBeenCalledWith('analytics');
      expect(analyticsServiceInstance.generateContentAnalytics).toHaveBeenCalledWith('content-1');
      expect(result).toEqual(mockContentAnalytics);
    });

    it('should handle errors gracefully', async () => {
      // Mock error response for analytics query
      mockSingle.mockReturnValueOnce({ data: null, error: new Error('Database error') });
      
      // Mock generateContentAnalytics to return null on error
      jest.spyOn(analyticsServiceInstance, 'generateContentAnalytics').mockResolvedValue(null);
      
      const result = await analyticsServiceInstance.getContentAnalytics('content-1');
      
      expect(createServerSupabaseClient).toHaveBeenCalled();
      expect(console.error).toHaveBeenCalled();
      expect(analyticsServiceInstance.generateContentAnalytics).toHaveBeenCalledWith('content-1');
      expect(result).toBeNull();
    });
  });

  describe('getPlatformAnalytics', () => {
    it('should return platform analytics', async () => {
      // Mock count queries
      const mockCount = jest.fn().mockReturnValue({ data: { count: 100 }, error: null });
      mockFrom.mockReturnValue({ select: mockSelect, count: mockCount });
      
      const result = await analyticsServiceInstance.getPlatformAnalytics();
      
      expect(createServerSupabaseClient).toHaveBeenCalled();
      expect(mockFrom).toHaveBeenCalledWith('profiles');
      expect(mockFrom).toHaveBeenCalledWith('courses');
      expect(mockFrom).toHaveBeenCalledWith('enrollments');
      expect(mockFrom).toHaveBeenCalledWith('content_items');
      expect(mockFrom).toHaveBeenCalledWith('assessments');
      expect(mockFrom).toHaveBeenCalledWith('student_submissions');
      expect(result).toEqual(expect.objectContaining({
        totalUsers: 100,
        totalCourses: 100,
        totalEnrollments: 100,
        totalContentItems: 100,
        totalAssessments: 100,
        totalSubmissions: 100
      }));
    });

    it('should handle errors gracefully', async () => {
      // Mock count query to return error
      const mockCount = jest.fn().mockReturnValue({ data: null, error: new Error('Database error') });
      mockFrom.mockReturnValue({ select: mockSelect, count: mockCount });
      
      const result = await analyticsServiceInstance.getPlatformAnalytics();
      
      expect(createServerSupabaseClient).toHaveBeenCalled();
      expect(console.error).toHaveBeenCalled();
      expect(result).toEqual(expect.objectContaining({
        totalUsers: 0,
        totalCourses: 0,
        totalEnrollments: 0,
        totalContentItems: 0,
        totalAssessments: 0,
        totalSubmissions: 0
      }));
    });
  });
});
