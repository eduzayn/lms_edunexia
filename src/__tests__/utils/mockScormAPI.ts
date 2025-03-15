/**
 * Mock SCORM API Implementation
 * 
 * This utility provides a mock implementation of the SCORM 1.2 and 2004 APIs
 * for testing SCORM-related functionality without requiring a real SCORM runtime.
 */

// SCORM 1.2 API Interface
export interface SCORM12API {
  LMSInitialize: (param: string) => string;
  LMSFinish: (param: string) => string;
  LMSGetValue: (element: string) => string;
  LMSSetValue: (element: string, value: string) => string;
  LMSCommit: (param: string) => string;
  LMSGetLastError: () => string;
  LMSGetErrorString: (errorCode: string) => string;
  LMSGetDiagnostic: (errorCode: string) => string;
}

// SCORM 2004 API Interface
export interface SCORM2004API {
  Initialize: (param: string) => string;
  Terminate: (param: string) => string;
  GetValue: (element: string) => string;
  SetValue: (element: string, value: string) => string;
  Commit: (param: string) => string;
  GetLastError: () => string;
  GetErrorString: (errorCode: string) => string;
  GetDiagnostic: (errorCode: string) => string;
}

// Mock data store for SCORM data
export interface ScormDataStore {
  [key: string]: string | number | boolean;
}

// Mock SCORM 1.2 API Implementation
export class MockSCORM12API implements SCORM12API {
  private initialized: boolean = false;
  private errorCode: string = '0';
  private data: ScormDataStore = {
    'cmi.core.lesson_status': 'not attempted',
    'cmi.core.score.raw': '0',
    'cmi.core.score.min': '0',
    'cmi.core.score.max': '100',
    'cmi.core.lesson_location': '',
    'cmi.core.session_time': '00:00:00',
    'cmi.suspend_data': '',
    'cmi.core.exit': '',
    'cmi.core.student_id': 'test-student',
    'cmi.core.student_name': 'Test Student'
  };
  
  // Optional callbacks for testing
  private onInitialize?: () => void;
  private onFinish?: () => void;
  private onSetValue?: (element: string, value: string) => void;
  private onGetValue?: (element: string) => void;
  private onCommit?: () => void;
  
  constructor(options?: {
    initialData?: ScormDataStore;
    onInitialize?: () => void;
    onFinish?: () => void;
    onSetValue?: (element: string, value: string) => void;
    onGetValue?: (element: string) => void;
    onCommit?: () => void;
  }) {
    if (options?.initialData) {
      this.data = { ...this.data, ...options.initialData };
    }
    
    this.onInitialize = options?.onInitialize;
    this.onFinish = options?.onFinish;
    this.onSetValue = options?.onSetValue;
    this.onGetValue = options?.onGetValue;
    this.onCommit = options?.onCommit;
  }
  
  LMSInitialize(param: string): string {
    this.initialized = true;
    this.errorCode = '0';
    if (this.onInitialize) this.onInitialize();
    return 'true';
  }
  
  LMSFinish(param: string): string {
    if (!this.initialized) {
      this.errorCode = '301'; // Not initialized
      return 'false';
    }
    
    this.initialized = false;
    this.errorCode = '0';
    if (this.onFinish) this.onFinish();
    return 'true';
  }
  
  LMSGetValue(element: string): string {
    if (!this.initialized) {
      this.errorCode = '301'; // Not initialized
      return '';
    }
    
    if (this.onGetValue) this.onGetValue(element);
    
    if (element in this.data) {
      this.errorCode = '0';
      return String(this.data[element]);
    } else {
      this.errorCode = '401'; // Not implemented error
      return '';
    }
  }
  
