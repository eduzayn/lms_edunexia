describe('Registration Page', () => {
  beforeEach(() => {
    cy.visit('/auth/register');
  });

  it('should display registration form', () => {
    cy.contains('h1', 'Criar Conta').should('be.visible');
    cy.get('input[name="name"]').should('be.visible');
    cy.get('input[name="email"]').should('be.visible');
    cy.get('input[name="password"]').should('be.visible');
    cy.get('input[name="confirmPassword"]').should('be.visible');
    cy.get('button[type="submit"]').should('be.visible');
  });

  it('should validate form inputs', () => {
    // Submit empty form
    cy.get('button[type="submit"]').click();
    cy.contains('Nome é obrigatório').should('be.visible');
    cy.contains('E-mail é obrigatório').should('be.visible');
    cy.contains('Senha é obrigatória').should('be.visible');

    // Invalid email
    cy.get('input[name="name"]').type('Test User');
    cy.get('input[name="email"]').type('invalid-email');
    cy.get('input[name="password"]').type('password123');
    cy.get('input[name="confirmPassword"]').type('password123');
    cy.get('button[type="submit"]').click();
    cy.contains('E-mail inválido').should('be.visible');

    // Password mismatch
    cy.get('input[name="email"]').clear().type('test@example.com');
    cy.get('input[name="password"]').clear().type('password123');
    cy.get('input[name="confirmPassword"]').clear().type('different');
    cy.get('button[type="submit"]').click();
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
