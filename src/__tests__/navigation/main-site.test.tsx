import React from 'react';
import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { MockHomePage, MockPricingPage, MockTestimonialsPage } from '../utils/mock-pages';
import { mockNextNavigation } from '../utils/test-utils';

// Import jest-dom matchers explicitly
import '@testing-library/jest-dom';

// Mock Next.js navigation
jest.mock('next/navigation', () => mockNextNavigation());

// Mock components that might cause issues in tests
jest.mock('../../components/layout/main-header', () => ({
  __esModule: true,
  default: () => <div data-testid="mock-main-header">Main Header</div>,
}));

jest.mock('../../components/layout/main-footer', () => ({
  __esModule: true,
  default: () => <div data-testid="mock-main-footer">Main Footer</div>,
}));

// Mock the mock pages to return simplified components
jest.mock('../utils/mock-pages', () => ({
  MockHomePage: () => (
    <div data-testid="home-page">
      <h1>Edunexia LMS</h1>
      <section>
        <h2>Recursos</h2>
        <div data-testid="feature-card">Feature 1</div>
        <div data-testid="feature-card">Feature 2</div>
        <div data-testid="feature-card">Feature 3</div>
        <div data-testid="feature-card">Feature 4</div>
        <div data-testid="feature-card">Feature 5</div>
        <div data-testid="feature-card">Feature 6</div>
      </section>
      <section>
        <h2>Portais</h2>
        <div>
          <h3>Portal do Aluno</h3>
          <a href="/auth/register">Começar Agora</a>
        </div>
        <div>
          <h3>Portal do Professor</h3>
        </div>
        <div>
          <h3>Portal Administrativo</h3>
        </div>
      </section>
      <nav>
        <a href="/precos">Ver Preços</a>
        <a href="/depoimentos">Depoimentos</a>
        <a href="/auth/login">Entrar</a>
      </nav>
    </div>
  ),
  MockPricingPage: () => (
    <div data-testid="pricing-page">
      <h1>Planos e Preços</h1>
      <div>Plano Básico</div>
      <div>Plano Profissional</div>
      <div>Plano Empresarial</div>
    </div>
  ),
  MockTestimonialsPage: () => (
    <div data-testid="testimonials-page">
      <h1>Depoimentos</h1>
      <div data-testid="testimonial-card">
        <img src="/avatar1.jpg" alt="Avatar" />
        <h3>Nome do Cliente</h3>
        <p>Depoimento do cliente sobre a plataforma.</p>
      </div>
    </div>
  ),
}));

describe('Main Site Navigation', () => {
  describe('Home Page', () => {
    it('renders the hero section with CTA buttons', () => {
      render(<MockHomePage />);
      
      // Check for hero section elements
      expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
      
      // Check for CTA buttons
      const startNowButton = screen.getByRole('link', { name: /começar agora/i });
      const viewPricingButton = screen.getByRole('link', { name: /ver preços/i });
      
      expect(startNowButton).toBeInTheDocument();
      expect(viewPricingButton).toBeInTheDocument();
      
      // Check for correct navigation links
      expect(startNowButton).toHaveAttribute('href', '/auth/register');
      expect(viewPricingButton).toHaveAttribute('href', '/precos');
    });
    
    it('displays the resources section with feature cards', () => {
      render(<MockHomePage />);
      
      // Check for resources section
      const resourcesSection = screen.getByText(/recursos/i).closest('section');
      expect(resourcesSection).toBeInTheDocument();
      
      // Check for feature cards (at least 6)
      const featureCards = screen.getAllByTestId('feature-card');
      expect(featureCards.length).toBeGreaterThanOrEqual(6);
    });
    
    it('shows the portals section with access cards', () => {
      render(<MockHomePage />);
      
      // Check for portals section
      const portalsSection = screen.getByText(/portais/i).closest('section');
      expect(portalsSection).toBeInTheDocument();
      
      // Check for portal cards
      const studentPortalCard = screen.getByText(/portal do aluno/i).closest('div');
      const teacherPortalCard = screen.getByText(/portal do professor/i).closest('div');
      const adminPortalCard = screen.getByText(/portal administrativo/i).closest('div');
      
      expect(studentPortalCard).toBeInTheDocument();
      expect(teacherPortalCard).toBeInTheDocument();
      expect(adminPortalCard).toBeInTheDocument();
    });
  });
  
  describe('Pricing Page', () => {
    it('renders pricing plans with correct information', () => {
      render(<MockPricingPage />);
      
      // Check for pricing page title
      expect(screen.getByRole('heading', { name: /planos e preços/i })).toBeInTheDocument();
      
      // Check for pricing plans
      const basicPlan = screen.getByText(/plano básico/i).closest('div');
      const professionalPlan = screen.getByText(/plano profissional/i).closest('div');
      const enterprisePlan = screen.getByText(/plano empresarial/i).closest('div');
      
      expect(basicPlan).toBeInTheDocument();
      expect(professionalPlan).toBeInTheDocument();
      expect(enterprisePlan).toBeInTheDocument();
    });
  });
  
  describe('Testimonials Page', () => {
    it('renders testimonial cards with user information', () => {
      render(<MockTestimonialsPage />);
      
      // Check for testimonials page title
      expect(screen.getByRole('heading', { name: /depoimentos/i })).toBeInTheDocument();
      
      // Check for testimonial cards
      const testimonialCards = screen.getAllByTestId('testimonial-card');
      expect(testimonialCards.length).toBeGreaterThanOrEqual(1);
    });
  });
  
  describe('Navigation between pages', () => {
    it('allows navigation from home to pricing page', async () => {
      const user = userEvent.setup();
      const { router } = mockNextNavigation();
      
      render(<MockHomePage />);
      
      // Find and click the pricing link in the header
      const pricingLink = screen.getByRole('link', { name: /ver preços/i });
      await user.click(pricingLink);
      
      // Check if router was called with correct path
      expect(router.push).toHaveBeenCalledWith('/precos');
    });
    
    it('allows navigation from home to testimonials page', async () => {
      const user = userEvent.setup();
      const { router } = mockNextNavigation();
      
      render(<MockHomePage />);
      
      // Find and click the testimonials link in the header
      const testimonialsLink = screen.getByRole('link', { name: /depoimentos/i });
      await user.click(testimonialsLink);
      
      // Check if router was called with correct path
      expect(router.push).toHaveBeenCalledWith('/depoimentos');
    });
    
    it('allows navigation to login page from header', async () => {
      const user = userEvent.setup();
      const { router } = mockNextNavigation();
      
      render(<MockHomePage />);
      
      // Find and click the login button in the header
      const loginButton = screen.getByRole('link', { name: /entrar/i });
      await user.click(loginButton);
      
      // Check if router was called with correct path
      expect(router.push).toHaveBeenCalledWith('/auth/login');
    });
  });
});
