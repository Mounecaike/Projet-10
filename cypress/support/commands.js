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
// Constante XSS
export const XssTest = '<script>alert("XSS")</script>';

  
