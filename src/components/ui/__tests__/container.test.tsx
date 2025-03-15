import React from 'react';
import { render, screen } from '@testing-library/react';
import { Container } from '../container';

describe('Container Component', () => {
  it('renders with default classes', () => {
    render(<Container data-testid="test-container">Test Content</Container>);
    const container = screen.getByTestId('test-container');
    
    expect(container).toBeInTheDocument();
    expect(container).toHaveClass('container');
    expect(container).toHaveClass('mx-auto');
    expect(container).toHaveClass('px-4');
    expect(container).toHaveClass('sm:px-6');
    expect(container).toHaveClass('lg:px-8');
    expect(container.tagName).toBe('DIV');
    expect(container).toHaveTextContent('Test Content');
  });

  it('applies additional className when provided', () => {
    render(
      <Container data-testid="test-container" className="custom-class">
        Test Content
      </Container>
    );
    
    const container = screen.getByTestId('test-container');
    expect(container).toHaveClass('container');
    expect(container).toHaveClass('custom-class');
  });

  it('passes additional props to the div element', () => {
    render(
      <Container 
        data-testid="test-container" 
        aria-label="Test Container"
        id="container-id"
      >
        Test Content
      </Container>
    );
    
    const container = screen.getByTestId('test-container');
    expect(container).toHaveAttribute('aria-label', 'Test Container');
    expect(container).toHaveAttribute('id', 'container-id');
  });

  it('renders children correctly', () => {
    render(
      <Container data-testid="test-container">
        <div data-testid="child-element">Child Content</div>
      </Container>
    );
    
    const container = screen.getByTestId('test-container');
    const child = screen.getByTestId('child-element');
    
    expect(container).toContainElement(child);
    expect(child).toHaveTextContent('Child Content');
  });
});
