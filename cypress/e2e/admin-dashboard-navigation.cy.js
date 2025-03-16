// Admin Dashboard Navigation Tests
// Tests navigation within the admin dashboard

describe('Admin Dashboard Navigation', () => {
  beforeEach(() => {
    // Visit the admin dashboard directly with auth bypass
    cy.visit('/admin/dashboard');
    
    // Set authentication bypass for development testing
    cy.window().then((win) => {
      win.localStorage.setItem('BYPASS_AUTH', 'true');
    });
  });

  it('should display all admin dashboard modules', () => {
    // Check that all module cards are displayed
    cy.contains('Usuários').should('be.visible');
    cy.contains('Cursos').should('be.visible');
    cy.contains('Conteúdo').should('be.visible');
    cy.contains('Módulos').should('be.visible');
    cy.contains('Financeiro').should('be.visible');
    cy.contains('Relatórios').should('be.visible');
    cy.contains('Analytics').should('be.visible');
    cy.contains('Avaliações').should('be.visible');
    cy.contains('Configurações').should('be.visible');
  });

  it('should navigate to the users management page', () => {
    // Click on the users management button
    cy.contains('Gerenciar Usuários').click();
    
    // Verify navigation to users management page
    cy.url().should('include', '/admin/users');
  });

  it('should navigate to the courses management page', () => {
    // Click on the courses management button
    cy.contains('Gerenciar Cursos').click();
    
    // Verify navigation to courses management page
    cy.url().should('include', '/admin/courses/list');
  });

  it('should navigate to the content management page', () => {
    // Click on the content management button
    cy.contains('Gerenciar Conteúdo').click();
    
    // Verify navigation to content management page
    cy.url().should('include', '/admin/content/list');
  });

  it('should navigate to the modules configuration page', () => {
    // Click on the modules configuration button
    cy.contains('Configurar Módulos').click();
    
    // Verify navigation to modules configuration page
    cy.url().should('include', '/admin/modules');
  });

  it('should navigate to the financial management page', () => {
    // Click on the financial management button
    cy.contains('Gestão Financeira').click();
    
    // Verify navigation to financial management page
    cy.url().should('include', '/admin/financial');
  });

  it('should navigate to the reports page', () => {
    // Click on the reports button
    cy.contains('Ver Relatórios').click();
    
    // Verify navigation to reports page
    cy.url().should('include', '/admin/reports');
  });

  it('should navigate to the analytics page', () => {
    // Click on the analytics button
    cy.contains('Ver Analytics').click();
    
    // Verify navigation to analytics page
    cy.url().should('include', '/admin/analytics/dashboard');
  });

  it('should navigate to the assessments management page', () => {
    // Click on the assessments management button
    cy.contains('Gerenciar Avaliações').click();
    
    // Verify navigation to assessments management page
    cy.url().should('include', '/admin/assessments/list');
  });

  it('should navigate to the settings page', () => {
    // Click on the settings button
    cy.contains('Configurações').click();
    
    // Verify navigation to settings page
    cy.url().should('include', '/admin/settings');
  });

  it('should have working sidebar navigation', () => {
    // Check that sidebar navigation links work
    cy.contains('a', 'Usuários').click();
    cy.url().should('include', '/admin/users');
    
    cy.contains('a', 'Cursos').click();
    cy.url().should('include', '/admin/courses');
    
    cy.contains('a', 'Conteúdo').click();
    cy.url().should('include', '/admin/content');
    
    cy.contains('a', 'Módulos').click();
    cy.url().should('include', '/admin/modules');
    
    cy.contains('a', 'Financeiro').click();
    cy.url().should('include', '/admin/financial');
    
    cy.contains('a', 'Relatórios').click();
    cy.url().should('include', '/admin/reports');
    
    cy.contains('a', 'Analytics').click();
    cy.url().should('include', '/admin/analytics');
    
    cy.contains('a', 'Avaliações').click();
    cy.url().should('include', '/admin/assessments');
    
    cy.contains('a', 'Configurações').click();
    cy.url().should('include', '/admin/settings');
  });
});
