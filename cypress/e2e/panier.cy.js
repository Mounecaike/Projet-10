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
    cy.visit('/products/3');
    cy.getBySel('detail-product-add').click();
    cy.wait(1000);
    cy.visit('/cart');
    cy.getBySel('cart-line')
    .find('.product-name') 
    .find('[data-cy="cart-line-name"]')
    .should('contain.text', 'Sentiments printaniers');
  });

  it('ajout d\'un produit au panier sans connexion', () => {
    cy.visit('/products/6');
    cy.getBySel('detail-product-add').click();
    cy.url().should('include', '/login'); // Vérifie la redirection vers la page
  });

  it('ajout d\'un produit au panier', () => {
    cy.login();
    cy.getBySel('nav-link-logout').should('be.visible');
    cy.visit('/products/8');
    cy.getBySel('detail-product-add').click();
    cy.visit('/cart');
    cy.wait(1000);
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
  })
  it('modification de la quantité', () => {
    cy.login();
    cy.getBySel('nav-link-logout').should('be.visible');
    cy.visit('/products/7');
    cy.getBySel('detail-product-quantity')
    .clear()
    .type('3');
    cy.getBySel('detail-product-add').click();
    cy.wait(1000);
    cy.visit('/cart');
    cy.getBySel('cart-line')        
    .find('[data-cy="cart-line-quantity"]') 
    .clear() 
    cy.getBySel('cart-line')        
    .find('[data-cy="cart-line-quantity"]') 
    .should('have.value', '1'); // Vérifie que la quantité est bien mise à 1
  })
  it('Validation de commande', () => {
    cy.login();
    cy.getBySel('nav-link-logout').should('be.visible');
    cy.wait(1000);
    cy.getBySel('nav-link-cart').click();
    cy.getBySel("cart-input-address").type(RandomUser.address.street);
    cy.getBySel("cart-input-zipcode").type('42600');
    cy.getBySel("cart-input-city").type(RandomUser.address.city);
    cy.getBySel('cart-submit').click();
    cy.url().should('include', '/confirmation'); // Vérifie l'URL
  });
});
