import React from 'react';
import { render, screen, act, waitFor } from '../utils/test-utils';
import { AuthProvider, useAuth } from '@/lib/contexts/auth-context';

// Mock Supabase client
jest.mock('@/lib/supabase/client', () => ({
  createClient: jest.fn(() => ({
    auth: {
      getSession: jest.fn(),
      onAuthStateChange: jest.fn(() => ({ data: { subscription: { unsubscribe: jest.fn() } } })),
    },
  })),
}));

// Test component that uses the auth context
const TestComponent = () => {
  const { user, isLoading, signOut } = useAuth();
  
  return (
    <div>
      {isLoading ? (
        <p>Loading...</p>
      ) : user ? (
        <>
          <p>User is logged in: {user.email}</p>
          <button onClick={signOut}>Sign Out</button>
        </>
      ) : (
        <p>User is not logged in</p>
      )}
    </div>
  );
};

describe('AuthProvider', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('shows loading state initially', async () => {
    const mockGetSession = jest.fn().mockReturnValue(new Promise(() => {})); // Never resolves to keep loading state
    
    require('@/lib/supabase/client').createClient.mockReturnValue({
      auth: {
        getSession: mockGetSession,
        onAuthStateChange: jest.fn(() => ({ data: { subscription: { unsubscribe: jest.fn() } } })),
      },
    });
    
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );
    
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('shows logged in state when user is authenticated', async () => {
    const mockUser = { id: '123', email: 'test@example.com' };
    const mockGetSession = jest.fn().mockResolvedValue({
      data: { session: { user: mockUser } },
      error: null,
    });
    
    require('@/lib/supabase/client').createClient.mockReturnValue({
      auth: {
        getSession: mockGetSession,
        onAuthStateChange: jest.fn(() => ({ data: { subscription: { unsubscribe: jest.fn() } } })),
      },
    });
    
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );
    
    await waitFor(() => {
      expect(screen.getByText(`User is logged in: ${mockUser.email}`)).toBeInTheDocument();
    });
  });

  it('shows logged out state when user is not authenticated', async () => {
    const mockGetSession = jest.fn().mockResolvedValue({
      data: { session: null },
      error: null,
    });
    
    require('@/lib/supabase/client').createClient.mockReturnValue({
      auth: {
        getSession: mockGetSession,
        onAuthStateChange: jest.fn(() => ({ data: { subscription: { unsubscribe: jest.fn() } } })),
      },
    });
    
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );
    
    await waitFor(() => {
      expect(screen.getByText('User is not logged in')).toBeInTheDocument();
    });
  });

  it('handles sign out correctly', async () => {
    const mockUser = { id: '123', email: 'test@example.com' };
    const mockSignOut = jest.fn().mockResolvedValue({ error: null });
    const mockGetSession = jest.fn().mockResolvedValue({
      data: { session: { user: mockUser } },
      error: null,
    });
    
    require('@/lib/supabase/client').createClient.mockReturnValue({
      auth: {
        getSession: mockGetSession,
        signOut: mockSignOut,
        onAuthStateChange: jest.fn(() => ({ data: { subscription: { unsubscribe: jest.fn() } } })),
      },
    });
    
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );
    
    await waitFor(() => {
      expect(screen.getByText(`User is logged in: ${mockUser.email}`)).toBeInTheDocument();
    });
    
    const signOutButton = screen.getByText('Sign Out');
    
    await act(async () => {
      signOutButton.click();
    });
    
    expect(mockSignOut).toHaveBeenCalled();
  });

  it('updates auth state when auth state changes', async () => {
    const mockUser = { id: '123', email: 'test@example.com' };
    let authChangeCallback;
    
    const mockGetSession = jest.fn().mockResolvedValue({
      data: { session: null },
      error: null,
    });
    
    const mockOnAuthStateChange = jest.fn((callback) => {
      authChangeCallback = callback;
      return { data: { subscription: { unsubscribe: jest.fn() } } };
    });
    
    require('@/lib/supabase/client').createClient.mockReturnValue({
      auth: {
        getSession: mockGetSession,
        onAuthStateChange: mockOnAuthStateChange,
      },
    });
    
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );
    
    await waitFor(() => {
      expect(screen.getByText('User is not logged in')).toBeInTheDocument();
    });
    
    // Simulate auth state change
    await act(async () => {
      authChangeCallback('SIGNED_IN', { user: mockUser });
    });
    
    await waitFor(() => {
      expect(screen.getByText(`User is logged in: ${mockUser.email}`)).toBeInTheDocument();
    });
  });
});
