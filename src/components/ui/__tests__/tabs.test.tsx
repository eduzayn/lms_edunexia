import React from 'react';
import { render, screen } from '../../../__tests__/utils/test-utils';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../tabs';

describe('Tabs Components', () => {
  describe('Tabs', () => {
    it('renders correctly with children', () => {
      render(
        <Tabs defaultValue="tab1">
          <div data-testid="tabs-child">Tabs Child</div>
        </Tabs>
      );
      expect(screen.getByTestId('tabs-child')).toBeInTheDocument();
    });

    it('applies custom className', () => {
      render(
        <Tabs defaultValue="tab1" className="custom-tabs">
          <div data-testid="tabs-child">Tabs Child</div>
        </Tabs>
      );
      expect(screen.getByTestId('tabs-child').parentElement).toHaveClass('custom-tabs');
    });
  });

  describe('TabsList', () => {
    it('renders correctly', () => {
      render(
        <Tabs defaultValue="tab1">
          <TabsList data-testid="tabs-list">
            <TabsTrigger value="tab1">Tab 1</TabsTrigger>
            <TabsTrigger value="tab2">Tab 2</TabsTrigger>
          </TabsList>
        </Tabs>
      );
      expect(screen.getByTestId('tabs-list')).toBeInTheDocument();
    });

    it('applies custom className', () => {
      render(
        <Tabs defaultValue="tab1">
          <TabsList className="custom-list" data-testid="tabs-list">
            <TabsTrigger value="tab1">Tab 1</TabsTrigger>
          </TabsList>
        </Tabs>
      );
      expect(screen.getByTestId('tabs-list')).toHaveClass('custom-list');
    });
  });

  describe('TabsTrigger', () => {
    it('renders correctly', () => {
      render(
        <Tabs defaultValue="tab1">
          <TabsList>
            <TabsTrigger value="tab1" data-testid="tab-trigger">Tab 1</TabsTrigger>
          </TabsList>
        </Tabs>
      );
      expect(screen.getByTestId('tab-trigger')).toBeInTheDocument();
      expect(screen.getByTestId('tab-trigger')).toHaveTextContent('Tab 1');
    });

    it('applies custom className', () => {
      render(
        <Tabs defaultValue="tab1">
          <TabsList>
            <TabsTrigger value="tab1" className="custom-trigger" data-testid="tab-trigger">
              Tab 1
            </TabsTrigger>
          </TabsList>
        </Tabs>
      );
      expect(screen.getByTestId('tab-trigger')).toHaveClass('custom-trigger');
    });
  });

  describe('TabsContent', () => {
    it('renders correctly', () => {
      render(
        <Tabs defaultValue="tab1">
          <TabsList>
            <TabsTrigger value="tab1">Tab 1</TabsTrigger>
          </TabsList>
          <TabsContent value="tab1" data-testid="tab-content">
            Content for Tab 1
          </TabsContent>
        </Tabs>
      );
      expect(screen.getByTestId('tab-content')).toBeInTheDocument();
      expect(screen.getByTestId('tab-content')).toHaveTextContent('Content for Tab 1');
    });

    it('applies custom className', () => {
      render(
        <Tabs defaultValue="tab1">
          <TabsList>
            <TabsTrigger value="tab1">Tab 1</TabsTrigger>
          </TabsList>
          <TabsContent value="tab1" className="custom-content" data-testid="tab-content">
            Content for Tab 1
          </TabsContent>
        </Tabs>
      );
      expect(screen.getByTestId('tab-content')).toHaveClass('custom-content');
    });
  });

  describe('Tabs Composition', () => {
    it('renders a complete tabs component with all parts', () => {
      render(
        <Tabs defaultValue="tab1" data-testid="tabs">
          <TabsList data-testid="tabs-list">
            <TabsTrigger value="tab1" data-testid="tab1-trigger">Tab 1</TabsTrigger>
            <TabsTrigger value="tab2" data-testid="tab2-trigger">Tab 2</TabsTrigger>
          </TabsList>
          <TabsContent value="tab1" data-testid="tab1-content">
            Content for Tab 1
          </TabsContent>
          <TabsContent value="tab2" data-testid="tab2-content">
            Content for Tab 2
          </TabsContent>
        </Tabs>
      );

      expect(screen.getByTestId('tabs')).toBeInTheDocument();
      expect(screen.getByTestId('tabs-list')).toBeInTheDocument();
      expect(screen.getByTestId('tab1-trigger')).toBeInTheDocument();
      expect(screen.getByTestId('tab2-trigger')).toBeInTheDocument();
      expect(screen.getByTestId('tab1-content')).toBeInTheDocument();
      expect(screen.queryByTestId('tab2-content')).not.toBeVisible();
    });
  });
});
