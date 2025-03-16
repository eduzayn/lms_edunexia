import React from 'react';
import { render, screen, fireEvent, waitFor } from '../utils/test-utils';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { gamificationService } from '@/lib/services/gamification-service';
import StudentGamificationPage from '@/app/student/gamification/page';
import StudentDashboardPage from '@/app/student/dashboard/page';
import AdminGamificationPage from '@/app/admin/gamification/page';

// Mock the Supabase client
jest.mock('@/lib/supabase/server', () => ({
  createServerSupabaseClient: jest.fn()
}));

// Mock the Gamification service
jest.mock('@/lib/services/gamification-service', () => ({
  gamificationService: {
    getStudentAchievements: jest.fn(),
    getStudentLevel: jest.fn(),
    getStudentPoints: jest.fn(),
    getPointsHistory: jest.fn(),
    getLeaderboard: jest.fn(),
    checkAchievements: jest.fn(),
    getAvailableAchievements: jest.fn(),
    getAchievementTypes: jest.fn()
  }
}));

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(() => ({
    push: jest.fn(),
    back: jest.fn(),
    refresh: jest.fn()
  })),
  useParams: jest.fn(() => ({
    id: 'student-123'
  }))
}));

describe('Gamification Journey', () => {
  // Mock data
  const mockStudentId = 'student-123';
  
  const mockAchievements = [
    {
      id: 'achievement-1',
      student_id: mockStudentId,
      achievement_type_id: 'type-1',
      earned_at: '2025-01-01T00:00:00Z',
      points_awarded: 100,
      data: {
        course_id: 'course-1',
        course_name: 'Introduction to Web Development'
      },
      type: {
        id: 'type-1',
        name: 'Course Completion',
        description: 'Awarded when a student completes a course',
        icon: 'graduation-cap',
        points: 100,
        requirements: {
          progress_percentage: 100
        }
      }
    },
    {
      id: 'achievement-2',
      student_id: mockStudentId,
      achievement_type_id: 'type-2',
      earned_at: '2025-01-05T00:00:00Z',
      points_awarded: 50,
      data: {
        days: 7
      },
      type: {
        id: 'type-2',
        name: 'Login Streak',
        description: 'Awarded for logging in consistently',
        icon: 'calendar-check',
        points: 50,
        requirements: {
          days: 7
        }
      }
    }
  ];
  
  const mockLevel = {
    level: 3,
    points: 350,
    points_to_next_level: 150,
    total_points_needed: 500,
    progress_percentage: 70
  };
  
  const mockPointsHistory = [
    {
      id: 'points-1',
      student_id: mockStudentId,
      points: 100,
      source_type: 'achievement',
      source_id: 'achievement-1',
      description: 'Earned Course Completion achievement',
      created_at: '2025-01-01T00:00:00Z'
    },
    {
      id: 'points-2',
      student_id: mockStudentId,
      points: 50,
      source_type: 'achievement',
      source_id: 'achievement-2',
      description: 'Earned Login Streak achievement',
      created_at: '2025-01-05T00:00:00Z'
    },
    {
      id: 'points-3',
      student_id: mockStudentId,
      points: 200,
      source_type: 'assessment',
      source_id: 'assessment-1',
      description: 'Completed assessment with high score',
      created_at: '2025-01-10T00:00:00Z'
    }
  ];
  
  const mockLeaderboard = [
    {
      student_id: 'student-456',
      full_name: 'Jane Smith',
      points: 500,
      level: 5,
      rank: 1
    },
    {
      student_id: mockStudentId,
      full_name: 'John Doe',
      points: 350,
      level: 3,
      rank: 2
    },
    {
      student_id: 'student-789',
      full_name: 'Bob Johnson',
      points: 200,
      level: 2,
      rank: 3
    }
  ];
  
  const mockAvailableAchievements = [
    {
      id: 'type-3',
      name: 'Perfect Score',
      description: 'Awarded for getting 100% on an assessment',
      icon: 'star',
      points: 150,
      requirements: {
        score: 100
      }
    },
    {
      id: 'type-4',
      name: 'Forum Contributor',
      description: 'Awarded for posting in the forums',
      icon: 'comments',
      points: 75,
      requirements: {
        posts: 10
      }
    }
  ];

  // Mock Supabase methods
  const mockSelect = jest.fn();
  const mockEq = jest.fn();
  const mockOrder = jest.fn();
  const mockFrom = jest.fn();
  const mockRpc = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    
    // Reset mock chain
    mockOrder.mockReturnValue({ data: mockAchievements, error: null });
    mockEq.mockReturnValue({ order: mockOrder });
    mockSelect.mockReturnValue({ eq: mockEq });
    mockFrom.mockReturnValue({ select: mockSelect });
    mockRpc.mockReturnValue({ data: {}, error: null });
    
    // Mock Supabase client
    (createServerSupabaseClient as jest.Mock).mockReturnValue({
      from: mockFrom,
      rpc: mockRpc
    });
    
    // Mock Gamification service
    (gamificationService.getStudentAchievements as jest.Mock).mockResolvedValue(mockAchievements);
    (gamificationService.getStudentLevel as jest.Mock).mockResolvedValue(mockLevel);
    (gamificationService.getStudentPoints as jest.Mock).mockResolvedValue(350);
    (gamificationService.getPointsHistory as jest.Mock).mockResolvedValue(mockPointsHistory);
    (gamificationService.getLeaderboard as jest.Mock).mockResolvedValue(mockLeaderboard);
    (gamificationService.checkAchievements as jest.Mock).mockResolvedValue({
      newAchievements: [],
      pointsAwarded: 0
    });
    (gamificationService.getAvailableAchievements as jest.Mock).mockResolvedValue(mockAvailableAchievements);
    (gamificationService.getAchievementTypes as jest.Mock).mockResolvedValue([
      ...mockAchievements.map(a => a.type),
      ...mockAvailableAchievements
    ]);
    
    // Mock console.error to prevent test output pollution
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('Student Gamification Dashboard Flow', () => {
    it('should display student achievements and level progress', async () => {
      // Render the student gamification page
      render(<StudentGamificationPage />);
      
      // Check if the page is rendered
      expect(screen.getByText(/Gamification/i)).toBeInTheDocument();
      
      // Wait for data to load
      await waitFor(() => {
        expect(gamificationService.getStudentAchievements).toHaveBeenCalled();
        expect(gamificationService.getStudentLevel).toHaveBeenCalled();
      });
      
      // Check if achievements are displayed
      expect(screen.getByText(/Course Completion/i)).toBeInTheDocument();
      expect(screen.getByText(/Login Streak/i)).toBeInTheDocument();
      
      // Check if level progress is displayed
      expect(screen.getByText(/Level 3/i)).toBeInTheDocument();
      expect(screen.getByText(/350 points/i)).toBeInTheDocument();
      
      // Check if points history is displayed
      expect(screen.getByText(/Points History/i)).toBeInTheDocument();
      expect(screen.getByText(/Earned Course Completion achievement/i)).toBeInTheDocument();
      
      // Check if leaderboard is displayed
      expect(screen.getByText(/Leaderboard/i)).toBeInTheDocument();
      expect(screen.getByText(/Jane Smith/i)).toBeInTheDocument();
      expect(screen.getByText(/John Doe/i)).toBeInTheDocument();
      
      // Check if available achievements are displayed
      expect(screen.getByText(/Available Achievements/i)).toBeInTheDocument();
      expect(screen.getByText(/Perfect Score/i)).toBeInTheDocument();
      expect(screen.getByText(/Forum Contributor/i)).toBeInTheDocument();
    });
  });

  describe('Achievement Unlocking Flow', () => {
    it('should check for new achievements on dashboard load', async () => {
      // Mock new achievements being unlocked
      (gamificationService.checkAchievements as jest.Mock).mockResolvedValue({
        newAchievements: [
          {
            id: 'achievement-3',
            type: {
              id: 'type-3',
              name: 'Perfect Score',
              description: 'Awarded for getting 100% on an assessment',
              icon: 'star',
              points: 150
            },
            points_awarded: 150,
            earned_at: new Date().toISOString()
          }
        ],
        pointsAwarded: 150
      });
      
      // Render the student dashboard page
      render(<StudentDashboardPage />);
      
      // Check if the page is rendered
      expect(screen.getByText(/Dashboard/i)).toBeInTheDocument();
      
      // Wait for achievement check to be called
      await waitFor(() => {
        expect(gamificationService.checkAchievements).toHaveBeenCalled();
      });
      
      // Check if achievement notification is displayed
      expect(screen.getByText(/Congratulations!/i)).toBeInTheDocument();
      expect(screen.getByText(/Perfect Score/i)).toBeInTheDocument();
      expect(screen.getByText(/\+150 points/i)).toBeInTheDocument();
      
      // Dismiss notification
      fireEvent.click(screen.getByText(/Dismiss/i));
      
      // Check if notification is removed
      await waitFor(() => {
        expect(screen.queryByText(/Congratulations!/i)).not.toBeInTheDocument();
      });
    });
  });

  describe('Admin Gamification Management Flow', () => {
    it('should display achievement types and allow configuration', async () => {
      // Render the admin gamification page
      render(<AdminGamificationPage />);
      
      // Check if the page is rendered
      expect(screen.getByText(/Gamification Management/i)).toBeInTheDocument();
      
      // Wait for data to load
      await waitFor(() => {
        expect(gamificationService.getAchievementTypes).toHaveBeenCalled();
      });
      
      // Check if achievement types are displayed
      expect(screen.getByText(/Course Completion/i)).toBeInTheDocument();
      expect(screen.getByText(/Login Streak/i)).toBeInTheDocument();
      expect(screen.getByText(/Perfect Score/i)).toBeInTheDocument();
      expect(screen.getByText(/Forum Contributor/i)).toBeInTheDocument();
      
      // Edit an achievement type
      const editButtons = screen.getAllByText(/Edit/i);
      fireEvent.click(editButtons[0]);
      
      // Check if edit form is displayed
      expect(screen.getByLabelText(/Achievement Name/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Description/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Points/i)).toBeInTheDocument();
      
      // Update achievement type
      fireEvent.change(screen.getByLabelText(/Points/i), { target: { value: '150' } });
      
      // Save changes
      fireEvent.click(screen.getByText(/Save Changes/i));
      
      // Check if RPC was called to update achievement type
      await waitFor(() => {
        expect(mockRpc).toHaveBeenCalledWith('update_achievement_type', expect.objectContaining({
          type_id: 'type-1',
          points: 150
        }));
      });
    });
  });

  describe('Leaderboard Interaction Flow', () => {
    it('should allow filtering and viewing the leaderboard', async () => {
      // Render the student gamification page
      render(<StudentGamificationPage />);
      
      // Check if the page is rendered
      expect(screen.getByText(/Gamification/i)).toBeInTheDocument();
      
      // Wait for data to load
      await waitFor(() => {
        expect(gamificationService.getLeaderboard).toHaveBeenCalled();
      });
      
      // Check if leaderboard is displayed
      expect(screen.getByText(/Leaderboard/i)).toBeInTheDocument();
      
      // Check if leaderboard entries are displayed
      expect(screen.getByText(/Jane Smith/i)).toBeInTheDocument();
      expect(screen.getByText(/John Doe/i)).toBeInTheDocument();
      expect(screen.getByText(/Bob Johnson/i)).toBeInTheDocument();
      
      // Filter leaderboard by time period
      const timeFilter = screen.getByLabelText(/Time Period/i);
      fireEvent.change(timeFilter, { target: { value: 'weekly' } });
      
      // Check if leaderboard was refreshed with new filter
      await waitFor(() => {
        expect(gamificationService.getLeaderboard).toHaveBeenCalledWith('weekly');
      });
      
      // View user profile from leaderboard
      const userLinks = screen.getAllByText(/View Profile/i);
      fireEvent.click(userLinks[0]);
      
      // Check if router was called to navigate to user profile
      const { useRouter } = require('next/navigation');
      expect(useRouter().push).toHaveBeenCalledWith(expect.stringContaining('student-456'));
    });
  });
});
