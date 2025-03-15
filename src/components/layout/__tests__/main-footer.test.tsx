import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MainFooter } from '../main-footer';
import { usePathname } from 'next/navigation';

// Mock the next/navigation module
jest.mock('next/navigation', () => ({
  usePathname: jest.fn(),
}));

describe('MainFooter Component', () => {
  beforeEach(() => {
    // Reset mocks before each test
    jest.clearAllMocks();
  });

  it('renders footer with all sections on public pages', () => {
    // Mock the pathname to be a public page
    (usePathname as jest.Mock).mockReturnValue('/');
    
    render(<MainFooter />);
    
    // Check if the logo is displayed
    expect(screen.getByText('Edunexia')).toBeInTheDocument();
    
    // Check if section headings are displayed
    expect(screen.getByText('Links Úteis')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Suporte' })).toBeInTheDocument();
    expect(screen.getByText('Legal')).toBeInTheDocument();
    
    // Check if navigation links are displayed
    expect(screen.getByText('Início')).toBeInTheDocument();
    expect(screen.getByText('Depoimentos')).toBeInTheDocument();
    expect(screen.getByText('Planos')).toBeInTheDocument();
    expect(screen.getByText('Entrar')).toBeInTheDocument();
    expect(screen.getByText('Registrar')).toBeInTheDocument();
    
    // Check if support links are displayed
    expect(screen.getByText('Central de Ajuda')).toBeInTheDocument();
    expect(screen.getByText('Contato')).toBeInTheDocument();
    expect(screen.getByText('suporte@edunexia.com.br')).toBeInTheDocument();
    expect(screen.getByText('+55 (11) 3456-7890')).toBeInTheDocument();
    
    // Check if legal links are displayed
    expect(screen.getByText('Termos de Uso')).toBeInTheDocument();
    expect(screen.getByText('Política de Privacidade')).toBeInTheDocument();
    expect(screen.getByText('Licenças')).toBeInTheDocument();
    
    // Check if copyright is displayed
    const currentYear = new Date().getFullYear();
    expect(screen.getByText(`© ${currentYear} Edunexia LMS. Todos os direitos reservados.`)).toBeInTheDocument();
    
    // Check if social media links are displayed
    expect(screen.getAllByRole('link', { name: /Facebook|Instagram|Twitter|LinkedIn/i }).length).toBe(4);
  });

  it('does not render footer on admin portal pages', () => {
    // Mock the pathname to be an admin page
    (usePathname as jest.Mock).mockReturnValue('/admin/dashboard');
    
    const { container } = render(<MainFooter />);
    
    // The footer should not be rendered
    expect(container).toBeEmptyDOMElement();
  });

  it('does not render footer on student portal pages', () => {
    // Mock the pathname to be a student page
    (usePathname as jest.Mock).mockReturnValue('/student/dashboard');
    
    const { container } = render(<MainFooter />);
    
    // The footer should not be rendered
    expect(container).toBeEmptyDOMElement();
  });

  it('does not render footer on teacher portal pages', () => {
    // Mock the pathname to be a teacher page
    (usePathname as jest.Mock).mockReturnValue('/teacher/dashboard');
    
    const { container } = render(<MainFooter />);
    
    // The footer should not be rendered
    expect(container).toBeEmptyDOMElement();
  });

  it('has correct href attributes for all links', () => {
    // Mock the pathname to be a public page
    (usePathname as jest.Mock).mockReturnValue('/');
    
    render(<MainFooter />);
    
    // Check href attributes for navigation links
    expect(screen.getByRole('link', { name: 'Edunexia' })).toHaveAttribute('href', '/');
    expect(screen.getAllByText('Início')[0].closest('a')).toHaveAttribute('href', '/');
    expect(screen.getByText('Depoimentos').closest('a')).toHaveAttribute('href', '/depoimentos');
    expect(screen.getByText('Planos').closest('a')).toHaveAttribute('href', '/pricing');
    expect(screen.getByText('Entrar').closest('a')).toHaveAttribute('href', '/auth/login');
    expect(screen.getByText('Registrar').closest('a')).toHaveAttribute('href', '/auth/register');
    
    // Check href attributes for support links
    expect(screen.getByText('Central de Ajuda').closest('a')).toHaveAttribute('href', '/support');
    expect(screen.getByText('Contato').closest('a')).toHaveAttribute('href', '/support');
    expect(screen.getByText('suporte@edunexia.com.br')).toHaveAttribute('href', 'mailto:suporte@edunexia.com.br');
    expect(screen.getByText('+55 (11) 3456-7890')).toHaveAttribute('href', 'tel:+551134567890');
    
    // Check href attributes for legal links
    expect(screen.getByText('Termos de Uso').closest('a')).toHaveAttribute('href', '/terms');
    expect(screen.getByText('Política de Privacidade').closest('a')).toHaveAttribute('href', '/privacy');
    expect(screen.getByText('Licenças').closest('a')).toHaveAttribute('href', '/terms');
  });

  it('has correct styling for the footer container', () => {
    // Mock the pathname to be a public page
    (usePathname as jest.Mock).mockReturnValue('/');
    
    render(<MainFooter />);
    
    // Get the footer container
    const footer = screen.getByRole('contentinfo');
    
    // Check if the footer has the correct styling
    expect(footer).toHaveClass('bg-gray-900');
    expect(footer).toHaveClass('text-white');
    expect(footer).toHaveClass('py-12');
  });
});
