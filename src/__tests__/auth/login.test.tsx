import React from 'react';
import { render, screen, fireEvent, waitFor } from '../utils/test-utils';
import { useRouter } from 'next/navigation';
import LoginPage from '@/app/auth/login/page';

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
  useSearchParams: jest.fn(() => ({ get: jest.fn() })),
}));

// Mock Supabase client
jest.mock('@/lib/supabase/client', () => ({
  createClient: jest.fn(() => ({
    auth: {
      signInWithPassword: jest.fn(),
      signOut: jest.fn(),
    },
  })),
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

  it('renders login form correctly', () => {
    render(<LoginPage />);
    
    expect(screen.getByRole('heading', { name: /login/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
  });

  it('handles form submission with valid credentials', async () => {
    const mockSignIn = jest.fn().mockResolvedValue({
      data: { user: { id: '123' } },
      error: null,
    });

    require('@/lib/supabase/client').createClient.mockReturnValue({
      auth: {
        signInWithPassword: mockSignIn,
      },
    });

    render(<LoginPage />);
    
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'test@example.com' },
    });
    
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: 'password123' },
    });
    
    fireEvent.click(screen.getByRole('button', { name: /login/i }));
    
    await waitFor(() => {
      expect(mockSignIn).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
      });
      expect(mockRouter.push).toHaveBeenCalledWith('/dashboard');
    });
  });

  it('displays error message on login failure', async () => {
    const mockSignIn = jest.fn().mockResolvedValue({
      data: { user: null },
      error: { message: 'Invalid login credentials' },
    });

    require('@/lib/supabase/client').createClient.mockReturnValue({
      auth: {
        signInWithPassword: mockSignIn,
      },
    });

    render(<LoginPage />);
    
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'test@example.com' },
    });
    
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: 'wrongpassword' },
    });
    
    fireEvent.click(screen.getByRole('button', { name: /login/i }));
    
    await waitFor(() => {
      expect(mockSignIn).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'wrongpassword',
      });
      expect(screen.getByText(/invalid login credentials/i)).toBeInTheDocument();
    });
  });

  it('navigates to registration page when clicking register link', () => {
    render(<LoginPage />);
    
    const registerLink = screen.getByText(/register/i);
    fireEvent.click(registerLink);
    
    expect(mockRouter.push).toHaveBeenCalledWith('/auth/register');
  });

  it('navigates to password reset page when clicking forgot password link', () => {
    render(<LoginPage />);
    
    const forgotPasswordLink = screen.getByText(/forgot password/i);
    fireEvent.click(forgotPasswordLink);
    
    expect(mockRouter.push).toHaveBeenCalledWith('/auth/reset-password');
  });
});
