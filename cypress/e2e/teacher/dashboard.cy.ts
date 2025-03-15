describe('Teacher Dashboard', () => {
  beforeEach(() => {
    // Mock login - in a real scenario, we would use the custom login command
    cy.visit('/teacher/dashboard');
    // For now, we'll assume we're redirected to login page
    cy.url().should('include', '/teacher/login');
    
    // Fill login form and submit
    cy.get('input#email').type('teacher@example.com');
    cy.get('input#password').type('password123');
    cy.get('button[type="submit"]').click();
    
    // Should be redirected to dashboard
    cy.url().should('include', '/teacher/dashboard');
  });

  it('should display teacher dashboard components', () => {
    cy.contains('Dashboard do Professor').should('be.visible');
    
    // Check for dashboard cards
    cy.contains('Meus Cursos').should('be.visible');
    cy.contains('Meus Alunos').should('be.visible');
    cy.contains('Conteúdo').should('be.visible');
    cy.contains('Avaliações').should('be.visible');
    cy.contains('Fóruns').should('be.visible');
    cy.contains('Relatórios').should('be.visible');
  });

  it('should navigate to courses page', () => {
    cy.contains('Meus Cursos').parent().contains('Gerenciar Cursos').click();
    cy.url().should('include', '/teacher/courses');
  });

  it('should navigate to assessments page', () => {
    cy.contains('Avaliações').parent().contains('Gerenciar Avaliações').click();
    cy.url().should('include', '/teacher/assessments');
  });

  it('should navigate to students page', () => {
    cy.contains('Meus Alunos').parent().contains('Ver Alunos').click();
    cy.url().should('include', '/teacher/students');
  });
});
