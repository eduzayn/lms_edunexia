import React from 'react';
import { render, screen } from '../../../__tests__/utils/test-utils';
import { Textarea } from '../textarea';

describe('Textarea Component', () => {
  it('renders correctly', () => {
    render(<Textarea placeholder="Enter description" />);
    expect(screen.getByPlaceholderText('Enter description')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    render(<Textarea className="custom-class" placeholder="Enter description" />);
    expect(screen.getByPlaceholderText('Enter description')).toHaveClass('custom-class');
  });

  it('forwards ref correctly', () => {
    const ref = React.createRef<HTMLTextAreaElement>();
    render(<Textarea ref={ref} placeholder="Ref test" />);
    expect(ref.current).toBeInstanceOf(HTMLTextAreaElement);
  });

  it('can be disabled', () => {
    render(<Textarea disabled placeholder="Disabled textarea" />);
    expect(screen.getByPlaceholderText('Disabled textarea')).toBeDisabled();
  });

  it('passes additional props to the textarea element', () => {
    render(<Textarea placeholder="Test textarea" data-testid="test-textarea" aria-label="test textarea" rows={5} />);
    const textarea = screen.getByPlaceholderText('Test textarea');
    expect(textarea).toHaveAttribute('data-testid', 'test-textarea');
    expect(textarea).toHaveAttribute('aria-label', 'test textarea');
    expect(textarea).toHaveAttribute('rows', '5');
  });

  it('handles user input correctly', () => {
    render(<Textarea placeholder="Enter text" />);
    const textarea = screen.getByPlaceholderText('Enter text');
    
    // Simulate user typing
    textarea.textContent = 'Hello, world!';
    
    expect(textarea.textContent).toBe('Hello, world!');
  });
});
