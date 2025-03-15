describe('Portal Access Navigation', () => {
  beforeEach(() => {
    // Visit the login page before each test
    cy.visit('/auth/login');
  });

  it('should display all three portal options', () => {
    // Check for portal links on the login page
    cy.get('a[href*="student/login"]').should('exist');
    cy.get('a[href*="teacher/login"]').should('exist');
    cy.get('a[href*="admin/login"]').should('exist');
  });

  it('should navigate to student login page', () => {
    // Click on the student portal access button
    cy.get('a[href*="student/login"]').first().click();
    
    // Verify we're on the student login page
    cy.url().should('include', '/student/login');
    cy.get('h1').should('contain', 'Portal do Aluno');
    
    // Verify the login form is displayed
    cy.get('form').within(() => {
      cy.get('input[type="email"]').should('exist');
      cy.get('input[type="password"]').should('exist');
      cy.get('button[type="submit"]').should('contain', 'Entrar');
    });
    
    // Verify the back link exists
    cy.contains('Voltar para seleção de portal').should('have.attr', 'href', '/auth/login');
  });

  it('should navigate to teacher login page', () => {
    // Click on the teacher portal access button
    cy.get('a[href*="teacher/login"]').first().click();
    
    // Verify we're on the teacher login page
    cy.url().should('include', '/teacher/login');
    cy.get('h1').should('contain', 'Portal do Professor');
    
    // Verify the login form is displayed
    cy.get('form').within(() => {
      cy.get('input[type="email"]').should('exist');
      cy.get('input[type="password"]').should('exist');
      cy.get('button[type="submit"]').should('contain', 'Entrar');
    });
    
    // Verify the back link exists
    cy.contains('Voltar para seleção de portal').should('have.attr', 'href', '/auth/login');
  });

  it('should navigate to admin login page', () => {
    // Click on the admin portal access button
    cy.get('a[href*="admin/login"]').first().click();
    
    // Verify we're on the admin login page
    cy.url().should('include', '/admin/login');
    cy.get('h1').should('contain', 'Portal Administrativo');
    
    // Verify the login form is displayed
    cy.get('form').within(() => {
      cy.get('input[type="email"]').should('exist');
      cy.get('input[type="password"]').should('exist');
      cy.get('button[type="submit"]').should('contain', 'Entrar');
    });
    
    // Verify the back link exists
    cy.contains('Voltar para seleção de portal').should('have.attr', 'href', '/auth/login');
  });

  it('should navigate back to portal selection from login pages', () => {
    // Navigate to student login page
    cy.get('a[href*="student/login"]').first().click();
    
    // Click on the back link
    cy.contains('Voltar para seleção de portal').click();
    
    // Verify we're back on the portal selection page
    cy.url().should('include', '/auth/login');
  });

  it('should bypass authentication in development mode', () => {
    // This test assumes NEXT_PUBLIC_BYPASS_AUTH=true is set in the environment
    
    // Navigate to student login page
    cy.get('a[href*="student/login"]').first().click();
    
    // Fill in the form with any credentials
    cy.get('input[type="email"]').type('test@example.com');
    cy.get('input[type="password"]').type('password123');
    
    // Submit the form
    cy.get('button[type="submit"]').click();
    
    // Verify we're redirected to the dashboard
    cy.url().should('include', '/student/dashboard');
    
    // Go back to portal selection
    cy.visit('/auth/login');
    
    // Test teacher login bypass
    cy.get('a[href*="teacher/login"]').first().click();
    
    cy.get('input[type="email"]').type('teacher@example.com');
    cy.get('input[type="password"]').type('password123');
    cy.get('button[type="submit"]').click();
    
    // Verify we're redirected to the teacher dashboard
    cy.url().should('include', '/teacher/dashboard');
    
    // Go back to portal selection
    cy.visit('/auth/login');
    
    // Test admin login bypass
    cy.get('a[href*="admin/login"]').first().click();
    
    cy.get('input[type="email"]').type('admin@example.com');
    cy.get('input[type="password"]').type('password123');
    cy.get('button[type="submit"]').click();
    
    // Verify we're redirected to the admin dashboard
    cy.url().should('include', '/admin/dashboard');
  });
});
