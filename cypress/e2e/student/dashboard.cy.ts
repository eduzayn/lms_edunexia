describe('Student Dashboard', () => {
  beforeEach(() => {
    // Mock login - in a real scenario, we would use the custom login command
    cy.visit('/student/dashboard');
    // For now, we'll assume we're redirected to login page
    cy.url().should('include', '/student/login');
    
    // Fill login form and submit
    cy.get('input[name="email"]').type('student@example.com');
    cy.get('input[name="password"]').type('password123');
    cy.get('button[type="submit"]').click();
    
    // Should be redirected to dashboard
    cy.url().should('include', '/student/dashboard');
  });

  it('should display student dashboard components', () => {
    cy.contains('Dashboard do Aluno').should('be.visible');
    cy.get('[data-testid="student-sidebar"]').should('be.visible');
    cy.get('[data-testid="student-breadcrumb"]').should('be.visible');
    
    // Check for dashboard widgets
    cy.contains('Próximas Atividades').should('be.visible');
    cy.contains('Progresso do Curso').should('be.visible');
    cy.contains('Avaliações Pendentes').should('be.visible');
  });

  it('should navigate to assessments page', () => {
    cy.contains('Avaliações').click();
    cy.url().should('include', '/student/assessments/list');
    cy.contains('Avaliações Disponíveis').should('be.visible');
  });

  it('should navigate to AI tutor page', () => {
    cy.contains('Tutor IA').click();
    cy.url().should('include', '/student/ai-tutor');
    cy.contains('Tutor de IA').should('be.visible');
  });

  it('should navigate to activities page', () => {
    cy.contains('Atividades').click();
    cy.url().should('include', '/student/activities');
    cy.contains('Minhas Atividades').should('be.visible');
  });

  it('should allow logging out', () => {
    cy.get('[data-testid="user-menu"]').click();
    cy.contains('Sair').click();
    cy.url().should('include', '/auth/login');
  });
});
