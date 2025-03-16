// Portal Navigation Tests
// Tests navigation between the main site and the three portals (Admin, Teacher, Student)

describe('Portal Navigation', () => {
  beforeEach(() => {
    // Visit the login page before each test
    cy.visit('/auth/login');
    
    // Set authentication bypass for development testing
    cy.window().then((win) => {
      win.localStorage.setItem('BYPASS_AUTH', 'true');
    });
  });

  it('should display all three portal options on the login page', () => {
    // Check that all three portal cards are displayed
    cy.contains('Portal do Aluno').should('be.visible');
    cy.contains('Portal do Professor').should('be.visible');
    cy.contains('Portal Administrativo').should('be.visible');
    
    // Check that all portal buttons are clickable
    cy.contains('button', 'Acessar Portal').should('have.length', 3);
  });

  it('should navigate to the admin login page when clicking admin portal', () => {
    // Click on the admin portal button
    cy.contains('Portal Administrativo')
      .parent()
      .parent()
      .within(() => {
        cy.contains('button', 'Acessar Portal').click();
      });
    
    // Verify navigation to admin login page
    cy.url().should('include', '/auth/admin-login');
    cy.contains('Portal Administrativo').should('be.visible');
    cy.contains('Acesso restrito para administradores do sistema').should('be.visible');
  });

  it('should navigate to the teacher login page when clicking teacher portal', () => {
    // Click on the teacher portal button
    cy.contains('Portal do Professor')
      .parent()
      .parent()
      .within(() => {
        cy.contains('button', 'Acessar Portal').click();
      });
    
    // Verify navigation to teacher login page
    cy.url().should('include', '/auth/teacher-login');
    cy.contains('Portal do Professor').should('be.visible');
    cy.contains('Faça login para gerenciar suas turmas e conteúdos').should('be.visible');
  });

  it('should navigate to the student login page when clicking student portal', () => {
    // Click on the student portal button
    cy.contains('Portal do Aluno')
      .parent()
      .parent()
      .within(() => {
        cy.contains('button', 'Acessar Portal').click();
      });
    
    // Verify navigation to student login page
    cy.url().should('include', '/auth/student-login');
    cy.contains('Portal do Aluno').should('be.visible');
    cy.contains('Faça login para acessar seus cursos e atividades').should('be.visible');
  });

  it('should navigate to the admin dashboard after login with bypass auth', () => {
    // Navigate to admin login page
    cy.contains('Portal Administrativo')
      .parent()
      .parent()
      .within(() => {
        cy.contains('button', 'Acessar Portal').click();
      });
    
    // Fill in login form
    cy.get('input[type="email"]').type('admin@example.com');
    cy.get('input[type="password"]').type('password123');
    
    // Submit the form
    cy.contains('button', 'Entrar').click();
    
    // Verify navigation to admin dashboard
    cy.url().should('include', '/admin/dashboard');
    cy.contains('Dashboard Administrativo').should('be.visible');
  });

  it('should navigate to the teacher dashboard after login with bypass auth', () => {
    // Navigate to teacher login page
    cy.contains('Portal do Professor')
      .parent()
      .parent()
      .within(() => {
        cy.contains('button', 'Acessar Portal').click();
      });
    
    // Fill in login form
    cy.get('input[type="email"]').type('teacher@example.com');
    cy.get('input[type="password"]').type('password123');
    
    // Submit the form
    cy.contains('button', 'Entrar').click();
    
    // Verify navigation to teacher dashboard
    cy.url().should('include', '/teacher/dashboard');
    cy.contains('Dashboard do Professor').should('be.visible');
  });

  it('should navigate to the student dashboard after login with bypass auth', () => {
    // Navigate to student login page
    cy.contains('Portal do Aluno')
      .parent()
      .parent()
      .within(() => {
        cy.contains('button', 'Acessar Portal').click();
      });
    
    // Fill in login form
    cy.get('input[type="email"]').type('student@example.com');
    cy.get('input[type="password"]').type('password123');
    
    // Submit the form
    cy.contains('button', 'Entrar').click();
    
    // Verify navigation to student dashboard
    cy.url().should('include', '/student/dashboard');
    cy.contains('Dashboard do Aluno').should('be.visible');
  });
});
