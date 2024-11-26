import { XssTest } from "../support/commands";

describe('E2E Test - simule diverse connexion', () => {
    beforeEach(() => {
      window.localStorage.setItem('authToken', 'fake-token-test');
      cy.visit('/');
    });
    it('connexion basique', () => {
        cy.visit('/login');
        cy.getBySel ('login-input-username').type('test2@test.fr'); // Saisit l'email
        cy.getBySel('login-input-password').type('testtest'); // Saisit le mot de passe
        cy.getBySel('login-submit').click(); // Clique sur le bouton de connexion
        cy.url().should('include', '/'); // Vérifie la redirection
        cy.window().its('localStorage.authToken').should('exist');
    });
    it('connexion avec une erreur mail', () => {
        cy.visit('/login');
        cy.getBySel('login-input-username').type('test2@orange.fr'); // Saisit l'email
        cy.getBySel('login-input-password').type('testtest'); // Saisit le mot de passe
        cy.getBySel('login-submit').click(); 
        cy.intercept('POST', '/login').as('loginRequest');
        cy.getBySel('login-submit').click(); 
        cy.wait('@loginRequest'); 
        cy.getBySel('[data-cy="login-error"]').should('be.visible');
    });
    it('connexion avec une erreur de mot de passe', () => {
        cy.visit('/login');
        cy.getBySel('login-input-username').type('test2@test.fr'); // Saisit l'email
        cy.getBySel('login-input-password').type('testtet'); // Saisit le mot de passe
        cy.getBySel('login-submit').click(); 
        cy.intercept('POST', '/login').as('loginRequest');
        cy.getBySel('login-submit').click(); 
        cy.wait('@loginRequest'); 
        cy.getBySel('login-error').should('be.visible');
    });
    it('essais inscription', () => {
        cy.visit('/register');
        cy.getBySel('register-input-lastname').type('dupont'); // Saisit le nom
        cy.getBySel('register-input-firstname').type('michel'); // Saisit le prenom
        cy.getBySel('register-input-email').type('dupont.michel@gmail.com'); // Saisit l'email
        cy.getBySel('register-input-password').type('michel42'); // Saisit le mot de passe
        cy.getBySel('register-input-password-confirm').type('michel42'); // Saisit la confirmation du mot de passe
        cy.getBySel('register-submit').click();
        cy.url().should('include', '/'); // Vérifie la redirection
        cy.getBySel('nav-link-logout').should('be.visible');
    });


});
describe('Test de faille XSS', () => {
    it('Test de faille sur le formulaire d\'inscription', () => {
      cy.visit('/register');
  
      // Injection XSS dans chaque champ
      cy.getBySel('register-input-lastname').type(XssTest);
      cy.getBySel('register-input-firstname').type(XssTest);
      cy.getBySel('register-input-email').type(XssTest);
      cy.getBySel('register-input-passeword').type(XssTest);
      cy.getBySel('register-input-passeword-confirm').type(XssTest);
  
      cy.getBySel('register-submit').click();
  
      cy.on('window:alert', (txt) => {
        expect(txt).to.not.include('XSS');
      });
  
      cy.getBySel('error-message').should('not.contain', '<script>');
    });
    it('Test de faille sur le login', () => {
        cy.visit('/login');
    
        // Injection XSS dans chaque champ
        cy.getBySel('login-input-username').type(XssTest); 
        cy.getBySel('login-input-password').type(XssTest); 
        cy.getBySel('login-submit').click(); 
    
        cy.on('window:alert', (txt) => {
          expect(txt).to.not.include('XSS');
        });
    
        cy.getBySel('error-message').should('not.contain', '<script>');
      });
  
    it('Test de faille sur le login', () => {
        cy.visit('/login');

        // Injection XSS dans chaque champ
        cy.get('[data-cy="login-input-username"]').type(XssTest); 
        cy.get('[data-cy="login-input-password"]').type(XssTest); 
        cy.get('[data-cy="login-submit"]').click(); 

        cy.on('window:alert', (txt) => {
            expect(txt).to.not.include('XSS');
        });

        cy.get('[data-cy="error-message"]').should('not.contain', '<script>');
    });
    it('Test de faille sur les avis', () => {
        cy.login();
        cy.get('[data-cy="nav-link-logout"]').should('be.visible');
        cy.visit('/reviews');
        cy.get('[data-cy="review-input-rating-images"] img') // Sélectionne les étoiles
            .eq(4) // Cinquième étoile (index 4)
            .click();
        cy.get('[data-cy="review-input-title"]').type(XssTest);
        cy.get('[data-cy="review-input-comment"]').type(XssTest);
        cy.get('[data-cy="review-submit"]').click();
        cy.on('window:alert', (txt) => {
            expect(txt).to.not.include('XSS');
          });
      
          cy.get('[data-cy="error-message"]').should('not.contain', '<script>');  
    });
    
  });

