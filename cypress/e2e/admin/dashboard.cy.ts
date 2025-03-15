describe('Admin Dashboard', () => {
  beforeEach(() => {
    // Mock login - in a real scenario, we would use the custom login command
    cy.visit('/admin/dashboard');
    // For now, we'll assume we're redirected to login page
    cy.url().should('include', '/admin/login');
    
    // Fill login form and submit
    cy.get('input[name="email"]').type('admin@example.com');
    cy.get('input[name="password"]').type('password123');
    cy.get('button[type="submit"]').click();
    
    // Should be redirected to dashboard
    cy.url().should('include', '/admin/dashboard');
  });

  it('should display admin dashboard components', () => {
    cy.contains('Dashboard Administrativo').should('be.visible');
    cy.get('[data-testid="admin-sidebar"]').should('be.visible');
    cy.get('[data-testid="admin-breadcrumb"]').should('be.visible');
    
    // Check for dashboard widgets
    cy.contains('Estatísticas Gerais').should('be.visible');
    cy.contains('Usuários Recentes').should('be.visible');
    cy.contains('Atividades do Sistema').should('be.visible');
  });

  it('should navigate to users management page', () => {
    cy.contains('Usuários').click();
    cy.url().should('include', '/admin/users');
    cy.contains('Gerenciar Usuários').should('be.visible');
  });

  it('should navigate to courses management page', () => {
    cy.contains('Cursos').click();
    cy.url().should('include', '/admin/courses');
    cy.contains('Gerenciar Cursos').should('be.visible');
  });

  it('should navigate to assessments management page', () => {
    cy.contains('Avaliações').click();
    cy.url().should('include', '/admin/assessments');
    cy.contains('Gerenciar Avaliações').should('be.visible');
  });

  it('should navigate to reports page', () => {
    cy.contains('Relatórios').click();
    cy.url().should('include', '/admin/reports');
    cy.contains('Relatórios do Sistema').should('be.visible');
  });

  it('should navigate to settings page', () => {
    cy.contains('Configurações').click();
    cy.url().should('include', '/admin/settings');
    cy.contains('Configurações do Sistema').should('be.visible');
  });

  it('should allow logging out', () => {
    cy.get('[data-testid="user-menu"]').click();
    cy.contains('Sair').click();
    cy.url().should('include', '/auth/login');
  });
});
