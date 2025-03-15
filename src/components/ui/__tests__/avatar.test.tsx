import React from 'react';
import { render, screen } from '../../../__tests__/utils/test-utils';
import { Avatar, AvatarImage, AvatarFallback } from '../avatar';

describe('Avatar Components', () => {
  describe('Avatar', () => {
    it('renders correctly', () => {
      render(<Avatar data-testid="avatar" />);
      expect(screen.getByTestId('avatar')).toBeInTheDocument();
    });

    it('applies custom className', () => {
      render(<Avatar className="custom-avatar" data-testid="avatar" />);
      expect(screen.getByTestId('avatar')).toHaveClass('custom-avatar');
    });
  });

  describe('AvatarImage', () => {
    it('renders correctly with src', () => {
      render(
        <Avatar>
          <AvatarImage src="/test-image.jpg" alt="Test User" data-testid="avatar-img" />
        </Avatar>
      );
      const img = screen.getByTestId('avatar-img');
      expect(img).toBeInTheDocument();
      expect(img).toHaveAttribute('src', '/test-image.jpg');
      expect(img).toHaveAttribute('alt', 'Test User');
    });

    it('applies custom className', () => {
      render(
        <Avatar>
          <AvatarImage 
            src="/test-image.jpg" 
            alt="Test User" 
            className="custom-img" 
            data-testid="avatar-img" 
          />
        </Avatar>
      );
      expect(screen.getByTestId('avatar-img')).toHaveClass('custom-img');
    });
  });

  describe('AvatarFallback', () => {
    it('renders correctly', () => {
      render(
        <Avatar>
          <AvatarFallback data-testid="avatar-fallback">JD</AvatarFallback>
        </Avatar>
      );
      const fallback = screen.getByTestId('avatar-fallback');
      expect(fallback).toBeInTheDocument();
      expect(fallback).toHaveTextContent('JD');
    });

    it('applies custom className', () => {
      render(
        <Avatar>
          <AvatarFallback className="custom-fallback" data-testid="avatar-fallback">
            JD
          </AvatarFallback>
        </Avatar>
      );
      expect(screen.getByTestId('avatar-fallback')).toHaveClass('custom-fallback');
    });
  });

  describe('Avatar Composition', () => {
    it('renders a complete avatar with image and fallback', () => {
      render(
        <Avatar data-testid="avatar">
          <AvatarImage src="/test-image.jpg" alt="John Doe" data-testid="avatar-img" />
          <AvatarFallback data-testid="avatar-fallback">JD</AvatarFallback>
        </Avatar>
      );

      expect(screen.getByTestId('avatar')).toBeInTheDocument();
      expect(screen.getByTestId('avatar-img')).toBeInTheDocument();
      expect(screen.getByTestId('avatar-fallback')).toBeInTheDocument();
    });
  });
});
