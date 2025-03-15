import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ContentViewer } from '../content-viewer';

describe('ContentViewer Component', () => {
  it('renders text content correctly', () => {
    const title = 'Sample Text Content';
    const content = 'This is some sample text content for testing.';
    
    render(<ContentViewer title={title} content={content} type="text" />);
    
    expect(screen.getByText(title)).toBeInTheDocument();
    expect(screen.getByText(content)).toBeInTheDocument();
    
    // Check if content is wrapped in prose and whitespace-pre-wrap
    const textContainer = screen.getByText(content).parentElement;
    expect(textContainer).toHaveClass('prose', 'max-w-none');
    
    // Find the inner div with the content
    const innerContainer = screen.getByText(content);
    expect(innerContainer).toHaveClass('whitespace-pre-wrap');
  });

  it('renders mindmap content correctly', () => {
    const title = 'Sample Mindmap';
    const content = 'Node 1\n  - Subnode 1.1\n  - Subnode 1.2\nNode 2\n  - Subnode 2.1';
    
    render(<ContentViewer title={title} content={content} type="mindmap" />);
    
    expect(screen.getByText(title)).toBeInTheDocument();
    
    // Find the mindmap content using a custom text matcher
    const mindmapContent = screen.getByText((text, element) => {
      return element.textContent?.includes('Node 1') && 
             element.textContent?.includes('Subnode 1.1') &&
             element.textContent?.includes('Node 2');
    });
    expect(mindmapContent).toBeInTheDocument();
    
    expect(screen.getByText('Mapa Mental')).toBeInTheDocument();
    
    // Check if content is in the correct container with proper styling
    const mindmapContainer = screen.getByText('Mapa Mental').parentElement;
    expect(mindmapContainer).toHaveClass('bg-muted');
    expect(mindmapContainer).toHaveClass('rounded-md');
  });

  it('renders flashcards content correctly', () => {
    const title = 'Sample Flashcards';
    const content = 'Question 1: What is React?\n\nQuestion 2: What is Next.js?';
    
    render(<ContentViewer title={title} content={content} type="flashcards" />);
    
    expect(screen.getByText(title)).toBeInTheDocument();
    expect(screen.getByText('Flashcards')).toBeInTheDocument();
    
    // Check if flashcards are split and rendered correctly
    expect(screen.getByText('Question 1: What is React?')).toBeInTheDocument();
    expect(screen.getByText('Question 2: What is Next.js?')).toBeInTheDocument();
    
    // Check if cards have proper styling
    const cards = screen.getAllByText(/Question/);
    cards.forEach(card => {
      const cardContainer = card.parentElement;
      expect(cardContainer).toHaveClass('rounded-md');
      // Check for border class instead of p-4
      expect(cardContainer).toHaveClass('border');
    });
  });

  it('applies correct card styling', () => {
    render(
      <ContentViewer 
        title="Test Title" 
        content="Test Content" 
        type="text" 
      />
    );
    
    // Find the Card component by its role
    const card = screen.getByRole('heading', { name: 'Test Title' }).closest('div');
    expect(card?.parentElement).toHaveClass('w-full');
  });
});
