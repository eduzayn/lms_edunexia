import React from 'react';
import { render, screen, waitFor } from '../../utils/test-utils';
import LevelProgress from '@/components/gamification/level-progress';
import GamificationService from '@/lib/services/gamification-service';

// Mock gamification service
jest.mock('@/lib/services/gamification-service', () => ({
  getInstance: jest.fn(() => ({
    getUserLevel: jest.fn(),
    getLevels: jest.fn(),
  })),
}));

describe('LevelProgress Component', () => {
  const mockUserLevel = {
    id: 'user-level-1',
    user_id: 'user-123',
    level_id: 'level-2',
    current_points: 250,
    level_achieved_at: '2025-02-01T00:00:00Z',
    created_at: '2025-01-01T00:00:00Z',
    updated_at: '2025-02-01T00:00:00Z',
    level: {
      id: 'level-2',
      level_number: 2,
      name: 'Intermediate',
      description: 'You are making good progress',
      points_required: 200,
      benefits: { discount: 10 },
      created_at: '2025-01-01T00:00:00Z',
      updated_at: '2025-01-01T00:00:00Z'
    }
  };

  const mockLevels = [
    {
      id: 'level-1',
      level_number: 1,
      name: 'Beginner',
      description: 'Just starting out',
      points_required: 0,
      benefits: {},
      created_at: '2025-01-01T00:00:00Z',
      updated_at: '2025-01-01T00:00:00Z'
    },
    {
      id: 'level-2',
      level_number: 2,
      name: 'Intermediate',
      description: 'You are making good progress',
      points_required: 200,
      benefits: { discount: 10 },
      created_at: '2025-01-01T00:00:00Z',
      updated_at: '2025-01-01T00:00:00Z'
    },
    {
      id: 'level-3',
      level_number: 3,
      name: 'Advanced',
      description: 'You are becoming an expert',
      points_required: 500,
      benefits: { discount: 20 },
      created_at: '2025-01-01T00:00:00Z',
      updated_at: '2025-01-01T00:00:00Z'
    }
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders loading state initially', () => {
    render(<LevelProgress userId="user-123" />);
    
    expect(screen.getByText('Carregando informações de nível...')).toBeInTheDocument();
  });

  it('renders level progress when loaded', async () => {
    const mockGetUserLevel = jest.fn().mockResolvedValue(mockUserLevel);
    const mockGetLevels = jest.fn().mockResolvedValue(mockLevels);
    
    (GamificationService.getInstance().getUserLevel as jest.Mock).mockImplementation(mockGetUserLevel);
    (GamificationService.getInstance().getLevels as jest.Mock).mockImplementation(mockGetLevels);
    
    render(<LevelProgress userId="user-123" />);
    
    await waitFor(() => {
      expect(mockGetUserLevel).toHaveBeenCalledWith('user-123');
      expect(mockGetLevels).toHaveBeenCalled();
    });
    
    // Check if level information is rendered
    expect(screen.getByText('Nível 2')).toBeInTheDocument();
    expect(screen.getByText('Intermediate')).toBeInTheDocument();
    expect(screen.getByText('You are making good progress')).toBeInTheDocument();
    
    // Check if progress information is rendered
    expect(screen.getByText('250 pontos')).toBeInTheDocument();
    
    // Check if next level information is rendered
    expect(screen.getByText('Próximo nível: Advanced')).toBeInTheDocument();
    expect(screen.getByText('Faltam 250 pontos')).toBeInTheDocument();
  });

  it('shows max level message when user is at max level', async () => {
    const maxLevelUserLevel = {
      ...mockUserLevel,
      level_id: 'level-3',
      level: mockLevels[2]
    };
    
    const mockGetUserLevel = jest.fn().mockResolvedValue(maxLevelUserLevel);
    const mockGetLevels = jest.fn().mockResolvedValue(mockLevels);
    
    (GamificationService.getInstance().getUserLevel as jest.Mock).mockImplementation(mockGetUserLevel);
    (GamificationService.getInstance().getLevels as jest.Mock).mockImplementation(mockGetLevels);
    
    render(<LevelProgress userId="user-123" />);
    
    await waitFor(() => {
      expect(screen.getByText('Nível Máximo Alcançado!')).toBeInTheDocument();
    });
  });

  it('shows error state when service fails', async () => {
    (GamificationService.getInstance().getUserLevel as jest.Mock).mockRejectedValue(new Error('Service error'));
    
    render(<LevelProgress userId="user-123" />);
    
    await waitFor(() => {
      expect(screen.getByText(/Não foi possível carregar as informações de nível/i)).toBeInTheDocument();
    });
  });

  it('calculates progress percentage correctly', async () => {
    const mockGetUserLevel = jest.fn().mockResolvedValue(mockUserLevel);
    const mockGetLevels = jest.fn().mockResolvedValue(mockLevels);
    
    (GamificationService.getInstance().getUserLevel as jest.Mock).mockImplementation(mockGetUserLevel);
    (GamificationService.getInstance().getLevels as jest.Mock).mockImplementation(mockGetLevels);
    
    render(<LevelProgress userId="user-123" />);
    
    await waitFor(() => {
      // Current points: 250, Current level: 200, Next level: 500
      // Progress: (250 - 200) / (500 - 200) = 50 / 300 = 16.67%
      const progressBar = screen.getByRole('progressbar');
      expect(progressBar).toHaveAttribute('aria-valuenow', '16.67');
    });
  });

  it('displays level benefits when available', async () => {
    const mockGetUserLevel = jest.fn().mockResolvedValue(mockUserLevel);
    const mockGetLevels = jest.fn().mockResolvedValue(mockLevels);
    
    (GamificationService.getInstance().getUserLevel as jest.Mock).mockImplementation(mockGetUserLevel);
    (GamificationService.getInstance().getLevels as jest.Mock).mockImplementation(mockGetLevels);
    
    render(<LevelProgress userId="user-123" />);
    
    await waitFor(() => {
      expect(screen.getByText('Benefícios do Nível')).toBeInTheDocument();
      expect(screen.getByText('10% de desconto')).toBeInTheDocument();
    });
  });
});
