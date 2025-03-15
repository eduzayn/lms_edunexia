describe('Comprehensive Student Journey', () => {
  beforeEach(() => {
    // Login as a student
    cy.visit('/student/login');
    cy.get('input#email').type('student@example.com');
    cy.get('input#password').type('password123');
    cy.get('button[type="submit"]').click();
    cy.url().should('include', '/student/dashboard');
  });

  it('should complete a full student journey', () => {
    // Step 1: Navigate to courses from dashboard
    cy.contains('Meus Cursos').parent().contains('Ver Cursos').click();
    cy.url().should('include', '/student/courses');
    
    // Step 2: Select a course
    cy.contains('Introdução à Programação').click();
    cy.url().should('include', '/student/courses/');
    cy.contains('Módulos do Curso').should('be.visible');
    
    // Step 3: Navigate to a module
    cy.contains('Módulo 1: Fundamentos').click();
    cy.contains('Conteúdo do Módulo').should('be.visible');
    
    // Step 4: View a lesson
    cy.contains('Lição 1: Introdução à Lógica').click();
    cy.contains('Conteúdo da Lição').should('be.visible');
    
    // Step 5: Complete the lesson and mark as done
    cy.get('[data-testid="mark-complete-button"]').click();
    cy.contains('Lição concluída').should('be.visible');
    
    // Step 6: Navigate to assessments
    cy.visit('/student/dashboard');
    cy.contains('Tutor IA').parent().contains('Acessar Tutor IA').click();
    cy.url().should('include', '/student/ai-tutor');
    
    // Step 7: Ask a question to the AI tutor
    cy.get('[data-testid="ai-input"]').type('O que é uma variável em programação?');
    cy.get('[data-testid="send-message-button"]').click();
    
    // Step 8: Wait for AI response
    cy.contains('Aguarde enquanto processamos sua pergunta').should('be.visible');
    cy.contains('Uma variável em programação', { timeout: 10000 }).should('be.visible');
    
    // Step 9: Navigate to activities
    cy.visit('/student/dashboard');
    cy.contains('Atividades').parent().contains('Ver Atividades').click();
    cy.url().should('include', '/student/activities');
    
    // Step 10: View pending activities
    cy.contains('Atividades Pendentes').should('be.visible');
    
    // Step 11: Start an assessment
    cy.contains('Avaliação: Fundamentos de Programação').click();
    cy.url().should('include', '/student/assessments/take/');
    
    // Step 12: Answer questions
    cy.get('[data-testid="question-option"]').first().click();
    cy.get('[data-testid="next-question-button"]').click();
    
    // Step 13: Submit assessment
    cy.get('[data-testid="submit-assessment-button"]').click();
    cy.contains('Avaliação enviada com sucesso').should('be.visible');
    
    // Step 14: View results
    cy.contains('Ver Resultados').click();
    cy.contains('Resultado da Avaliação').should('be.visible');
    
    // Step 15: Return to dashboard
    cy.visit('/student/dashboard');
    cy.contains('Dashboard do Aluno').should('be.visible');
  });
});
