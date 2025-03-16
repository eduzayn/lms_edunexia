import { createClient } from '@supabase/supabase-js';
import { Database } from '@/types/supabase';
import { createServerSupabaseClient } from '../supabase/server';

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon?: string;
  points: number;
  achievement_type: 'course_completion' | 'assessment_score' | 'login_streak' | 'content_creation' | 'forum_participation' | 'custom';
  criteria: Record<string, any>;
  is_hidden: boolean;
  created_at: string;
  updated_at: string;
}

export interface UserAchievement {
  id: string;
  user_id: string;
  achievement_id: string;
  achieved_at: string;
  context: Record<string, any>;
  created_at: string;
  achievement?: Achievement;
}

export interface PointsTransaction {
  id: string;
  user_id: string;
  points: number;
  transaction_type: 'achievement' | 'course_completion' | 'assessment_completion' | 'login_streak' | 'content_creation' | 'forum_participation' | 'custom';
  reference_id?: string;
  description?: string;
  created_at: string;
}

export interface Level {
  id: string;
  level_number: number;
  name: string;
  description?: string;
  points_required: number;
  icon?: string;
  benefits: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface UserLevel {
  id: string;
  user_id: string;
  level_id: string;
  current_points: number;
  level_achieved_at: string;
  created_at: string;
  updated_at: string;
  level?: Level;
}

class GamificationService {
  private static instance: GamificationService;
  private supabaseUrl: string;
  private supabaseKey: string;
  private supabase: ReturnType<typeof createClient> | null = null;

  private constructor() {
    this.supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
    this.supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
    
    if (this.supabaseUrl && this.supabaseKey) {
      this.supabase = createClient(this.supabaseUrl, this.supabaseKey);
    }
  }

  public static getInstance(): GamificationService {
    if (!GamificationService.instance) {
      GamificationService.instance = new GamificationService();
    }
    return GamificationService.instance;
  }

  // Achievements
  async getAchievements(includeHidden = false): Promise<Achievement[]> {
    const supabase = createServerSupabaseClient();
    
    let query = supabase
      .from('gamification.achievements')
      .select('*')
      .order('points', { ascending: false });
    
    if (!includeHidden) {
      query = query.eq('is_hidden', false);
    }
    
    const { data, error } = await query;
    
    if (error) {
      console.error('Error fetching achievements:', error);
      return [];
    }
    
    return data || [];
  }

  async getAchievement(id: string): Promise<Achievement | null> {
    const supabase = createServerSupabaseClient();
    
    const { data, error } = await supabase
      .from('gamification.achievements')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      console.error('Error fetching achievement:', error);
      return null;
    }
    
    return data;
  }

  async createAchievement(achievement: Partial<Achievement>): Promise<Achievement | null> {
    const supabase = createServerSupabaseClient();
    
    const { data, error } = await supabase
      .from('gamification.achievements')
      .insert({
        name: achievement.name || 'Nova Conquista',
        description: achievement.description || 'Descrição da conquista',
        icon: achievement.icon,
        points: achievement.points || 10,
        achievement_type: achievement.achievement_type || 'custom',
        criteria: achievement.criteria || {},
        is_hidden: achievement.is_hidden || false
      })
      .select()
      .single();
    
    if (error) {
      console.error('Error creating achievement:', error);
      return null;
    }
    
    return data;
  }

  async updateAchievement(id: string, achievement: Partial<Achievement>): Promise<Achievement | null> {
    const supabase = createServerSupabaseClient();
    
    const { data, error } = await supabase
      .from('gamification.achievements')
      .update({
        name: achievement.name,
        description: achievement.description,
        icon: achievement.icon,
        points: achievement.points,
        achievement_type: achievement.achievement_type,
        criteria: achievement.criteria,
        is_hidden: achievement.is_hidden
      })
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error('Error updating achievement:', error);
      return null;
    }
    
