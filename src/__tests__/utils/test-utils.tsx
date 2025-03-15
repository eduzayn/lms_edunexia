import React, { ReactElement } from 'react';
import { render as rtlRender, RenderOptions, within as rtlWithin, screen as rtlScreen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { mockNextNavigation } from './mock-navigation';
import { mockDevelopmentMode, setMockEnvironmentVariables, resetMockEnvironmentVariables } from './mock-env';
import userEvent from '@testing-library/user-event';

// Add any providers here
const AllProviders = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      {children}
    </>
  );
};

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>,
) => rtlRender(ui, { wrapper: AllProviders, ...options });

// Mock Supabase client for testing
export const mockSupabaseClient = {
  auth: {
    signInWithPassword: jest.fn(),
    signUp: jest.fn(),
    signOut: jest.fn(),
    getSession: jest.fn(),
    signInWithOAuth: jest.fn(),
  },
  from: jest.fn(() => ({
    select: jest.fn(() => ({
      eq: jest.fn(() => ({
        single: jest.fn(),
        order: jest.fn(),
        limit: jest.fn(),
      })),
      order: jest.fn(),
      limit: jest.fn(),
    })),
    insert: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  })),
};

// Mock OpenAI client for testing
export const mockOpenAIClient = {
  chat: {
    completions: {
      create: jest.fn().mockResolvedValue({
        choices: [{ message: { content: 'Mocked AI response' } }],
      }),
    },
  },
};

// Export environment variable utilities
export { setMockEnvironmentVariables, resetMockEnvironmentVariables };

// Helper to mock bypass auth
export const mockBypassAuth = (enabled = true) => {
  setMockEnvironmentVariables({
    NEXT_PUBLIC_BYPASS_AUTH: enabled ? 'true' : 'false',
  });
};

// Setup user event for testing
export const setupUserEvent = () => userEvent.setup();

// Create custom screen and within functions that include jest-dom matchers
const screen = {
  ...rtlScreen,
  // Add any custom screen methods here
};

const within = (element: HTMLElement) => {
  return {
    ...rtlWithin(element),
    // Add any custom within methods here
  };
};

// re-export everything
export * from '@testing-library/react';
export { customRender as render };
export { mockNextNavigation };
export { mockDevelopmentMode };
export { within };
export { screen };
export { userEvent };
