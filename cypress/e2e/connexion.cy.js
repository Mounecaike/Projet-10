import { XssTest } from "../support/commands";
import { faker } from '@faker-js/faker'

describe('E2E Test - simule diverse connexion', () => {
  let RandomUser;
  beforeEach(() => {
    const password = faker.internet.password();
      RandomUser = {
        email: faker.internet.email(),
        firstName: faker.person.firstName(), 
        lastName: faker.person.lastName(),  
        password: password,
        confirmPassword: password,
        address: {
          street: faker.location.streetAddress(), 
          city: faker.location.city(),           
          zipCode: faker.location.zipCode(),    
          country: faker.location.country(),     
        },
      };
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
        cy.wait(1000)
        cy.wait('@loginRequest').then((interception) => {
          // Vérifier que le statut HTTP est bien 401
          expect(interception.response.statusCode).to.eq(401);
          // Optionnel : Vérifier que le message d'erreur dans la réponse est correct (si l'API le renvoie)
          expect(interception.response.body.message).to.eq('Invalid credentials.');
        });
      });
    it('connexion avec une erreur de mot de passe', () => {
        cy.visit('/login');
        cy.getBySel('login-input-username').type('test2@test.fr'); // Saisit l'email
        cy.getBySel('login-input-password').type('testtet'); // Saisit le mot de passe
        cy.getBySel('login-submit').click(); 
        cy.intercept('POST', '/login').as('loginRequest');
        cy.getBySel('login-submit').click(); 
        cy.wait(1000)
        cy.wait('@loginRequest').then((interception) => {
          expect(interception.response.statusCode).to.eq(401);
          expect(interception.response.body.message).to.eq('Invalid credentials.');
        });
    });
    it('essais inscription', () => {
        cy.visit('/register');
        cy.getBySel('register-input-lastname').type(RandomUser.lastName); // Saisit le nom
        cy.getBySel('register-input-firstname').type(RandomUser.firstName); // Saisit le prenom
        cy.getBySel('register-input-email').type(RandomUser.email); // Saisit l'email
        cy.getBySel('register-input-password').type(RandomUser.password); // Saisit le mot de passe
        cy.getBySel('register-input-password-confirm').type(RandomUser.confirmPassword); // Saisit la confirmation du mot de passe
        cy.getBySel('register-submit').click();
        cy.url().should('include', '/'); // Vérifie la redirection
        cy.getBySel('nav-link-logout').should('be.visible');
    });


});
describe('Test de faille XSS', () => {
  let RandomUser;
  beforeEach(() => {
    const password = faker.internet.password();
      RandomUser = {
        email: faker.internet.email(),
        firstName: faker.person.firstName(), 
        lastName: faker.person.lastName(),  
        password: password,
        confirmPassword: password,
        address: {
          street: faker.location.streetAddress(), 
          city: faker.location.city(),           
          zipCode: faker.location.zipCode(),    
          country: faker.location.country(),     
        },
      };
      window.localStorage.setItem('authToken', 'fake-token-test');
      cy.visit('/');
    });

    it('Test de faille sur le formulaire d\'inscription', () => {
      cy.visit('/register');
  
      // Injection XSS dans chaque champ
      cy.getBySel('register-input-lastname').type(XssTest);
      cy.getBySel('register-input-firstname').type(XssTest);
      cy.getBySel('register-input-email').type(RandomUser.email);
      cy.getBySel('register-input-password').type(XssTest);
      cy.getBySel('register-input-password-confirm').type(XssTest);
      cy.getBySel('register-submit').click();
      cy.wait(1000)
      cy.get('body').should('not.contain', '<script>');

      cy.on('window:alert', (txt) => {
        expect(txt).to.not.include('<script>');  // Vérifie qu'il n'y a pas de script dans l'alerte
      });
        
    });
    it('Test de faille sur le login', () => {
        cy.visit('/login');
    
        // Injection XSS dans chaque champ
        cy.getBySel('login-input-username').type(RandomUser.email); 
        cy.getBySel('login-input-password').type(XssTest); 
        cy.getBySel('login-submit').click(); 
        cy.wait(1000)
        cy.get('body').should('not.contain', '<script>');
  
        cy.on('window:alert', (txt) => {
          expect(txt).to.not.include('<script>');  // Vérifie qu'il n'y a pas de script dans l'alerte
        });
      
      });
  
    it('Test de faille sur le mot de passe', () => {
        cy.visit('/login');

        // Injection XSS dans chaque champ
        cy.getBySel('login-input-username').type('test2@test.fr'); 
        cy.getBySel('login-input-password').type(XssTest); 
        cy.getBySel('login-submit').click(); 
        cy.wait(1000)
        cy.get('body').should('not.contain', '<script>');
        cy.on('window:alert', (txt) => {
          expect(txt).to.not.include('<script>'); 
        });
    })
    it('Test de faille sur les avis', () => {
        cy.login();
        cy.getBySel('nav-link-logout').should('be.visible');
        cy.visit('/reviews');
        cy.getBySel('review-form')
        .find('[data-cy="review-input-rating-images"] img') // Sélectionne les étoiles
        .eq(4) // Cinquième étoile (index 4)
        .click();
        cy.getBySel('review-input-title').type(XssTest);
        cy.getBySel('review-input-comment').type(XssTest);
        cy.getBySel('review-submit').click();
        cy.wait(1000)
        cy.get('body').should('not.contain', '<script>');
        cy.on('window:alert', (txt) => {
          expect(txt).to.not.include('<script>'); 
        });
    });
    
  });

