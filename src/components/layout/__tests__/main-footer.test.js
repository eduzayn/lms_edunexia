/**
 * @jest-environment jsdom
 */

import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MainFooter } from '../main-footer';

describe('MainFooter Component', () => {
  it('renders the footer with copyright information', () => {
    render(<MainFooter />);
    
    // Check if the copyright text is displayed
    expect(screen.getByText(/© \d{4} Edunexia/)).toBeInTheDocument();
  });

  it('renders footer links', () => {
    render(<MainFooter />);
    
    // Check if the footer links are displayed
    expect(screen.getByText('Termos de Uso')).toBeInTheDocument();
    expect(screen.getByText('Política de Privacidade')).toBeInTheDocument();
    
    // Check for the Suporte heading instead of the link
    expect(screen.getByText('Suporte', { selector: 'h4' })).toBeInTheDocument();
  });

  it('has correct href attributes for links', () => {
    render(<MainFooter />);
    
    // Check href attributes for footer links
    expect(screen.getByText('Termos de Uso').closest('a')).toHaveAttribute('href', '/terms');
    expect(screen.getByText('Política de Privacidade').closest('a')).toHaveAttribute('href', '/privacy');
    expect(screen.getByText('Central de Ajuda').closest('a')).toHaveAttribute('href', '/support');
  });
});
