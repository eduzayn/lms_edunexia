/**
 * Mock LTI Launch Utility
 * 
 * This utility provides mock implementations for LTI 1.3 launch functionality
 * to facilitate testing of LTI-related components without requiring a real LTI tool provider.
 */

// LTI 1.3 Launch Parameters
export interface LTILaunchParams {
  iss: string; // Issuer - the platform ID
  sub: string; // Subject - the user ID
  aud: string; // Audience - the client ID
  exp: number; // Expiration time
  iat: number; // Issued at time
  nonce: string; // Nonce value
  azp?: string; // Authorized party
  name?: string; // User's name
  email?: string; // User's email
  given_name?: string; // User's first name
  family_name?: string; // User's last name
  locale?: string; // User's locale
  'https://purl.imsglobal.org/spec/lti/claim/deployment_id': string; // Deployment ID
  'https://purl.imsglobal.org/spec/lti/claim/message_type': string; // Message type
  'https://purl.imsglobal.org/spec/lti/claim/version': string; // LTI version
  'https://purl.imsglobal.org/spec/lti/claim/target_link_uri': string; // Target link URI
  'https://purl.imsglobal.org/spec/lti/claim/resource_link': {
    id: string;
    title?: string;
    description?: string;
  };
  'https://purl.imsglobal.org/spec/lti/claim/roles'?: string[]; // User roles
  'https://purl.imsglobal.org/spec/lti/claim/custom'?: Record<string, string>; // Custom parameters
  'https://purl.imsglobal.org/spec/lti/claim/context'?: {
    id: string;
    label?: string;
    title?: string;
    type?: string[];
  };
  [key: string]: any; // Allow for additional claims
}

// LTI 1.3 JWT Token
export interface LTIToken {
  token: string;
  params: LTILaunchParams;
}

// LTI Launch State
export interface LTILaunchState {
  state: string;
  nonce: string;
  redirectUri: string;
  clientId: string;
  platformId: string;
  deploymentId: string;
}

// Mock LTI Platform Response
export interface LTIPlatformResponse {
  id_token: string;
  state: string;
}

// Create a mock LTI launch token
export function createMockLTIToken(params: Partial<LTILaunchParams> = {}): LTIToken {
  const now = Math.floor(Date.now() / 1000);
  
  const defaultParams: LTILaunchParams = {
    iss: 'https://platform.example.com',
    sub: 'user-123',
    aud: 'client-123',
    exp: now + 3600,
    iat: now,
    nonce: `nonce-${Math.random().toString(36).substring(2, 15)}`,
    name: 'Test User',
    email: 'test@example.com',
    given_name: 'Test',
    family_name: 'User',
    locale: 'en-US',
    'https://purl.imsglobal.org/spec/lti/claim/deployment_id': 'deployment-123',
    'https://purl.imsglobal.org/spec/lti/claim/message_type': 'LtiResourceLinkRequest',
    'https://purl.imsglobal.org/spec/lti/claim/version': '1.3.0',
    'https://purl.imsglobal.org/spec/lti/claim/target_link_uri': 'https://tool.example.com/launch',
    'https://purl.imsglobal.org/spec/lti/claim/resource_link': {
      id: 'resource-link-123',
      title: 'Test Resource',
      description: 'A test resource for LTI launch'
    },
    'https://purl.imsglobal.org/spec/lti/claim/roles': [
      'http://purl.imsglobal.org/vocab/lis/v2/membership#Learner'
    ],
    'https://purl.imsglobal.org/spec/lti/claim/custom': {
      resource_id: 'content-123',
      course_id: 'course-123'
    },
    'https://purl.imsglobal.org/spec/lti/claim/context': {
      id: 'course-123',
      label: 'Course 123',
      title: 'Test Course',
      type: ['http://purl.imsglobal.org/vocab/lis/v2/course#CourseOffering']
    }
  };
  
  const mergedParams = { ...defaultParams, ...params };
  
  // In a real implementation, we would sign this with JWT
  // For testing purposes, we'll just base64 encode the JSON
  const token = Buffer.from(JSON.stringify(mergedParams)).toString('base64');
  
  return {
    token,
    params: mergedParams
  };
}

