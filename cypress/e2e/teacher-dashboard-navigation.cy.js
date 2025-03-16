// Teacher Dashboard Navigation Tests
// Tests navigation within the teacher dashboard

describe('Teacher Dashboard Navigation', () => {
  beforeEach(() => {
    // Visit the teacher dashboard directly with auth bypass
    cy.visit('/teacher/dashboard');
    
    // Set authentication bypass for development testing
    cy.window().then((win) => {
      win.localStorage.setItem('BYPASS_AUTH', 'true');
    });
  });

  it('should display all teacher dashboard modules', () => {
    // Check that all module cards are displayed
    cy.contains('Meus Cursos').should('be.visible');
    cy.contains('Meus Alunos').should('be.visible');
    cy.contains('Conteúdo').should('be.visible');
    cy.contains('Avaliações').should('be.visible');
    cy.contains('Fóruns').should('be.visible');
    cy.contains('Relatórios').should('be.visible');
  });

  it('should navigate to the courses management page', () => {
    // Click on the courses management button
    cy.contains('Gerenciar Cursos').click();
    
    // Verify navigation to courses management page
    cy.url().should('include', '/teacher/courses');
  });

  it('should navigate to the students page', () => {
    // Click on the students button
    cy.contains('Ver Alunos').click();
    
    // Verify navigation to students page
    cy.url().should('include', '/teacher/students');
  });

  it('should navigate to the content management page', () => {
    // Click on the content management button
    cy.contains('Gerenciar Conteúdo').click();
    
    // Verify navigation to content management page
    cy.url().should('include', '/teacher/content');
  });

  it('should navigate to the assessments management page', () => {
    // Click on the assessments management button
    cy.contains('Gerenciar Avaliações').click();
    
    // Verify navigation to assessments management page
    cy.url().should('include', '/teacher/assessments');
  });

  it('should navigate to the forums page', () => {
    // Click on the forums button
    cy.contains('Acessar Fóruns').click();
    
    // Verify navigation to forums page
    cy.url().should('include', '/forums/list');
  });

  it('should navigate to the reports page', () => {
    // Click on the reports button
    cy.contains('Ver Relatórios').click();
    
    // Verify navigation to reports page
    cy.url().should('include', '/teacher/reports');
  });

  it('should have working sidebar navigation', () => {
    // Check that sidebar navigation links work
    cy.contains('a', 'Meus Cursos').click();
    cy.url().should('include', '/teacher/courses');
    
    cy.contains('a', 'Meus Alunos').click();
    cy.url().should('include', '/teacher/students');
    
    cy.contains('a', 'Conteúdo').click();
    cy.url().should('include', '/teacher/content');
    
    cy.contains('a', 'Avaliações').click();
    cy.url().should('include', '/teacher/assessments');
    
    cy.contains('a', 'Fóruns').click();
    cy.url().should('include', '/forums');
    
    cy.contains('a', 'Videoconferência').click();
    cy.url().should('include', '/teacher/videoconference');
    
    cy.contains('a', 'Relatórios').click();
    cy.url().should('include', '/teacher/reports');
  });
});
