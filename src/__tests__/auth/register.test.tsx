import React from 'react';
import { render, screen } from '../utils/test-utils';
import { useRouter } from 'next/navigation';
import RegisterPage from '@/app/auth/register/page';

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
  useSearchParams: jest.fn(() => ({ get: jest.fn() })),
}));

// Mock auth context
jest.mock('@/lib/contexts/auth-context', () => ({
  useAuth: jest.fn(() => ({
    signUp: jest.fn(),
    isLoading: false,
  })),
}));

describe('Register Page', () => {
  const mockRouter = {
    push: jest.fn(),
    replace: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
  });

  it('renders registration page correctly', () => {
    render(<RegisterPage />);
    
    expect(screen.getByRole('heading', { name: /criar conta/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/nome completo/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/e-mail/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^senha$/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/confirmar senha/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /criar conta/i })).toBeInTheDocument();
  });
  
  it('has link to login page', () => {
    render(<RegisterPage />);
    
    const loginLink = screen.getByRole('link', { name: /entrar/i });
    expect(loginLink).toHaveAttribute('href', '/auth/login');
  });
  
  it('has links to terms and privacy pages', () => {
    render(<RegisterPage />);
    
    const termsLink = screen.getByRole('link', { name: /termos de serviço/i });
    expect(termsLink).toHaveAttribute('href', '/terms');
    
    const privacyLink = screen.getByRole('link', { name: /política de privacidade/i });
    expect(privacyLink).toHaveAttribute('href', '/privacy');
  });
});
