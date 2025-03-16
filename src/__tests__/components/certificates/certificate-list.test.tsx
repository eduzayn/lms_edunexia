import React from 'react';
import { render, screen, waitFor } from '../../utils/test-utils';
import CertificateList from '@/components/certificates/certificate-list';
import { certificateService } from '@/lib/services/certificate-service';

// Mock certificate service
jest.mock('@/lib/services/certificate-service', () => ({
  certificateService: {
    getStudentCertificates: jest.fn(),
  }
}));

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(() => ({
    push: jest.fn(),
  })),
}));

// Import useRouter for type checking
import { useRouter } from 'next/navigation';
import { jest } from '@jest/globals';

describe('CertificateList Component', () => {
  const mockCertificates = [
    {
      id: 'cert-1',
      student_id: 'student-123',
      course_id: 'course-1',
      template_id: 'template-1',
      certificate_number: 'CERT-123456',
      verification_hash: 'hash-1',
      issue_date: '2025-03-01T00:00:00Z',
      created_at: '2025-03-01T00:00:00Z',
      updated_at: '2025-03-01T00:00:00Z',
      course: {
        id: 'course-1',
        name: 'Introduction to React',
        description: 'Learn the basics of React',
        hours: 40
      },
      template: {
        id: 'template-1',
        name: 'Standard Template'
      }
    },
    {
      id: 'cert-2',
      student_id: 'student-123',
      course_id: 'course-2',
      template_id: 'template-1',
      certificate_number: 'CERT-789012',
      verification_hash: 'hash-2',
      issue_date: '2025-02-15T00:00:00Z',
      created_at: '2025-02-15T00:00:00Z',
      updated_at: '2025-02-15T00:00:00Z',
      course: {
        id: 'course-2',
        name: 'Advanced JavaScript',
        description: 'Master JavaScript concepts',
        hours: 60
      },
      template: {
        id: 'template-1',
        name: 'Standard Template'
      }
    }
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders loading state initially', () => {
    render(<CertificateList studentId="student-123" />);
    
    expect(screen.getByText('Carregando certificados...')).toBeInTheDocument();
  });

  it('renders certificates when loaded', async () => {
    const mockGetStudentCertificates = jest.fn().mockResolvedValue(mockCertificates);
    
    (certificateService.getStudentCertificates as jest.Mock).mockImplementation(mockGetStudentCertificates);
    
    render(<CertificateList studentId="student-123" />);
    
    await waitFor(() => {
      expect(mockGetStudentCertificates).toHaveBeenCalledWith('student-123');
    });
    
    // Check if certificates are rendered
    expect(screen.getByText('Introduction to React')).toBeInTheDocument();
    expect(screen.getByText('Advanced JavaScript')).toBeInTheDocument();
    
    // Check if certificate numbers are rendered
    expect(screen.getByText('CERT-123456')).toBeInTheDocument();
    expect(screen.getByText('CERT-789012')).toBeInTheDocument();
    
    // Check if issue dates are rendered (formatted)
    const date1 = new Date('2025-03-01T00:00:00Z').toLocaleDateString('pt-BR');
    const date2 = new Date('2025-02-15T00:00:00Z').toLocaleDateString('pt-BR');
    expect(screen.getByText(date1, { exact: false })).toBeInTheDocument();
    expect(screen.getByText(date2, { exact: false })).toBeInTheDocument();
  });

  it('shows empty state when no certificates', async () => {
    const mockGetStudentCertificates = jest.fn().mockResolvedValue([]);
    
    (certificateService.getStudentCertificates as jest.Mock).mockImplementation(mockGetStudentCertificates);
    
    render(<CertificateList studentId="student-123" />);
    
    await waitFor(() => {
      expect(screen.getByText('Nenhum certificado encontrado')).toBeInTheDocument();
    });
  });

  it('shows error state when service fails', async () => {
    (certificateService.getStudentCertificates as jest.Mock).mockRejectedValue(new Error('Service error'));
    
    render(<CertificateList studentId="student-123" />);
    
    await waitFor(() => {
      expect(screen.getByText(/Não foi possível carregar os certificados/i)).toBeInTheDocument();
    });
  });

  it('renders view and download buttons for each certificate', async () => {
    const mockGetStudentCertificates = jest.fn().mockResolvedValue(mockCertificates);
    
    (certificateService.getStudentCertificates as jest.Mock).mockImplementation(mockGetStudentCertificates);
    
    render(<CertificateList studentId="student-123" />);
    
    await waitFor(() => {
      // There should be two "Ver Certificado" buttons (one for each certificate)
      const viewButtons = screen.getAllByText('Ver Certificado');
      expect(viewButtons).toHaveLength(2);
      
      // There should be two "Baixar" buttons (one for each certificate)
      const downloadButtons = screen.getAllByText('Baixar');
      expect(downloadButtons).toHaveLength(2);
    });
  });

  it('navigates to certificate page when view button is clicked', async () => {
    const mockRouter = { push: jest.fn() };
    // Update the mock to use the correct syntax
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
    
    const mockGetStudentCertificates = jest.fn().mockResolvedValue(mockCertificates);
    (certificateService.getStudentCertificates as jest.Mock).mockImplementation(mockGetStudentCertificates);
    
    render(<CertificateList studentId="student-123" />);
    
    await waitFor(() => {
      const viewButtons = screen.getAllByText('Ver Certificado');
      viewButtons[0].click();
      
      expect(mockRouter.push).toHaveBeenCalledWith('/student/certificates/cert-1');
    });
  });
});
