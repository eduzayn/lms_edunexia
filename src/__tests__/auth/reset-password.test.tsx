import React from 'react';
import { render, screen } from '../utils/test-utils';
import { useRouter } from 'next/navigation';
import ResetPasswordPage from '@/app/auth/reset-password/page';

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
  useSearchParams: jest.fn(() => ({ get: jest.fn() })),
}));

// Mock auth context
jest.mock('@/lib/contexts/auth-context', () => ({
  useAuth: jest.fn(() => ({
    resetPassword: jest.fn(),
    isLoading: false,
  })),
}));

describe('Reset Password Page', () => {
  const mockRouter = {
    push: jest.fn(),
    replace: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
  });

  it('renders reset password page correctly', () => {
    render(<ResetPasswordPage />);
    
    expect(screen.getByRole('heading', { name: /recuperar senha/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/e-mail/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /enviar link de recuperação/i })).toBeInTheDocument();
  });
  
  it('has link back to login page', () => {
    render(<ResetPasswordPage />);
    
    const loginLinks = screen.getAllByRole('link', { name: /voltar para login/i });
    expect(loginLinks[0]).toHaveAttribute('href', '/auth/login');
  });
});
