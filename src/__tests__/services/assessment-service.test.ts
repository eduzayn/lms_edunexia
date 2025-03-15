import { AssessmentService, Assessment, AssessmentQuestion, QuestionOption, StudentSubmission } from '@/lib/services/assessment-service';
import { createServerSupabaseClient } from '@/lib/supabase/server';

// Mock the Supabase client
jest.mock('@/lib/supabase/server', () => ({
  createServerSupabaseClient: jest.fn()
}));

describe('AssessmentService', () => {
  // Get the singleton instance
  const assessmentService = AssessmentService.getInstance();
  
  // Mock data
  const mockAssessmentType = {
    id: 'type-1',
    name: 'Multiple Choice',
    description: 'Multiple choice questions',
    icon: 'check-square',
    settings: {}
  };
  
  const mockQuestionOption: QuestionOption = {
    id: 'option-1',
    question_id: 'question-1',
    text: 'Option 1',
    is_correct: true,
    order: 1
  };
  
  const mockQuestion: AssessmentQuestion = {
    id: 'question-1',
    assessment_id: 'assessment-1',
    question_text: 'What is the capital of France?',
    question_type: 'multiple_choice',
    points: 10,
    options: [mockQuestionOption],
    order: 1
  };
  
  const mockAssessment: Assessment = {
    id: 'assessment-1',
    title: 'Test Assessment',
    description: 'This is a test assessment',
    instructions: 'Answer all questions',
    type_id: 'type-1',
    course_id: 'course-1',
    module_id: 'module-1',
    due_date: null,
    points: 100,
    passing_score: 70,
    time_limit_minutes: 60,
    attempts_allowed: 3,
    settings: {},
    questions: [mockQuestion],
    created_at: '2025-01-01T00:00:00Z',
    updated_at: '2025-01-01T00:00:00Z',
    type: mockAssessmentType
  };
  
  const mockSubmission: StudentSubmission = {
    id: 'submission-1',
    assessment_id: 'assessment-1',
    student_id: 'student-1',
    started_at: '2025-01-01T00:00:00Z',
    completed_at: '2025-01-01T01:00:00Z',
    score: 85,
    passed: true,
    time_spent_seconds: 3600,
    attempt_number: 1,
    answers: [
      {
        id: 'answer-1',
        submission_id: 'submission-1',
        question_id: 'question-1',
        answer_text: 'Paris',
        is_correct: true,
        points_awarded: 10
      }
    ],
    feedback: 'Good job!',
    status: 'graded'
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
  const mockLimit = jest.fn();
  const mockMaybeSingle = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    
    // Reset mock chain
    mockSingle.mockReturnValue({ data: mockAssessment, error: null });
    mockMaybeSingle.mockReturnValue({ data: null, error: null });
    mockLimit.mockReturnValue({ single: mockSingle });
    mockOrder.mockReturnValue({ 
      limit: mockLimit, 
      data: [mockAssessmentType], 
      error: null 
    });
    mockEq.mockReturnValue({ 
      select: mockSelect, 
      order: mockOrder, 
      single: mockSingle,
      delete: mockDelete,
      update: mockUpdate
    });
    mockSelect.mockReturnValue({ 
      eq: mockEq, 
      order: mockOrder,
      data: [mockAssessment], 
      error: null 
    });
    mockInsert.mockReturnValue({ select: mockSelect });
    mockUpdate.mockReturnValue({ select: mockSelect });
    mockDelete.mockReturnValue({ error: null });
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

  describe('getInstance', () => {
    it('should return the singleton instance', () => {
      const instance1 = AssessmentService.getInstance();
      const instance2 = AssessmentService.getInstance();
      
      expect(instance1).toBe(instance2);
    });
  });

  describe('getAssessmentTypes', () => {
    it('should return assessment types when successful', async () => {
      mockOrder.mockReturnValueOnce({ data: [mockAssessmentType], error: null });
      
      const result = await assessmentService.getAssessmentTypes();
      
      expect(createServerSupabaseClient).toHaveBeenCalled();
      expect(mockFrom).toHaveBeenCalledWith('assessment_types');
      expect(mockSelect).toHaveBeenCalledWith('*');
      expect(mockOrder).toHaveBeenCalledWith('name');
      expect(result).toEqual([mockAssessmentType]);
    });

    it('should return empty array when error occurs', async () => {
      mockOrder.mockReturnValueOnce({ data: null, error: new Error('Database error') });
      
      const result = await assessmentService.getAssessmentTypes();
      
      expect(console.error).toHaveBeenCalled();
      expect(result).toEqual([]);
    });
  });

  describe('getAssessments', () => {
    it('should return assessments for a course when courseId is provided', async () => {
      const result = await assessmentService.getAssessments('course-1');
      
      expect(createServerSupabaseClient).toHaveBeenCalled();
      expect(mockFrom).toHaveBeenCalledWith('assessments');
      expect(mockSelect).toHaveBeenCalledWith(`
        *,
        type:assessment_types(*)
      `);
      expect(mockOrder).toHaveBeenCalledWith('created_at', { ascending: false });
      expect(mockEq).toHaveBeenCalledWith('course_id', 'course-1');
      expect(result).toEqual([{
        ...mockAssessment,
        type: mockAssessmentType,
        questions: []
      }]);
    });

    it('should return all assessments when courseId is not provided', async () => {
      const result = await assessmentService.getAssessments();
      
      expect(createServerSupabaseClient).toHaveBeenCalled();
      expect(mockFrom).toHaveBeenCalledWith('assessments');
      expect(mockSelect).toHaveBeenCalledWith(`
        *,
        type:assessment_types(*)
      `);
      expect(mockOrder).toHaveBeenCalledWith('created_at', { ascending: false });
      expect(mockEq).not.toHaveBeenCalledWith('course_id', expect.anything());
      expect(result).toEqual([{
        ...mockAssessment,
        type: mockAssessmentType,
        questions: []
      }]);
    });

    it('should return empty array when error occurs', async () => {
      mockOrder.mockReturnValueOnce({ data: null, error: new Error('Database error') });
      
      const result = await assessmentService.getAssessments('course-1');
      
      expect(console.error).toHaveBeenCalled();
      expect(result).toEqual([]);
    });
  });

  describe('getAssessment', () => {
    it('should return an assessment with questions when successful', async () => {
      const result = await assessmentService.getAssessment('assessment-1');
      
      expect(createServerSupabaseClient).toHaveBeenCalled();
      expect(mockFrom).toHaveBeenCalledWith('assessments');
      expect(mockSelect).toHaveBeenCalledWith(`
        *,
        type:assessment_types(*),
        questions:assessment_questions(
          *,
          options:question_options(*)
        )
      `);
      expect(mockEq).toHaveBeenCalledWith('id', 'assessment-1');
      expect(mockSingle).toHaveBeenCalled();
      expect(result).toEqual(mockAssessment);
    });

    it('should return null when error occurs', async () => {
      mockSingle.mockReturnValueOnce({ data: null, error: new Error('Database error') });
      
      const result = await assessmentService.getAssessment('assessment-1');
      
      expect(console.error).toHaveBeenCalled();
      expect(result).toBeNull();
    });
  });

  describe('createAssessment', () => {
    it('should create an assessment when successful', async () => {
      const newAssessment = {
        title: 'New Assessment',
        description: 'This is a new assessment',
        instructions: 'Answer all questions',
        type_id: 'type-1',
        course_id: 'course-1',
        module_id: 'module-1',
        points: 100,
        passing_score: 70
      };
      
      const result = await assessmentService.createAssessment(newAssessment);
      
      expect(createServerSupabaseClient).toHaveBeenCalled();
      expect(mockFrom).toHaveBeenCalledWith('assessments');
      expect(mockInsert).toHaveBeenCalledWith(expect.objectContaining({
        title: 'New Assessment',
        description: 'This is a new assessment',
        instructions: 'Answer all questions',
        type_id: 'type-1',
        course_id: 'course-1',
        module_id: 'module-1',
        points: 100,
        passing_score: 70
      }));
      expect(mockSelect).toHaveBeenCalled();
      expect(mockSingle).toHaveBeenCalled();
      expect(result).toEqual({
        ...mockAssessment,
        questions: []
      });
    });

    it('should use default values when not provided', async () => {
      const newAssessment = {
        type_id: 'type-1',
        course_id: 'course-1',
        module_id: 'module-1'
      };
      
      const result = await assessmentService.createAssessment(newAssessment);
      
      expect(createServerSupabaseClient).toHaveBeenCalled();
      expect(mockFrom).toHaveBeenCalledWith('assessments');
      expect(mockInsert).toHaveBeenCalledWith(expect.objectContaining({
        title: 'Untitled Assessment',
        description: '',
        instructions: '',
        type_id: 'type-1',
        course_id: 'course-1',
        module_id: 'module-1',
        points: 100,
        passing_score: 70,
        settings: {}
      }));
      expect(result).toEqual({
        ...mockAssessment,
        questions: []
      });
    });

    it('should return null when error occurs', async () => {
      mockSingle.mockReturnValueOnce({ data: null, error: new Error('Database error') });
      
      const newAssessment = {
        title: 'New Assessment',
        type_id: 'type-1',
        course_id: 'course-1',
        module_id: 'module-1'
      };
      
      const result = await assessmentService.createAssessment(newAssessment);
      
      expect(console.error).toHaveBeenCalled();
      expect(result).toBeNull();
    });
  });

  describe('updateAssessment', () => {
    it('should update an assessment when successful', async () => {
      const updates = {
        title: 'Updated Assessment',
        description: 'This is an updated assessment',
        instructions: 'Updated instructions',
        points: 120,
        passing_score: 80
      };
      
      const result = await assessmentService.updateAssessment('assessment-1', updates);
      
      expect(createServerSupabaseClient).toHaveBeenCalled();
      expect(mockFrom).toHaveBeenCalledWith('assessments');
      expect(mockUpdate).toHaveBeenCalledWith(expect.objectContaining({
        title: 'Updated Assessment',
        description: 'This is an updated assessment',
        instructions: 'Updated instructions',
        points: 120,
        passing_score: 80
      }));
      expect(mockEq).toHaveBeenCalledWith('id', 'assessment-1');
      expect(mockSelect).toHaveBeenCalled();
      expect(mockSingle).toHaveBeenCalled();
      expect(result).toEqual({
        ...mockAssessment,
        questions: []
      });
    });

    it('should return null when error occurs', async () => {
      mockSingle.mockReturnValueOnce({ data: null, error: new Error('Database error') });
      
      const updates = {
        title: 'Updated Assessment'
      };
      
      const result = await assessmentService.updateAssessment('assessment-1', updates);
      
      expect(console.error).toHaveBeenCalled();
      expect(result).toBeNull();
    });
  });

  describe('deleteAssessment', () => {
    it('should delete an assessment when successful', async () => {
      const result = await assessmentService.deleteAssessment('assessment-1');
      
      expect(createServerSupabaseClient).toHaveBeenCalled();
      expect(mockFrom).toHaveBeenCalledWith('assessments');
      expect(mockDelete).toHaveBeenCalled();
      expect(mockEq).toHaveBeenCalledWith('id', 'assessment-1');
      expect(result).toBe(true);
    });

    it('should return false when error occurs', async () => {
      mockDelete.mockReturnValueOnce({ error: new Error('Database error') });
      
      const result = await assessmentService.deleteAssessment('assessment-1');
      
      expect(console.error).toHaveBeenCalled();
      expect(result).toBe(false);
    });
  });

  describe('createQuestion', () => {
    it('should create a question when successful', async () => {
      // Mock existing questions query
      mockLimit.mockReturnValueOnce({ data: [{ order: 2 }], error: null });
      
      const newQuestion = {
        assessment_id: 'assessment-1',
        question_text: 'What is the capital of Germany?',
        question_type: 'multiple_choice' as const,
        points: 15
      };
      
      const result = await assessmentService.createQuestion(newQuestion);
      
      expect(createServerSupabaseClient).toHaveBeenCalled();
      expect(mockFrom).toHaveBeenCalledWith('assessment_questions');
      expect(mockSelect).toHaveBeenCalledWith('order');
      expect(mockEq).toHaveBeenCalledWith('assessment_id', 'assessment-1');
      expect(mockOrder).toHaveBeenCalledWith('order', { ascending: false });
      expect(mockLimit).toHaveBeenCalledWith(1);
      
      expect(mockInsert).toHaveBeenCalledWith(expect.objectContaining({
        assessment_id: 'assessment-1',
        question_text: 'What is the capital of Germany?',
        question_type: 'multiple_choice',
        points: 15,
        order: 3
      }));
      
      expect(result).toEqual({
        ...mockQuestion,
        options: []
      });
    });

    it('should use order 1 when no existing questions', async () => {
      // Mock empty existing questions query
      mockLimit.mockReturnValueOnce({ data: [], error: null });
      
      const newQuestion = {
        assessment_id: 'assessment-1',
        question_text: 'What is the capital of Germany?'
      };
      
      const result = await assessmentService.createQuestion(newQuestion);
      
      expect(mockInsert).toHaveBeenCalledWith(expect.objectContaining({
        assessment_id: 'assessment-1',
        question_text: 'What is the capital of Germany?',
        question_type: 'multiple_choice',
        points: 10,
        order: 1
      }));
      
      expect(result).toEqual({
        ...mockQuestion,
        options: []
      });
    });

    it('should return null when error occurs', async () => {
      // Mock existing questions query
      mockLimit.mockReturnValueOnce({ data: [{ order: 2 }], error: null });
      
      // Mock error on insert
      mockSingle.mockReturnValueOnce({ data: null, error: new Error('Database error') });
      
      const newQuestion = {
        assessment_id: 'assessment-1',
        question_text: 'What is the capital of Germany?'
      };
      
      const result = await assessmentService.createQuestion(newQuestion);
      
      expect(console.error).toHaveBeenCalled();
      expect(result).toBeNull();
    });
  });

  describe('updateQuestion', () => {
    it('should update a question when successful', async () => {
      const updates = {
        question_text: 'Updated question text',
        points: 20,
        order: 2
      };
      
      const result = await assessmentService.updateQuestion('question-1', updates);
      
      expect(createServerSupabaseClient).toHaveBeenCalled();
      expect(mockFrom).toHaveBeenCalledWith('assessment_questions');
      expect(mockUpdate).toHaveBeenCalledWith(expect.objectContaining({
        question_text: 'Updated question text',
        points: 20,
        order: 2
      }));
      expect(mockEq).toHaveBeenCalledWith('id', 'question-1');
      expect(mockSelect).toHaveBeenCalled();
      expect(mockSingle).toHaveBeenCalled();
      expect(result).toEqual({
        ...mockQuestion,
        options: []
      });
    });

    it('should return null when error occurs', async () => {
      mockSingle.mockReturnValueOnce({ data: null, error: new Error('Database error') });
      
      const updates = {
        question_text: 'Updated question text'
      };
      
      const result = await assessmentService.updateQuestion('question-1', updates);
      
      expect(console.error).toHaveBeenCalled();
      expect(result).toBeNull();
    });
  });

  describe('deleteQuestion', () => {
    it('should delete a question when successful', async () => {
      const result = await assessmentService.deleteQuestion('question-1');
      
      expect(createServerSupabaseClient).toHaveBeenCalled();
      expect(mockFrom).toHaveBeenCalledWith('assessment_questions');
      expect(mockDelete).toHaveBeenCalled();
      expect(mockEq).toHaveBeenCalledWith('id', 'question-1');
      expect(result).toBe(true);
    });

    it('should return false when error occurs', async () => {
      mockDelete.mockReturnValueOnce({ error: new Error('Database error') });
      
      const result = await assessmentService.deleteQuestion('question-1');
      
      expect(console.error).toHaveBeenCalled();
      expect(result).toBe(false);
    });
  });

  describe('createQuestionOption', () => {
    it('should create a question option when successful', async () => {
      // Mock existing options query
      mockLimit.mockReturnValueOnce({ data: [{ order: 2 }], error: null });
      
      const newOption = {
        question_id: 'question-1',
        text: 'Berlin',
        is_correct: true
      };
      
      const result = await assessmentService.createQuestionOption(newOption);
      
      expect(createServerSupabaseClient).toHaveBeenCalled();
      expect(mockFrom).toHaveBeenCalledWith('question_options');
      expect(mockSelect).toHaveBeenCalledWith('order');
      expect(mockEq).toHaveBeenCalledWith('question_id', 'question-1');
      expect(mockOrder).toHaveBeenCalledWith('order', { ascending: false });
      expect(mockLimit).toHaveBeenCalledWith(1);
      
      expect(mockInsert).toHaveBeenCalledWith(expect.objectContaining({
        question_id: 'question-1',
        text: 'Berlin',
        is_correct: true,
        order: 3
      }));
      
      expect(result).toEqual(mockQuestionOption);
    });

    it('should use order 1 when no existing options', async () => {
      // Mock empty existing options query
      mockLimit.mockReturnValueOnce({ data: [], error: null });
      
      const newOption = {
        question_id: 'question-1',
        text: 'Berlin'
      };
      
      const result = await assessmentService.createQuestionOption(newOption);
      
      expect(mockInsert).toHaveBeenCalledWith(expect.objectContaining({
        question_id: 'question-1',
        text: 'Berlin',
        is_correct: false,
        order: 1
      }));
      
      expect(result).toEqual(mockQuestionOption);
    });

    it('should return null when error occurs', async () => {
      // Mock existing options query
      mockLimit.mockReturnValueOnce({ data: [{ order: 2 }], error: null });
      
      // Mock error on insert
      mockSingle.mockReturnValueOnce({ data: null, error: new Error('Database error') });
      
      const newOption = {
        question_id: 'question-1',
        text: 'Berlin'
      };
      
      const result = await assessmentService.createQuestionOption(newOption);
      
      expect(console.error).toHaveBeenCalled();
      expect(result).toBeNull();
    });
  });

  describe('getStudentSubmissions', () => {
    it('should return submissions for a student and assessment when both IDs are provided', async () => {
      mockOrder.mockReturnValueOnce({ data: [mockSubmission], error: null });
      
      const result = await assessmentService.getStudentSubmissions('student-1', 'assessment-1');
      
      expect(createServerSupabaseClient).toHaveBeenCalled();
      expect(mockFrom).toHaveBeenCalledWith('student_submissions');
      expect(mockSelect).toHaveBeenCalledWith(`
        *,
        answers:submission_answers(*)
      `);
      expect(mockEq).toHaveBeenCalledWith('student_id', 'student-1');
      expect(mockEq).toHaveBeenCalledWith('assessment_id', 'assessment-1');
      expect(mockOrder).toHaveBeenCalledWith('created_at', { ascending: false });
      expect(result).toEqual([mockSubmission]);
    });

    it('should return all submissions for a student when assessment ID is not provided', async () => {
      mockOrder.mockReturnValueOnce({ data: [mockSubmission], error: null });
      
      const result = await assessmentService.getStudentSubmissions('student-1');
      
      expect(createServerSupabaseClient).toHaveBeenCalled();
      expect(mockFrom).toHaveBeenCalledWith('student_submissions');
      expect(mockSelect).toHaveBeenCalledWith(`
        *,
        answers:submission_answers(*)
      `);
      expect(mockEq).toHaveBeenCalledWith('student_id', 'student-1');
      expect(mockEq).not.toHaveBeenCalledWith('assessment_id', expect.anything());
      expect(mockOrder).toHaveBeenCalledWith('created_at', { ascending: false });
      expect(result).toEqual([mockSubmission]);
    });

    it('should return empty array when error occurs', async () => {
      mockOrder.mockReturnValueOnce({ data: null, error: new Error('Database error') });
      
      const result = await assessmentService.getStudentSubmissions('student-1', 'assessment-1');
      
      expect(console.error).toHaveBeenCalled();
      expect(result).toEqual([]);
    });
  });

  describe('saveAnswer', () => {
    it('should update an existing answer when it exists', async () => {
      // Mock existing answer query
      mockMaybeSingle.mockReturnValueOnce({ data: { id: 'answer-1' }, error: null });
      
      const answer = {
        submission_id: 'submission-1',
        question_id: 'question-1',
        answer_text: 'Berlin',
        is_correct: false,
        points_awarded: 0
      };
      
      const result = await assessmentService.saveAnswer(answer);
      
      expect(createServerSupabaseClient).toHaveBeenCalled();
      expect(mockFrom).toHaveBeenCalledWith('submission_answers');
      expect(mockSelect).toHaveBeenCalledWith('id');
      expect(mockEq).toHaveBeenCalledWith('submission_id', 'submission-1');
      expect(mockEq).toHaveBeenCalledWith('question_id', 'question-1');
      expect(mockMaybeSingle).toHaveBeenCalled();
      
      expect(mockUpdate).toHaveBeenCalledWith(expect.objectContaining({
        answer_text: 'Berlin',
        is_correct: false,
        points_awarded: 0
      }));
      expect(mockEq).toHaveBeenCalledWith('id', 'answer-1');
      
      expect(result).toEqual(mockSubmission.answers[0]);
    });

    it('should create a new answer when it does not exist', async () => {
      // Mock non-existing answer query
      mockMaybeSingle.mockReturnValueOnce({ data: null, error: null });
      
      const answer = {
        submission_id: 'submission-1',
        question_id: 'question-1',
        answer_text: 'Berlin',
        is_correct: false,
        points_awarded: 0
      };
      
      const result = await assessmentService.saveAnswer(answer);
      
      expect(createServerSupabaseClient).toHaveBeenCalled();
      expect(mockFrom).toHaveBeenCalledWith('submission_answers');
      expect(mockSelect).toHaveBeenCalledWith('id');
      expect(mockEq).toHaveBeenCalledWith('submission_id', 'submission-1');
      expect(mockEq).toHaveBeenCalledWith('question_id', 'question-1');
      expect(mockMaybeSingle).toHaveBeenCalled();
      
      expect(mockInsert).toHaveBeenCalledWith(expect.objectContaining({
        submission_id: 'submission-1',
        question_id: 'question-1',
        answer_text: 'Berlin',
        is_correct: false,
        points_awarded: 0
      }));
      
      expect(result).toEqual(mockSubmission.answers[0]);
    });

    it('should return null when error occurs', async () => {
      // Mock existing answer query
      mockMaybeSingle.mockReturnValueOnce({ data: { id: 'answer-1' }, error: null });
      
      // Mock error on update
      mockSingle.mockReturnValueOnce({ data: null, error: new Error('Database error') });
      
      const answer = {
        submission_id: 'submission-1',
        question_id: 'question-1',
        answer_text: 'Berlin'
      };
      
      const result = await assessmentService.saveAnswer(answer);
      
      expect(console.error).toHaveBeenCalled();
      expect(result).toBeNull();
    });
  });
});
