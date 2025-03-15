/**
 * Utility to mock environment variables in tests
 */

// Store original environment
const originalEnv = process.env;

/**
 * Set environment variables for testing
 * This function should be called directly in tests, not in beforeEach/afterEach
 */
export const setMockEnvironmentVariables = (variables: Record<string, string>) => {
  jest.resetModules();
  process.env = { ...originalEnv, ...variables };
};

/**
 * Reset environment variables to original state
 * This function should be called in afterEach blocks
 */
export const resetMockEnvironmentVariables = () => {
  process.env = originalEnv;
};

/**
 * Mock development environment for authentication bypass
 * The application uses NODE_ENV === 'development' to bypass authentication
 */
export const mockDevelopmentMode = (isDevelopment = true) => {
  setMockEnvironmentVariables({
    NODE_ENV: isDevelopment ? 'development' : 'production',
    NEXT_PUBLIC_BYPASS_AUTH: isDevelopment ? 'true' : 'false',
  });
};

/**
 * Legacy method for backward compatibility
 * @deprecated Use mockDevelopmentMode instead
 */
export const mockBypassAuth = (enabled = true) => {
  setMockEnvironmentVariables({
    NEXT_PUBLIC_BYPASS_AUTH: enabled ? 'true' : 'false',
  });
};
