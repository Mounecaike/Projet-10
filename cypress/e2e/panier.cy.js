import { XssTest } from "../support/commands";
import { faker } from '@faker-js/faker'
let RandomUser;

describe('E2E Test - simule diverse connexion', () => {
    beforeEach(() => {
        window.localStorage.setItem('authToken', 'fake-token-test');
        cy.visit('/');
      });
    it('ajout d\'un produit en rupture de stock', () => {
    cy.login();
    cy.getBySel('nav-link-logout').should('be.visible');
    cy.intercept('GET', '/products/3').as('getProduct');
    cy.visit('/products/3');
    cy.wait('@getProduct').then((interception) => {
        expect(interception.response.statusCode).to.eq(200); // Vérifie le code 200
        expect(interception.response.body.id).to.eq(3); // Vérifie que l'ID du produit est correct
        expect(interception.response.body.name).to.exist;
    });
    cy.getBySel('detail-product-add').click();
    })
    it('ajout d\'un produit au panier', () => {
        cy.login();
        cy.getBySel('nav-link-logout').should('be.visible');
        cy.intercept('GET', '/orders').as('getCart');
        cy.visit('/products/6');
        cy.getBySel('detail-product-add').click();
        cy.visit('/cart');
        cy.wait(1000);
        cy.getBySel('cart-line')
        .find('.product-name') // Utilisation de la classe .product-name
        .find('[data-cy="cart-line-name"]')
        .should('contain.text', 'Extrait de nature');
        cy.wait('@getCart').then((interception) => {
            expect(interception.response.statusCode).to.eq(200); // Vérifie le statut 200
            expect(interception.response.body).to.have.property('products');
            expect(interception.request.headers).to.have.property('authorization');
        });
    });
    it('ajout au panier d\'une quantité superieur au stock', () => {
    cy.login();
    cy.getBySel('nav-link-logout').should('be.visible');
    cy.visit('/products/7');
    cy.getBySel('detail-product-quantity')
    .clear()
    .type('3');
    cy.getBySel('detail-product-add').click();
    cy.wait(1000);
    cy.getBySel('cart-line')
    .find('.product-name') 
    .find('[data-cy="cart-line-name"]')
    .should('contain.text', 'Extrait de nature');
    });
});
describe('E2E Test - gestion des produits dans le panier', () => {
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
    it('supression d\'un produit dans le panier', () => {
        cy.login();
        cy.getBySel('nav-link-logout').should('be.visible');
        cy.visit('/products/7');
        cy.getBySel('detail-product-add').click();
        cy.visit('/cart');
        cy.wait(1000);
        cy.getBySel('cart-line')        
        .find('[data-cy="cart-line-delete"]') // Trouve la corbeille
        .click(); // Clique sur la corbeille
        cy.getBySel('cart-line')
        .find('.product-name') 
        .find('[data-cy="cart-line-name"]')
        cy.contains('cart-line-name', 'Extrait de nature').should('not.exist');
        })
    it('modification de la quantité', () => {
        cy.login();
        cy.getBySel('nav-link-logout').should('be.visible');
        cy.visit('/products/7');
        cy.getBySel('detail-product-quantity')
        .clear()
        .type('3');
        cy.getBySel('detail-product-add').click();
        cy.visit('/cart');
        cy.wait(1000);
        cy.getBySel('cart-line')        
        .find('[data-cy="cart-line-quantity"]') // Trouve la corbeille
        .clear() // Efface la valeur actuelle
        cy.getBySel('cart-line')        
        .find('[data-cy="cart-line-quantity"]') // Trouve la corbeille
        .should('have.value', '1'); // Vérifie que la quantité est bien mise à 1
              })
    it('Validation de commande', () => {
        cy.login();
        cy.getBySel('nav-link-logout').should('be.visible');
        cy.intercept('POST', '/orders').as('createOrder');
        cy.visit('/cart');
        cy.wait(1000);
        cy.getBySel("cart-input-address").type(RandomUser.address.street);
        cy.getBySel("cart-input-zipcode").type('42600');
        cy.getBySel("cart-input-city").type(RandomUser.address.city);
        cy.getBySel('cart-submit').click();
        cy.wait('@createOrder').then((interception) => {
            // Vérifie que la requête a bien été envoyée
            expect(interception.response.statusCode).to.eq(201); // Vérifie le statut 201 Created
            expect(interception.response.body).to.have.property('orderId'); // Vérifie la présence d'un ID de commande
            });
        cy.url().should('include', '/confirmation'); // Vérifie l'URL
    });
});
describe('E2E Test - gestion du formulaire', () => {
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
    it('vérification de la faille XSS', () => {
        cy.login();
        cy.getBySel('nav-link-logout').should('be.visible');
        cy.visit('/products/6');
        cy.getBySel('detail-product-add').click();
        cy.visit('/cart');
        cy.wait(1000);
        cy.getBySel('cart-form').within(() => {
            cy.getBySel('cart-input-lastname').clear().type(XssTest);
            cy.getBySel('cart-input-firstname').clear().type(XssTest);
            cy.getBySel('cart-input-address').clear().type(XssTest);
            cy.getBySel('cart-input-zipcode').clear().type('42600');
            cy.getBySel('cart-input-city').clear().type(XssTest);
            cy.getBySel('cart-submit').click();
          });
                  cy.wait(1000)
        cy.on('window:alert', (txt) => {
            expect(txt).to.not.include('XSS');
          });
      
          cy.getBySel('error-message').should('not.contain', '<script>');
    });

});
