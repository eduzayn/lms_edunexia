import { 
  injectSCORMAPI, 
  removeSCORMAPI, 
  MockSCORM12API,
  MockSCORM2004API
} from './mockScormAPI';

describe('SCORM API Mock Utilities', () => {
  afterEach(() => {
    // Clean up any injected APIs
    removeSCORMAPI('1.2');
    removeSCORMAPI('2004');
  });

  describe('SCORM 1.2 API', () => {
    it('should inject SCORM 1.2 API into window', () => {
      const api = injectSCORMAPI('1.2');
      expect((window as any).API).toBeDefined();
      expect(typeof (window as any).API.LMSInitialize).toBe('function');
      expect(typeof (window as any).API.LMSFinish).toBe('function');
      expect(typeof (window as any).API.LMSGetValue).toBe('function');
      expect(typeof (window as any).API.LMSSetValue).toBe('function');
      expect(typeof (window as any).API.LMSCommit).toBe('function');
      expect(typeof (window as any).API.LMSGetLastError).toBe('function');
      expect(typeof (window as any).API.LMSGetErrorString).toBe('function');
      expect(typeof (window as any).API.LMSGetDiagnostic).toBe('function');
    });

    it('should remove SCORM 1.2 API from window', () => {
      injectSCORMAPI('1.2');
      expect((window as any).API).toBeDefined();
      
      removeSCORMAPI('1.2');
      expect((window as any).API).toBeUndefined();
    });
  });

  describe('SCORM 2004 API', () => {
    it('should inject SCORM 2004 API into window', () => {
      const api = injectSCORMAPI('2004');
      expect((window as any).API_1484_11).toBeDefined();
      expect(typeof (window as any).API_1484_11.Initialize).toBe('function');
      expect(typeof (window as any).API_1484_11.Terminate).toBe('function');
      expect(typeof (window as any).API_1484_11.GetValue).toBe('function');
      expect(typeof (window as any).API_1484_11.SetValue).toBe('function');
      expect(typeof (window as any).API_1484_11.Commit).toBe('function');
      expect(typeof (window as any).API_1484_11.GetLastError).toBe('function');
      expect(typeof (window as any).API_1484_11.GetErrorString).toBe('function');
      expect(typeof (window as any).API_1484_11.GetDiagnostic).toBe('function');
    });

    it('should remove SCORM 2004 API from window', () => {
      injectSCORMAPI('2004');
      expect((window as any).API_1484_11).toBeDefined();
      
      removeSCORMAPI('2004');
      expect((window as any).API_1484_11).toBeUndefined();
    });
  });
});
