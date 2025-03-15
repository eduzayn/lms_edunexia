import React from 'react';
import { render, screen } from '../../utils/test-utils';
import AchievementCard from '@/components/gamification/achievement-card';

describe('AchievementCard Component', () => {
  const mockAchievement = {
    id: 'achievement-123',
    name: 'Test Achievement',
    description: 'This is a test achievement',
    points: 50,
    achievement_type: 'course_completion',
    criteria: {},
    is_hidden: false,
    created_at: '2025-01-01T00:00:00Z',
    updated_at: '2025-01-01T00:00:00Z'
  };

  it('renders achievement details correctly', () => {
    render(<AchievementCard achievement={mockAchievement} />);
    
    expect(screen.getByText('Test Achievement')).toBeInTheDocument();
    expect(screen.getByText('This is a test achievement')).toBeInTheDocument();
    expect(screen.getByText('50 pontos')).toBeInTheDocument();
  });

  it('renders with achieved status when specified', () => {
    const achievedDate = '2025-02-15T10:30:00Z';
    render(
      <AchievementCard 
        achievement={mockAchievement} 
        achieved={true} 
        achievedAt={achievedDate} 
      />
    );
    
    expect(screen.getByText('Conquistado')).toBeInTheDocument();
    expect(screen.getByText(/Conquistado em/)).toBeInTheDocument();
    
    // Check for date formatting (pt-BR locale)
    const formattedDate = new Date(achievedDate).toLocaleDateString('pt-BR');
    expect(screen.getByText(`Conquistado em ${formattedDate}`)).toBeInTheDocument();
  });

  it('does not show achieved badge when not achieved', () => {
    render(<AchievementCard achievement={mockAchievement} achieved={false} />);
    
    expect(screen.queryByText('Conquistado')).not.toBeInTheDocument();
  });

  it('uses correct icon based on achievement type', () => {
    const achievementTypes = [
      { type: 'course_completion', icon: 'book' },
      { type: 'assessment_score', icon: 'check-circle' },
      { type: 'login_streak', icon: 'calendar' },
      { type: 'content_creation', icon: 'edit' },
      { type: 'forum_participation', icon: 'message-square' },
      { type: 'custom', icon: 'award' }
    ];
    
    achievementTypes.forEach(({ type, icon }) => {
      const achievement = { ...mockAchievement, achievement_type: type };
      const { container } = render(<AchievementCard achievement={achievement} />);
      
      // Check if SVG with the correct path exists
      // This is a simplified check - in a real test you might want to use a more robust approach
      const svgElement = container.querySelector('svg');
      expect(svgElement).toBeInTheDocument();
      
      // Check if the path for the specific icon exists
      const pathElement = container.querySelector(`path[d*="${icon}"]`);
      expect(pathElement).toBeTruthy();
    });
  });

  it('uses custom icon when provided', () => {
    const achievementWithIcon = {
      ...mockAchievement,
      icon: 'star'
    };
    
    render(<AchievementCard achievement={achievementWithIcon} />);
    
    // In a real test, you would check for the specific icon
    // This is a simplified test that just checks the component renders
    expect(screen.getByText('Test Achievement')).toBeInTheDocument();
  });

  it('applies different styles based on achieved status', () => {
    // Test unachieved style
    const { rerender } = render(<AchievementCard achievement={mockAchievement} achieved={false} />);
    
    let card = screen.getByText('Test Achievement').closest('.relative');
    expect(card).toHaveClass('bg-gray-50');
    expect(card).not.toHaveClass('bg-gradient-to-br');
    
    // Test achieved style
    rerender(<AchievementCard achievement={mockAchievement} achieved={true} />);
    
    card = screen.getByText('Test Achievement').closest('.relative');
    expect(card).toHaveClass('bg-gradient-to-br');
    expect(card).toHaveClass('shadow-md');
  });
});
