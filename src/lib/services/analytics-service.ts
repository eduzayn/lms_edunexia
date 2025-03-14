import { createClient } from '@supabase/supabase-js';
import { Database } from '@/types/supabase';
import { createServerSupabaseClient } from '../supabase/server';

export interface AnalyticsData {
  id: string;
  type: 'course' | 'student' | 'assessment' | 'content';
  entity_id: string;
  data: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

export interface CourseAnalytics {
  courseId: string;
  totalStudents: number;
  activeStudents: number;
  completionRate: number;
  averageScore: number;
  studentProgress: {
    studentId: string;
    progress: number;
    lastActivity: string;
  }[];
  moduleCompletion: {
    moduleId: string;
    title: string;
    completionRate: number;
  }[];
  assessmentPerformance: {
    assessmentId: string;
    title: string;
    averageScore: number;
    completionRate: number;
  }[];
}

export interface StudentAnalytics {
  studentId: string;
  enrolledCourses: number;
  completedCourses: number;
  averageScore: number;
  totalTimeSpent: number;
  courseProgress: {
    courseId: string;
    title: string;
    progress: number;
    score: number;
    lastActivity: string;
  }[];
  assessmentPerformance: {
    assessmentId: string;
    title: string;
    score: number;
    completedAt: string;
  }[];
  strengths: string[];
  areasForImprovement: string[];
}

export interface AssessmentAnalytics {
  assessmentId: string;
  totalSubmissions: number;
  averageScore: number;
  passRate: number;
  averageTimeSpent: number;
  questionPerformance: {
    questionId: string;
    averageScore: number;
    correctRate: number;
  }[];
  scoreDistribution: number[];
}

export interface ContentAnalytics {
  contentId: string;
  views: number;
  uniqueViews: number;
  averageTimeSpent: number;
  completionRate: number;
  engagementRate: number;
  feedback: {
    rating: number;
    comments: string[];
  };
}

class AnalyticsService {
  private static instance: AnalyticsService;
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

  public static getInstance(): AnalyticsService {
    if (!AnalyticsService.instance) {
      AnalyticsService.instance = new AnalyticsService();
    }
    return AnalyticsService.instance;
  }

  // Course Analytics
  async getCourseAnalytics(courseId: string): Promise<CourseAnalytics | null> {
    const supabase = createServerSupabaseClient();
    
    // Get analytics data from the database
    const { data, error } = await supabase
      .from('analytics')
      .select('*')
      .eq('type', 'course')
      .eq('entity_id', courseId)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();
    
    if (error || !data) {
      console.error('Error fetching course analytics:', error);
      
      // Generate analytics data if not found
      return this.generateCourseAnalytics(courseId);
    }
    
    return data.data as CourseAnalytics;
  }

