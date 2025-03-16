import React from 'react';
import { render, screen, fireEvent, waitFor } from '../../utils/test-utils';
import CertificateVerification from '@/components/certificates/certificate-verification';
import CertificateService from '@/lib/services/certificate-service';

// Mock certificate service
jest.mock('@/lib/services/certificate-service', () => ({
  getInstance: jest.fn(() => ({
    verifyCertificate: jest.fn(),
  })),
}));

describe('CertificateVerification Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the verification form correctly', () => {
    render(<CertificateVerification />);
    
    expect(screen.getByText('Verificação de Certificado')).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Digite o código de verificação/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Verificar/i })).toBeInTheDocument();
  });

  it('shows error when submitting empty hash', async () => {
    render(<CertificateVerification />);
    
    fireEvent.click(screen.getByRole('button', { name: /Verificar/i }));
    
    expect(await screen.findByText('Por favor, insira um código de verificação.')).toBeInTheDocument();
  });

  it('calls verifyCertificate service when submitting valid hash', async () => {
    const mockVerifyCertificate = jest.fn().mockResolvedValue({
      isValid: true,
      certificate: {
        id: 'cert-123',
        student_id: 'student-123',
        course_id: 'course-123',
        certificate_number: 'CERT-123456',
        verification_hash: 'valid-hash',
        issue_date: '2025-01-01T00:00:00Z',
        metadata: {},
        created_at: '2025-01-01T00:00:00Z',
        updated_at: '2025-01-01T00:00:00Z',
        student: { full_name: 'Test Student' },
        course: { name: 'Test Course' }
      }
    });
    
    (CertificateService.getInstance().verifyCertificate as jest.Mock).mockImplementation(mockVerifyCertificate);
    
    render(<CertificateVerification />);
    
    const input = screen.getByPlaceholderText(/Digite o código de verificação/i);
    fireEvent.change(input, { target: { value: 'valid-hash' } });
    fireEvent.click(screen.getByRole('button', { name: /Verificar/i }));
    
    await waitFor(() => {
      expect(mockVerifyCertificate).toHaveBeenCalledWith('valid-hash', undefined, undefined, expect.any(String));
    });
  });

  it('displays valid certificate details when verification succeeds', async () => {
    const mockVerifyCertificate = jest.fn().mockResolvedValue({
      isValid: true,
      certificate: {
        id: 'cert-123',
        student_id: 'student-123',
        course_id: 'course-123',
        certificate_number: 'CERT-123456',
        verification_hash: 'valid-hash',
        issue_date: '2025-01-01T00:00:00Z',
        metadata: {},
        created_at: '2025-01-01T00:00:00Z',
        updated_at: '2025-01-01T00:00:00Z',
        student: { full_name: 'Test Student' },
        course: { name: 'Test Course' }
      }
    });
    
    (CertificateService.getInstance().verifyCertificate as jest.Mock).mockImplementation(mockVerifyCertificate);
    
    render(<CertificateVerification />);
    
    const input = screen.getByPlaceholderText(/Digite o código de verificação/i);
    fireEvent.change(input, { target: { value: 'valid-hash' } });
    fireEvent.click(screen.getByRole('button', { name: /Verificar/i }));
    
    expect(await screen.findByText('Certificado Válido')).toBeInTheDocument();
    expect(await screen.findByText('Test Student')).toBeInTheDocument();
    expect(await screen.findByText('Test Course')).toBeInTheDocument();
  });

  it('displays invalid certificate message when verification fails', async () => {
    const mockVerifyCertificate = jest.fn().mockResolvedValue({
      isValid: false,
      certificate: null
    });
    
    (CertificateService.getInstance().verifyCertificate as jest.Mock).mockImplementation(mockVerifyCertificate);
    
    render(<CertificateVerification />);
    
    const input = screen.getByPlaceholderText(/Digite o código de verificação/i);
    fireEvent.change(input, { target: { value: 'invalid-hash' } });
    fireEvent.click(screen.getByRole('button', { name: /Verificar/i }));
    
    expect(await screen.findByText('Certificado Inválido')).toBeInTheDocument();
  });

  it('handles service errors gracefully', async () => {
    (CertificateService.getInstance().verifyCertificate as jest.Mock).mockRejectedValue(new Error('Service error'));
    
    render(<CertificateVerification />);
    
    const input = screen.getByPlaceholderText(/Digite o código de verificação/i);
    fireEvent.change(input, { target: { value: 'error-hash' } });
    fireEvent.click(screen.getByRole('button', { name: /Verificar/i }));
    
    expect(await screen.findByText(/Ocorreu um erro ao verificar o certificado/i)).toBeInTheDocument();
  });

  it('renders with initial hash when provided', () => {
    render(<CertificateVerification initialHash="provided-hash" />);
    
    const input = screen.getByPlaceholderText(/Digite o código de verificação/i) as HTMLInputElement;
    expect(input.value).toBe('provided-hash');
  });
});
