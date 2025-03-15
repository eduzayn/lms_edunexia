describe('Student Dashboard', () => {
  beforeEach(() => {
    // Mock login - in a real scenario, we would use the custom login command
    cy.visit('/student/dashboard');
    // For now, we'll assume we're redirected to login page
    cy.url().should('include', '/student/login');
    
    // Fill login form and submit
    cy.get('input#email').type('student@example.com');
    cy.get('input#password').type('password123');
    cy.get('button[type="submit"]').click();
    
    // Should be redirected to dashboard
    cy.url().should('include', '/student/dashboard');
  });

  it('should display student dashboard components', () => {
    cy.contains('Dashboard do Aluno').should('be.visible');
    
    // Check for dashboard cards
    cy.contains('Meus Cursos').should('be.visible');
    cy.contains('Meu Progresso').should('be.visible');
    cy.contains('Financeiro').should('be.visible');
    cy.contains('Certificados').should('be.visible');
    cy.contains('Tutor IA').should('be.visible');
    cy.contains('Atividades').should('be.visible');
  });

  it('should navigate to courses page', () => {
    cy.contains('Meus Cursos').parent().contains('Ver Cursos').click();
    cy.url().should('include', '/student/courses');
  });

  it('should navigate to AI tutor page', () => {
    cy.contains('Tutor IA').parent().contains('Acessar Tutor IA').click();
    cy.url().should('include', '/student/ai-tutor');
  });

  it('should navigate to activities page', () => {
    cy.contains('Atividades').parent().contains('Ver Atividades').click();
    cy.url().should('include', '/student/activities');
  });
});