  async generateCourseAnalytics(courseId: string): Promise<CourseAnalytics | null> {
    const supabase = createServerSupabaseClient();
    
    // Get course details
    const { data: course, error: courseError } = await supabase
      .from('courses')
      .select('*')
      .eq('id', courseId)
      .single();
    
    if (courseError || !course) {
      console.error('Error fetching course:', courseError);
      return null;
    }
    
    // Get enrollments for this course
    const { data: enrollments, error: enrollmentsError } = await supabase
      .from('enrollments')
      .select('*, student:profiles(*)')
      .eq('course_id', courseId);
    
    if (enrollmentsError) {
      console.error('Error fetching enrollments:', enrollmentsError);
      return null;
    }
    
    // Get modules for this course
    const { data: modules, error: modulesError } = await supabase
      .from('modules')
      .select('*')
      .eq('course_id', courseId);
    
    if (modulesError) {
      console.error('Error fetching modules:', modulesError);
      return null;
    }
    
    // Get assessments for this course
    const { data: assessments, error: assessmentsError } = await supabase
      .from('assessments')
      .select('*')
      .eq('course_id', courseId);
    
    if (assessmentsError) {
      console.error('Error fetching assessments:', assessmentsError);
      return null;
    }
    
    // Get student progress
    const studentProgress = [];
    const moduleCompletion = [];
    const assessmentPerformance = [];
    
    // Calculate student progress
    for (const enrollment of enrollments || []) {
      // Get progress for each student
      const { data: progress, error: progressError } = await supabase
        .from('student_progress')
        .select('*')
        .eq('student_id', enrollment.student_id)
        .eq('course_id', courseId)
        .single();
      
      if (!progressError && progress) {
        studentProgress.push({
          studentId: enrollment.student_id,
          progress: progress.progress_percentage,
          lastActivity: progress.last_activity_at
        });
      }
    }
    
    // Calculate module completion
    for (const module of modules || []) {
      // Get completion for each module
      const { data: completions, error: completionsError } = await supabase
        .from('module_completions')
        .select('*')
        .eq('module_id', module.id);
      
      if (!completionsError && completions) {
        const completionRate = enrollments?.length > 0
          ? (completions.length / enrollments.length) * 100
          : 0;
        
        moduleCompletion.push({
          moduleId: module.id,
          title: module.title,
          completionRate
        });
      }
    }
    
    // Calculate assessment performance
    for (const assessment of assessments || []) {
      // Get submissions for each assessment
      const { data: submissions, error: submissionsError } = await supabase
        .from('student_submissions')
        .select('*')
        .eq('assessment_id', assessment.id);
      
      if (!submissionsError && submissions) {
        const completedSubmissions = submissions.filter(s => s.status === 'graded');
        const averageScore = completedSubmissions.length > 0
          ? completedSubmissions.reduce((sum, s) => sum + (s.score || 0), 0) / completedSubmissions.length
          : 0;
        
        const completionRate = enrollments?.length > 0
          ? (completedSubmissions.length / enrollments.length) * 100
          : 0;
        
        assessmentPerformance.push({
          assessmentId: assessment.id,
          title: assessment.title,
          averageScore,
          completionRate
        });
      }
    }
    
    // Calculate overall metrics
    const totalStudents = enrollments?.length || 0;
    const activeStudents = studentProgress.filter(p => 
      new Date(p.lastActivity).getTime() > Date.now() - 7 * 24 * 60 * 60 * 1000
    ).length;
    
    const completionRate = studentProgress.length > 0
      ? studentProgress.reduce((sum, p) => sum + p.progress, 0) / studentProgress.length
      : 0;
    
    const averageScore = assessmentPerformance.length > 0
      ? assessmentPerformance.reduce((sum, a) => sum + a.averageScore, 0) / assessmentPerformance.length
      : 0;
    
    // Create analytics object
    const analytics: CourseAnalytics = {
      courseId,
      totalStudents,
      activeStudents,
      completionRate,
      averageScore,
      studentProgress,
      moduleCompletion,
      assessmentPerformance
    };
    
    // Save analytics to database
    await supabase
      .from('analytics')
      .insert({
        type: 'course',
        entity_id: courseId,
        data: analytics
      });
    
    return analytics;
  }

  // Student Analytics
  async getStudentAnalytics(studentId: string): Promise<StudentAnalytics | null> {
    const supabase = createServerSupabaseClient();
    
    // Get analytics data from the database
    const { data, error } = await supabase
      .from('analytics')
      .select('*')
      .eq('type', 'student')
      .eq('entity_id', studentId)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();
    
    if (error || !data) {
      console.error('Error fetching student analytics:', error);
      
      // Generate analytics data if not found
      return this.generateStudentAnalytics(studentId);
    }
    
    return data.data as StudentAnalytics;
  }

