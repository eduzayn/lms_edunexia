// Main Site Navigation Tests
// Tests navigation within the main public site

describe('Main Site Navigation', () => {
  beforeEach(() => {
    // Visit the home page before each test
    cy.visit('/');
  });

  it('should have a working header navigation', () => {
    // Check that header navigation links work
    cy.contains('a', 'Início').click();
    cy.url().should('include', '/');
    
    cy.contains('a', 'Depoimentos').click();
    cy.url().should('include', '/depoimentos');
    
    cy.contains('a', 'Preços').click();
    cy.url().should('include', '/precos');
    
    cy.contains('a', 'Suporte').click();
    cy.url().should('include', '/suporte');
  });

  it('should navigate to login page from header', () => {
    // Click on the login button in header
    cy.contains('a', 'Entrar').click();
    
    // Verify navigation to login page
    cy.url().should('include', '/auth/login');
    cy.contains('Bem-vindo de volta!').should('be.visible');
    cy.contains('Portal do Aluno').should('be.visible');
    cy.contains('Portal do Professor').should('be.visible');
    cy.contains('Portal Administrativo').should('be.visible');
  });

  it('should navigate to registration page from header', () => {
    // Click on the register button in header
    cy.contains('a', 'Criar Conta').click();
    
    // Verify navigation to registration page
    cy.url().should('include', '/auth/register');
    cy.contains('Criar uma conta').should('be.visible');
  });

  it('should navigate to registration page from hero section', () => {
    // Click on the "Começar Agora" button in hero section
    cy.contains('a', 'Começar Agora').click();
    
    // Verify navigation to registration page
    cy.url().should('include', '/auth/register');
    cy.contains('Criar uma conta').should('be.visible');
  });

  it('should navigate to pricing page from hero section', () => {
    // Click on the "Ver Preços" button in hero section
    cy.contains('a', 'Ver Preços').click();
    
    // Verify navigation to pricing page
    cy.url().should('include', '/precos');
    cy.contains('Planos e Preços').should('be.visible');
  });

  it('should navigate to student portal from login page', () => {
    // Navigate to login page
    cy.visit('/auth/login');
    
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
  });

  it('should navigate to teacher portal from login page', () => {
    // Navigate to login page
    cy.visit('/auth/login');
    
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
  });

  it('should navigate to admin portal from login page', () => {
    // Navigate to login page
    cy.visit('/auth/login');
    
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
  });

  it('should navigate back to portal selection from login pages', () => {
    // Navigate to admin login page
    cy.visit('/auth/admin-login');
    
    // Click on the back button
    cy.contains('a', 'Voltar para seleção de portal').click();
    
    // Verify navigation back to portal selection page
    cy.url().should('include', '/auth/login');
    cy.contains('Bem-vindo de volta!').should('be.visible');
    
    // Repeat for teacher login page
    cy.visit('/auth/teacher-login');
    cy.contains('a', 'Voltar para seleção de portal').click();
    cy.url().should('include', '/auth/login');
    
    // Repeat for student login page
    cy.visit('/auth/student-login');
    cy.contains('a', 'Voltar para seleção de portal').click();
    cy.url().should('include', '/auth/login');
  });

  it('should navigate to registration page from login pages', () => {
    // Navigate to student login page
    cy.visit('/auth/student-login');
    
    // Click on the register link
    cy.contains('a', 'Criar conta').click();
    
    // Verify navigation to registration page
    cy.url().should('include', '/auth/register');
    cy.contains('Criar uma conta').should('be.visible');
    
    // Repeat for teacher login page
    cy.visit('/auth/teacher-login');
    cy.contains('a', 'Criar conta').click();
    cy.url().should('include', '/auth/register');
    
    // Repeat for admin login page
    cy.visit('/auth/admin-login');
    cy.contains('a', 'Criar conta').click();
    cy.url().should('include', '/auth/register');
  });
});
