import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { UserStats } from '../user-stats';

describe('UserStats Component', () => {
  const defaultProps = {
    questionsAnswered: 42,
    materialsGenerated: 15,
    timeSaved: 120
  };

  it('renders all stat cards correctly', () => {
    render(<UserStats {...defaultProps} />);
    
    // Check if all titles are displayed
    expect(screen.getByText('Perguntas Respondidas')).toBeInTheDocument();
    expect(screen.getByText('Materiais Gerados')).toBeInTheDocument();
    expect(screen.getByText('Tempo Economizado')).toBeInTheDocument();
    
    // Check if all values are displayed correctly
    expect(screen.getByText('42')).toBeInTheDocument();
    expect(screen.getByText('15')).toBeInTheDocument();
    expect(screen.getByText('120 min')).toBeInTheDocument();
    
    // Check if all descriptions are displayed
    expect(screen.getByText('Interações com o tutor de IA')).toBeInTheDocument();
    expect(screen.getByText('Resumos, mapas mentais e mais')).toBeInTheDocument();
    expect(screen.getByText('Estimativa de tempo poupado')).toBeInTheDocument();
  });

  it('applies correct grid layout', () => {
    render(<UserStats {...defaultProps} />);
    
    const valueElement = screen.getByText('42');
    const divElement = valueElement.closest('div');
    expect(divElement).not.toBeNull();
    const parentElement = divElement?.parentElement;
    expect(parentElement).not.toBeNull();
    const container = parentElement?.parentElement;
    expect(container).not.toBeNull();
    expect(container).toHaveClass('grid');
    expect(container).toHaveClass('grid-cols-1');
    expect(container).toHaveClass('md:grid-cols-3');
    expect(container).toHaveClass('gap-6');
  });

  it('renders with zero values correctly', () => {
    render(
      <UserStats 
        questionsAnswered={0} 
        materialsGenerated={0} 
        timeSaved={0} 
      />
    );
    
    // Use getAllByText since there are multiple elements with '0'
    const zeroElements = screen.getAllByText('0');
    expect(zeroElements.length).toBe(2); // Two elements with just '0'
    expect(screen.getByText('0 min')).toBeInTheDocument();
  });

  it('applies correct card styling', () => {
    render(<UserStats {...defaultProps} />);
    
    // Get all cards
    const cards = screen.getAllByText(/Perguntas|Materiais|Tempo/);
    
    cards.forEach(card => {
      const cardElement = card.closest('div');
      expect(cardElement).toHaveClass('pb-2');
    });
    
    // Check if values have correct styling
    const values = screen.getAllByText(/42|15|120 min/);
    values.forEach(value => {
      expect(value).toHaveClass('text-3xl');
      expect(value).toHaveClass('font-bold');
    });
    
    // Check if descriptions have correct styling
    const descriptions = screen.getAllByText(/Interações|Resumos|Estimativa/);
    descriptions.forEach(desc => {
      expect(desc).toHaveClass('text-sm');
      expect(desc).toHaveClass('text-muted-foreground');
    });
  });
});
