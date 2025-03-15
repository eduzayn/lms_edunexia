import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ConversationHistory } from '../conversation-history';

describe('ConversationHistory Component', () => {
  const mockConversations = [
    {
      id: '1',
      title: 'Conversation 1',
      created_at: '2025-03-15T10:00:00Z',
      description: 'First test conversation'
    },
    {
      id: '2',
      title: 'Conversation 2',
      created_at: '2025-03-15T11:00:00Z'
    }
  ];

  const mockOnSelect = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders conversation cards correctly', () => {
    render(
      <ConversationHistory 
        conversations={mockConversations} 
        onSelect={mockOnSelect} 
      />
    );
    
    // Check if both conversation titles are displayed
    expect(screen.getByText('Conversation 1')).toBeInTheDocument();
    expect(screen.getByText('Conversation 2')).toBeInTheDocument();
    
    // Check if description is displayed when provided
    expect(screen.getByText('First test conversation')).toBeInTheDocument();
    
    // Check if default description is displayed when not provided
    expect(screen.getByText('Conversa com o assistente de IA')).toBeInTheDocument();
    
    // Check if dates are formatted correctly
    const formattedDate = new Date('2025-03-15T10:00:00Z').toLocaleDateString('pt-BR');
    expect(screen.getAllByText(formattedDate).length).toBe(2);
    
    // Check if "Ver Conversa" buttons are displayed
    const buttons = screen.getAllByText('Ver Conversa');
    expect(buttons.length).toBe(2);
  });

  it('calls onSelect with correct conversation ID when button is clicked', () => {
    render(
      <ConversationHistory 
        conversations={mockConversations} 
        onSelect={mockOnSelect} 
      />
    );
    
    const buttons = screen.getAllByText('Ver Conversa');
    
    // Click the first conversation button
    fireEvent.click(buttons[0]);
    expect(mockOnSelect).toHaveBeenCalledWith('1');
    
    // Click the second conversation button
    fireEvent.click(buttons[1]);
    expect(mockOnSelect).toHaveBeenCalledWith('2');
    expect(mockOnSelect).toHaveBeenCalledTimes(2);
  });

  it('renders empty state when no conversations are provided', () => {
    render(
      <ConversationHistory 
        conversations={[]} 
        onSelect={mockOnSelect} 
      />
    );
    
    // Check that the container is empty but rendered
    const container = screen.getByTestId('conversation-container');
    expect(container).toBeInTheDocument();
    expect(container.children.length).toBe(0);
  });

  it('applies correct styling to conversation cards', () => {
    render(
      <ConversationHistory 
        conversations={mockConversations} 
        onSelect={mockOnSelect} 
      />
    );
    
    // Check if cards have the correct spacing
    const container = screen.getByTestId('conversation-container');
    expect(container).toHaveClass('space-y-4');
    
    // Check if buttons have the correct variant and size
    const buttons = screen.getAllByText('Ver Conversa');
    buttons.forEach(button => {
      expect(button).toHaveClass('border');
      expect(button).toHaveClass('border-input');
    });
  });
});
