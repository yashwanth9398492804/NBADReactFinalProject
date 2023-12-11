/// <reference types="cypress" />

describe('AuthenticationContext', () => {
  // E2E: Test login functionality
  it('should log in a user and update AuthenticationContext state', () => {
    cy.visit('/login');

    cy.get('.login-input[name="username"]').type('testuser');
    cy.get('.login-input[name="password"]').type('testpassword');
    cy.get('.login-button').click();

    cy.request('POST', 'http://localhost:5000/api/auth/login', {
      username: 'testuser',
      password: 'testpassword',
    }).then((response) => {
      const { token } = response.body;
      cy.window().its('localStorage.token').should('eq', token);

      cy.window()
        .its('AuthenticationContext')
        .should('deep.include', { isLoggedIn: true, token: Cypress.any(String) });
    });
  });

  it('should log out a user and update AuthenticationContext state', () => {
    cy.visit('/dashboard');
    cy.get('.logout-button').click();

    cy.window().its('localStorage.token').should('be.null');
    cy.window()
      .its('AuthenticationContext')
      .should('deep.include', { isLoggedIn: false, token: null });
  });

  // Visual Regression: Test for matching the AuthContext state snapshot
  it('should match the AuthenticationContext state snapshot', () => {
    cy.visit('/dashboard');

    cy.eyesOpen({
      appName: 'financeapplication',
      testName: 'AuthenticationContext State Snapshot',
    });

    cy.eyesCheckWindow('AuthenticationContext State');

    cy.eyesClose();
  });
});
