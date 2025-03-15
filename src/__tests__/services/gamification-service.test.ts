import GamificationService, { Achievement, UserAchievement, PointsTransaction, Level, UserLevel } from '@/lib/services/gamification-service';
import { createServerSupabaseClient } from '@/lib/supabase/server';

// Mock Supabase client
jest.mock('@/lib/supabase/server', () => ({
  createServerSupabaseClient: jest.fn(),
}));

describe('GamificationService', () => {
  let mockSupabase: any;
  
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Setup mock Supabase client
    mockSupabase = {
      from: jest.fn().mockReturnThis(),
      select: jest.fn().mockReturnThis(),
      insert: jest.fn().mockReturnThis(),
      update: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      single: jest.fn(),
      maybeSingle: jest.fn(),
      order: jest.fn().mockReturnThis(),
      limit: jest.fn().mockReturnThis(),
      count: jest.fn().mockReturnThis(),
      head: jest.fn().mockReturnThis(),
    };
    
    (createServerSupabaseClient as jest.Mock).mockReturnValue(mockSupabase);
  });
  
  describe('getAchievements', () => {
    it('should return achievements when successful', async () => {
      const mockAchievements = [
        {
          id: 'achievement-1',
          name: 'First Course',
          description: 'Complete your first course',
          points: 50,
          achievement_type: 'course_completion',
          criteria: { courses: 1 },
          is_hidden: false,
          created_at: '2025-01-01T00:00:00Z',
          updated_at: '2025-01-01T00:00:00Z'
        }
      ];
      
      mockSupabase.order.mockResolvedValue({ data: mockAchievements, error: null });
      
      const service = GamificationService.getInstance();
      const result = await service.getAchievements();
      
      expect(mockSupabase.from).toHaveBeenCalledWith('gamification.achievements');
      expect(mockSupabase.select).toHaveBeenCalledWith('*');
      expect(mockSupabase.eq).toHaveBeenCalledWith('is_hidden', false);
      expect(mockSupabase.order).toHaveBeenCalledWith('points', { ascending: false });
      expect(result).toEqual(mockAchievements);
    });
    
    it('should include hidden achievements when includeHidden is true', async () => {
      const mockAchievements = [
        {
          id: 'achievement-1',
          name: 'First Course',
          description: 'Complete your first course',
          points: 50,
          achievement_type: 'course_completion',
          criteria: { courses: 1 },
          is_hidden: false,
          created_at: '2025-01-01T00:00:00Z',
          updated_at: '2025-01-01T00:00:00Z'
        },
        {
          id: 'achievement-2',
          name: 'Secret Achievement',
          description: 'Hidden achievement',
          points: 100,
          achievement_type: 'custom',
          criteria: {},
          is_hidden: true,
          created_at: '2025-01-01T00:00:00Z',
          updated_at: '2025-01-01T00:00:00Z'
        }
      ];
      
      mockSupabase.order.mockResolvedValue({ data: mockAchievements, error: null });
      
      const service = GamificationService.getInstance();
      const result = await service.getAchievements(true);
      
      expect(mockSupabase.from).toHaveBeenCalledWith('gamification.achievements');
      expect(mockSupabase.select).toHaveBeenCalledWith('*');
      expect(mockSupabase.eq).not.toHaveBeenCalled();
      expect(mockSupabase.order).toHaveBeenCalledWith('points', { ascending: false });
      expect(result).toEqual(mockAchievements);
    });
    
    it('should return empty array when error occurs', async () => {
      mockSupabase.order.mockResolvedValue({ data: null, error: new Error('Database error') });
      
      const service = GamificationService.getInstance();
      const result = await service.getAchievements();
      
      expect(result).toEqual([]);
    });
  });
  
  describe('getUserAchievements', () => {
    it('should return user achievements when successful', async () => {
      const mockUserAchievements = [
        {
          id: 'user-achievement-1',
          user_id: 'user-1',
          achievement_id: 'achievement-1',
          achieved_at: '2025-01-01T00:00:00Z',
          context: {},
          created_at: '2025-01-01T00:00:00Z',
          achievement: {
            id: 'achievement-1',
            name: 'First Course',
            description: 'Complete your first course',
            points: 50,
            achievement_type: 'course_completion',
            criteria: { courses: 1 },
            is_hidden: false,
            created_at: '2025-01-01T00:00:00Z',
            updated_at: '2025-01-01T00:00:00Z'
          }
        }
      ];
      
      mockSupabase.order.mockResolvedValue({ data: mockUserAchievements, error: null });
      
      const service = GamificationService.getInstance();
      const result = await service.getUserAchievements('user-1');
      
      expect(mockSupabase.from).toHaveBeenCalledWith('gamification.user_achievements');
      expect(mockSupabase.select).toHaveBeenCalledWith(`
        *,
        achievement:gamification.achievements(*)
      `);
      expect(mockSupabase.eq).toHaveBeenCalledWith('user_id', 'user-1');
      expect(mockSupabase.order).toHaveBeenCalledWith('achieved_at', { ascending: false });
      expect(result).toEqual(mockUserAchievements);
    });
    
    it('should return empty array when error occurs', async () => {
      mockSupabase.order.mockResolvedValue({ data: null, error: new Error('Database error') });
      
      const service = GamificationService.getInstance();
      const result = await service.getUserAchievements('user-1');
      
      expect(result).toEqual([]);
    });
  });
  
  describe('awardAchievement', () => {
    it('should award achievement when user does not have it yet', async () => {
      const mockAchievement = {
        id: 'achievement-1',
        name: 'First Course',
        description: 'Complete your first course',
        points: 50,
        achievement_type: 'course_completion',
        criteria: { courses: 1 },
        is_hidden: false,
        created_at: '2025-01-01T00:00:00Z',
        updated_at: '2025-01-01T00:00:00Z'
      };
      
      const mockUserAchievement = {
        id: 'user-achievement-1',
        user_id: 'user-1',
        achievement_id: 'achievement-1',
        achieved_at: '2025-01-01T00:00:00Z',
        context: {},
        created_at: '2025-01-01T00:00:00Z'
      };
      
      // Mock check if user already has achievement
      mockSupabase.maybeSingle.mockResolvedValueOnce({ data: null, error: null });
      
      // Mock getAchievement
      mockSupabase.single.mockResolvedValueOnce({ data: mockAchievement, error: null });
      
      // Mock insert user achievement
      mockSupabase.single.mockResolvedValueOnce({ data: mockUserAchievement, error: null });
      
      // Mock addPoints
      const addPointsSpy = jest.spyOn(GamificationService.prototype as any, 'addPoints').mockResolvedValueOnce({});
      
      const service = GamificationService.getInstance();
      const result = await service.awardAchievement('user-1', 'achievement-1', { test: true });
      
      expect(mockSupabase.from).toHaveBeenCalledWith('gamification.user_achievements');
      expect(mockSupabase.select).toHaveBeenCalledWith('id');
      expect(mockSupabase.eq).toHaveBeenCalledWith('user_id', 'user-1');
      expect(mockSupabase.eq).toHaveBeenCalledWith('achievement_id', 'achievement-1');
      expect(mockSupabase.insert).toHaveBeenCalledWith({
        user_id: 'user-1',
        achievement_id: 'achievement-1',
        achieved_at: expect.any(String),
        context: { test: true }
      });
      expect(addPointsSpy).toHaveBeenCalledWith('user-1', 50, 'achievement', 'achievement-1', 'Conquista: First Course');
      expect(result).toEqual(mockUserAchievement);
      
      addPointsSpy.mockRestore();
    });
    
    it('should not award achievement when user already has it', async () => {
      // Mock check if user already has achievement
      mockSupabase.maybeSingle.mockResolvedValueOnce({ data: { id: 'existing-achievement' }, error: null });
      
      const service = GamificationService.getInstance();
      const result = await service.awardAchievement('user-1', 'achievement-1');
      
      expect(result).toBeNull();
    });
    
    it('should not award achievement when achievement does not exist', async () => {
      // Mock check if user already has achievement
      mockSupabase.maybeSingle.mockResolvedValueOnce({ data: null, error: null });
      
      // Mock getAchievement
      mockSupabase.single.mockResolvedValueOnce({ data: null, error: { code: 'PGRST116' } });
      
      const service = GamificationService.getInstance();
      const result = await service.awardAchievement('user-1', 'non-existent-achievement');
      
      expect(result).toBeNull();
    });
  });
  
  describe('getUserPoints', () => {
    it('should return points from user level when available', async () => {
      const mockUserLevel = {
        current_points: 250
      };
      
      mockSupabase.maybeSingle.mockResolvedValue({ data: mockUserLevel, error: null });
      
      const service = GamificationService.getInstance();
      const result = await service.getUserPoints('user-1');
      
      expect(mockSupabase.from).toHaveBeenCalledWith('gamification.user_levels');
      expect(mockSupabase.select).toHaveBeenCalledWith('current_points');
      expect(mockSupabase.eq).toHaveBeenCalledWith('user_id', 'user-1');
      expect(result).toBe(250);
    });
    
    it('should calculate points from transactions when user level not available', async () => {
      const mockTransactions = [
        { points: 50 },
        { points: 100 },
        { points: -20 }
      ];
      
      // Mock user level query
      mockSupabase.maybeSingle.mockResolvedValueOnce({ data: null, error: null });
      
      // Mock transactions query
      mockSupabase.select.mockResolvedValueOnce({ data: mockTransactions, error: null });
      
      const service = GamificationService.getInstance();
      const result = await service.getUserPoints('user-1');
      
      expect(mockSupabase.from).toHaveBeenCalledWith('gamification.points_transactions');
      expect(mockSupabase.select).toHaveBeenCalledWith('points');
      expect(mockSupabase.eq).toHaveBeenCalledWith('user_id', 'user-1');
      expect(result).toBe(130); // 50 + 100 - 20
    });
    
    it('should return 0 when no transactions found', async () => {
      // Mock user level query
      mockSupabase.maybeSingle.mockResolvedValueOnce({ data: null, error: null });
      
      // Mock transactions query
      mockSupabase.select.mockResolvedValueOnce({ data: null, error: null });
      
      const service = GamificationService.getInstance();
      const result = await service.getUserPoints('user-1');
      
      expect(result).toBe(0);
    });
  });
  
  describe('checkForAchievements', () => {
    it('should check all achievement types for user', async () => {
      // Mock methods
      const checkLoginStreakSpy = jest.spyOn(GamificationService.prototype as any, 'checkLoginStreakAchievements').mockResolvedValueOnce(undefined);
      const checkCourseCompletionSpy = jest.spyOn(GamificationService.prototype as any, 'checkCourseCompletionAchievements').mockResolvedValueOnce(undefined);
      const checkForumParticipationSpy = jest.spyOn(GamificationService.prototype as any, 'checkForumParticipationAchievements').mockResolvedValueOnce(undefined);
      
      // Mock getUserAchievements to return achievements before and after checks
      const mockBeforeAchievements = [
        { id: 'user-achievement-1', achievement_id: 'achievement-1' }
      ];
      
      const mockAfterAchievements = [
        { id: 'user-achievement-1', achievement_id: 'achievement-1' },
        { id: 'user-achievement-2', achievement_id: 'achievement-2' }
      ];
      
      const getUserAchievementsSpy = jest.spyOn(GamificationService.prototype, 'getUserAchievements')
        .mockResolvedValueOnce(mockBeforeAchievements)
        .mockResolvedValueOnce(mockAfterAchievements);
      
      const service = GamificationService.getInstance();
      const result = await service.checkForAchievements('user-1');
      
      expect(checkLoginStreakSpy).toHaveBeenCalledWith('user-1');
      expect(checkCourseCompletionSpy).toHaveBeenCalledWith('user-1');
      expect(checkForumParticipationSpy).toHaveBeenCalledWith('user-1');
      expect(getUserAchievementsSpy).toHaveBeenCalledTimes(2);
      expect(result).toEqual([{ id: 'user-achievement-2', achievement_id: 'achievement-2' }]);
      
      checkLoginStreakSpy.mockRestore();
      checkCourseCompletionSpy.mockRestore();
      checkForumParticipationSpy.mockRestore();
      getUserAchievementsSpy.mockRestore();
    });
  });
});
