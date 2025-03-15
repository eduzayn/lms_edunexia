import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ChatMessage } from '../chat-message';

describe('ChatMessage Component', () => {
  it('renders user message correctly', () => {
    render(<ChatMessage role="user" content="Hello, this is a test message" />);
    
    // Check if the message content is displayed
    expect(screen.getByText('Hello, this is a test message')).toBeInTheDocument();
    
    // Check if the user avatar is displayed (contains 'E' for Edunexia user)
    const userAvatar = screen.getByText('E');
    expect(userAvatar).toBeInTheDocument();
    const userAvatarParent = userAvatar.parentElement;
    expect(userAvatarParent).not.toBeNull();
    expect(userAvatarParent).toHaveClass('bg-secondary');
    
    // Check if the message is aligned to the right (user messages)
    const messageElement = screen.getByText('Hello, this is a test message').closest('div');
    expect(messageElement).not.toBeNull();
    const messageContainer = messageElement?.parentElement;
    expect(messageContainer).not.toBeNull();
    expect(messageContainer).toHaveClass('justify-end');
  });

  it('renders assistant message correctly', () => {
    render(<ChatMessage role="assistant" content="I am the AI assistant" />);
    
    // Check if the message content is displayed
    expect(screen.getByText('I am the AI assistant')).toBeInTheDocument();
    
    // Check if the assistant avatar is displayed (contains 'A' for Assistant)
    const assistantAvatar = screen.getByText('A');
    expect(assistantAvatar).toBeInTheDocument();
    const assistantAvatarParent = assistantAvatar.parentElement;
    expect(assistantAvatarParent).not.toBeNull();
    expect(assistantAvatarParent).toHaveClass('bg-primary');
    
    // Check if the message is not aligned to the right (assistant messages)
    const messageElement = screen.getByText('I am the AI assistant').closest('div');
    expect(messageElement).not.toBeNull();
    const messageContainer = messageElement?.parentElement;
    expect(messageContainer).not.toBeNull();
    expect(messageContainer).not.toHaveClass('justify-end');
  });

  it('handles multiline content correctly', () => {
    const multilineContent = `This is line 1
    This is line 2
    This is line 3`;
    
    render(<ChatMessage role="assistant" content={multilineContent} />);
    
    // Check if the multiline content is preserved with whitespace-pre-wrap
    const messageText = screen.getByText(multilineContent);
    expect(messageText).toBeInTheDocument();
    expect(messageText.parentElement).toHaveClass('whitespace-pre-wrap');
  });

  it('applies correct background colors based on role', () => {
    const { rerender } = render(<ChatMessage role="user" content="User message" />);
    
    // User message should have secondary background color
    let messageElement = screen.getByText('User message').parentElement;
    expect(messageElement).toHaveClass('bg-secondary/10');
    
    // Rerender with assistant role
    rerender(<ChatMessage role="assistant" content="Assistant message" />);
    
    // Assistant message should have primary background color
    messageElement = screen.getByText('Assistant message').parentElement;
    expect(messageElement).toHaveClass('bg-primary/10');
  });
});
