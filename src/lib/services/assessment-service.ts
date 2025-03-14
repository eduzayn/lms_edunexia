import { createClient } from '@supabase/supabase-js';
import { Database } from '@/types/supabase';
import { createServerSupabaseClient } from '../supabase/server';

// Types for assessment entities
export interface AssessmentType {
  id: string;
  name: string;
  description: string;
  icon: string;
  settings: any;
}

export interface Assessment {
  id: string;
  title: string;
  description: string;
  instructions: string;
  type_id: string;
  course_id: string;
  module_id: string;
  due_date: string | null;
  points: number;
  passing_score: number;
  time_limit_minutes: number | null;
  attempts_allowed: number | null;
  settings: any;
  questions: AssessmentQuestion[];
  created_at: string;
  updated_at: string;
  type?: AssessmentType;
}

export interface AssessmentQuestion {
  id: string;
  assessment_id: string;
  question_text: string;
  question_type: 'multiple_choice' | 'true_false' | 'essay' | 'matching' | 'fill_blank' | 'code';
  points: number;
  options?: QuestionOption[];
  correct_answer?: string;
  feedback?: string;
  settings?: any;
  order: number;
}

export interface QuestionOption {
  id: string;
  question_id: string;
  text: string;
  is_correct: boolean;
  feedback?: string;
  order: number;
}

export interface StudentSubmission {
  id: string;
  assessment_id: string;
  student_id: string;
  started_at: string;
  completed_at: string | null;
  score: number | null;
  passed: boolean | null;
  time_spent_seconds: number | null;
  attempt_number: number;
  answers: SubmissionAnswer[];
  feedback: string | null;
  status: 'in_progress' | 'submitted' | 'graded' | 'needs_review';
}

export interface SubmissionAnswer {
  id: string;
  submission_id: string;
  question_id: string;
  answer_text: string;
  is_correct?: boolean;
  points_awarded?: number;
  feedback?: string;
}

class AssessmentService {
  private static instance: AssessmentService;
  private supabaseUrl: string;
  private supabaseKey: string;
  private supabase: ReturnType<typeof createClient> | null = null;

  private constructor() {
    this.supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
    this.supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
    
    if (this.supabaseUrl && this.supabaseKey) {
      this.supabase = createClient<Database>(this.supabaseUrl, this.supabaseKey);
    }
  }

  public static getInstance(): AssessmentService {
    if (!AssessmentService.instance) {
      AssessmentService.instance = new AssessmentService();
    }
    return AssessmentService.instance;
  }

  // Assessment Types
  async getAssessmentTypes(): Promise<AssessmentType[]> {
    const supabase = createServerSupabaseClient();
    
    const { data, error } = await supabase
      .from('assessment_types')
      .select('*')
      .order('name');
    
    if (error) {
      console.error('Error fetching assessment types:', error);
      return [];
    }
    
    return data || [];
  }

  // Assessments
  async getAssessments(courseId?: string): Promise<Assessment[]> {
    const supabase = createServerSupabaseClient();
    
    let query = supabase
      .from('assessments')
      .select(`
        *,
        type:assessment_types(*)
      `)
      .order('created_at', { ascending: false });
    
    if (courseId) {
      query = query.eq('course_id', courseId);
    }
    
    const { data, error } = await query;
    
    if (error) {
      console.error('Error fetching assessments:', error);
      return [];
    }
    
    return data.map(assessment => ({
      ...assessment,
      type: assessment.type?.[0],
      questions: []
    })) || [];
  }

  async getAssessment(id: string): Promise<Assessment | null> {
    const supabase = createServerSupabaseClient();
    
    const { data, error } = await supabase
      .from('assessments')
      .select(`
        *,
        type:assessment_types(*),
        questions:assessment_questions(
          *,
          options:question_options(*)
        )
      `)
      .eq('id', id)
      .single();
    
    if (error) {
      console.error('Error fetching assessment:', error);
      return null;
    }
    
    if (!data) return null;
    
    // Sort questions and options by order
    const questions = data.questions || [];
    questions.sort((a: AssessmentQuestion, b: AssessmentQuestion) => a.order - b.order);
    
    questions.forEach((question: AssessmentQuestion) => {
      if (question.options) {
        question.options.sort((a: QuestionOption, b: QuestionOption) => a.order - b.order);
      }
    });
    
    return {
      ...data,
      type: data.type?.[0],
      questions
    };
  }

