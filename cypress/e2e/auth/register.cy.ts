describe('Registration Page', () => {
  beforeEach(() => {
    cy.visit('/auth/register');
  });

  it('should display registration form', () => {
    cy.contains('h1', 'Criar Conta').should('be.visible');
    cy.get('input#name').should('be.visible');
    cy.get('input#email').should('be.visible');
    cy.get('input#password').should('be.visible');
    cy.get('input#confirm-password').should('be.visible');
    cy.get('button[type="submit"]').should('be.visible');
  });

  it('should validate form inputs', () => {
    // Submit empty form
    cy.get('button[type="submit"]').click();
    
    // HTML5 validation should prevent submission and highlight required fields
    // We can check if we're still on the same page
    cy.url().should('include', '/auth/register');
    
    // Test password mismatch error
    cy.get('input#name').type('Test User');
    cy.get('input#email').type('test@example.com');
    cy.get('input#password').type('password123');
    cy.get('input#confirm-password').type('different');
    cy.get('input#terms').check();
    cy.get('button[type="submit"]').click();
    
    // The component should show the password mismatch error
    cy.contains('As senhas não coincidem').should('be.visible');
  });

  it('should navigate to login page', () => {
    cy.contains('Já tem uma conta?').should('be.visible');
    cy.contains('Entrar').click();
    cy.url().should('include', '/auth/login');
  });

  it('should have links to terms and privacy', () => {
    cy.contains('Termos de Serviço').should('have.attr', 'href', '/terms');
    cy.contains('Política de Privacidade').should('have.attr', 'href', '/privacy');
  });
});
