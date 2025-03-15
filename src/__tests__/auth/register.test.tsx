import React from 'react';
import { render, screen, fireEvent, waitFor } from '../utils/test-utils';
import { useRouter } from 'next/navigation';
import RegisterPage from '@/app/auth/register/page';

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
  useSearchParams: jest.fn(() => ({ get: jest.fn() })),
}));

// Mock Supabase client
jest.mock('@/lib/supabase/client', () => ({
  createClient: jest.fn(() => ({
    auth: {
      signUp: jest.fn(),
    },
    from: jest.fn(() => ({
      insert: jest.fn().mockReturnValue({
        select: jest.fn().mockReturnValue({
          single: jest.fn(),
        }),
      }),
    })),
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

  it('renders registration form correctly', () => {
    render(<RegisterPage />);
    
    expect(screen.getByRole('heading', { name: /register/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /register/i })).toBeInTheDocument();
  });

  it('handles form submission with valid data', async () => {
    const mockSignUp = jest.fn().mockResolvedValue({
      data: { user: { id: '123' } },
      error: null,
    });

    const mockInsert = jest.fn().mockReturnValue({
      select: jest.fn().mockReturnValue({
        single: jest.fn().mockResolvedValue({ id: '123', name: 'Test User' }),
      }),
    });

    require('@/lib/supabase/client').createClient.mockReturnValue({
      auth: {
        signUp: mockSignUp,
      },
      from: jest.fn(() => ({
        insert: mockInsert,
      })),
    });

    render(<RegisterPage />);
    
    fireEvent.change(screen.getByLabelText(/name/i), {
      target: { value: 'Test User' },
    });
    
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'test@example.com' },
    });
    
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: 'password123' },
    });
    
    fireEvent.click(screen.getByRole('button', { name: /register/i }));
    
    await waitFor(() => {
      expect(mockSignUp).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
      });
      expect(mockInsert).toHaveBeenCalledWith({
        id: '123',
        name: 'Test User',
        email: 'test@example.com',
      });
      expect(mockRouter.push).toHaveBeenCalledWith('/auth/login?registered=true');
    });
  });

  it('displays error message on registration failure', async () => {
    const mockSignUp = jest.fn().mockResolvedValue({
      data: { user: null },
      error: { message: 'Email already registered' },
    });

    require('@/lib/supabase/client').createClient.mockReturnValue({
      auth: {
        signUp: mockSignUp,
      },
    });

    render(<RegisterPage />);
    
    fireEvent.change(screen.getByLabelText(/name/i), {
      target: { value: 'Test User' },
    });
    
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'existing@example.com' },
    });
    
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: 'password123' },
    });
    
    fireEvent.click(screen.getByRole('button', { name: /register/i }));
    
    await waitFor(() => {
      expect(mockSignUp).toHaveBeenCalledWith({
        email: 'existing@example.com',
        password: 'password123',
      });
      expect(screen.getByText(/email already registered/i)).toBeInTheDocument();
    });
  });

  it('validates form fields before submission', async () => {
    render(<RegisterPage />);
    
    // Submit without filling any fields
    fireEvent.click(screen.getByRole('button', { name: /register/i }));
    
    await waitFor(() => {
      expect(screen.getByText(/name is required/i)).toBeInTheDocument();
      expect(screen.getByText(/email is required/i)).toBeInTheDocument();
      expect(screen.getByText(/password is required/i)).toBeInTheDocument();
    });
  });

  it('navigates to login page when clicking login link', () => {
    render(<RegisterPage />);
    
    const loginLink = screen.getByText(/already have an account/i);
    fireEvent.click(loginLink);
    
    expect(mockRouter.push).toHaveBeenCalledWith('/auth/login');
  });
});
