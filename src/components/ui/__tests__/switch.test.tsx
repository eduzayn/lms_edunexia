import React from 'react';
import { render, screen, fireEvent } from '../../../__tests__/utils/test-utils';
import { Switch } from '../switch';

describe('Switch Component', () => {
  it('renders correctly', () => {
    render(<Switch />);
    expect(screen.getByRole('switch')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    render(<Switch className="custom-switch" />);
    expect(screen.getByRole('switch')).toHaveClass('custom-switch');
  });

  it('handles checked state correctly', () => {
    render(<Switch defaultChecked />);
    expect(screen.getByRole('switch')).toBeChecked();
  });

  it('handles onChange events', () => {
    const handleChange = jest.fn();
    render(<Switch onChange={handleChange} />);
    
    const switchElement = screen.getByRole('switch');
    fireEvent.click(switchElement);
    
    expect(handleChange).toHaveBeenCalledTimes(1);
  });

  it('can be disabled', () => {
    render(<Switch disabled />);
    expect(screen.getByRole('switch')).toBeDisabled();
  });

  it('forwards ref correctly', () => {
    const ref = React.createRef<HTMLButtonElement>();
    render(<Switch ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLButtonElement);
  });

  it('passes additional props to the switch element', () => {
    render(<Switch data-testid="test-switch" aria-label="Toggle feature" />);
    const switchElement = screen.getByRole('switch');
    expect(switchElement).toHaveAttribute('data-testid', 'test-switch');
    expect(switchElement).toHaveAttribute('aria-label', 'Toggle feature');
  });

  it('toggles checked state when clicked', () => {
    render(<Switch />);
    const switchElement = screen.getByRole('switch');
    
    // Initially unchecked
    expect(switchElement).not.toBeChecked();
    
    // Click to check
    fireEvent.click(switchElement);
    expect(switchElement).toBeChecked();
    
    // Click again to uncheck
    fireEvent.click(switchElement);
    expect(switchElement).not.toBeChecked();
  });
});