  async generateStudentAnalytics(studentId: string): Promise<StudentAnalytics | null> {
    const supabase = createServerSupabaseClient();
    
    // Get student details
    const { data: student, error: studentError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', studentId)
      .single();
    
    if (studentError || !student) {
      console.error('Error fetching student:', studentError);
      return null;
    }
    
    // Get enrollments for this student
    const { data: enrollments, error: enrollmentsError } = await supabase
      .from('enrollments')
      .select('*, course:courses(*)')
      .eq('student_id', studentId);
    
    if (enrollmentsError) {
      console.error('Error fetching enrollments:', enrollmentsError);
      return null;
    }
    
    // Get assessment submissions for this student
    const { data: submissions, error: submissionsError } = await supabase
      .from('student_submissions')
      .select('*, assessment:assessments(*)')
      .eq('student_id', studentId);
    
    if (submissionsError) {
      console.error('Error fetching submissions:', submissionsError);
      return null;
    }
    
    // Calculate course progress
    const courseProgress = [];
    let totalTimeSpent = 0;
    
    for (const enrollment of enrollments || []) {
      // Get progress for each course
      const { data: progress, error: progressError } = await supabase
        .from('student_progress')
        .select('*')
        .eq('student_id', studentId)
        .eq('course_id', enrollment.course_id)
        .single();
      
      if (!progressError && progress) {
        courseProgress.push({
          courseId: enrollment.course_id,
          title: enrollment.course?.title || 'Unknown Course',
          progress: progress.progress_percentage,
          score: progress.score || 0,
          lastActivity: progress.last_activity_at
        });
        
        totalTimeSpent += progress.time_spent_seconds || 0;
      }
    }
    
    // Calculate assessment performance
    const assessmentPerformance = [];
    
    for (const submission of submissions || []) {
      if (submission.status === 'graded') {
        assessmentPerformance.push({
          assessmentId: submission.assessment_id,
          title: submission.assessment?.title || 'Unknown Assessment',
          score: submission.score || 0,
          completedAt: submission.completed_at || submission.updated_at
        });
      }
    }
    
    // Calculate overall metrics
    const enrolledCourses = enrollments?.length || 0;
    const completedCourses = courseProgress.filter(p => p.progress >= 100).length;
    
    const averageScore = assessmentPerformance.length > 0
      ? assessmentPerformance.reduce((sum, a) => sum + a.score, 0) / assessmentPerformance.length
      : 0;
    
    // Analyze strengths and areas for improvement
    const strengths = [];
    const areasForImprovement = [];
    
    // Group assessments by type
    const assessmentsByType: Record<string, { score: number, count: number }> = {};
    
    for (const submission of submissions || []) {
      if (submission.status === 'graded' && submission.assessment?.type_id) {
        const typeId = submission.assessment.type_id;
        
        if (!assessmentsByType[typeId]) {
          assessmentsByType[typeId] = { score: 0, count: 0 };
        }
        
        assessmentsByType[typeId].score += submission.score || 0;
        assessmentsByType[typeId].count += 1;
      }
    }
    
    // Find strengths and weaknesses
    for (const [typeId, data] of Object.entries(assessmentsByType)) {
      const averageTypeScore = data.count > 0 ? data.score / data.count : 0;
      
      // Get assessment type name
      const { data: assessmentType } = await supabase
        .from('assessment_types')
        .select('name')
        .eq('id', typeId)
        .single();
      
      const typeName = assessmentType?.name || 'Unknown Type';
      
      if (averageTypeScore >= 80) {
        strengths.push(`Bom desempenho em ${typeName}`);
      } else if (averageTypeScore <= 60) {
        areasForImprovement.push(`Precisa melhorar em ${typeName}`);
      }
    }
    
    // Add general strengths/weaknesses
    if (courseProgress.length > 0) {
      const avgProgress = courseProgress.reduce((sum, p) => sum + p.progress, 0) / courseProgress.length;
      
      if (avgProgress >= 75) {
        strengths.push('Progresso consistente nos cursos');
      } else if (avgProgress <= 40) {
        areasForImprovement.push('Progresso lento nos cursos');
      }
    }
    
    // Create analytics object
    const analytics: StudentAnalytics = {
      studentId,
      enrolledCourses,
      completedCourses,
      averageScore,
      totalTimeSpent,
      courseProgress,
      assessmentPerformance,
      strengths,
      areasForImprovement
    };
    
    // Save analytics to database
    await supabase
      .from('analytics')
      .insert({
        type: 'student',
        entity_id: studentId,
        data: analytics
      });
    
    return analytics;
  }

  // Assessment Analytics
  async getAssessmentAnalytics(assessmentId: string): Promise<AssessmentAnalytics | null> {
    const supabase = createServerSupabaseClient();
    
    // Get analytics data from the database
    const { data, error } = await supabase
      .from('analytics')
      .select('*')
      .eq('type', 'assessment')
      .eq('entity_id', assessmentId)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();
    
    if (error || !data) {
      console.error('Error fetching assessment analytics:', error);
      
      // Generate analytics data if not found
      return this.generateAssessmentAnalytics(assessmentId);
    }
    
    return data.data as AssessmentAnalytics;
  }

  async generateAssessmentAnalytics(assessmentId: string): Promise<AssessmentAnalytics | null> {
    const supabase = createServerSupabaseClient();
    
    // Get assessment details
    const { data: assessment, error: assessmentError } = await supabase
      .from('assessments')
      .select(`
        *,
        questions:assessment_questions(*)
      `)
      .eq('id', assessmentId)
      .single();
    
    if (assessmentError || !assessment) {
      console.error('Error fetching assessment:', assessmentError);
      return null;
    }
    
    // Get submissions for this assessment
    const { data: submissions, error: submissionsError } = await supabase
      .from('student_submissions')
      .select(`
        *,
        answers:submission_answers(*)
      `)
      .eq('assessment_id', assessmentId);
    
    if (submissionsError) {
      console.error('Error fetching submissions:', submissionsError);
      return null;
    }
    
    // Filter completed submissions
    const completedSubmissions = (submissions || []).filter(s => 
      s.status === 'graded' || s.status === 'needs_review'
    );
    
    // Calculate overall metrics
    const totalSubmissions = completedSubmissions.length;
    
    const averageScore = totalSubmissions > 0
      ? completedSubmissions.reduce((sum, s) => sum + (s.score || 0), 0) / totalSubmissions
      : 0;
    
    const passRate = totalSubmissions > 0
      ? (completedSubmissions.filter(s => s.passed).length / totalSubmissions) * 100
      : 0;
    
    const averageTimeSpent = totalSubmissions > 0
      ? completedSubmissions.reduce((sum, s) => sum + (s.time_spent_seconds || 0), 0) / totalSubmissions
      : 0;
    
    // Calculate question performance
    const questionPerformance = [];
    
    for (const question of assessment.questions || []) {
      let correctCount = 0;
      let totalCount = 0;
      let totalScore = 0;
      
      for (const submission of completedSubmissions) {
        const answer = submission.answers?.find((a: { question_id: string }) => a.question_id === question.id);
        
        if (answer) {
          totalCount++;
          
          if (answer.is_correct) {
            correctCount++;
          }
          
          totalScore += answer.points_awarded || 0;
        }
      }
      
      const correctRate = totalCount > 0 ? (correctCount / totalCount) * 100 : 0;
      const averageQuestionScore = totalCount > 0 ? totalScore / totalCount : 0;
      
      questionPerformance.push({
        questionId: question.id,
        averageScore: averageQuestionScore,
        correctRate
      });
    }
    
    // Calculate score distribution (0-10, 11-20, ..., 91-100)
    const scoreDistribution = Array(10).fill(0);
    
    for (const submission of completedSubmissions) {
      if (submission.score !== null) {
        const index = Math.min(Math.floor(submission.score / 10), 9);
        scoreDistribution[index]++;
      }
    }
    
    // Create analytics object
    const analytics: AssessmentAnalytics = {
      assessmentId,
      totalSubmissions,
      averageScore,
      passRate,
      averageTimeSpent,
      questionPerformance,
      scoreDistribution
    };
    
    // Save analytics to database
    await supabase
      .from('analytics')
      .insert({
        type: 'assessment',
        entity_id: assessmentId,
        data: analytics
      });
    
    return analytics;
  }

  // Content Analytics
  async getContentAnalytics(contentId: string): Promise<ContentAnalytics | null> {
    const supabase = createServerSupabaseClient();
    
    // Get analytics data from the database
    const { data, error } = await supabase
      .from('analytics')
      .select('*')
      .eq('type', 'content')
      .eq('entity_id', contentId)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();
    
    if (error || !data) {
      console.error('Error fetching content analytics:', error);
      
      // Generate analytics data if not found
      return this.generateContentAnalytics(contentId);
    }
    
    return data.data as ContentAnalytics;
  }

  async generateContentAnalytics(contentId: string): Promise<ContentAnalytics | null> {
    const supabase = createServerSupabaseClient();
    
    // Get content details
    const { data: content, error: contentError } = await supabase
      .from('content_items')
      .select('*')
      .eq('id', contentId)
      .single();
    
    if (contentError || !content) {
      console.error('Error fetching content:', contentError);
      return null;
    }
    
    // Get content views
    const { data: contentViews, error: viewsError } = await supabase
      .from('content_views')
      .select('*')
      .eq('content_id', contentId);
    
    if (viewsError) {
      console.error('Error fetching content views:', viewsError);
      return null;
    }
    
    // Get content feedback
    const { data: contentFeedback, error: feedbackError } = await supabase
      .from('content_feedback')
      .select('*')
      .eq('content_id', contentId);
    
    if (feedbackError) {
      console.error('Error fetching content feedback:', feedbackError);
      return null;
    }
    
    // Calculate metrics
    const views = contentViews?.length || 0;
    const uniqueViewers = new Set(contentViews?.map(v => v.user_id) || []).size;
    
    const totalTimeSpent = contentViews?.reduce((sum, v) => sum + (v.time_spent_seconds || 0), 0) || 0;
    const averageTimeSpent = views > 0 ? totalTimeSpent / views : 0;
    
    const completedViews = contentViews?.filter(v => v.completed) || [];
    const completionRate = views > 0 ? (completedViews.length / views) * 100 : 0;
    
    // Calculate engagement rate (interactions / views)
    const interactions = contentViews?.reduce((sum, v) => sum + (v.interaction_count || 0), 0) || 0;
    const engagementRate = views > 0 ? (interactions / views) * 100 : 0;
    
    // Process feedback
    const ratings = contentFeedback?.map(f => f.rating) || [];
    const averageRating = ratings.length > 0
      ? ratings.reduce((sum, r) => sum + r, 0) / ratings.length
      : 0;
    
    const comments = contentFeedback?.map(f => f.comment).filter(Boolean) || [];
    
    // Create analytics object
    const analytics: ContentAnalytics = {
      contentId,
      views,
      uniqueViews: uniqueViewers,
      averageTimeSpent,
      completionRate,
      engagementRate,
      feedback: {
        rating: averageRating,
        comments
      }
    };
    
    // Save analytics to database
    await supabase
      .from('analytics')
      .insert({
        type: 'content',
        entity_id: contentId,
        data: analytics
      });
    
    return analytics;
  }

  // Platform Analytics
  async getPlatformAnalytics(): Promise<any> {
    const supabase = createServerSupabaseClient();
    
    // Get total users
    const { count: totalUsers } = await supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true });
    
