// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

Cypress.Commands.add('login', () => {
    cy.visit('/login');
    cy.get('#username').type('test2@test.fr');
    cy.get('#password').type('testtest');
    cy.get('[data-cy="login-submit"]').click();
    cy.url().should('include', '/');
  });
  Cypress.Commands.add('getAuthToken', () => {
    return 'fake-token-test'; // Remplace par une commande réelle si nécessaire
  });
  
  Cypress.Commands.add('apiRequest', (method, url, body = null) => {
    const token = Cypress.env('authToken'); // Récupère le token stocké
  
    return cy.request({
      method,
      url: `${Cypress.env('apiBaseUrl')}${url}`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body,
      failOnStatusCode: false, // Permet d'inspecter les réponses même en cas d'erreur
    });
  });
  
