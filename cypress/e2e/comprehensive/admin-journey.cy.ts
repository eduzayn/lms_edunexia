describe('Comprehensive Admin Journey', () => {
  beforeEach(() => {
    // Login as an admin
    cy.visit('/admin/login');
    cy.get('input#email').type('admin@example.com');
    cy.get('input#password').type('password123');
    cy.get('button[type="submit"]').click();
    cy.url().should('include', '/admin/dashboard');
  });

  it('should complete a full admin journey', () => {
    // Step 1: Navigate to users from dashboard
    cy.contains('Usuários').parent().contains('Gerenciar Usuários').click();
    cy.url().should('include', '/admin/users');
    
    // Step 2: Create a new user
    cy.contains('Novo Usuário').click();
    cy.get('input#user-name').type('Maria Oliveira');
    cy.get('input#user-email').type('maria@example.com');
    cy.get('select#user-role').select('Professor');
    cy.get('button[type="submit"]').click();
    cy.contains('Usuário criado com sucesso').should('be.visible');
    
    // Step 3: Edit user permissions
    cy.contains('Maria Oliveira').parent().contains('Editar').click();
    cy.get('input#permission-create-courses').check();
    cy.get('input#permission-manage-students').check();
    cy.get('button[type="submit"]').click();
    cy.contains('Permissões atualizadas com sucesso').should('be.visible');
    
    // Step 4: Navigate to courses
    cy.visit('/admin/dashboard');
    cy.contains('Cursos').parent().contains('Gerenciar Cursos').click();
    cy.url().should('include', '/admin/courses/list');
    
    // Step 5: Approve a course
    cy.contains('Curso de Testes Automatizados').parent().contains('Aprovar').click();
    cy.contains('Curso aprovado com sucesso').should('be.visible');
    
    // Step 6: Navigate to modules
    cy.visit('/admin/dashboard');
    cy.contains('Módulos').parent().contains('Configurar Módulos').click();
    cy.url().should('include', '/admin/modules');
    
    // Step 7: Enable a module
    cy.contains('Módulo de Fóruns').parent().get('input[type="checkbox"]').check();
    cy.contains('Salvar Configurações').click();
    cy.contains('Configurações salvas com sucesso').should('be.visible');
    
    // Step 8: Navigate to financial
    cy.visit('/admin/dashboard');
    cy.contains('Financeiro').parent().contains('Gestão Financeira').click();
    cy.url().should('include', '/admin/financial');
    
    // Step 9: View financial reports
    cy.contains('Relatórios Financeiros').click();
    cy.contains('Receita Mensal').should('be.visible');
    
    // Step 10: Navigate to reports
    cy.visit('/admin/dashboard');
    cy.contains('Relatórios').parent().contains('Ver Relatórios').click();
    cy.url().should('include', '/admin/reports');
    
    // Step 11: Generate a report
    cy.get('select#report-type').select('Desempenho de Alunos');
    cy.get('input#start-date').type('2025-01-01');
    cy.get('input#end-date').type('2025-03-15');
    cy.contains('Gerar Relatório').click();
    cy.contains('Relatório gerado com sucesso').should('be.visible');
    
    // Step 12: Export report
    cy.contains('Exportar como PDF').click();
    cy.contains('Relatório exportado com sucesso').should('be.visible');
    
    // Step 13: Navigate to settings
    cy.visit('/admin/dashboard');
    cy.contains('Configurações').parent().contains('Configurações').click();
    cy.url().should('include', '/admin/settings');
    
    // Step 14: Update platform settings
    cy.get('input#platform-name').clear().type('Edunexia LMS');
    cy.get('textarea#platform-description').clear().type('Plataforma de aprendizado online completa');
    cy.get('input#support-email').clear().type('suporte@edunexia.com');
    cy.contains('Salvar Configurações').click();
    cy.contains('Configurações salvas com sucesso').should('be.visible');
    
    // Step 15: Return to dashboard
    cy.visit('/admin/dashboard');
    cy.contains('Dashboard Administrativo').should('be.visible');
  });
});