  LMSSetValue(element: string, value: string): string {
    if (!this.initialized) {
      this.errorCode = '301'; // Not initialized
      return 'false';
    }
    
    if (this.onSetValue) this.onSetValue(element, value);
    
    // Validate element based on SCORM 1.2 spec
    if (element.startsWith('cmi.')) {
      this.data[element] = value;
      this.errorCode = '0';
      return 'true';
    } else {
      this.errorCode = '401'; // Not implemented error
      return 'false';
    }
  }
  
  LMSCommit(param: string): string {
    if (!this.initialized) {
      this.errorCode = '301'; // Not initialized
      return 'false';
    }
    
    this.errorCode = '0';
    if (this.onCommit) this.onCommit();
    return 'true';
  }
  
  LMSGetLastError(): string {
    return this.errorCode;
  }
  
  LMSGetErrorString(errorCode: string): string {
    const errorStrings: Record<string, string> = {
      '0': 'No error',
      '101': 'General exception',
      '201': 'Invalid argument error',
      '202': 'Element cannot have children',
      '203': 'Element not an array - cannot have count',
      '301': 'Not initialized',
      '401': 'Not implemented error',
      '402': 'Invalid set value, element is a keyword',
      '403': 'Element is read only',
      '404': 'Element is write only',
      '405': 'Incorrect data type'
    };
    
    return errorStrings[errorCode] || 'Unknown error';
  }
  
  LMSGetDiagnostic(errorCode: string): string {
    return this.LMSGetErrorString(errorCode);
  }
  
  // Helper methods for testing
  getData(): ScormDataStore {
    return { ...this.data };
  }
  
  setData(data: ScormDataStore): void {
    this.data = { ...this.data, ...data };
  }
  
  isInitialized(): boolean {
    return this.initialized;
  }
}

// Mock SCORM 2004 API Implementation
export class MockSCORM2004API implements SCORM2004API {
  private initialized: boolean = false;
  private errorCode: string = '0';
  private data: ScormDataStore = {
    'cmi.completion_status': 'not attempted',
    'cmi.success_status': 'unknown',
    'cmi.score.raw': '0',
    'cmi.score.min': '0',
    'cmi.score.max': '100',
    'cmi.score.scaled': '0',
    'cmi.location': '',
    'cmi.session_time': 'PT0H0M0S',
    'cmi.suspend_data': '',
    'cmi.exit': '',
    'cmi.learner_id': 'test-student',
    'cmi.learner_name': 'Test Student'
  };
  
  // Optional callbacks for testing
  private onInitialize?: () => void;
  private onTerminate?: () => void;
  private onSetValue?: (element: string, value: string) => void;
  private onGetValue?: (element: string) => void;
  private onCommit?: () => void;
  
  constructor(options?: {
    initialData?: ScormDataStore;
    onInitialize?: () => void;
    onTerminate?: () => void;
    onSetValue?: (element: string, value: string) => void;
    onGetValue?: (element: string) => void;
    onCommit?: () => void;
  }) {
    if (options?.initialData) {
      this.data = { ...this.data, ...options.initialData };
    }
    
    this.onInitialize = options?.onInitialize;
    this.onTerminate = options?.onTerminate;
    this.onSetValue = options?.onSetValue;
    this.onGetValue = options?.onGetValue;
    this.onCommit = options?.onCommit;
  }
  
  Initialize(param: string): string {
    this.initialized = true;
    this.errorCode = '0';
    if (this.onInitialize) this.onInitialize();
    return 'true';
  }
  
  Terminate(param: string): string {
    if (!this.initialized) {
      this.errorCode = '123'; // Not initialized
      return 'false';
    }
    
    this.initialized = false;
    this.errorCode = '0';
    if (this.onTerminate) this.onTerminate();
    return 'true';
  }
  
  GetValue(element: string): string {
    if (!this.initialized) {
      this.errorCode = '123'; // Not initialized
      return '';
    }
    
    if (this.onGetValue) this.onGetValue(element);
    
    if (element in this.data) {
      this.errorCode = '0';
      return String(this.data[element]);
    } else {
      this.errorCode = '401'; // Not implemented error
      return '';
    }
  }
  
