import {
  createMockLTIToken,
  createMockLTILaunchState,
  createMockLTIPlatformResponse,
  simulateLTILaunch,
  parseMockLTIToken,
  validateMockLTILaunch,
  createMockLTILaunchURL,
  createMockLTILaunchIframe,
  simulateLTIContentLoaded,
  simulateLTIContentCompletion
} from './mockLTILaunch';

describe('LTI Launch Mock Utilities', () => {
  describe('Token Generation', () => {
    it('should create a mock LTI token with default values', () => {
      const token = createMockLTIToken();
      expect(token.token).toBeDefined();
      expect(token.params).toBeDefined();
      expect(token.params.iss).toBe('https://platform.example.com');
      expect(token.params.sub).toBe('user-123');
      expect(token.params.aud).toBe('client-123');
      expect(token.params['https://purl.imsglobal.org/spec/lti/claim/message_type']).toBe('LtiResourceLinkRequest');
    });

    it('should create a mock LTI token with custom values', () => {
      const customParams = {
        iss: 'https://custom-platform.example.com',
        sub: 'custom-user-123',
        'https://purl.imsglobal.org/spec/lti/claim/resource_link': {
          id: 'custom-resource-link-123',
          title: 'Custom Resource'
        }
      };
      
      const token = createMockLTIToken(customParams);
      expect(token.params.iss).toBe('https://custom-platform.example.com');
      expect(token.params.sub).toBe('custom-user-123');
      expect(token.params['https://purl.imsglobal.org/spec/lti/claim/resource_link'].id).toBe('custom-resource-link-123');
      expect(token.params['https://purl.imsglobal.org/spec/lti/claim/resource_link'].title).toBe('Custom Resource');
    });
  });

  describe('Launch State', () => {
    it('should create a mock LTI launch state with default values', () => {
      const state = createMockLTILaunchState();
      expect(state.state).toBeDefined();
      expect(state.nonce).toBeDefined();
      expect(state.redirectUri).toBe('https://tool.example.com/launch');
      expect(state.clientId).toBe('client-123');
      expect(state.platformId).toBe('https://platform.example.com');
      expect(state.deploymentId).toBe('deployment-123');
    });

    it('should create a mock LTI launch state with custom values', () => {
      const customState = createMockLTILaunchState({
        redirectUri: 'https://custom-tool.example.com/launch',
        clientId: 'custom-client-123',
        platformId: 'https://custom-platform.example.com'
      });
      
      expect(customState.redirectUri).toBe('https://custom-tool.example.com/launch');
      expect(customState.clientId).toBe('custom-client-123');
      expect(customState.platformId).toBe('https://custom-platform.example.com');
    });
  });

  describe('Launch Simulation', () => {
    it('should simulate a complete LTI launch', () => {
      const launch = simulateLTILaunch();
      expect(launch.token).toBeDefined();
      expect(launch.state).toBeDefined();
      expect(launch.response).toBeDefined();
      expect(launch.response.id_token).toBe(launch.token.token);
      expect(launch.response.state).toBe(launch.state.state);
    });

    it('should parse a mock LTI token', () => {
      const token = createMockLTIToken();
      const parsedParams = parseMockLTIToken(token.token);
      expect(parsedParams).toEqual(token.params);
    });

    it('should validate a mock LTI launch', () => {
      const token = createMockLTIToken();
      const state = createMockLTILaunchState();
      
      const validation = validateMockLTILaunch(token.token, state.state, state);
      expect(validation.isValid).toBe(false); // Will be false because token and state don't match
    });
  });

  describe('UI Helpers', () => {
    it('should create a mock LTI launch URL', () => {
      const token = createMockLTIToken();
      const state = createMockLTILaunchState();
      const url = createMockLTILaunchURL('https://tool.example.com/launch', token, state);
      
      expect(url).toContain('https://tool.example.com/launch');
      expect(url).toContain('id_token=');
      expect(url).toContain('state=');
    });

    it('should create a mock LTI launch iframe', () => {
      const iframe = createMockLTILaunchIframe('https://tool.example.com/launch');
      
      expect(iframe.tagName).toBe('IFRAME');
      expect(iframe.src).toBe('https://tool.example.com/launch');
      expect(iframe.width).toBe('100%');
      expect(iframe.height).toBe('600px');
      expect(iframe.title).toBe('LTI Content');
    });

    it('should simulate LTI content loaded event', () => {
      const iframe = document.createElement('iframe');
      const loadHandler = jest.fn();
      iframe.addEventListener('load', loadHandler);
      
      simulateLTIContentLoaded(iframe);
      expect(loadHandler).toHaveBeenCalled();
    });

    it('should simulate LTI content completion', () => {
      const messageHandler = jest.fn();
      window.addEventListener('message', messageHandler);
      
      const iframe = document.createElement('iframe');
      simulateLTIContentCompletion(iframe, { status: 'completed', score: 0.95 });
      
      expect(messageHandler).toHaveBeenCalled();
      
      window.removeEventListener('message', messageHandler);
    });
  });
});
