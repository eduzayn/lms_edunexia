import React from 'react';
import { render, screen, waitFor } from '../../utils/test-utils';
import CertificateDisplay from '@/components/certificates/certificate-display';
import CertificateService from '@/lib/services/certificate-service';

// Mock certificate service
jest.mock('@/lib/services/certificate-service', () => ({
  getInstance: jest.fn(() => ({
    renderCertificate: jest.fn(),
  })),
}));

// Mock window.print
const mockPrint = jest.fn();
Object.defineProperty(window, 'print', {
  value: mockPrint,
  writable: true
});

describe('CertificateDisplay Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders loading state initially', () => {
    render(<CertificateDisplay certificateId="cert-123" />);
    
    expect(screen.getByText('Carregando certificado...')).toBeInTheDocument();
  });

  it('renders certificate content when loaded', async () => {
    const mockRenderCertificate = jest.fn().mockResolvedValue({
      html: '<div id="certificate-content">Certificate HTML Content</div>',
      css: 'body { font-family: Arial; }'
    });
    
    (CertificateService.getInstance().renderCertificate as jest.Mock).mockImplementation(mockRenderCertificate);
    
    render(<CertificateDisplay certificateId="cert-123" />);
    
    await waitFor(() => {
      expect(mockRenderCertificate).toHaveBeenCalledWith('cert-123');
    });
    
    // Check if the HTML content is rendered
    const certificateContainer = document.querySelector('.certificate-content');
    expect(certificateContainer).toBeInTheDocument();
    expect(certificateContainer?.innerHTML).toContain('Certificate HTML Content');
  });

  it('shows error message when certificate rendering fails', async () => {
    (CertificateService.getInstance().renderCertificate as jest.Mock).mockResolvedValue(null);
    
    render(<CertificateDisplay certificateId="invalid-cert" />);
    
    await waitFor(() => {
      expect(screen.getByText(/Não foi possível carregar o certificado/i)).toBeInTheDocument();
    });
  });

  it('handles service errors gracefully', async () => {
    (CertificateService.getInstance().renderCertificate as jest.Mock).mockRejectedValue(new Error('Service error'));
    
    render(<CertificateDisplay certificateId="error-cert" />);
    
    await waitFor(() => {
      expect(screen.getByText(/Não foi possível carregar o certificado/i)).toBeInTheDocument();
    });
  });

  it('shows print button when not in printable mode', async () => {
    const mockRenderCertificate = jest.fn().mockResolvedValue({
      html: '<div>Certificate Content</div>',
      css: 'body { font-family: Arial; }'
    });
    
    (CertificateService.getInstance().renderCertificate as jest.Mock).mockImplementation(mockRenderCertificate);
    
    render(<CertificateDisplay certificateId="cert-123" />);
    
    await waitFor(() => {
      expect(screen.getByText('Imprimir Certificado')).toBeInTheDocument();
    });
  });

  it('hides print button in printable mode', async () => {
    const mockRenderCertificate = jest.fn().mockResolvedValue({
      html: '<div>Certificate Content</div>',
      css: 'body { font-family: Arial; }'
    });
    
    (CertificateService.getInstance().renderCertificate as jest.Mock).mockImplementation(mockRenderCertificate);
    
    render(<CertificateDisplay certificateId="cert-123" printable={true} />);
    
    await waitFor(() => {
      expect(mockRenderCertificate).toHaveBeenCalledWith('cert-123');
    });
    
    expect(screen.queryByText('Imprimir Certificado')).not.toBeInTheDocument();
  });

  it('calls window.print when print button is clicked', async () => {
    const mockRenderCertificate = jest.fn().mockResolvedValue({
      html: '<div>Certificate Content</div>',
      css: 'body { font-family: Arial; }'
    });
    
    (CertificateService.getInstance().renderCertificate as jest.Mock).mockImplementation(mockRenderCertificate);
    
    render(<CertificateDisplay certificateId="cert-123" />);
    
    await waitFor(() => {
      expect(screen.getByText('Imprimir Certificado')).toBeInTheDocument();
    });
    
    screen.getByText('Imprimir Certificado').click();
    
    expect(mockPrint).toHaveBeenCalled();
  });
});
