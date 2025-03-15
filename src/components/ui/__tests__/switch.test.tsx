import React from 'react';
import { render, screen, fireEvent } from '../../../__tests__/utils/test-utils';
import { Switch } from '../switch';

describe('Switch Component', () => {
  it('renders correctly', () => {
    render(<Switch />);
    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toBeInTheDocument();
  });

  it('applies custom className', () => {
    render(<Switch className="custom-switch" />);
    const label = screen.getByTestId('switch-label');
    expect(label).toHaveClass('custom-switch');
  });

  it('handles checked state correctly', () => {
    render(<Switch defaultChecked />);
    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toBeChecked();
  });

  it('handles onChange events', () => {
    const handleChange = jest.fn();
    render(<Switch onChange={handleChange} />);
    
    const checkbox = screen.getByRole('checkbox');
    fireEvent.click(checkbox);
    
    expect(handleChange).toHaveBeenCalledTimes(1);
  });

  it('can be disabled', () => {
    render(<Switch disabled />);
    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toBeDisabled();
  });

  it('forwards ref correctly', () => {
    const ref = React.createRef<HTMLInputElement>();
    render(<Switch ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLInputElement);
  });

  it('passes additional props to the input element', () => {
    render(<Switch data-testid="test-switch" aria-label="Toggle feature" />);
    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toHaveAttribute('aria-label', 'Toggle feature');
  });

  it('toggles checked state when clicked', () => {
    render(<Switch />);
    const checkbox = screen.getByRole('checkbox');
    
    // Initially unchecked
    expect(checkbox).not.toBeChecked();
    
    // Click to check
    fireEvent.click(checkbox);
    expect(checkbox).toBeChecked();
    
    // Click again to uncheck
    fireEvent.click(checkbox);
    expect(checkbox).not.toBeChecked();
  });
});
