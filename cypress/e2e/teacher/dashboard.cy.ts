describe('Teacher Dashboard', () => {
  beforeEach(() => {
    // Mock login - in a real scenario, we would use the custom login command
    cy.visit('/teacher/dashboard');
    // For now, we'll assume we're redirected to login page
    cy.url().should('include', '/teacher/login');
    
    // Fill login form and submit
    cy.get('input[name="email"]').type('teacher@example.com');
    cy.get('input[name="password"]').type('password123');
    cy.get('button[type="submit"]').click();
    
    // Should be redirected to dashboard
    cy.url().should('include', '/teacher/dashboard');
  });

  it('should display teacher dashboard components', () => {
    cy.contains('Dashboard do Professor').should('be.visible');
    cy.get('[data-testid="teacher-sidebar"]').should('be.visible');
    cy.get('[data-testid="teacher-breadcrumb"]').should('be.visible');
    
    // Check for dashboard widgets
    cy.contains('Desempenho dos Alunos').should('be.visible');
    cy.contains('Avaliações Recentes').should('be.visible');
    cy.contains('Atividades Pendentes').should('be.visible');
  });

  it('should navigate to assessments page', () => {
    cy.contains('Avaliações').click();
    cy.url().should('include', '/teacher/assessments');
    cy.contains('Gerenciar Avaliações').should('be.visible');
  });

  it('should navigate to courses page', () => {
    cy.contains('Cursos').click();
    cy.url().should('include', '/teacher/courses');
    cy.contains('Meus Cursos').should('be.visible');
  });

  it('should navigate to students page', () => {
    cy.contains('Alunos').click();
    cy.url().should('include', '/teacher/students');
    cy.contains('Meus Alunos').should('be.visible');
  });

  it('should navigate to reports page', () => {
    cy.contains('Relatórios').click();
    cy.url().should('include', '/teacher/reports');
    cy.contains('Relatórios de Desempenho').should('be.visible');
  });

  it('should allow logging out', () => {
    cy.get('[data-testid="user-menu"]').click();
    cy.contains('Sair').click();
    cy.url().should('include', '/auth/login');
  });
});