  SetValue(element: string, value: string): string {
    if (!this.initialized) {
      this.errorCode = '123'; // Not initialized
      return 'false';
    }
    
    if (this.onSetValue) this.onSetValue(element, value);
    
    // Validate element based on SCORM 2004 spec
    if (element.startsWith('cmi.')) {
      this.data[element] = value;
      this.errorCode = '0';
      return 'true';
    } else {
      this.errorCode = '401'; // Not implemented error
      return 'false';
    }
  }
  
  Commit(param: string): string {
    if (!this.initialized) {
      this.errorCode = '123'; // Not initialized
      return 'false';
    }
    
    this.errorCode = '0';
    if (this.onCommit) this.onCommit();
    return 'true';
  }
  
  GetLastError(): string {
    return this.errorCode;
  }
  
  GetErrorString(errorCode: string): string {
    const errorStrings: Record<string, string> = {
      '0': 'No error',
      '101': 'General exception',
      '102': 'General initialization failure',
      '103': 'Already initialized',
      '104': 'Content instance terminated',
      '111': 'General termination failure',
      '112': 'Termination before initialization',
      '113': 'Termination after termination',
      '122': 'Retrieve data before initialization',
      '123': 'Retrieve data after termination',
      '132': 'Store data before initialization',
      '133': 'Store data after termination',
      '142': 'Commit before initialization',
      '143': 'Commit after termination',
      '201': 'General argument error',
      '301': 'General get failure',
      '351': 'General set failure',
      '391': 'General commit failure',
      '401': 'Undefined data model element',
      '402': 'Unimplemented data model element',
      '403': 'Data model element value not initialized',
      '404': 'Data model element is read only',
      '405': 'Data model element is write only',
      '406': 'Data model element type mismatch',
      '407': 'Data model element value out of range',
      '408': 'Data model dependency not established'
    };
    
    return errorStrings[errorCode] || 'Unknown error';
  }
  
  GetDiagnostic(errorCode: string): string {
    return this.GetErrorString(errorCode);
  }
  
  // Helper methods for testing
  getData(): ScormDataStore {
    return { ...this.data };
  }
  
  setData(data: ScormDataStore): void {
    this.data = { ...this.data, ...data };
  }
  
  isInitialized(): boolean {
    return this.initialized;
  }
}

// Helper function to inject SCORM API into window
export function injectSCORMAPI(version: '1.2' | '2004'): SCORM12API | SCORM2004API {
  let api: SCORM12API | SCORM2004API;
  
  if (version === '1.2') {
    api = new MockSCORM12API();
    (window as any).API = api;
  } else {
    api = new MockSCORM2004API();
    (window as any).API_1484_11 = api;
  }
  
  return api;
}

// Helper function to remove SCORM API from window
export function removeSCORMAPI(version: '1.2' | '2004'): void {
  if (version === '1.2') {
    delete (window as any).API;
  } else {
    delete (window as any).API_1484_11;
  }
}

// Helper function to create a mock SCORM environment for testing
export function setupSCORMTestEnvironment(version: '1.2' | '2004', options?: {
  initialData?: ScormDataStore;
  onInitialize?: () => void;
  onFinish?: () => void;
  onSetValue?: (element: string, value: string) => void;
  onGetValue?: (element: string) => void;
  onCommit?: () => void;
}): SCORM12API | SCORM2004API {
  let api: SCORM12API | SCORM2004API;
  
  if (version === '1.2') {
    api = new MockSCORM12API(options);
    (window as any).API = api;
  } else {
    api = new MockSCORM2004API(options);
    (window as any).API_1484_11 = api;
  }
  
  return api;
}

// Helper function to clean up SCORM test environment
export function cleanupSCORMTestEnvironment(version: '1.2' | '2004'): void {
  removeSCORMAPI(version);
}
