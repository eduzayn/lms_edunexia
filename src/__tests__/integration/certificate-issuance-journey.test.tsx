import React from 'react';
import { render, screen, fireEvent, waitFor } from '../utils/test-utils';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { certificateService } from '@/lib/services/certificate-service';
import AdminCertificateTemplatePage from '@/app/admin/certificates/templates/create/page';
import AdminCertificateIssuePage from '@/app/admin/certificates/issue/page';
import StudentCertificatePage from '@/app/student/certificates/[id]/page';
import VerifyCertificatePage from '@/app/verify-certificate/page';

// Mock the Supabase client
jest.mock('@/lib/supabase/server', () => ({
  createServerSupabaseClient: jest.fn()
}));

// Mock the Certificate service
jest.mock('@/lib/services/certificate-service', () => ({
  certificateService: {
    createCertificateTemplate: jest.fn(),
    getCertificateTemplate: jest.fn(),
    issueCertificate: jest.fn(),
    getCertificate: jest.fn(),
    verifyCertificate: jest.fn(),
    getStudentCertificates: jest.fn()
  }
}));

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(() => ({
    push: jest.fn(),
    back: jest.fn(),
    refresh: jest.fn()
  })),
  useParams: jest.fn(() => ({
    id: 'certificate-123'
  })),
  useSearchParams: jest.fn(() => ({
    get: jest.fn((param) => param === 'code' ? 'verification-code-123' : null)
  }))
}));

