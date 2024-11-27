Cypress.Commands.add('login', () => {
  cy.visit('/login');
  cy.getBySel('login-input-username').type('test2@test.fr');
  cy.getBySel('login-input-password').type('testtest');
  cy.getBySel('login-submit').click();
  cy.url().should('include', '/');
});
Cypress.Commands.add("getBySel", (selector, ...args) => {
  return cy.get(`[data-cy="${selector}"]`, ...args); // Ajout de guillemets
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


