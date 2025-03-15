import React from 'react';
import { render, screen } from '../../../__tests__/utils/test-utils';
import { Avatar } from '../avatar';

describe('Avatar Component', () => {
  it('renders correctly', () => {
    render(<Avatar data-testid="avatar" />);
    expect(screen.getByTestId('avatar')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    render(<Avatar className="custom-avatar" data-testid="avatar" />);
    expect(screen.getByTestId('avatar')).toHaveClass('custom-avatar');
  });

  it('forwards ref correctly', () => {
    const ref = React.createRef<HTMLDivElement>();
    render(<Avatar ref={ref} data-testid="avatar" />);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it('renders with children', () => {
    render(
      <Avatar data-testid="avatar">
        <div data-testid="avatar-child">Child Content</div>
      </Avatar>
    );
    expect(screen.getByTestId('avatar-child')).toBeInTheDocument();
    expect(screen.getByText('Child Content')).toBeInTheDocument();
  });
});
