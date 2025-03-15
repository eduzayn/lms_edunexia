import React from 'react';
import { render, screen } from '../utils/test-utils';
import { useRouter } from 'next/navigation';
import LoginPage from '@/app/auth/login/page';

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
  useSearchParams: jest.fn(() => ({ get: jest.fn() })),
}));

describe('Login Page', () => {
  const mockRouter = {
    push: jest.fn(),
    replace: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
  });

  it('renders login portal selection correctly', () => {
    render(<LoginPage />);
    
    expect(screen.getByText('Acesse sua Conta')).toBeInTheDocument();
    expect(screen.getByText('Portal do Aluno')).toBeInTheDocument();
    expect(screen.getByText('Portal do Professor')).toBeInTheDocument();
    expect(screen.getByText('Portal Administrativo')).toBeInTheDocument();
  });

  it('has correct links to different portals', () => {
    render(<LoginPage />);
    
    // Check student portal link
    const studentPortalLink = screen.getAllByRole('link', { name: /acessar portal/i })[0];
    expect(studentPortalLink).toHaveAttribute('href', '/student/login');
    
    // Check teacher portal link
    const teacherPortalLink = screen.getAllByRole('link', { name: /acessar portal/i })[1];
    expect(teacherPortalLink).toHaveAttribute('href', '/teacher/login');
    
    // Check admin portal link
    const adminPortalLink = screen.getAllByRole('link', { name: /acessar portal/i })[2];
    expect(adminPortalLink).toHaveAttribute('href', '/admin/login');
  });

  it('navigates to registration page when clicking create account button', () => {
    render(<LoginPage />);
    
    const registerLink = screen.getByRole('link', { name: /criar conta/i });
    expect(registerLink).toHaveAttribute('href', '/auth/register');
  });
});