    // Get active users (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const { count: activeUsers } = await supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true })
      .gt('last_sign_in_at', thirtyDaysAgo.toISOString());
    
    // Get total courses
    const { count: totalCourses } = await supabase
      .from('courses')
      .select('*', { count: 'exact', head: true });
    
    // Get total enrollments
    const { count: totalEnrollments } = await supabase
      .from('enrollments')
      .select('*', { count: 'exact', head: true });
    
    // Get total content items
    const { count: totalContentItems } = await supabase
      .from('content_items')
      .select('*', { count: 'exact', head: true });
    
    // Get total assessments
    const { count: totalAssessments } = await supabase
      .from('assessments')
      .select('*', { count: 'exact', head: true });
    
    // Get total submissions
    const { count: totalSubmissions } = await supabase
      .from('student_submissions')
      .select('*', { count: 'exact', head: true });
    
    // Get user growth (last 6 months)
    const userGrowth = [];
    
    for (let i = 5; i >= 0; i--) {
      const startDate = new Date();
      startDate.setMonth(startDate.getMonth() - i);
      startDate.setDate(1);
      startDate.setHours(0, 0, 0, 0);
      
      const endDate = new Date(startDate);
      endDate.setMonth(endDate.getMonth() + 1);
      
      const { count } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', startDate.toISOString())
        .lt('created_at', endDate.toISOString());
      
      userGrowth.push({
        month: startDate.toLocaleString('default', { month: 'short' }),
        count: count || 0
      });
    }
    
    return {
      totalUsers,
      activeUsers,
      totalCourses,
      totalEnrollments,
      totalContentItems,
      totalAssessments,
      totalSubmissions,
      userGrowth,
      activeUserRate: totalUsers && totalUsers > 0 ? (activeUsers || 0) / totalUsers * 100 : 0,
      enrollmentsPerCourse: totalCourses && totalCourses > 0 ? (totalEnrollments || 0) / totalCourses : 0,
      submissionsPerAssessment: totalAssessments && totalAssessments > 0 ? (totalSubmissions || 0) / totalAssessments : 0
    };
  }
}

export const analyticsService = AnalyticsService.getInstance();
