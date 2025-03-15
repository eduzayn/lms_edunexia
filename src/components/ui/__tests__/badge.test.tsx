import React from 'react';
import { render, screen } from '../../../__tests__/utils/test-utils';
import { Badge } from '../badge';

describe('Badge Component', () => {
  it('renders correctly', () => {
    render(<Badge>New</Badge>);
    expect(screen.getByText('New')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    render(<Badge className="custom-badge">New</Badge>);
    expect(screen.getByText('New')).toHaveClass('custom-badge');
  });

  it('renders with different variants', () => {
    const { rerender } = render(<Badge variant="default">Default</Badge>);
    expect(screen.getByText('Default')).toHaveClass('bg-primary');

    rerender(<Badge variant="secondary">Secondary</Badge>);
    expect(screen.getByText('Secondary')).toHaveClass('bg-secondary');

    rerender(<Badge variant="destructive">Destructive</Badge>);
    expect(screen.getByText('Destructive')).toHaveClass('bg-destructive');

    rerender(<Badge variant="outline">Outline</Badge>);
    expect(screen.getByText('Outline')).toHaveClass('border');
  });

  it('passes additional props to the div element', () => {
    render(<Badge data-testid="test-badge">Test Badge</Badge>);
    expect(screen.getByTestId('test-badge')).toHaveTextContent('Test Badge');
  });
});
