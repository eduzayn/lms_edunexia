describe('Authentication Edge Cases', () => {
  beforeEach(() => {
    cy.visit('/auth/login');
  });

  it('should handle invalid login credentials', () => {
    // Navigate to student login
    cy.contains('Portal do Aluno').parent().contains('Acessar Portal').click();
    cy.url().should('include', '/student/login');
    
    // Try invalid email format
    cy.get('input#email').type('invalid-email');
    cy.get('input#password').type('password123');
    cy.get('button[type="submit"]').click();
    
    // HTML5 validation should prevent submission
    cy.url().should('include', '/student/login');
    
    // Try valid email but wrong password
    cy.get('input#email').clear().type('student@example.com');
    cy.get('input#password').type('wrongpassword');
    cy.get('button[type="submit"]').click();
    
    // Should show error message
    cy.contains('Credenciais inválidas').should('be.visible');
    
    // Try non-existent user
    cy.get('input#email').clear().type('nonexistent@example.com');
    cy.get('input#password').clear().type('password123');
    cy.get('button[type="submit"]').click();
    
    // Should show error message
    cy.contains('Usuário não encontrado').should('be.visible');
  });

  it('should handle password reset flow', () => {
    // Navigate to student login
    cy.contains('Portal do Aluno').parent().contains('Acessar Portal').click();
    cy.url().should('include', '/student/login');
    
    // Click on forgot password link
    cy.contains('Esqueceu sua senha?').click();
    cy.url().should('include', '/auth/reset-password');
    
    // Submit empty form
    cy.get('button[type="submit"]').click();
    
    // HTML5 validation should prevent submission
    cy.url().should('include', '/auth/reset-password');
    
    // Try invalid email format
    cy.get('input#email').type('invalid-email');
    cy.get('button[type="submit"]').click();
    
    // HTML5 validation should prevent submission
    cy.url().should('include', '/auth/reset-password');
    
    // Try valid email
    cy.get('input#email').clear().type('student@example.com');
    cy.get('button[type="submit"]').click();
    
    // Should show success message
    cy.contains('E-mail enviado com sucesso').should('be.visible');
    
    // Try to simulate reset password with token
    cy.visit('/auth/reset-password?token=valid-token');
    cy.contains('Nova Senha').should('be.visible');
    
    // Try password mismatch
    cy.get('input#password').type('newpassword123');
    cy.get('input#confirm-password').type('differentpassword');
    cy.get('button[type="submit"]').click();
    
    // Should show error message
    cy.contains('As senhas não coincidem').should('be.visible');
    
    // Try valid password reset
    cy.get('input#password').clear().type('newpassword123');
    cy.get('input#confirm-password').clear().type('newpassword123');
    cy.get('button[type="submit"]').click();
    
    // Should show success message and redirect to login
    cy.contains('Senha redefinida com sucesso').should('be.visible');
    cy.url().should('include', '/auth/login');
  });

  it('should handle registration validation', () => {
    // Navigate to registration page
    cy.contains('Criar Conta').click();
    cy.url().should('include', '/auth/register');
    
    // Submit empty form
    cy.get('button[type="submit"]').click();
    
    // HTML5 validation should prevent submission
    cy.url().should('include', '/auth/register');
    
    // Try weak password
    cy.get('input#name').type('Novo Usuário');
    cy.get('input#email').type('novo@example.com');
    cy.get('input#password').type('123');
    cy.get('input#confirm-password').type('123');
    cy.get('input#terms').check();
    cy.get('button[type="submit"]').click();
    
    // Should show error message about password strength
    cy.contains('Senha muito fraca').should('be.visible');
    
    // Try email that's already in use
    cy.get('input#email').clear().type('student@example.com');
    cy.get('input#password').clear().type('Password123!');
    cy.get('input#confirm-password').clear().type('Password123!');
    cy.get('button[type="submit"]').click();
    
    // Should show error message
    cy.contains('E-mail já cadastrado').should('be.visible');
    
    // Try valid registration
    cy.get('input#email').clear().type('novo@example.com');
    cy.get('button[type="submit"]').click();
    
    // Should show success message and redirect to dashboard
    cy.contains('Conta criada com sucesso').should('be.visible');
    cy.url().should('include', '/student/dashboard');
  });
});