    return data;
  }

  // User Achievements
  async getUserAchievements(userId: string): Promise<UserAchievement[]> {
    const supabase = createServerSupabaseClient();
    
    const { data, error } = await supabase
      .from('gamification.user_achievements')
      .select(`
        *,
        achievement:gamification.achievements(*)
      `)
      .eq('user_id', userId)
      .order('achieved_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching user achievements:', error);
      return [];
    }
    
    return data || [];
  }

  async awardAchievement(userId: string, achievementId: string, context: Record<string, any> = {}): Promise<UserAchievement | null> {
    const supabase = createServerSupabaseClient();
    
    // Check if user already has this achievement
    const { data: existingAchievement } = await supabase
      .from('gamification.user_achievements')
      .select('id')
      .eq('user_id', userId)
      .eq('achievement_id', achievementId)
      .maybeSingle();
    
    if (existingAchievement) {
      console.log('User already has this achievement');
      return null;
    }
    
    // Get achievement details
    const achievement = await this.getAchievement(achievementId);
    if (!achievement) {
      console.error('Achievement not found');
      return null;
    }
    
    // Award achievement
    const { data, error } = await supabase
      .from('gamification.user_achievements')
      .insert({
        user_id: userId,
        achievement_id: achievementId,
        achieved_at: new Date().toISOString(),
        context
      })
      .select()
      .single();
    
    if (error) {
      console.error('Error awarding achievement:', error);
      return null;
    }
    
    // Add points
    await this.addPoints(userId, achievement.points, 'achievement', achievementId, `Conquista: ${achievement.name}`);
    
    return data;
  }

  // Points
  async getUserPoints(userId: string): Promise<number> {
    const supabase = createServerSupabaseClient();
    
    // Get user level which contains current points
    const { data: userLevel } = await supabase
      .from('gamification.user_levels')
      .select('current_points')
      .eq('user_id', userId)
      .maybeSingle();
    
    if (userLevel) {
      return userLevel.current_points;
    }
    
    // If user doesn't have a level yet, calculate from transactions
    const { data: transactions } = await supabase
      .from('gamification.points_transactions')
      .select('points')
      .eq('user_id', userId);
    
    if (!transactions) {
      return 0;
    }
    
    return transactions.reduce((total, transaction) => total + transaction.points, 0);
  }

  async getPointsTransactions(userId: string, limit = 10): Promise<PointsTransaction[]> {
    const supabase = createServerSupabaseClient();
    
    const { data, error } = await supabase
      .from('gamification.points_transactions')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit);
    
    if (error) {
      console.error('Error fetching points transactions:', error);
      return [];
    }
    
    return data || [];
  }

  async addPoints(
    userId: string, 
    points: number, 
    transactionType: PointsTransaction['transaction_type'], 
    referenceId?: string, 
    description?: string
  ): Promise<PointsTransaction | null> {
    const supabase = createServerSupabaseClient();
    
    // Add points transaction
    const { data, error } = await supabase
      .from('gamification.points_transactions')
      .insert({
        user_id: userId,
        points,
        transaction_type: transactionType,
        reference_id: referenceId,
        description
      })
      .select()
      .single();
    
    if (error) {
      console.error('Error adding points:', error);
      return null;
    }
    
    // Update user level
    await this.updateUserLevel(userId);
    
    return data;
  }

  // Levels
  async getLevels(): Promise<Level[]> {
    const supabase = createServerSupabaseClient();
    
    const { data, error } = await supabase
      .from('gamification.levels')
      .select('*')
      .order('level_number', { ascending: true });
    
    if (error) {
      console.error('Error fetching levels:', error);
      return [];
    }
    
    return data || [];
  }

  async getUserLevel(userId: string): Promise<UserLevel | null> {
    const supabase = createServerSupabaseClient();
    
    const { data, error } = await supabase
      .from('gamification.user_levels')
      .select(`
        *,
        level:gamification.levels(*)
      `)
      .eq('user_id', userId)
      .single();
    
    if (error) {
      // User might not have a level yet
      if (error.code === 'PGRST116') {
        // Initialize user level
        return this.initializeUserLevel(userId);
      }
      
      console.error('Error fetching user level:', error);
      return null;
    }
    
    return data;
  }

  private async initializeUserLevel(userId: string): Promise<UserLevel | null> {
    const supabase = createServerSupabaseClient();
    
    // Get level 1
    const { data: level1 } = await supabase
      .from('gamification.levels')
      .select('*')
      .eq('level_number', 1)
      .single();
    
    if (!level1) {
      console.error('Level 1 not found');
      return null;
    }
    
    // Create user level
    const { data, error } = await supabase
      .from('gamification.user_levels')
      .insert({
        user_id: userId,
        level_id: level1.id,
        current_points: 0,
        level_achieved_at: new Date().toISOString()
      })
      .select(`
        *,
        level:gamification.levels(*)
      `)
      .single();
    
    if (error) {
      console.error('Error initializing user level:', error);
      return null;
    }
    
    return data;
  }

  private async updateUserLevel(userId: string): Promise<void> {
    const supabase = createServerSupabaseClient();
    
    // Get current points
    const totalPoints = await this.getUserPoints(userId);
    
    // Get all levels
    const levels = await this.getLevels();
    if (!levels.length) {
      return;
    }
    
    // Find highest level user qualifies for
    let highestQualifyingLevel = levels[0];
    for (const level of levels) {
      if (totalPoints >= level.points_required) {
        highestQualifyingLevel = level;
      } else {
        break;
      }
    }
    
    // Get current user level
    const { data: userLevel } = await supabase
      .from('gamification.user_levels')
      .select('id, level_id, current_points')
      .eq('user_id', userId)
      .maybeSingle();
    
    if (!userLevel) {
      // Initialize user level
      await this.initializeUserLevel(userId);
      return;
    }
    
    // Update points
    await supabase
      .from('gamification.user_levels')
      .update({
        current_points: totalPoints
      })
      .eq('id', userLevel.id);
    
    // If level changed, update level
    if (userLevel.level_id !== highestQualifyingLevel.id) {
      await supabase
        .from('gamification.user_levels')
        .update({
          level_id: highestQualifyingLevel.id,
          level_achieved_at: new Date().toISOString()
        })
        .eq('id', userLevel.id);
    }
  }

  // Achievement Eligibility Checks
  async checkLoginStreakAchievements(userId: string): Promise<void> {
    const supabase = createServerSupabaseClient();
    
    // Get login streak achievements
    const { data: achievements } = await supabase
      .from('gamification.achievements')
      .select('*')
      .eq('achievement_type', 'login_streak')
      .order('points', { ascending: true });
    
    if (!achievements || !achievements.length) {
      return;
    }
    
    // Get user's login history
    const { data: loginHistory } = await supabase
      .from('analytics.user_logins')
      .select('login_date')
      .eq('user_id', userId)
      .order('login_date', { ascending: false });
    
    if (!loginHistory || !loginHistory.length) {
      return;
    }
    
    const loginCount = loginHistory.length;
    
    // Check for consecutive days
    let consecutiveDays = 1;
    for (let i = 1; i < loginHistory.length; i++) {
      const currentDate = new Date(loginHistory[i-1].login_date);
      const prevDate = new Date(loginHistory[i].login_date);
      
      const diffTime = Math.abs(currentDate.getTime() - prevDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays === 1) {
        consecutiveDays++;
      } else {
        break;
      }
    }
    
    // Check each achievement
    for (const achievement of achievements) {
      const criteria = achievement.criteria as Record<string, any>;
      
      if (criteria.logins && loginCount >= criteria.logins) {
        await this.awardAchievement(userId, achievement.id, { login_count: loginCount });
      }
      
      if (criteria.consecutive_days && consecutiveDays >= criteria.consecutive_days) {
        await this.awardAchievement(userId, achievement.id, { consecutive_days: consecutiveDays });
      }
    }
  }

  async checkCourseCompletionAchievements(userId: string): Promise<void> {
    const supabase = createServerSupabaseClient();
    
    // Get course completion achievements
    const { data: achievements } = await supabase
      .from('gamification.achievements')
      .select('*')
      .eq('achievement_type', 'course_completion')
      .order('points', { ascending: true });
    
    if (!achievements || !achievements.length) {
      return;
    }
    
    // Get completed courses
    const { data: completedCourses } = await supabase
      .from('analytics.student_progress')
      .select('course_id')
      .eq('student_id', userId)
      .eq('progress_percentage', 100);
    
    if (!completedCourses) {
      return;
    }
    
    const completedCount = completedCourses.length;
    
    // Check each achievement
    for (const achievement of achievements) {
      const criteria = achievement.criteria as Record<string, any>;
      
      if (criteria.courses && completedCount >= criteria.courses) {
        await this.awardAchievement(userId, achievement.id, { completed_courses: completedCount });
      }
    }
  }

  async checkAssessmentScoreAchievements(userId: string, assessmentId: string, score: number): Promise<void> {
    const supabase = createServerSupabaseClient();
    
    // Get assessment score achievements
    const { data: achievements } = await supabase
      .from('gamification.achievements')
      .select('*')
      .eq('achievement_type', 'assessment_score')
      .order('points', { ascending: true });
    
    if (!achievements || !achievements.length) {
      return;
    }
    
    // Check each achievement
    for (const achievement of achievements) {
      const criteria = achievement.criteria as Record<string, any>;
      
      if (criteria.min_score && score >= criteria.min_score) {
        await this.awardAchievement(userId, achievement.id, { 
          assessment_id: assessmentId,
          score 
        });
      }
    }
  }

  async checkForumParticipationAchievements(userId: string): Promise<void> {
    const supabase = createServerSupabaseClient();
    
    // Get forum participation achievements
    const { data: achievements } = await supabase
      .from('gamification.achievements')
      .select('*')
      .eq('achievement_type', 'forum_participation')
      .order('points', { ascending: true });
    
    if (!achievements || !achievements.length) {
      return;
    }
    
    // Get forum posts count
    const { count: postsCount } = await supabase
      .from('forums.posts')
      .select('*', { count: 'exact', head: true })
      .eq('author_id', userId);
    
    if (postsCount === null) {
      return;
    }
    
    // Check each achievement
    for (const achievement of achievements) {
      const criteria = achievement.criteria as Record<string, any>;
      
      if (criteria.min_posts && postsCount >= criteria.min_posts) {
        await this.awardAchievement(userId, achievement.id, { posts_count: postsCount });
      }
    }
  }

  // Course completion handler - call this when a course is completed
  async handleCourseCompletion(userId: string, courseId: string): Promise<void> {
    // Add points for course completion
    await this.addPoints(
      userId,
      100, // Default points for course completion
      'course_completion',
      courseId,
      'Conclusão de curso'
    );
    
    // Check for achievements
    await this.checkCourseCompletionAchievements(userId);
  }

  // Assessment completion handler - call this when an assessment is completed
  async handleAssessmentCompletion(userId: string, assessmentId: string, score: number, passed: boolean): Promise<void> {
    // Add points for assessment completion
    const points = passed ? 50 : 10; // More points if passed
    
    await this.addPoints(
      userId,
      points,
      'assessment_completion',
      assessmentId,
      `Avaliação ${passed ? 'aprovada' : 'concluída'}`
    );
    
    // Check for achievements
    await this.checkAssessmentScoreAchievements(userId, assessmentId, score);
  }
}

export default GamificationService;
