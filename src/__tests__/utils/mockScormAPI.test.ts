import { 
  injectScorm12API, 
  removeScorm12API, 
  injectScorm2004API, 
  removeScorm2004API 
} from './mockScormAPI';

describe('SCORM API Mock Utilities', () => {
  afterEach(() => {
    // Clean up any injected APIs
    removeScorm12API();
    removeScorm2004API();
  });

  describe('SCORM 1.2 API', () => {
    it('should inject SCORM 1.2 API into window', () => {
      injectScorm12API();
      expect(window.API).toBeDefined();
      expect(typeof window.API.LMSInitialize).toBe('function');
      expect(typeof window.API.LMSFinish).toBe('function');
      expect(typeof window.API.LMSGetValue).toBe('function');
      expect(typeof window.API.LMSSetValue).toBe('function');
      expect(typeof window.API.LMSCommit).toBe('function');
      expect(typeof window.API.LMSGetLastError).toBe('function');
      expect(typeof window.API.LMSGetErrorString).toBe('function');
      expect(typeof window.API.LMSGetDiagnostic).toBe('function');
    });

    it('should remove SCORM 1.2 API from window', () => {
      injectScorm12API();
      expect(window.API).toBeDefined();
      
      removeScorm12API();
      expect(window.API).toBeUndefined();
    });
  });

  describe('SCORM 2004 API', () => {
    it('should inject SCORM 2004 API into window', () => {
      injectScorm2004API();
      expect(window.API_1484_11).toBeDefined();
      expect(typeof window.API_1484_11.Initialize).toBe('function');
      expect(typeof window.API_1484_11.Terminate).toBe('function');
      expect(typeof window.API_1484_11.GetValue).toBe('function');
      expect(typeof window.API_1484_11.SetValue).toBe('function');
      expect(typeof window.API_1484_11.Commit).toBe('function');
      expect(typeof window.API_1484_11.GetLastError).toBe('function');
      expect(typeof window.API_1484_11.GetErrorString).toBe('function');
      expect(typeof window.API_1484_11.GetDiagnostic).toBe('function');
    });

    it('should remove SCORM 2004 API from window', () => {
      injectScorm2004API();
      expect(window.API_1484_11).toBeDefined();
      
      removeScorm2004API();
      expect(window.API_1484_11).toBeUndefined();
    });
  });
});
