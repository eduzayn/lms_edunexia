import { NextRequest, NextResponse } from 'next/server';
import { middleware } from '../middleware';

// Mock NextResponse
jest.mock('next/server', () => {
  const originalModule = jest.requireActual('next/server');
  return {
    ...originalModule,
    NextResponse: {
      next: jest.fn(() => 'next response'),
      redirect: jest.fn(() => 'redirect response'),
    },
  };
});

describe('Middleware', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // We'll use a mock for NODE_ENV instead of trying to modify it directly
  });

  it('should bypass authentication in development mode', () => {
    // Mock the middleware implementation to simulate development mode
    jest.spyOn(process, 'env', 'get').mockReturnValue({
      ...process.env,
      NODE_ENV: 'development'
    });

    // Create mock request
    const request = {
      nextUrl: {
        pathname: '/admin/dashboard',
      },
      cookies: {
        has: jest.fn().mockReturnValue(false),
      },
    } as unknown as NextRequest;

    // Call middleware
    const response = middleware(request);

    // Verify NextResponse.next was called
    expect(NextResponse.next).toHaveBeenCalled();
    expect(response).toBe('next response');
  });

  it('should allow access to public paths', () => {
    // Create mock request for public path
    const request = {
      nextUrl: {
        pathname: '/',
      },
      cookies: {
        has: jest.fn().mockReturnValue(false),
      },
      url: 'http://localhost:3000/',
    } as unknown as NextRequest;

    // Call middleware
    const response = middleware(request);

    // Verify NextResponse.next was called
    expect(NextResponse.next).toHaveBeenCalled();
    expect(response).toBe('next response');
  });

  it('should redirect authenticated users from public paths to dashboard', () => {
    // Create mock request for public path with authenticated user
    const request = {
      nextUrl: {
        pathname: '/auth/login',
      },
      cookies: {
        has: jest.fn().mockImplementation((name) => {
          return name === 'sb-access-token';
        }),
      },
      url: 'http://localhost:3000/auth/login',
    } as unknown as NextRequest;

    // Call middleware
    const response = middleware(request);

    // Verify NextResponse.redirect was called with correct URL
    expect(NextResponse.redirect).toHaveBeenCalledWith(
      expect.objectContaining({
        href: expect.stringContaining('/student/dashboard'),
      })
    );
    expect(response).toBe('redirect response');
  });

  it('should redirect unauthenticated users from protected paths to login', () => {
    // Create mock request for protected path with unauthenticated user
    const request = {
      nextUrl: {
        pathname: '/admin/dashboard',
      },
      cookies: {
        has: jest.fn().mockReturnValue(false),
      },
      url: 'http://localhost:3000/admin/dashboard',
    } as unknown as NextRequest;

    // Call middleware
    const response = middleware(request);

    // Verify NextResponse.redirect was called with correct URL
    expect(NextResponse.redirect).toHaveBeenCalledWith(
      expect.objectContaining({
        href: expect.stringContaining('/auth/login'),
      })
    );
    expect(response).toBe('redirect response');
  });

  it('should allow authenticated users to access protected paths', () => {
    // Create mock request for protected path with authenticated user
    const request = {
      nextUrl: {
        pathname: '/admin/dashboard',
      },
      cookies: {
        has: jest.fn().mockImplementation((name) => {
          return name === 'sb-access-token';
        }),
      },
      url: 'http://localhost:3000/admin/dashboard',
    } as unknown as NextRequest;

    // Call middleware
    const response = middleware(request);

    // Verify NextResponse.next was called
    expect(NextResponse.next).toHaveBeenCalled();
    expect(response).toBe('next response');
  });
});
