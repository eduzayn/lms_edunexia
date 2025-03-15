describe('Login Page', () => {
  beforeEach(() => {
    cy.visit('/auth/login');
  });

  it('should display login portal options', () => {
    cy.contains('h1', 'Acesse sua Conta').should('be.visible');
    cy.contains('Portal do Aluno').should('be.visible');
    cy.contains('Portal do Professor').should('be.visible');
    cy.contains('Portal Administrativo').should('be.visible');
  });

  it('should navigate to student login page', () => {
    cy.contains('Portal do Aluno').parent().contains('Acessar Portal').click();
    cy.url().should('include', '/student/login');
    cy.contains('Login do Aluno').should('be.visible');
  });

  it('should navigate to teacher login page', () => {
    cy.contains('Portal do Professor').parent().contains('Acessar Portal').click();
    cy.url().should('include', '/teacher/login');
    cy.contains('Login do Professor').should('be.visible');
  });

  it('should navigate to admin login page', () => {
    cy.contains('Portal Administrativo').parent().contains('Acessar Portal').click();
    cy.url().should('include', '/admin/login');
    cy.contains('Login Administrativo').should('be.visible');
  });

  it('should navigate to registration page', () => {
    cy.contains('Criar Conta').click();
    cy.url().should('include', '/auth/register');
    cy.contains('Criar Conta').should('be.visible');
  });
});