// Create a mock LTI launch state
export function createMockLTILaunchState(overrides: Partial<LTILaunchState> = {}): LTILaunchState {
  return {
    state: `state-${Math.random().toString(36).substring(2, 15)}`,
    nonce: `nonce-${Math.random().toString(36).substring(2, 15)}`,
    redirectUri: 'https://tool.example.com/launch',
    clientId: 'client-123',
    platformId: 'https://platform.example.com',
    deploymentId: 'deployment-123',
    ...overrides
  };
}

// Create a mock LTI platform response
export function createMockLTIPlatformResponse(
  token: LTIToken,
  state: string
): LTIPlatformResponse {
  return {
    id_token: token.token,
    state
  };
}

// Simulate an LTI 1.3 launch
export function simulateLTILaunch(
  launchParams: Partial<LTILaunchParams> = {},
  stateOverrides: Partial<LTILaunchState> = {}
): {
  token: LTIToken;
  state: LTILaunchState;
  response: LTIPlatformResponse;
} {
  const token = createMockLTIToken(launchParams);
  const state = createMockLTILaunchState(stateOverrides);
  const response = createMockLTIPlatformResponse(token, state.state);
  
  return {
    token,
    state,
    response
  };
}

// Parse a mock LTI token
export function parseMockLTIToken(token: string): LTILaunchParams {
  try {
    return JSON.parse(Buffer.from(token, 'base64').toString());
  } catch (error) {
    throw new Error('Invalid LTI token format');
  }
}

// Validate a mock LTI launch
export function validateMockLTILaunch(
  token: string,
  state: string,
  expectedState: LTILaunchState
): {
  isValid: boolean;
  params?: LTILaunchParams;
  error?: string;
} {
  // Check if state matches
  if (state !== expectedState.state) {
    return {
      isValid: false,
      error: 'Invalid state parameter'
    };
  }
  
  try {
    // Parse token
    const params = parseMockLTIToken(token);
    
    // Validate required claims
    if (params.iss !== expectedState.platformId) {
      return {
        isValid: false,
        error: 'Invalid issuer'
      };
    }
    
    if (params.aud !== expectedState.clientId) {
      return {
        isValid: false,
        error: 'Invalid audience'
      };
    }
    
    if (params['https://purl.imsglobal.org/spec/lti/claim/deployment_id'] !== expectedState.deploymentId) {
      return {
        isValid: false,
        error: 'Invalid deployment ID'
      };
    }
    
    // Check if token is expired
    const now = Math.floor(Date.now() / 1000);
    if (params.exp < now) {
      return {
        isValid: false,
        error: 'Token expired'
      };
    }
    
    return {
      isValid: true,
      params
    };
  } catch (error) {
    return {
      isValid: false,
      error: 'Invalid token format'
    };
  }
}

// Create a mock LTI launch URL
export function createMockLTILaunchURL(
  baseUrl: string,
  token: LTIToken,
  state: LTILaunchState
): string {
  const url = new URL(baseUrl);
  url.searchParams.append('id_token', token.token);
  url.searchParams.append('state', state.state);
  return url.toString();
}

// Helper to create a mock LTI launch iframe
export function createMockLTILaunchIframe(
  launchUrl: string,
  options: {
    width?: string;
    height?: string;
    id?: string;
    title?: string;
  } = {}
): HTMLIFrameElement {
  const iframe = document.createElement('iframe');
  iframe.src = launchUrl;
  iframe.width = options.width || '100%';
  iframe.height = options.height || '600px';
  iframe.id = options.id || 'lti-launch-iframe';
  iframe.title = options.title || 'LTI Content';
  iframe.setAttribute('allowfullscreen', 'true');
  iframe.setAttribute('allow', 'microphone; camera; geolocation; display-capture');
  
  return iframe;
}

// Helper to simulate LTI content loaded event
export function simulateLTIContentLoaded(iframe: HTMLIFrameElement): void {
  const event = new Event('load');
  iframe.dispatchEvent(event);
}

// Helper to simulate LTI content completion
export function simulateLTIContentCompletion(
  iframe: HTMLIFrameElement,
  data: {
    status: 'completed' | 'failed' | 'in_progress';
    score?: number;
    timeSpent?: number;
  }
): void {
  const event = new MessageEvent('message', {
    data: {
      subject: 'lti.completion',
      ...data
    },
    origin: 'https://tool.example.com'
  });
  
  window.dispatchEvent(event);
}
