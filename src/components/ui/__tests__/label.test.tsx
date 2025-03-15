import React from 'react';
import { render, screen } from '../../../__tests__/utils/test-utils';
import { Label } from '../label';

describe('Label Component', () => {
  it('renders correctly', () => {
    render(<Label htmlFor="test-input">Test Label</Label>);
    expect(screen.getByText('Test Label')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    render(<Label className="custom-class">Test Label</Label>);
    expect(screen.getByText('Test Label')).toHaveClass('custom-class');
  });

  it('forwards ref correctly', () => {
    const ref = React.createRef<HTMLLabelElement>();
    render(<Label ref={ref}>Ref test</Label>);
    expect(ref.current).toBeInstanceOf(HTMLLabelElement);
  });

  it('passes additional props to the label element', () => {
    render(<Label htmlFor="test-input" data-testid="test-label">Test Label</Label>);
    const label = screen.getByText('Test Label');
    expect(label).toHaveAttribute('data-testid', 'test-label');
    expect(label).toHaveAttribute('htmlFor', 'test-input');
  });

  it('applies peer-disabled styles correctly', () => {
    render(<Label>Disabled Label</Label>);
    expect(screen.getByText('Disabled Label')).toHaveClass('peer-disabled:cursor-not-allowed');
    expect(screen.getByText('Disabled Label')).toHaveClass('peer-disabled:opacity-70');
  });
});
