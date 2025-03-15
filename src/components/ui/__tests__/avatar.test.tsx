import React from 'react';
import { render, screen } from '../../../__tests__/utils/test-utils';
import { Avatar } from '../avatar';

describe('Avatar Component', () => {
  it('renders correctly', () => {
    render(<Avatar />);
    const avatarContainer = screen.getByTestId('avatar-container');
    expect(avatarContainer).toBeInTheDocument();
  });

  it('applies custom className', () => {
    render(<Avatar className="custom-avatar" data-testid="avatar-container" />);
    const avatarContainer = screen.getByTestId('avatar-container');
    expect(avatarContainer).toHaveClass('custom-avatar');
  });

  it('renders with image when src is provided', () => {
    render(<Avatar src="/test-image.jpg" alt="Test User" data-testid="avatar-container" />);
    const img = screen.getByRole('img');
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute('src', '/test-image.jpg');
    expect(img).toHaveAttribute('alt', 'Test User');
  });

  it('renders fallback when provided', () => {
    render(<Avatar fallback="JD" data-testid="avatar-container" />);
    const fallback = screen.getByText('JD');
    expect(fallback).toBeInTheDocument();
  });

  it('renders initials from alt text when no src or fallback is provided', () => {
    render(<Avatar alt="John Doe" data-testid="avatar-container" />);
    const initials = screen.getByText('JD');
    expect(initials).toBeInTheDocument();
  });
});
