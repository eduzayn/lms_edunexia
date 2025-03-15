import React from 'react';
import { render, screen, fireEvent } from '../../../__tests__/utils/test-utils';
import { Avatar } from '../avatar';

describe('Avatar Component', () => {
  it('renders correctly', () => {
    render(<Avatar />);
    const avatarElement = screen.getByRole('generic');
    expect(avatarElement).toBeInTheDocument();
  });

  it('applies custom className', () => {
    render(<Avatar className="custom-avatar" />);
    const avatarElement = screen.getByRole('generic');
    expect(avatarElement).toHaveClass('custom-avatar');
  });

  it('renders with image when src is provided', () => {
    render(<Avatar src="/test-image.jpg" alt="Test User" />);
    const img = screen.getByRole('img');
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute('src', '/test-image.jpg');
    expect(img).toHaveAttribute('alt', 'Test User');
  });

  it('renders fallback when provided', () => {
    render(<Avatar fallback="JD" />);
    const fallback = screen.getByText('JD');
    expect(fallback).toBeInTheDocument();
  });

  it('renders initials from alt text when no src or fallback is provided', () => {
    render(<Avatar alt="John Doe" />);
    const initials = screen.getByText('JD');
    expect(initials).toBeInTheDocument();
  });
});