describe('Certificate Issuance Journey', () => {
  // Mock data
  const mockTemplateId = 'template-123';
  const mockCertificateId = 'certificate-123';
  const mockStudentId = 'student-123';
  const mockCourseId = 'course-123';
  
  const mockTemplate = {
    id: mockTemplateId,
    name: 'Course Completion Certificate',
    description: 'Certificate for completing a course',
    html_template: '<div>{{student_name}} has completed {{course_name}}</div>',
    css_styles: '.certificate { border: 1px solid #000; }',
    variables: ['student_name', 'course_name', 'completion_date'],
    created_at: '2025-01-01T00:00:00Z',
    updated_at: '2025-01-01T00:00:00Z'
  };
  
  const mockCertificate = {
    id: mockCertificateId,
    template_id: mockTemplateId,
    student_id: mockStudentId,
    course_id: mockCourseId,
    issue_date: '2025-01-15T00:00:00Z',
    expiry_date: '2030-01-15T00:00:00Z',
    verification_code: 'verification-code-123',
    data: {
      student_name: 'John Doe',
      course_name: 'Advanced Web Development',
      completion_date: '15 de Janeiro de 2025'
    },
    status: 'active',
    created_at: '2025-01-15T00:00:00Z',
    updated_at: '2025-01-15T00:00:00Z'
  };

  // Mock Supabase methods
  const mockSelect = jest.fn();
  const mockEq = jest.fn();
  const mockSingle = jest.fn();
  const mockInsert = jest.fn();
  const mockFrom = jest.fn();
  const mockStorage = {
    from: jest.fn(() => ({
      upload: jest.fn(() => ({ error: null })),
      getPublicUrl: jest.fn(() => ({
        data: { publicUrl: 'https://example.com/storage/certificates/template.png' }
      }))
    }))
  };

  beforeEach(() => {
    jest.clearAllMocks();
    
    // Reset mock chain
    mockSelect.mockReturnValue({ single: mockSingle });
    mockEq.mockReturnValue({ select: mockSelect });
    mockSingle.mockReturnValue({ data: { id: mockTemplateId }, error: null });
    mockInsert.mockReturnValue({ select: mockSelect });
    mockFrom.mockReturnValue({ 
      select: mockSelect,
      insert: mockInsert
    });
    
    // Mock Supabase client
    (createServerSupabaseClient as jest.Mock).mockReturnValue({
      from: mockFrom,
      storage: mockStorage
    });
    
    // Mock Certificate service
    (certificateService.createCertificateTemplate as jest.Mock).mockResolvedValue(mockTemplate);
    (certificateService.getCertificateTemplate as jest.Mock).mockResolvedValue(mockTemplate);
    (certificateService.issueCertificate as jest.Mock).mockResolvedValue(mockCertificate);
    (certificateService.getCertificate as jest.Mock).mockResolvedValue(mockCertificate);
    (certificateService.verifyCertificate as jest.Mock).mockResolvedValue({
      isValid: true,
      certificate: mockCertificate
    });
    (certificateService.getStudentCertificates as jest.Mock).mockResolvedValue([mockCertificate]);
    
    // Mock console.error to prevent test output pollution
    jest.spyOn(console, 'error').mockImplementation(() => {});
    
    // Mock html2canvas
    global.HTMLCanvasElement.prototype.getContext = jest.fn(() => ({
      fillRect: jest.fn(),
      clearRect: jest.fn(),
      getImageData: jest.fn(() => ({
        data: new Array(4)
      })),
      putImageData: jest.fn(),
      createImageData: jest.fn(() => []),
      setTransform: jest.fn(),
      drawImage: jest.fn(),
      save: jest.fn(),
      restore: jest.fn(),
      scale: jest.fn(),
      rotate: jest.fn(),
      translate: jest.fn(),
      transform: jest.fn(),
      globalCompositeOperation: jest.fn(),
      createLinearGradient: jest.fn(() => ({
        addColorStop: jest.fn()
      })),
      createRadialGradient: jest.fn(() => ({
        addColorStop: jest.fn()
      })),
      createPattern: jest.fn(() => ({})),
      beginPath: jest.fn(),
      closePath: jest.fn(),
      moveTo: jest.fn(),
      lineTo: jest.fn(),
      bezierCurveTo: jest.fn(),
      quadraticCurveTo: jest.fn(),
      arc: jest.fn(),
      arcTo: jest.fn(),
      ellipse: jest.fn(),
      rect: jest.fn(),
      fill: jest.fn(),
      stroke: jest.fn(),
      clip: jest.fn(),
      isPointInPath: jest.fn(),
      isPointInStroke: jest.fn(),
      measureText: jest.fn(() => ({
        width: 100
      })),
      createImageData: jest.fn(),
      getImageData: jest.fn(),
      putImageData: jest.fn(),
      getContextAttributes: jest.fn(),
      setLineDash: jest.fn(),
      getLineDash: jest.fn(),
      setTransform: jest.fn(),
      resetTransform: jest.fn(),
      drawFocusIfNeeded: jest.fn(),
      canvas: jest.fn(),
      createPattern: jest.fn(),
      fillText: jest.fn(),
      strokeText: jest.fn()
    }));
    global.HTMLCanvasElement.prototype.toDataURL = jest.fn(() => 'data:image/png;base64,mockDataUrl');
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('Certificate Template Creation Flow', () => {
    it('should allow creating a certificate template', async () => {
      // Render the template creation page
      render(<AdminCertificateTemplatePage />);
      
      // Check if the page is rendered
      expect(screen.getByText(/Create Certificate Template/i)).toBeInTheDocument();
      
      // Fill in the form
      fireEvent.change(screen.getByLabelText(/Template Name/i), { 
        target: { value: 'Course Completion Certificate' } 
      });
      
      fireEvent.change(screen.getByLabelText(/Description/i), { 
        target: { value: 'Certificate for completing a course' } 
      });
      
      fireEvent.change(screen.getByLabelText(/HTML Template/i), { 
        target: { value: '<div>{{student_name}} has completed {{course_name}}</div>' } 
      });
      
      fireEvent.change(screen.getByLabelText(/CSS Styles/i), { 
        target: { value: '.certificate { border: 1px solid #000; }' } 
      });
      
      // Add variables
      fireEvent.change(screen.getByLabelText(/Add Variable/i), { 
        target: { value: 'student_name' } 
      });
      fireEvent.click(screen.getByText(/Add/i));
      
      fireEvent.change(screen.getByLabelText(/Add Variable/i), { 
        target: { value: 'course_name' } 
      });
      fireEvent.click(screen.getByText(/Add/i));
      
      fireEvent.change(screen.getByLabelText(/Add Variable/i), { 
        target: { value: 'completion_date' } 
      });
      fireEvent.click(screen.getByText(/Add/i));
      
      // Save the template
      fireEvent.click(screen.getByText(/Save Template/i));
      
      // Wait for template to be saved
      await waitFor(() => {
        expect(certificateService.createCertificateTemplate).toHaveBeenCalledWith(expect.objectContaining({
          name: 'Course Completion Certificate',
          description: 'Certificate for completing a course',
          html_template: '<div>{{student_name}} has completed {{course_name}}</div>',
          css_styles: '.certificate { border: 1px solid #000; }',
          variables: ['student_name', 'course_name', 'completion_date']
        }));
      });
    });
  });

  describe('Certificate Issuance Flow', () => {
    it('should allow issuing a certificate to a student', async () => {
      // Mock templates and students data
      mockFrom.mockImplementation((table) => {
        if (table === 'certificate_templates') {
          return {
            select: jest.fn().mockReturnValue({
              data: [mockTemplate],
              error: null
            })
          };
        } else if (table === 'profiles') {
          return {
            select: jest.fn().mockReturnValue({
              data: [{ id: mockStudentId, full_name: 'John Doe' }],
              error: null
            })
          };
        } else if (table === 'courses') {
          return {
            select: jest.fn().mockReturnValue({
              data: [{ id: mockCourseId, title: 'Advanced Web Development' }],
              error: null
            })
          };
        }
        return { select: mockSelect };
      });
      
      // Render the certificate issuance page
      render(<AdminCertificateIssuePage />);
      
      // Check if the page is rendered
      expect(screen.getByText(/Issue Certificate/i)).toBeInTheDocument();
      
      // Select template
      const templateSelect = screen.getByLabelText(/Certificate Template/i);
      fireEvent.change(templateSelect, { target: { value: mockTemplateId } });
      
      // Select student
      const studentSelect = screen.getByLabelText(/Student/i);
      fireEvent.change(studentSelect, { target: { value: mockStudentId } });
      
      // Select course
      const courseSelect = screen.getByLabelText(/Course/i);
      fireEvent.change(courseSelect, { target: { value: mockCourseId } });
      
      // Set expiry date
      const expiryDateInput = screen.getByLabelText(/Expiry Date/i);
      fireEvent.change(expiryDateInput, { target: { value: '2030-01-15' } });
      
      // Issue the certificate
      fireEvent.click(screen.getByText(/Issue Certificate/i));
      
      // Wait for certificate to be issued
      await waitFor(() => {
        expect(certificateService.issueCertificate).toHaveBeenCalledWith(expect.objectContaining({
          template_id: mockTemplateId,
          student_id: mockStudentId,
          course_id: mockCourseId,
          expiry_date: '2030-01-15T00:00:00.000Z',
          data: expect.objectContaining({
            student_name: 'John Doe',
            course_name: 'Advanced Web Development'
          })
        }));
      });
    });
  });

  describe('Certificate Viewing Flow', () => {
    it('should allow a student to view their certificate', async () => {
      // Render the student certificate page
      render(<StudentCertificatePage />);
      
      // Check if the page is rendered
      await waitFor(() => {
        expect(screen.getByText(/Certificate/i)).toBeInTheDocument();
      });
      
      // Check if certificate service was called
      expect(certificateService.getCertificate).toHaveBeenCalledWith(mockCertificateId);
      
      // Check if certificate data is displayed
      expect(screen.getByText(/John Doe/i)).toBeInTheDocument();
      expect(screen.getByText(/Advanced Web Development/i)).toBeInTheDocument();
      
      // Check if verification code is displayed
      expect(screen.getByText(/verification-code-123/i)).toBeInTheDocument();
      
      // Check if download button is available
      expect(screen.getByText(/Download Certificate/i)).toBeInTheDocument();
    });
  });

  describe('Certificate Verification Flow', () => {
    it('should allow verifying a certificate', async () => {
      // Render the verification page
      render(<VerifyCertificatePage />);
      
      // Check if the page is rendered
      expect(screen.getByText(/Verify Certificate/i)).toBeInTheDocument();
      
      // Enter verification code
      fireEvent.change(screen.getByLabelText(/Verification Code/i), { 
        target: { value: 'verification-code-123' } 
      });
      
      // Submit verification
      fireEvent.click(screen.getByText(/Verify/i));
      
      // Wait for verification to complete
      await waitFor(() => {
        expect(certificateService.verifyCertificate).toHaveBeenCalledWith('verification-code-123');
      });
      
      // Check if verification result is displayed
      expect(screen.getByText(/Certificate is valid/i)).toBeInTheDocument();
      expect(screen.getByText(/John Doe/i)).toBeInTheDocument();
      expect(screen.getByText(/Advanced Web Development/i)).toBeInTheDocument();
      expect(screen.getByText(/15 de Janeiro de 2025/i)).toBeInTheDocument();
    });

    it('should show error for invalid certificate', async () => {
      // Mock invalid certificate verification
      (certificateService.verifyCertificate as jest.Mock).mockResolvedValue({
        isValid: false,
        message: 'Certificate not found or invalid'
      });
      
      // Render the verification page
      render(<VerifyCertificatePage />);
      
      // Enter verification code
      fireEvent.change(screen.getByLabelText(/Verification Code/i), { 
        target: { value: 'invalid-code' } 
      });
      
      // Submit verification
      fireEvent.click(screen.getByText(/Verify/i));
      
      // Wait for verification to complete
      await waitFor(() => {
        expect(certificateService.verifyCertificate).toHaveBeenCalledWith('invalid-code');
      });
      
      // Check if error message is displayed
      expect(screen.getByText(/Certificate not found or invalid/i)).toBeInTheDocument();
    });
  });
});
