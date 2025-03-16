import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MainHeader } from '../main-header';
import { usePathname } from 'next/navigation';

// Mock the next/navigation module
jest.mock('next/navigation', () => ({
  usePathname: jest.fn(),
}));

describe('MainHeader Component', () => {
  beforeEach(() => {
    // Reset mocks before each test
    jest.clearAllMocks();
  });

  it('renders header with navigation links and buttons on public pages', () => {
    // Mock the pathname to be a public page
    (usePathname as jest.Mock).mockReturnValue('/');
    
    render(<MainHeader />);
    
    // Check if the logo is displayed
    expect(screen.getByText('EdunexIA LMS')).toBeInTheDocument();
    
    // Check if navigation links are displayed
    expect(screen.getByText('Início')).toBeInTheDocument();
    expect(screen.getByText('Depoimentos')).toBeInTheDocument();
    expect(screen.getByText('Preços')).toBeInTheDocument();
    expect(screen.getByText('Suporte')).toBeInTheDocument();
    
    // Check if action buttons are displayed
    expect(screen.getByText('Entrar')).toBeInTheDocument();
    expect(screen.getByText('Criar Conta')).toBeInTheDocument();
  });

  it('does not render header on admin portal pages', () => {
    // Mock the pathname to be an admin page
    (usePathname as jest.Mock).mockReturnValue('/admin/dashboard');
    
    const { container } = render(<MainHeader />);
    
    // The header should not be rendered
    expect(container).toBeEmptyDOMElement();
  });

  it('does not render header on student portal pages', () => {
    // Mock the pathname to be a student page
    (usePathname as jest.Mock).mockReturnValue('/student/dashboard');
    
    const { container } = render(<MainHeader />);
    
    // The header should not be rendered
    expect(container).toBeEmptyDOMElement();
  });

  it('does not render header on teacher portal pages', () => {
    // Mock the pathname to be a teacher page
    (usePathname as jest.Mock).mockReturnValue('/teacher/dashboard');
    
    const { container } = render(<MainHeader />);
    
    // The header should not be rendered
    expect(container).toBeEmptyDOMElement();
  });

  it('has correct href attributes for all links', () => {
    // Mock the pathname to be a public page
    (usePathname as jest.Mock).mockReturnValue('/');
    
    render(<MainHeader />);
    
    // Check href attributes for navigation links
    expect(screen.getByText('Início').closest('a')).toHaveAttribute('href', '/');
    expect(screen.getByText('Depoimentos').closest('a')).toHaveAttribute('href', '/depoimentos');
    expect(screen.getByText('Preços').closest('a')).toHaveAttribute('href', '/precos');
    expect(screen.getByText('Suporte').closest('a')).toHaveAttribute('href', '/suporte');
    
    // Check href attributes for action buttons
    expect(screen.getByText('Entrar').closest('a')).toHaveAttribute('href', '/auth/login');
    expect(screen.getByText('Criar Conta').closest('a')).toHaveAttribute('href', '/auth/register');
  });

  it('has correct styling for the header container', () => {
    // Mock the pathname to be a public page
    (usePathname as jest.Mock).mockReturnValue('/');
    
    render(<MainHeader />);
    
    // Get the header container
    const header = screen.getByRole('banner');
    
    // Check if the header has the correct styling
    expect(header).toHaveClass('bg-white');
    expect(header).toHaveClass('border-b');
    expect(header).toHaveClass('py-4');
  });
});