  async createAssessment(assessment: Partial<Assessment>): Promise<Assessment | null> {
    const supabase = createServerSupabaseClient();
    
    // Create assessment
    const { data, error } = await supabase
      .from('assessments')
      .insert({
        title: assessment.title || 'Untitled Assessment',
        description: assessment.description || '',
        instructions: assessment.instructions || '',
        type_id: assessment.type_id,
        course_id: assessment.course_id,
        module_id: assessment.module_id,
        due_date: assessment.due_date,
        points: assessment.points || 100,
        passing_score: assessment.passing_score || 70,
        time_limit_minutes: assessment.time_limit_minutes,
        attempts_allowed: assessment.attempts_allowed,
        settings: assessment.settings || {}
      })
      .select()
      .single();
    
    if (error) {
      console.error('Error creating assessment:', error);
      return null;
    }
    
    return {
      ...data,
      questions: []
    };
  }

  async updateAssessment(id: string, assessment: Partial<Assessment>): Promise<Assessment | null> {
    const supabase = createServerSupabaseClient();
    
    const { data, error } = await supabase
      .from('assessments')
      .update({
        title: assessment.title,
        description: assessment.description,
        instructions: assessment.instructions,
        type_id: assessment.type_id,
        course_id: assessment.course_id,
        module_id: assessment.module_id,
        due_date: assessment.due_date,
        points: assessment.points,
        passing_score: assessment.passing_score,
        time_limit_minutes: assessment.time_limit_minutes,
        attempts_allowed: assessment.attempts_allowed,
        settings: assessment.settings
      })
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error('Error updating assessment:', error);
      return null;
    }
    
