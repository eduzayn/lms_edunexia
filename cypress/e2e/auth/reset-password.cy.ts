describe('Reset Password Page', () => {
  beforeEach(() => {
    cy.visit('/auth/reset-password');
  });

  it('should display reset password form', () => {
    cy.contains('h1', 'Recuperar Senha').should('be.visible');
    cy.get('input#email').should('be.visible');
    cy.get('button[type="submit"]').should('be.visible');
  });

  it('should validate email input', () => {
    // Submit empty form
    cy.get('button[type="submit"]').click();
    
    // HTML5 validation should prevent submission and highlight required fields
    // We can check if we're still on the same page
    cy.url().should('include', '/auth/reset-password');
  });

  it('should show success message on valid submission', () => {
    cy.get('input#email').type('test@example.com');
    cy.get('button[type="submit"]').click();
    
    // Check for success message
    cy.contains('E-mail enviado com sucesso!').should('be.visible');
    cy.contains('Verifique sua caixa de entrada').should('be.visible');
  });

  it('should navigate back to login page', () => {
    cy.contains('Voltar para login').click();
    cy.url().should('include', '/auth/login');
  });
});
