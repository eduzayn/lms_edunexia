describe('Admin Dashboard', () => {
  beforeEach(() => {
    // Mock login - in a real scenario, we would use the custom login command
    cy.visit('/admin/dashboard');
    // For now, we'll assume we're redirected to login page
    cy.url().should('include', '/admin/login');
    
    // Fill login form and submit
    cy.get('input#email').type('admin@example.com');
    cy.get('input#password').type('password123');
    cy.get('button[type="submit"]').click();
    
    // Should be redirected to dashboard
    cy.url().should('include', '/admin/dashboard');
  });

  it('should display admin dashboard components', () => {
    cy.contains('Dashboard Administrativo').should('be.visible');
    
    // Check for dashboard cards
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

  it('should navigate to users management page', () => {
    cy.contains('Usuários').parent().contains('Gerenciar Usuários').click();
    cy.url().should('include', '/admin/users');
  });

  it('should navigate to courses management page', () => {
    cy.contains('Cursos').parent().contains('Gerenciar Cursos').click();
    cy.url().should('include', '/admin/courses/list');
  });

  it('should navigate to assessments management page', () => {
    cy.contains('Avaliações').parent().contains('Gerenciar Avaliações').click();
    cy.url().should('include', '/admin/assessments/list');
  });
});
