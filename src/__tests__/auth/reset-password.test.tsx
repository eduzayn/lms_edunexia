import React from 'react';
import { render, screen, fireEvent, waitFor } from '../utils/test-utils';
import { useRouter } from 'next/navigation';
import ResetPasswordPage from '@/app/auth/reset-password/page';

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
  useSearchParams: jest.fn(() => ({ get: jest.fn() })),
}));

// Mock Supabase client
jest.mock('@/lib/supabase/client', () => ({
  createClient: jest.fn(() => ({
    auth: {
      resetPasswordForEmail: jest.fn(),
    },
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

  it('renders reset password form correctly', () => {
    render(<ResetPasswordPage />);
    
    expect(screen.getByRole('heading', { name: /reset password/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /send reset link/i })).toBeInTheDocument();
  });

  it('handles form submission with valid email', async () => {
    const mockResetPassword = jest.fn().mockResolvedValue({
      data: {},
      error: null,
    });

    require('@/lib/supabase/client').createClient.mockReturnValue({
      auth: {
        resetPasswordForEmail: mockResetPassword,
      },
    });

    render(<ResetPasswordPage />);
    
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'test@example.com' },
    });
    
    fireEvent.click(screen.getByRole('button', { name: /send reset link/i }));
    
    await waitFor(() => {
      expect(mockResetPassword).toHaveBeenCalledWith('test@example.com', {
        redirectTo: expect.any(String),
      });
      expect(screen.getByText(/password reset email sent/i)).toBeInTheDocument();
    });
  });

  it('displays error message on reset password failure', async () => {
    const mockResetPassword = jest.fn().mockResolvedValue({
      data: null,
      error: { message: 'Email not found' },
    });

    require('@/lib/supabase/client').createClient.mockReturnValue({
      auth: {
        resetPasswordForEmail: mockResetPassword,
      },
    });

    render(<ResetPasswordPage />);
    
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'nonexistent@example.com' },
    });
    
    fireEvent.click(screen.getByRole('button', { name: /send reset link/i }));
    
    await waitFor(() => {
      expect(mockResetPassword).toHaveBeenCalledWith('nonexistent@example.com', {
        redirectTo: expect.any(String),
      });
      expect(screen.getByText(/email not found/i)).toBeInTheDocument();
    });
  });

  it('validates email field before submission', async () => {
    render(<ResetPasswordPage />);
    
    // Submit without filling email field
    fireEvent.click(screen.getByRole('button', { name: /send reset link/i }));
    
    await waitFor(() => {
      expect(screen.getByText(/email is required/i)).toBeInTheDocument();
    });
  });

  it('navigates to login page when clicking back to login link', () => {
    render(<ResetPasswordPage />);
    
    const loginLink = screen.getByText(/back to login/i);
    fireEvent.click(loginLink);
    
    expect(mockRouter.push).toHaveBeenCalledWith('/auth/login');
  });
});
