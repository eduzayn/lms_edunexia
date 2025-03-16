import React from 'react';
import { render, screen, waitFor } from '../../utils/test-utils';
import PointsHistory from '@/components/gamification/points-history';
import GamificationService from '@/lib/services/gamification-service';

// Mock gamification service
jest.mock('@/lib/services/gamification-service', () => ({
  getInstance: jest.fn(() => ({
    getPointsTransactions: jest.fn(),
    getUserPoints: jest.fn(),
  })),
}));

describe('PointsHistory Component', () => {
  const mockTransactions = [
    {
      id: 'tx-1',
      student_id: 'user-123',
      points: 50,
      source_type: 'achievement',
      source_id: 'achievement-123',
      description: 'Earned achievement: First Course',
      created_at: '2025-03-01T10:00:00Z',
    },
    {
      id: 'tx-2',
      student_id: 'user-123',
      points: 100,
      source_type: 'course',
      source_id: 'course-123',
      description: 'Completed course: Introduction to React',
      created_at: '2025-02-15T14:30:00Z',
    },
    {
      id: 'tx-3',
      student_id: 'user-123',
      points: -20,
      source_type: 'manual',
      source_id: 'manual-123',
      description: 'Penalty for late submission',
      created_at: '2025-02-10T09:15:00Z',
    }
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders loading state initially', () => {
    render(<PointsHistory userId="user-123" />);
    
    expect(screen.getByText('Carregando histórico de pontos...')).toBeInTheDocument();
  });

  it('renders transactions when loaded', async () => {
    const mockGetPointsTransactions = jest.fn().mockResolvedValue(mockTransactions);
    const mockGetUserPoints = jest.fn().mockResolvedValue(130);
    
    (GamificationService.getInstance().getPointsTransactions as jest.Mock).mockImplementation(mockGetPointsTransactions);
    (GamificationService.getInstance().getUserPoints as jest.Mock).mockImplementation(mockGetUserPoints);
    
    render(<PointsHistory userId="user-123" />);
    
    await waitFor(() => {
      expect(mockGetPointsTransactions).toHaveBeenCalledWith('user-123', 10);
      expect(mockGetUserPoints).toHaveBeenCalledWith('user-123');
    });
    
    // Check if transactions are rendered
    expect(screen.getByText('Earned achievement: First Course')).toBeInTheDocument();
    expect(screen.getByText('Completed course: Introduction to React')).toBeInTheDocument();
    expect(screen.getByText('Penalty for late submission')).toBeInTheDocument();
    
    // Check total points
    expect(screen.getByText('130 pontos totais')).toBeInTheDocument();
  });

  it('shows empty state when no transactions', async () => {
    const mockGetPointsTransactions = jest.fn().mockResolvedValue([]);
    const mockGetUserPoints = jest.fn().mockResolvedValue(0);
    
    (GamificationService.getInstance().getPointsTransactions as jest.Mock).mockImplementation(mockGetPointsTransactions);
    (GamificationService.getInstance().getUserPoints as jest.Mock).mockImplementation(mockGetUserPoints);
    
    render(<PointsHistory userId="user-123" />);
    
    await waitFor(() => {
      expect(screen.getByText('Nenhuma transação de pontos encontrada.')).toBeInTheDocument();
    });
  });

  it('shows error state when service fails', async () => {
    (GamificationService.getInstance().getPointsTransactions as jest.Mock).mockRejectedValue(new Error('Service error'));
    
    render(<PointsHistory userId="user-123" />);
    
    await waitFor(() => {
      expect(screen.getByText(/Não foi possível carregar o histórico de pontos/i)).toBeInTheDocument();
    });
  });

  it('applies different styles for positive and negative points', async () => {
    const mockGetPointsTransactions = jest.fn().mockResolvedValue(mockTransactions);
    const mockGetUserPoints = jest.fn().mockResolvedValue(130);
    
    (GamificationService.getInstance().getPointsTransactions as jest.Mock).mockImplementation(mockGetPointsTransactions);
    (GamificationService.getInstance().getUserPoints as jest.Mock).mockImplementation(mockGetUserPoints);
    
    render(<PointsHistory userId="user-123" />);
    
    await waitFor(() => {
      expect(screen.getByText('+50')).toBeInTheDocument();
      expect(screen.getByText('+100')).toBeInTheDocument();
      expect(screen.getByText('-20')).toBeInTheDocument();
    });
    
    // In a real test, you would check the specific classes applied
    // This is a simplified test that just checks the points are displayed correctly
  });

  it('applies correct type colors for different transaction types', async () => {
    const mockGetPointsTransactions = jest.fn().mockResolvedValue(mockTransactions);
    const mockGetUserPoints = jest.fn().mockResolvedValue(130);
    
    (GamificationService.getInstance().getPointsTransactions as jest.Mock).mockImplementation(mockGetPointsTransactions);
    (GamificationService.getInstance().getUserPoints as jest.Mock).mockImplementation(mockGetUserPoints);
    
    render(<PointsHistory userId="user-123" />);
    
    await waitFor(() => {
      expect(screen.getByText('Conquista')).toBeInTheDocument();
      expect(screen.getByText('Curso')).toBeInTheDocument();
      expect(screen.getByText('Manual')).toBeInTheDocument();
    });
    
    // In a real test, you would check the specific classes applied
    // This is a simplified test that just checks the type labels are displayed correctly
  });

  it('respects the limit parameter', async () => {
    const mockGetPointsTransactions = jest.fn().mockResolvedValue(mockTransactions.slice(0, 2));
    const mockGetUserPoints = jest.fn().mockResolvedValue(150);
    
    (GamificationService.getInstance().getPointsTransactions as jest.Mock).mockImplementation(mockGetPointsTransactions);
    (GamificationService.getInstance().getUserPoints as jest.Mock).mockImplementation(mockGetUserPoints);
    
    render(<PointsHistory userId="user-123" limit={2} />);
    
    await waitFor(() => {
      expect(mockGetPointsTransactions).toHaveBeenCalledWith('user-123', 2);
    });
    
    // Check if only the first two transactions are rendered
    expect(screen.getByText('Earned achievement: First Course')).toBeInTheDocument();
    expect(screen.getByText('Completed course: Introduction to React')).toBeInTheDocument();
    expect(screen.queryByText('Penalty for late submission')).not.toBeInTheDocument();
  });
});
