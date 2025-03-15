import React from 'react';
import { render, screen } from '../../../__tests__/utils/test-utils';
import { Input } from '../input';

describe('Input Component', () => {
  it('renders correctly', () => {
    render(<Input placeholder="Enter text" />);
    expect(screen.getByPlaceholderText('Enter text')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    render(<Input className="custom-class" placeholder="Enter text" />);
    expect(screen.getByPlaceholderText('Enter text')).toHaveClass('custom-class');
  });

  it('handles different input types', () => {
    const { rerender } = render(<Input type="text" placeholder="Text input" />);
    expect(screen.getByPlaceholderText('Text input')).toHaveAttribute('type', 'text');

    rerender(<Input type="password" placeholder="Password input" />);
    expect(screen.getByPlaceholderText('Password input')).toHaveAttribute('type', 'password');

    rerender(<Input type="email" placeholder="Email input" />);
    expect(screen.getByPlaceholderText('Email input')).toHaveAttribute('type', 'email');

    rerender(<Input type="number" placeholder="Number input" />);
    expect(screen.getByPlaceholderText('Number input')).toHaveAttribute('type', 'number');
  });

  it('forwards ref correctly', () => {
    const ref = React.createRef<HTMLInputElement>();
    render(<Input ref={ref} placeholder="Ref test" />);
    expect(ref.current).toBeInstanceOf(HTMLInputElement);
  });

  it('can be disabled', () => {
    render(<Input disabled placeholder="Disabled input" />);
    expect(screen.getByPlaceholderText('Disabled input')).toBeDisabled();
  });

  it('passes additional props to the input element', () => {
    render(<Input placeholder="Test input" data-testid="test-input" aria-label="test input" />);
    const input = screen.getByPlaceholderText('Test input');
    expect(input).toHaveAttribute('data-testid', 'test-input');
    expect(input).toHaveAttribute('aria-label', 'test input');
  });
});
