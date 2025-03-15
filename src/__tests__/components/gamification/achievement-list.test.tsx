import React from 'react';
import { render, screen, waitFor } from '../../utils/test-utils';
import AchievementList from '@/components/gamification/achievement-list';
import GamificationService from '@/lib/services/gamification-service';

// Mock gamification service
jest.mock('@/lib/services/gamification-service', () => ({
  getInstance: jest.fn(() => ({
    getAchievements: jest.fn(),
    getUserAchievements: jest.fn(),
  })),
}));

// Mock achievement card component
jest.mock('@/components/gamification/achievement-card', () => {
  return function MockAchievementCard({ achievement, achieved, achievedAt }) {
    return (
      <div data-testid="achievement-card" className={achieved ? 'achieved' : 'not-achieved'}>
        <h3>{achievement.name}</h3>
        <p>{achievement.description}</p>
        <p>Points: {achievement.points}</p>
        {achieved && <p>Achieved at: {achievedAt}</p>}
      </div>
    );
  };
});

describe('AchievementList Component', () => {
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
      name: 'Perfect Score',
      description: 'Get 100% on an assessment',
      points: 100,
      achievement_type: 'assessment_score',
      criteria: { min_score: 100 },
      is_hidden: false,
      created_at: '2025-01-01T00:00:00Z',
      updated_at: '2025-01-01T00:00:00Z'
    },
    {
      id: 'achievement-3',
      name: 'Forum Contributor',
      description: 'Make 5 forum posts',
      points: 30,
      achievement_type: 'forum_participation',
      criteria: { min_posts: 5 },
      is_hidden: false,
      created_at: '2025-01-01T00:00:00Z',
      updated_at: '2025-01-01T00:00:00Z'
    }
  ];

  const mockUserAchievements = [
    {
      id: 'user-achievement-1',
      user_id: 'user-123',
      achievement_id: 'achievement-1',
      achieved_at: '2025-02-15T10:30:00Z',
      context: {},
      created_at: '2025-02-15T10:30:00Z',
      achievement: mockAchievements[0]
    }
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders loading state initially', () => {
    render(<AchievementList userId="user-123" />);
    
    expect(screen.getByText('Carregando conquistas...')).toBeInTheDocument();
  });

  it('renders achievements grouped by type when loaded', async () => {
    const mockGetAchievements = jest.fn().mockResolvedValue(mockAchievements);
    const mockGetUserAchievements = jest.fn().mockResolvedValue(mockUserAchievements);
    
    (GamificationService.getInstance().getAchievements as jest.Mock).mockImplementation(mockGetAchievements);
    (GamificationService.getInstance().getUserAchievements as jest.Mock).mockImplementation(mockGetUserAchievements);
    
    render(<AchievementList userId="user-123" />);
    
    await waitFor(() => {
      expect(mockGetAchievements).toHaveBeenCalledWith(false);
      expect(mockGetUserAchievements).toHaveBeenCalledWith('user-123');
    });
    
    // Check if achievement types are rendered as headings
    expect(screen.getByText('Conclusão de Cursos')).toBeInTheDocument();
    expect(screen.getByText('Avaliações')).toBeInTheDocument();
    expect(screen.getByText('Participação em Fóruns')).toBeInTheDocument();
    
    // Check if all achievements are rendered
    expect(screen.getByText('First Course')).toBeInTheDocument();
    expect(screen.getByText('Perfect Score')).toBeInTheDocument();
    expect(screen.getByText('Forum Contributor')).toBeInTheDocument();
    
    // Check if achievement cards are rendered with correct props
    const achievementCards = screen.getAllByTestId('achievement-card');
    expect(achievementCards).toHaveLength(3);
    
    // First achievement should be marked as achieved
    expect(achievementCards[0]).toHaveClass('achieved');
    
    // Other achievements should not be marked as achieved
    expect(achievementCards[1]).toHaveClass('not-achieved');
    expect(achievementCards[2]).toHaveClass('not-achieved');
  });

  it('shows empty state when no achievements', async () => {
    const mockGetAchievements = jest.fn().mockResolvedValue([]);
    const mockGetUserAchievements = jest.fn().mockResolvedValue([]);
    
    (GamificationService.getInstance().getAchievements as jest.Mock).mockImplementation(mockGetAchievements);
    (GamificationService.getInstance().getUserAchievements as jest.Mock).mockImplementation(mockGetUserAchievements);
    
    render(<AchievementList userId="user-123" />);
    
    await waitFor(() => {
      expect(screen.getByText('Nenhuma conquista disponível no momento.')).toBeInTheDocument();
    });
  });

  it('shows error state when service fails', async () => {
    (GamificationService.getInstance().getAchievements as jest.Mock).mockRejectedValue(new Error('Service error'));
    
    render(<AchievementList userId="user-123" />);
    
    await waitFor(() => {
      expect(screen.getByText(/Não foi possível carregar as conquistas/i)).toBeInTheDocument();
    });
  });

  it('includes hidden achievements when showHidden is true', async () => {
    const hiddenAchievement = {
      id: 'achievement-4',
      name: 'Secret Achievement',
      description: 'This is a hidden achievement',
      points: 200,
      achievement_type: 'custom',
      criteria: {},
      is_hidden: true,
      created_at: '2025-01-01T00:00:00Z',
      updated_at: '2025-01-01T00:00:00Z'
    };
    
    const mockGetAchievements = jest.fn().mockResolvedValue([...mockAchievements, hiddenAchievement]);
    const mockGetUserAchievements = jest.fn().mockResolvedValue(mockUserAchievements);
    
    (GamificationService.getInstance().getAchievements as jest.Mock).mockImplementation(mockGetAchievements);
    (GamificationService.getInstance().getUserAchievements as jest.Mock).mockImplementation(mockGetUserAchievements);
    
    render(<AchievementList userId="user-123" showHidden={true} />);
    
    await waitFor(() => {
      expect(mockGetAchievements).toHaveBeenCalledWith(true);
    });
    
    // Check if hidden achievement is rendered
    expect(screen.getByText('Secret Achievement')).toBeInTheDocument();
  });

  it('filters achievements by type when filter is provided', async () => {
    const mockGetAchievements = jest.fn().mockResolvedValue(mockAchievements);
    const mockGetUserAchievements = jest.fn().mockResolvedValue(mockUserAchievements);
    
    (GamificationService.getInstance().getAchievements as jest.Mock).mockImplementation(mockGetAchievements);
    (GamificationService.getInstance().getUserAchievements as jest.Mock).mockImplementation(mockGetUserAchievements);
    
    render(<AchievementList userId="user-123" filter="course_completion" />);
    
    await waitFor(() => {
      // Only course completion achievements should be rendered
      expect(screen.getByText('First Course')).toBeInTheDocument();
      expect(screen.queryByText('Perfect Score')).not.toBeInTheDocument();
      expect(screen.queryByText('Forum Contributor')).not.toBeInTheDocument();
    });
  });
});