    return {
      ...data,
      questions: assessment.questions || []
    };
  }

  async deleteAssessment(id: string): Promise<boolean> {
    const supabase = createServerSupabaseClient();
    
    const { error } = await supabase
      .from('assessments')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('Error deleting assessment:', error);
      return false;
    }
    
    return true;
  }

  // Questions
  async createQuestion(question: Partial<AssessmentQuestion>): Promise<AssessmentQuestion | null> {
    const supabase = createServerSupabaseClient();
    
    // Get the highest order value for this assessment
    const { data: existingQuestions } = await supabase
      .from('assessment_questions')
      .select('order')
      .eq('assessment_id', question.assessment_id)
      .order('order', { ascending: false })
      .limit(1);
    
    const nextOrder = existingQuestions && existingQuestions.length > 0 
      ? (existingQuestions[0].order + 1) 
      : 1;
    
    const { data, error } = await supabase
      .from('assessment_questions')
      .insert({
        assessment_id: question.assessment_id,
        question_text: question.question_text || 'New Question',
        question_type: question.question_type || 'multiple_choice',
        points: question.points || 10,
        correct_answer: question.correct_answer,
        feedback: question.feedback,
        settings: question.settings || {},
        order: nextOrder
      })
      .select()
      .single();
    
    if (error) {
      console.error('Error creating question:', error);
      return null;
    }
    
    return {
      ...data,
      options: []
    };
  }

  async updateQuestion(id: string, question: Partial<AssessmentQuestion>): Promise<AssessmentQuestion | null> {
    const supabase = createServerSupabaseClient();
    
    const { data, error } = await supabase
      .from('assessment_questions')
      .update({
        question_text: question.question_text,
        question_type: question.question_type,
        points: question.points,
        correct_answer: question.correct_answer,
        feedback: question.feedback,
        settings: question.settings,
        order: question.order
      })
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error('Error updating question:', error);
      return null;
    }
    
    return {
      ...data,
      options: question.options || []
    };
  }

  async deleteQuestion(id: string): Promise<boolean> {
    const supabase = createServerSupabaseClient();
    
    const { error } = await supabase
      .from('assessment_questions')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('Error deleting question:', error);
      return false;
    }
    
    return true;
  }

  // Question Options
  async createQuestionOption(option: Partial<QuestionOption>): Promise<QuestionOption | null> {
    const supabase = createServerSupabaseClient();
    
    // Get the highest order value for this question
    const { data: existingOptions } = await supabase
      .from('question_options')
      .select('order')
      .eq('question_id', option.question_id)
      .order('order', { ascending: false })
      .limit(1);
    
    const nextOrder = existingOptions && existingOptions.length > 0 
      ? (existingOptions[0].order + 1) 
      : 1;
    
    const { data, error } = await supabase
      .from('question_options')
      .insert({
        question_id: option.question_id,
        text: option.text || 'New Option',
        is_correct: option.is_correct || false,
        feedback: option.feedback,
        order: nextOrder
      })
      .select()
      .single();
    
    if (error) {
      console.error('Error creating question option:', error);
      return null;
    }
    
    return data;
  }

  async updateQuestionOption(id: string, option: Partial<QuestionOption>): Promise<QuestionOption | null> {
    const supabase = createServerSupabaseClient();
    
    const { data, error } = await supabase
      .from('question_options')
      .update({
        text: option.text,
        is_correct: option.is_correct,
        feedback: option.feedback,
        order: option.order
      })
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error('Error updating question option:', error);
      return null;
    }
    
    return data;
  }

  async deleteQuestionOption(id: string): Promise<boolean> {
    const supabase = createServerSupabaseClient();
    
    const { error } = await supabase
      .from('question_options')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('Error deleting question option:', error);
      return false;
    }
    
    return true;
  }

  // Student Submissions
  async getStudentSubmissions(studentId: string, assessmentId?: string): Promise<StudentSubmission[]> {
    const supabase = createServerSupabaseClient();
    
    let query = supabase
      .from('student_submissions')
      .select(`
        *,
        answers:submission_answers(*)
      `)
      .eq('student_id', studentId)
      .order('created_at', { ascending: false });
    
    if (assessmentId) {
      query = query.eq('assessment_id', assessmentId);
    }
    
    const { data, error } = await query;
    
    if (error) {
      console.error('Error fetching student submissions:', error);
      return [];
    }
    
    return data || [];
  }

  async getSubmission(id: string): Promise<StudentSubmission | null> {
    const supabase = createServerSupabaseClient();
    
    const { data, error } = await supabase
      .from('student_submissions')
      .select(`
        *,
        answers:submission_answers(*)
      `)
      .eq('id', id)
      .single();
    
    if (error) {
      console.error('Error fetching submission:', error);
      return null;
    }
    
    return data;
  }

  async createSubmission(submission: Partial<StudentSubmission>): Promise<StudentSubmission | null> {
    const supabase = createServerSupabaseClient();
    
    // Get the attempt number
    const { data: existingSubmissions } = await supabase
      .from('student_submissions')
      .select('attempt_number')
      .eq('assessment_id', submission.assessment_id)
      .eq('student_id', submission.student_id)
      .order('attempt_number', { ascending: false })
      .limit(1);
    
    const attemptNumber = existingSubmissions && existingSubmissions.length > 0 
      ? (existingSubmissions[0].attempt_number + 1) 
      : 1;
    
    const { data, error } = await supabase
      .from('student_submissions')
      .insert({
        assessment_id: submission.assessment_id,
        student_id: submission.student_id,
        started_at: new Date().toISOString(),
        status: 'in_progress',
        attempt_number: attemptNumber
      })
      .select()
      .single();
    
    if (error) {
      console.error('Error creating submission:', error);
      return null;
    }
    
    return {
      ...data,
      answers: []
    };
  }

  async updateSubmission(id: string, submission: Partial<StudentSubmission>): Promise<StudentSubmission | null> {
    const supabase = createServerSupabaseClient();
    
    const updateData: any = {};
    
    if (submission.completed_at) updateData.completed_at = submission.completed_at;
    if (submission.score !== undefined) updateData.score = submission.score;
    if (submission.passed !== undefined) updateData.passed = submission.passed;
    if (submission.time_spent_seconds) updateData.time_spent_seconds = submission.time_spent_seconds;
    if (submission.feedback) updateData.feedback = submission.feedback;
    if (submission.status) updateData.status = submission.status;
    
    const { data, error } = await supabase
      .from('student_submissions')
      .update(updateData)
      .eq('id', id)
      .select(`
        *,
        answers:submission_answers(*)
      `)
      .single();
    
    if (error) {
      console.error('Error updating submission:', error);
      return null;
    }
    
    return data;
  }

  // Submission Answers
  async saveAnswer(answer: Partial<SubmissionAnswer>): Promise<SubmissionAnswer | null> {
    const supabase = createServerSupabaseClient();
    
    // Check if answer already exists
    const { data: existingAnswer } = await supabase
      .from('submission_answers')
      .select('id')
      .eq('submission_id', answer.submission_id)
      .eq('question_id', answer.question_id)
      .maybeSingle();
    
    let result;
    
    if (existingAnswer) {
      // Update existing answer
      result = await supabase
        .from('submission_answers')
        .update({
          answer_text: answer.answer_text,
          is_correct: answer.is_correct,
          points_awarded: answer.points_awarded,
          feedback: answer.feedback
        })
        .eq('id', existingAnswer.id)
        .select()
        .single();
    } else {
      // Create new answer
      result = await supabase
        .from('submission_answers')
        .insert({
          submission_id: answer.submission_id,
          question_id: answer.question_id,
          answer_text: answer.answer_text || '',
          is_correct: answer.is_correct,
          points_awarded: answer.points_awarded,
          feedback: answer.feedback
        })
        .select()
        .single();
    }
    
    if (result.error) {
      console.error('Error saving answer:', result.error);
      return null;
    }
    
    return result.data;
  }

  // Grading
  async gradeSubmission(submissionId: string): Promise<StudentSubmission | null> {
    const supabase = createServerSupabaseClient();
    
    // Get the submission with answers
    const { data: submission } = await supabase
      .from('student_submissions')
      .select(`
        *,
        answers:submission_answers(*),
        assessment:assessments(*)
      `)
      .eq('id', submissionId)
      .single();
    
    if (!submission) {
      console.error('Submission not found');
      return null;
    }
    
    // Get the assessment with questions
    const { data: assessment } = await supabase
      .from('assessments')
      .select(`
        *,
        questions:assessment_questions(
          *,
          options:question_options(*)
        )
      `)
      .eq('id', submission.assessment_id)
      .single();
    
    if (!assessment) {
      console.error('Assessment not found');
      return null;
    }
    
    // Grade each answer
    let totalPoints = 0;
    let earnedPoints = 0;
    let needsReview = false;
    
    for (const question of assessment.questions) {
      totalPoints += question.points;
      
      const answer = submission.answers.find((a: SubmissionAnswer) => a.question_id === question.id);
      
      if (!answer) continue;
      
      // Auto-grade based on question type
      if (question.question_type === 'multiple_choice' || question.question_type === 'true_false') {
        const correctOption = question.options.find((o: QuestionOption) => o.is_correct);
        
        if (correctOption && answer.answer_text === correctOption.id) {
          answer.is_correct = true;
          answer.points_awarded = question.points;
          earnedPoints += question.points;
        } else {
          answer.is_correct = false;
          answer.points_awarded = 0;
        }
        
        // Update the answer
        await this.saveAnswer({
          id: answer.id,
          is_correct: answer.is_correct,
          points_awarded: answer.points_awarded
        });
      } else if (question.question_type === 'matching' || question.question_type === 'fill_blank') {
        // Simple exact match for these types
        if (answer.answer_text === question.correct_answer) {
          answer.is_correct = true;
          answer.points_awarded = question.points;
          earnedPoints += question.points;
        } else {
          answer.is_correct = false;
          answer.points_awarded = 0;
        }
        
        // Update the answer
        await this.saveAnswer({
          id: answer.id,
          is_correct: answer.is_correct,
          points_awarded: answer.points_awarded
        });
      } else {
        // Essay and code questions need manual review
        needsReview = true;
      }
    }
    
    // Calculate score as percentage
    const score = totalPoints > 0 ? Math.round((earnedPoints / totalPoints) * 100) : 0;
    
    // Check if passed
    const passed = score >= assessment.passing_score;
    
    // Update submission
    const status = needsReview ? 'needs_review' : 'graded';
    
    return this.updateSubmission(submissionId, {
      completed_at: new Date().toISOString(),
      score,
      passed,
      status
    });
  }

  // Analytics
  async getAssessmentAnalytics(assessmentId: string): Promise<any> {
    const supabase = createServerSupabaseClient();
    
    const { data: submissions, error } = await supabase
      .from('student_submissions')
      .select('*')
      .eq('assessment_id', assessmentId);
    
    if (error) {
      console.error('Error fetching assessment analytics:', error);
      return null;
    }
    
    if (!submissions || submissions.length === 0) {
      return {
        totalSubmissions: 0,
        averageScore: 0,
        passRate: 0,
        highestScore: 0,
        lowestScore: 0,
        scoreDistribution: []
      };
    }
    
    // Calculate analytics
    const completedSubmissions = submissions.filter(s => s.status === 'graded' || s.status === 'needs_review');
    const scores = completedSubmissions.map(s => s.score || 0);
    const passedCount = completedSubmissions.filter(s => s.passed).length;
    
    const totalSubmissions = completedSubmissions.length;
    const averageScore = scores.reduce((sum, score) => sum + score, 0) / totalSubmissions;
    const passRate = totalSubmissions > 0 ? (passedCount / totalSubmissions) * 100 : 0;
    const highestScore = Math.max(...scores);
    const lowestScore = Math.min(...scores);
    
    // Score distribution (0-10, 11-20, ..., 91-100)
    const scoreDistribution = Array(10).fill(0);
    
    scores.forEach(score => {
      const index = Math.min(Math.floor(score / 10), 9);
      scoreDistribution[index]++;
    });
    
    return {
      totalSubmissions,
      averageScore,
      passRate,
      highestScore,
      lowestScore,
      scoreDistribution
    };
  }
}

export const assessmentService = AssessmentService.getInstance();
