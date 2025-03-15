describe('Reset Password Page', () => {
  beforeEach(() => {
    cy.visit('/auth/reset-password');
  });

  it('should display reset password form', () => {
    cy.contains('h1', 'Recuperar Senha').should('be.visible');
    cy.get('input[name="email"]').should('be.visible');
    cy.get('button[type="submit"]').should('be.visible');
  });

  it('should validate email input', () => {
    // Submit empty form
    cy.get('button[type="submit"]').click();
    cy.contains('E-mail é obrigatório').should('be.visible');

    // Invalid email
    cy.get('input[name="email"]').type('invalid-email');
    cy.get('button[type="submit"]').click();
    cy.contains('E-mail inválido').should('be.visible');
  });

  it('should show success message on valid submission', () => {
    cy.get('input[name="email"]').type('test@example.com');
    cy.get('button[type="submit"]').click();
    cy.contains('Link de recuperação enviado').should('be.visible');
    cy.contains('Verifique seu e-mail').should('be.visible');
  });

  it('should navigate back to login page', () => {
    cy.contains('Voltar para Login').click();
    cy.url().should('include', '/auth/login');
  });
});
