import React from 'react';
import { render, screen } from '../../../__tests__/utils/test-utils';
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent, 
  CardFooter 
} from '../card';

describe('Card Components', () => {
  describe('Card', () => {
    it('renders correctly', () => {
      render(<Card>Card Content</Card>);
      expect(screen.getByText('Card Content')).toBeInTheDocument();
    });

    it('applies custom className', () => {
      render(<Card className="custom-class">Card Content</Card>);
      expect(screen.getByText('Card Content')).toHaveClass('custom-class');
    });

    it('forwards ref correctly', () => {
      const ref = React.createRef<HTMLDivElement>();
      render(<Card ref={ref}>Card Content</Card>);
      expect(ref.current).toBeInstanceOf(HTMLDivElement);
    });
  });

  describe('CardHeader', () => {
    it('renders correctly', () => {
      render(<CardHeader>Header Content</CardHeader>);
      expect(screen.getByText('Header Content')).toBeInTheDocument();
    });

    it('applies custom className', () => {
      render(<CardHeader className="custom-header">Header Content</CardHeader>);
      expect(screen.getByText('Header Content')).toHaveClass('custom-header');
    });
  });

  describe('CardTitle', () => {
    it('renders correctly', () => {
      render(<CardTitle>Card Title</CardTitle>);
      expect(screen.getByText('Card Title')).toBeInTheDocument();
      expect(screen.getByText('Card Title').tagName).toBe('H3');
    });

    it('applies custom className', () => {
      render(<CardTitle className="custom-title">Card Title</CardTitle>);
      expect(screen.getByText('Card Title')).toHaveClass('custom-title');
    });
  });

  describe('CardDescription', () => {
    it('renders correctly', () => {
      render(<CardDescription>Card Description</CardDescription>);
      expect(screen.getByText('Card Description')).toBeInTheDocument();
      expect(screen.getByText('Card Description').tagName).toBe('P');
    });

    it('applies custom className', () => {
      render(<CardDescription className="custom-desc">Card Description</CardDescription>);
      expect(screen.getByText('Card Description')).toHaveClass('custom-desc');
    });
  });

  describe('CardContent', () => {
    it('renders correctly', () => {
      render(<CardContent>Content Area</CardContent>);
      expect(screen.getByText('Content Area')).toBeInTheDocument();
    });

    it('applies custom className', () => {
      render(<CardContent className="custom-content">Content Area</CardContent>);
      expect(screen.getByText('Content Area')).toHaveClass('custom-content');
    });
  });

  describe('CardFooter', () => {
    it('renders correctly', () => {
      render(<CardFooter>Footer Content</CardFooter>);
      expect(screen.getByText('Footer Content')).toBeInTheDocument();
    });

    it('applies custom className', () => {
      render(<CardFooter className="custom-footer">Footer Content</CardFooter>);
      expect(screen.getByText('Footer Content')).toHaveClass('custom-footer');
    });
  });

  describe('Card Composition', () => {
    it('renders a complete card with all components', () => {
      render(
        <Card>
          <CardHeader>
            <CardTitle>Example Card</CardTitle>
            <CardDescription>This is an example card description</CardDescription>
          </CardHeader>
          <CardContent>
            <p>This is the main content of the card.</p>
          </CardContent>
          <CardFooter>
            <button>Action Button</button>
          </CardFooter>
        </Card>
      );

      expect(screen.getByText('Example Card')).toBeInTheDocument();
      expect(screen.getByText('This is an example card description')).toBeInTheDocument();
      expect(screen.getByText('This is the main content of the card.')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Action Button' })).toBeInTheDocument();
    });
  });
});
