describe('Comprehensive Teacher Journey', () => {
  beforeEach(() => {
    // Login as a teacher
    cy.visit('/teacher/login');
    cy.get('input#email').type('teacher@example.com');
    cy.get('input#password').type('password123');
    cy.get('button[type="submit"]').click();
    cy.url().should('include', '/teacher/dashboard');
  });

  it('should complete a full teacher journey', () => {
    // Step 1: Navigate to courses from dashboard
    cy.contains('Meus Cursos').parent().contains('Gerenciar Cursos').click();
    cy.url().should('include', '/teacher/courses');
    
    // Step 2: Create a new course
    cy.contains('Novo Curso').click();
    cy.get('input#course-title').type('Curso de Testes Automatizados');
    cy.get('textarea#course-description').type('Aprenda a criar testes automatizados para aplicações web.');
    cy.get('select#course-category').select('Tecnologia');
    cy.get('button[type="submit"]').click();
    cy.contains('Curso criado com sucesso').should('be.visible');
    
    // Step 3: Add a module to the course
    cy.contains('Adicionar Módulo').click();
    cy.get('input#module-title').type('Módulo 1: Introdução aos Testes');
    cy.get('textarea#module-description').type('Fundamentos de testes automatizados.');
    cy.get('button[type="submit"]').click();
    cy.contains('Módulo adicionado com sucesso').should('be.visible');
    
    // Step 4: Add content to the module
    cy.contains('Adicionar Conteúdo').click();
    cy.get('input#content-title').type('Lição 1: O que são testes automatizados');
    cy.get('[data-testid="content-editor"]').type('Nesta lição, vamos aprender os conceitos básicos de testes automatizados.');
    cy.get('button[type="submit"]').click();
    cy.contains('Conteúdo adicionado com sucesso').should('be.visible');
    
    // Step 5: Navigate to assessments
    cy.visit('/teacher/dashboard');
    cy.contains('Avaliações').parent().contains('Gerenciar Avaliações').click();
    cy.url().should('include', '/teacher/assessments');
    
    // Step 6: Create a new assessment
    cy.contains('Nova Avaliação').click();
    cy.get('input#assessment-title').type('Avaliação: Fundamentos de Testes');
    cy.get('textarea#assessment-description').type('Teste seus conhecimentos sobre os fundamentos de testes automatizados.');
    cy.get('select#assessment-course').select('Curso de Testes Automatizados');
    
    // Step 7: Add questions to the assessment
    cy.contains('Adicionar Questão').click();
    cy.get('input#question-text').type('Qual é o principal objetivo dos testes automatizados?');
    cy.get('input#option-1').type('Encontrar bugs');
    cy.get('input#option-2').type('Melhorar a performance');
    cy.get('input#option-3').type('Garantir que o software funcione conforme esperado');
    cy.get('input#option-4').type('Documentar o código');
    cy.get('[data-testid="correct-option-3"]').click();
    cy.contains('Adicionar').click();
    
    // Step 8: Save the assessment
    cy.get('button[type="submit"]').click();
    cy.contains('Avaliação criada com sucesso').should('be.visible');
    
    // Step 9: Navigate to students
    cy.visit('/teacher/dashboard');
    cy.contains('Meus Alunos').parent().contains('Ver Alunos').click();
    cy.url().should('include', '/teacher/students');
    
    // Step 10: View student list
    cy.contains('Lista de Alunos').should('be.visible');
    
    // Step 11: View student details
    cy.contains('João Silva').click();
    cy.contains('Perfil do Aluno').should('be.visible');
    
    // Step 12: View student progress
    cy.contains('Ver Progresso').click();
    cy.contains('Progresso do Aluno').should('be.visible');
    
    // Step 13: Grade student submission
    cy.contains('Avaliações Pendentes').click();
    cy.contains('Avaliação: Fundamentos de Programação').click();
    cy.get('input#grade').type('85');
    cy.get('textarea#feedback').type('Bom trabalho! Continue estudando os conceitos de variáveis.');
    cy.get('button[type="submit"]').click();
    cy.contains('Avaliação corrigida com sucesso').should('be.visible');
    
    // Step 14: Return to dashboard
    cy.visit('/teacher/dashboard');
    cy.contains('Dashboard do Professor').should('be.visible');
  });
});
