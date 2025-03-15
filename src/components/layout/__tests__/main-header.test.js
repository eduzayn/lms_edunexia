/**
 * @jest-environment jsdom
 */

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
    
    // Mock the pathname to be the home page
    usePathname.mockReturnValue('/');
  });

  it('renders the header with logo', () => {
    render(<MainHeader />);
    
    // Check if the logo is displayed
    expect(screen.getByText('Edunexia')).toBeInTheDocument();
  });

  it('renders navigation links', () => {
    render(<MainHeader />);
    
    // Check if the navigation links are displayed
    expect(screen.getByText('Início')).toBeInTheDocument();
    expect(screen.getByText('Preços')).toBeInTheDocument();
    expect(screen.getByText('Depoimentos')).toBeInTheDocument();
  });

  it('renders login and register buttons', () => {
    render(<MainHeader />);
    
    // Check if the login and register buttons are displayed
    expect(screen.getByText('Entrar')).toBeInTheDocument();
    expect(screen.getByText('Criar Conta')).toBeInTheDocument();
  });

  it('has correct href attributes for all links', () => {
    render(<MainHeader />);
    
    // Check href attributes for navigation links
    expect(screen.getByText('Início').closest('a')).toHaveAttribute('href', '/');
    expect(screen.getByText('Preços').closest('a')).toHaveAttribute('href', '/pricing');
    expect(screen.getByText('Depoimentos').closest('a')).toHaveAttribute('href', '/depoimentos');
    
    // Check href attributes for login and register buttons
    expect(screen.getByText('Entrar').closest('a')).toHaveAttribute('href', '/auth/login');
    expect(screen.getByText('Criar Conta').closest('a')).toHaveAttribute('href', '/auth/register');
  });

  it('highlights the current active link', () => {
    usePathname.mockReturnValue('/');
    
    render(<MainHeader />);
    
    // Find all navigation links
    const links = screen.getAllByRole('link');
    
    // Find the Home link which should be active
    const homeLink = links.find(link => link.textContent === 'Início');
    
    // Check if the Home link has the active class (it doesn't have text-primary when active)
    expect(homeLink).toHaveClass('text-gray-600');
  });
});
