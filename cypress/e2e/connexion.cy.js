describe('E2E Test - simule diverse connexion', () => {
    beforeEach(() => {
      window.localStorage.setItem('authToken', 'fake-token-test');
      cy.visit('/');
    });
    it('connexion basique', () => {
        cy.visit('/login');
        cy.get('[data-cy="login-input-username"]').type('test2@test.fr'); // Saisit l'email
        cy.get('[data-cy="login-input-password"]').type('testtest'); // Saisit le mot de passe
        cy.get('[data-cy="login-submit"]').click(); // Clique sur le bouton de connexion
        cy.url().should('include', '/'); // Vérifie la redirection
        cy.window().its('localStorage.authToken').should('exist');
    });
    it('connexion avec une erreur mail', () => {
        cy.visit('/login');
        cy.get('[data-cy="login-input-username"]').type('test2@orange.fr'); // Saisit l'email
        cy.get('[data-cy="login-input-password"]').type('testtest'); // Saisit le mot de passe
        cy.get('[data-cy="login-submit"]').click(); 
        cy.intercept('POST', '/login').as('loginRequest');
        cy.get('[data-cy="login-submit"]').click(); 
        cy.wait('@loginRequest'); 
        cy.get('[data-cy="login-error"]').should('be.visible');
    });
    it('connexion avec une erreur de mot de passe', () => {
        cy.visit('/login');
        cy.get('[data-cy="login-input-username"]').type('test2@test.fr'); // Saisit l'email
        cy.get('[data-cy="login-input-password"]').type('testtet'); // Saisit le mot de passe
        cy.get('[data-cy="login-submit"]').click(); 
        cy.intercept('POST', '/login').as('loginRequest');
        cy.get('[data-cy="login-submit"]').click(); 
        cy.wait('@loginRequest'); 
        cy.get('[data-cy="login-error"]').should('be.visible');
    });
    it('essais inscription', () => {
        cy.visit('/register');
        cy.get('[data-cy="register-input-lastname"]').type('dupont'); // Saisit le nom
        cy.get('[data-cy="register-input-firstname"]').type('michel'); // Saisit le prenom
        cy.get('[data-cy="register-input-email"]').type('dupont.michel@gmail.com'); // Saisit l'email
        cy.get('[data-cy="register-input-password"]').type('michel42'); // Saisit le mot de passe
        cy.get('[data-cy="register-input-password-confirm"]').type('michel42'); // Saisit la confirmation du mot de passe
        cy.get('[data-cy="register-submit"]').click();
        cy.url().should('include', '/'); // Vérifie la redirection
        cy.get('[data-cy="nav-link-logout"]').should('be.visible');
    });


});
describe('Test de faille XSS', () => {
    it('Test de faille sur le formulaire d\'inscription', () => {
      cy.visit('/register');
  
      // Injection XSS dans chaque champ
      cy.get('[data-cy="register-input-lastname"]').type('<script>alert("XSS")</script>');
      cy.get('[data-cy="register-input-firstname"]').type('<script>alert("XSS")</script>');
      cy.get('[data-cy="register-input-email"]').type('<script>alert("XSS")</script>');
      cy.get('[data-cy="register-input-passeword"]').type('<script>alert("XSS")</script>');
      cy.get('[data-cy="register-input-passeword-confirm"]').type('<script>alert("XSS")</script>');
  
      cy.get('[data-cy="register-submit"]').click();
  
      cy.on('window:alert', (txt) => {
        expect(txt).to.not.include('XSS');
      });
  
      cy.get('[data-cy="error-message"]').should('not.contain', '<script>');
    });
    it('Test de faille sur le login', () => {
        cy.visit('/login');
    
        // Injection XSS dans chaque champ
        cy.get('[data-cy="login-input-username"]').type('<script>alert("XSS")</script>'); 
        cy.get('[data-cy="login-input-password"]').type('<script>alert("XSS")</script>'); 
        cy.get('[data-cy="login-submit"]').click(); 
    
        cy.on('window:alert', (txt) => {
          expect(txt).to.not.include('XSS');
        });
    
        cy.get('[data-cy="error-message"]').should('not.contain', '<script>');
      });
  
    it('Test de faille sur le login', () => {
        cy.visit('/login');

        // Injection XSS dans chaque champ
        cy.get('[data-cy="login-input-username"]').type('<script>alert("XSS")</script>'); 
        cy.get('[data-cy="login-input-password"]').type('<script>alert("XSS")</script>'); 
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
        cy.get('[data-cy="review-input-title"]').type('<script>alert("XSS")</script>');
        cy.get('[data-cy="review-input-comment"]').type('<script>alert("XSS")</script>');
        cy.get('[data-cy="review-submit"]').click();
        cy.on('window:alert', (txt) => {
            expect(txt).to.not.include('XSS');
          });
      
          cy.get('[data-cy="error-message"]').should('not.contain', '<script>');  
    });
    
  });

