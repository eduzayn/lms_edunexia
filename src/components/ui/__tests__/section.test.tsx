import React from 'react';
import { render, screen } from '@testing-library/react';
import { Section, SectionTitle, SectionDescription } from '../section';

describe('Section Components', () => {
  describe('Section', () => {
    it('renders with default classes', () => {
      render(<Section data-testid="test-section">Test Content</Section>);
      const section = screen.getByTestId('test-section');
      
      expect(section).toBeInTheDocument();
      expect(section).toHaveClass('py-12');
      expect(section.tagName).toBe('SECTION');
      expect(section).toHaveTextContent('Test Content');
    });

    it('applies additional className when provided', () => {
      render(
        <Section data-testid="test-section" className="custom-class">
          Test Content
        </Section>
      );
      
      const section = screen.getByTestId('test-section');
      expect(section).toHaveClass('py-12');
      expect(section).toHaveClass('custom-class');
    });

    it('passes additional props to the section element', () => {
      render(
        <Section 
          data-testid="test-section" 
          aria-label="Test Section"
          id="section-id"
        >
          Test Content
        </Section>
      );
      
      const section = screen.getByTestId('test-section');
      expect(section).toHaveAttribute('aria-label', 'Test Section');
      expect(section).toHaveAttribute('id', 'section-id');
    });
  });

  describe('SectionTitle', () => {
    it('renders with default classes', () => {
      render(<SectionTitle data-testid="test-title">Test Title</SectionTitle>);
      const title = screen.getByTestId('test-title');
      
      expect(title).toBeInTheDocument();
      expect(title).toHaveClass('text-3xl');
      expect(title).toHaveClass('font-bold');
      expect(title).toHaveClass('tracking-tight');
      expect(title).toHaveClass('text-gray-900');
      expect(title).toHaveClass('sm:text-4xl');
      expect(title.tagName).toBe('H2');
      expect(title).toHaveTextContent('Test Title');
    });

    it('applies additional className when provided', () => {
      render(
        <SectionTitle data-testid="test-title" className="custom-class">
          Test Title
        </SectionTitle>
      );
      
      const title = screen.getByTestId('test-title');
      expect(title).toHaveClass('text-3xl');
      expect(title).toHaveClass('custom-class');
    });
  });

  describe('SectionDescription', () => {
    it('renders with default classes', () => {
      render(<SectionDescription data-testid="test-desc">Test Description</SectionDescription>);
      const desc = screen.getByTestId('test-desc');
      
      expect(desc).toBeInTheDocument();
      expect(desc).toHaveClass('mt-4');
      expect(desc).toHaveClass('max-w-2xl');
      expect(desc).toHaveClass('text-xl');
      expect(desc).toHaveClass('text-gray-500');
      expect(desc.tagName).toBe('P');
      expect(desc).toHaveTextContent('Test Description');
    });

    it('applies additional className when provided', () => {
      render(
        <SectionDescription data-testid="test-desc" className="custom-class">
          Test Description
        </SectionDescription>
      );
      
      const desc = screen.getByTestId('test-desc');
      expect(desc).toHaveClass('mt-4');
      expect(desc).toHaveClass('custom-class');
    });
  });
});
