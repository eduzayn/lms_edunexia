import React from 'react';
import { render, screen, waitFor, fireEvent } from '../../utils/test-utils';
import CertificateDisplay from '@/components/certificates/certificate-display';
import CertificateService from '@/lib/services/certificate-service';

// Mock certificate service
jest.mock('@/lib/services/certificate-service', () => ({
  getInstance: jest.fn(() => ({
    renderCertificate: jest.fn().mockResolvedValue({
      html: '<div id="certificate-content">Certificate HTML Content</div>',
      css: 'body { font-family: Arial; }'
    }),
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
    render(<CertificateDisplay certificateId="cert-123" />);
    
    await waitFor(() => {
      expect(screen.getByText('Imprimir Certificado')).toBeInTheDocument();
    });
    
    // Check if the HTML content is rendered
    const certificateContainer = document.querySelector('.certificate-content');
    expect(certificateContainer).toBeInTheDocument();
  });

  it('shows error message when certificate rendering fails', async () => {
    // Override the mock for this specific test
    const mockGetInstance = jest.fn().mockReturnValue({
      renderCertificate: jest.fn().mockResolvedValue(null)
    });
    (CertificateService.getInstance as jest.Mock) = mockGetInstance;
    
    render(<CertificateDisplay certificateId="invalid-cert" />);
    
    await waitFor(() => {
      expect(screen.getByText(/Não foi possível carregar o certificado/i)).toBeInTheDocument();
    });
  });

  it('hides print button in printable mode', async () => {
    render(<CertificateDisplay certificateId="cert-123" printable={true} />);
    
    await waitFor(() => {
      expect(screen.queryByText('Imprimir Certificado')).not.toBeInTheDocument();
    });
  });

  it('calls window.print when print button is clicked', async () => {
    render(<CertificateDisplay certificateId="cert-123" />);
    
    await waitFor(() => {
      expect(screen.getByText('Imprimir Certificado')).toBeInTheDocument();
    });
    
    fireEvent.click(screen.getByText('Imprimir Certificado'));
    
    expect(mockPrint).toHaveBeenCalled();
  });
});
