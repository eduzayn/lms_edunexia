import CertificateService, { CertificateTemplate, IssuedCertificate } from '@/lib/services/certificate-service';
import { createServerSupabaseClient } from '@/lib/supabase/server';

// Mock Supabase client
jest.mock('@/lib/supabase/server', () => ({
  createServerSupabaseClient: jest.fn(),
}));

describe('CertificateService', () => {
  let mockSupabase: any;
  
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Setup mock Supabase client
    mockSupabase = {
      from: jest.fn().mockReturnThis(),
      select: jest.fn().mockReturnThis(),
      insert: jest.fn().mockReturnThis(),
      update: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      single: jest.fn(),
      maybeSingle: jest.fn(),
      order: jest.fn().mockReturnThis(),
      limit: jest.fn().mockReturnThis(),
    };
    
    (createServerSupabaseClient as jest.Mock).mockReturnValue(mockSupabase);
  });
  
  describe('getTemplates', () => {
    it('should return templates when successful', async () => {
      const mockTemplates = [
        {
          id: 'template-1',
          name: 'Standard Template',
          description: 'A standard certificate template',
          html_template: '<div>Certificate content</div>',
          css_style: 'body { font-family: Arial; }',
          is_default: true,
          created_at: '2025-01-01T00:00:00Z',
          updated_at: '2025-01-01T00:00:00Z'
        }
      ];
      
      mockSupabase.single.mockResolvedValue({ data: null, error: null });
      mockSupabase.order.mockResolvedValue({ data: mockTemplates, error: null });
      
      const service = CertificateService.getInstance();
      const result = await service.getTemplates();
      
      expect(mockSupabase.from).toHaveBeenCalledWith('certificates.templates');
      expect(mockSupabase.select).toHaveBeenCalledWith('*');
      expect(mockSupabase.order).toHaveBeenCalledWith('created_at', { ascending: false });
      expect(result).toEqual(mockTemplates);
    });
    
    it('should return empty array when error occurs', async () => {
      mockSupabase.order.mockResolvedValue({ data: null, error: new Error('Database error') });
      
      const service = CertificateService.getInstance();
      const result = await service.getTemplates();
      
      expect(result).toEqual([]);
    });
  });
  
  describe('getDefaultTemplate', () => {
    it('should return default template when successful', async () => {
      const mockTemplate = {
        id: 'template-1',
        name: 'Standard Template',
        description: 'A standard certificate template',
        html_template: '<div>Certificate content</div>',
        css_style: 'body { font-family: Arial; }',
        is_default: true,
        created_at: '2025-01-01T00:00:00Z',
        updated_at: '2025-01-01T00:00:00Z'
      };
      
      mockSupabase.single.mockResolvedValue({ data: mockTemplate, error: null });
      
      const service = CertificateService.getInstance();
      const result = await service.getDefaultTemplate();
      
      expect(mockSupabase.from).toHaveBeenCalledWith('certificates.templates');
      expect(mockSupabase.select).toHaveBeenCalledWith('*');
      expect(mockSupabase.eq).toHaveBeenCalledWith('is_default', true);
      expect(mockSupabase.single).toHaveBeenCalled();
      expect(result).toEqual(mockTemplate);
    });
    
    it('should return null when error occurs', async () => {
      mockSupabase.single.mockResolvedValue({ data: null, error: new Error('Database error') });
      
      const service = CertificateService.getInstance();
      const result = await service.getDefaultTemplate();
      
      expect(result).toBeNull();
    });
  });
  
  describe('verifyCertificate', () => {
    it('should return valid certificate when hash is valid', async () => {
      const mockCertificate = {
        id: 'cert-1',
        student_id: 'student-1',
        course_id: 'course-1',
        template_id: 'template-1',
        certificate_number: 'CERT-123456',
        verification_hash: 'valid-hash',
        issue_date: '2025-01-01T00:00:00Z',
        created_at: '2025-01-01T00:00:00Z',
        updated_at: '2025-01-01T00:00:00Z',
        student: { full_name: 'Test Student' },
        course: { name: 'Test Course' }
      };
      
      // Mock getCertificateByHash
      mockSupabase.single.mockResolvedValue({ data: mockCertificate, error: null });
      
      // Mock insert for verification log
      mockSupabase.insert.mockResolvedValue({ data: null, error: null });
      
      const service = CertificateService.getInstance();
      const result = await service.verifyCertificate('valid-hash');
      
      expect(result.isValid).toBe(true);
      expect(result.certificate).toEqual(mockCertificate);
      
      // Check if verification was logged
      expect(mockSupabase.from).toHaveBeenCalledWith('certificates.verification_logs');
      expect(mockSupabase.insert).toHaveBeenCalledWith(expect.objectContaining({
        certificate_id: 'cert-1',
        verification_hash: 'valid-hash',
        is_valid: true
      }));
    });
    
    it('should return invalid result when hash is invalid', async () => {
      // Mock getCertificateByHash returning null
      mockSupabase.single.mockResolvedValue({ data: null, error: { code: 'PGRST116' } });
      
      // Mock insert for verification log
      mockSupabase.insert.mockResolvedValue({ data: null, error: null });
      
      const service = CertificateService.getInstance();
      const result = await service.verifyCertificate('invalid-hash');
      
      expect(result.isValid).toBe(false);
      expect(result.certificate).toBeNull();
      
      // Check if verification was logged
      expect(mockSupabase.from).toHaveBeenCalledWith('certificates.verification_logs');
      expect(mockSupabase.insert).toHaveBeenCalledWith(expect.objectContaining({
        certificate_id: undefined,
        verification_hash: 'invalid-hash',
        is_valid: false
      }));
    });
  });
  
  describe('issueCertificate', () => {
    it('should issue certificate when student completed course', async () => {
      const mockProgress = { progress_percentage: 100 };
      const mockTemplate = {
        id: 'template-1',
        name: 'Standard Template',
        html_template: '<div>Certificate content</div>',
        css_style: 'body { font-family: Arial; }',
        is_default: true
      };
      const mockCertificate = {
        id: 'cert-1',
        student_id: 'student-1',
        course_id: 'course-1',
        template_id: 'template-1',
        certificate_number: 'CERT-123456',
        verification_hash: 'hash-123',
        issue_date: '2025-01-01T00:00:00Z'
      };
      
      // Mock progress check
      mockSupabase.single.mockResolvedValueOnce({ data: mockProgress, error: null });
      
      // Mock existing certificate check
      mockSupabase.maybeSingle.mockResolvedValueOnce({ data: null, error: null });
      
      // Mock getDefaultTemplate
      mockSupabase.single.mockResolvedValueOnce({ data: mockTemplate, error: null });
      
      // Mock insert certificate
      mockSupabase.single.mockResolvedValueOnce({ data: mockCertificate, error: null });
      
      // Mock getCertificate
      mockSupabase.single.mockResolvedValueOnce({ 
        data: { ...mockCertificate, student: { full_name: 'Test Student' }, course: { name: 'Test Course' } }, 
        error: null 
      });
      
      const service = CertificateService.getInstance();
      const result = await service.issueCertificate('student-1', 'course-1');
      
      expect(result).not.toBeNull();
      expect(mockSupabase.from).toHaveBeenCalledWith('analytics.student_progress');
      expect(mockSupabase.from).toHaveBeenCalledWith('certificates.issued_certificates');
      expect(mockSupabase.insert).toHaveBeenCalledWith(expect.objectContaining({
        student_id: 'student-1',
        course_id: 'course-1',
        template_id: 'template-1'
      }));
    });
    
    it('should not issue certificate when student has not completed course', async () => {
      const mockProgress = { progress_percentage: 80 };
      
      // Mock progress check
      mockSupabase.single.mockResolvedValueOnce({ data: mockProgress, error: null });
      
      const service = CertificateService.getInstance();
      const result = await service.issueCertificate('student-1', 'course-1');
      
      expect(result).toBeNull();
    });
    
    it('should return existing certificate when already issued', async () => {
      const mockProgress = { progress_percentage: 100 };
      const mockExistingCert = { id: 'cert-1' };
      const mockCertificate = {
        id: 'cert-1',
        student_id: 'student-1',
        course_id: 'course-1',
        template_id: 'template-1',
        student: { full_name: 'Test Student' },
        course: { name: 'Test Course' }
      };
      
      // Mock progress check
      mockSupabase.single.mockResolvedValueOnce({ data: mockProgress, error: null });
      
      // Mock existing certificate check
      mockSupabase.maybeSingle.mockResolvedValueOnce({ data: mockExistingCert, error: null });
      
      // Mock getCertificate
      mockSupabase.single.mockResolvedValueOnce({ data: mockCertificate, error: null });
      
      const service = CertificateService.getInstance();
      const result = await service.issueCertificate('student-1', 'course-1');
      
      expect(result).toEqual(mockCertificate);
    });
  });
  
  describe('renderCertificate', () => {
    it('should render certificate HTML with placeholders replaced', async () => {
      const mockCertificate = {
        id: 'cert-1',
        student_id: 'student-1',
        course_id: 'course-1',
        template_id: 'template-1',
        certificate_number: 'CERT-123456',
        verification_hash: 'hash-123',
        issue_date: '2025-01-01T00:00:00Z',
        metadata: { instructor: 'Dr. Smith' },
        template: {
          html_template: '<div>{{student_name}} completed {{course_name}} ({{course_hours}}h) on {{completion_date}}. Certificate: {{certificate_number}}. Instructor: {{instructor}}</div>',
          css_style: 'body { font-family: Arial; }'
        },
        student: { full_name: 'Test Student' },
        course: { name: 'Test Course', hours: 40 }
      };
      
      // Mock getCertificate
      mockSupabase.single.mockResolvedValue({ data: mockCertificate, error: null });
      
      const service = CertificateService.getInstance();
      const result = await service.renderCertificate('cert-1');
      
      expect(result).not.toBeNull();
      expect(result?.html).toContain('Test Student');
      expect(result?.html).toContain('Test Course');
      expect(result?.html).toContain('40h');
      expect(result?.html).toContain('CERT-123456');
      expect(result?.html).toContain('Dr. Smith');
      expect(result?.css).toBe('body { font-family: Arial; }');
    });
    
    it('should return null when certificate not found', async () => {
      // Mock getCertificate
      mockSupabase.single.mockResolvedValue({ data: null, error: { code: 'PGRST116' } });
      
      const service = CertificateService.getInstance();
      const result = await service.renderCertificate('invalid-cert');
      
      expect(result).toBeNull();
    });
  });
});
