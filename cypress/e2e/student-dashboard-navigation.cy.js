// Student Dashboard Navigation Tests
// Tests navigation within the student dashboard

describe('Student Dashboard Navigation', () => {
  beforeEach(() => {
    // Visit the student dashboard directly with auth bypass
    cy.visit('/student/dashboard');
    
    // Set authentication bypass for development testing
    cy.window().then((win) => {
      win.localStorage.setItem('BYPASS_AUTH', 'true');
    });
  });

  it('should display all student dashboard modules', () => {
    // Check that all module cards are displayed
    cy.contains('Meus Cursos').should('be.visible');
    cy.contains('Meu Progresso').should('be.visible');
    cy.contains('Certificados').should('be.visible');
    cy.contains('Gamificação').should('be.visible');
    cy.contains('Tutor IA').should('be.visible');
    cy.contains('Financeiro').should('be.visible');
    cy.contains('Atividades').should('be.visible');
  });

  it('should navigate to the courses page', () => {
    // Click on the courses button
    cy.contains('Ver Cursos').click();
    
    // Verify navigation to courses page
    cy.url().should('include', '/student/courses');
  });

  it('should navigate to the progress page', () => {
    // Click on the progress button
    cy.contains('Ver Progresso').click();
    
    // Verify navigation to progress page
    cy.url().should('include', '/student/progress');
  });

  it('should navigate to the certificates page', () => {
    // Click on the certificates button
    cy.contains('Meus Certificados').click();
    
    // Verify navigation to certificates page
    cy.url().should('include', '/student/certificates');
  });

  it('should navigate to the gamification page', () => {
    // Click on the gamification button
    cy.contains('Minhas Conquistas').click();
    
    // Verify navigation to gamification page
    cy.url().should('include', '/student/gamification');
  });

  it('should navigate to the AI tutor page', () => {
    // Click on the AI tutor button
    cy.contains('Acessar Tutor IA').click();
    
    // Verify navigation to AI tutor page
    cy.url().should('include', '/student/ai-tutor');
  });

  it('should navigate to the financial page', () => {
    // Click on the financial button
    cy.contains('Área Financeira').click();
    
    // Verify navigation to financial page
    cy.url().should('include', '/student/financial');
  });

  it('should navigate to the activities page', () => {
    // Click on the activities button
    cy.contains('Ver Atividades').click();
    
    // Verify navigation to activities page
    cy.url().should('include', '/student/activities');
  });

  it('should have working sidebar navigation', () => {
    // Check that sidebar navigation links work
    cy.contains('a', 'Meus Cursos').click();
    cy.url().should('include', '/student/courses');
    
    cy.contains('a', 'Meu Progresso').click();
    cy.url().should('include', '/student/progress');
    
    cy.contains('a', 'Financeiro').click();
    cy.url().should('include', '/student/financial');
    
    cy.contains('a', 'Certificados').click();
    cy.url().should('include', '/student/certificates');
    
    cy.contains('a', 'Tutor IA').click();
    cy.url().should('include', '/student/ai-tutor');
    
    cy.contains('a', 'Atividades').click();
    cy.url().should('include', '/student/activities');
    
    cy.contains('a', 'Fóruns').click();
    cy.url().should('include', '/forums');
    
    cy.contains('a', 'Videoconferência').click();
    cy.url().should('include', '/student/videoconference');
  });
});
