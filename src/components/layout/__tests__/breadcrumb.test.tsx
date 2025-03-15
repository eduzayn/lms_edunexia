import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Breadcrumb } from '../breadcrumb';

describe('Breadcrumb Component', () => {
  const mockItems = [
    { label: 'Home', href: '/' },
    { label: 'Products', href: '/products' },
    { label: 'Category', href: '/products/category' },
    { label: 'Item', href: '/products/category/item' }
  ];

  it('renders all breadcrumb items correctly', () => {
    render(<Breadcrumb items={mockItems} />);
    
    // Check if all labels are displayed
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('Products')).toBeInTheDocument();
    expect(screen.getByText('Category')).toBeInTheDocument();
    expect(screen.getByText('Item')).toBeInTheDocument();
    
    // Check if the last item is not a link and has the correct styling
    const lastItem = screen.getByText('Item');
    expect(lastItem.tagName).not.toBe('A');
    expect(lastItem).toHaveClass('font-medium');
    expect(lastItem).toHaveClass('text-foreground');
    
    // Check if other items are links
    const homeLink = screen.getByText('Home').closest('a');
    expect(homeLink).toBeInTheDocument();
    expect(homeLink).toHaveAttribute('href', '/');
    
    const productsLink = screen.getByText('Products').closest('a');
    expect(productsLink).toBeInTheDocument();
    expect(productsLink).toHaveAttribute('href', '/products');
    
    const categoryLink = screen.getByText('Category').closest('a');
    expect(categoryLink).toBeInTheDocument();
    expect(categoryLink).toHaveAttribute('href', '/products/category');
  });

  it('renders chevron icons between items', () => {
    render(<Breadcrumb items={mockItems} />);
    
    // There should be 3 chevron icons (one less than the number of items)
    const chevrons = document.querySelectorAll('.lucide-chevron-right');
    expect(chevrons.length).toBe(3);
  });

  it('applies additional className when provided', () => {
    render(<Breadcrumb items={mockItems} className="custom-class" />);
    
    const nav = screen.getByRole('navigation');
    expect(nav).toHaveClass('custom-class');
  });

  it('renders correctly with a single item', () => {
    const singleItem = [{ label: 'Home', href: '/' }];
    render(<Breadcrumb items={singleItem} />);
    
    // Check if the label is displayed
    expect(screen.getByText('Home')).toBeInTheDocument();
    
    // There should be no chevron icons
    const chevrons = document.querySelectorAll('.lucide-chevron-right');
    expect(chevrons.length).toBe(0);
    
    // The single item should not be a link since it's the current page
    const homeItem = screen.getByText('Home');
    expect(homeItem.tagName).not.toBe('A');
  });

  it('has correct accessibility attributes', () => {
    render(<Breadcrumb items={mockItems} />);
    
    const nav = screen.getByRole('navigation');
    expect(nav).toHaveAttribute('aria-label', 'Breadcrumb');
    
    // The current page should have aria-current="page"
    const currentPage = screen.getByText('Item');
    expect(currentPage).toHaveAttribute('aria-current', 'page');
  });
});
