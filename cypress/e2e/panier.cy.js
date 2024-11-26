import { XssTest } from "../support/commands";

describe('E2E Test - Ajouter un produit au panier', () => {
    beforeEach(() => {
      window.localStorage.setItem('authToken', 'fake-token-test');
      cy.visit('/');
    });
    it('ajout d\'un produit en rupture de stock', () => {
        cy.login();
        cy.get('[data-cy="nav-link-logout"]').should('be.visible');
        cy.visit('/products/3');
        cy.get('[data-cy="detail-product-add"]').click();
    })
    it('ajout d\'un produit au panier', () => {
        cy.login();
        cy.get('[data-cy="nav-link-logout"]').should('be.visible');
        cy.visit('/products/6');
        cy.get('[data-cy="detail-product-add"]').click();
        cy.visit('/cart');
        cy.wait(1000);
        cy.get('[data-cy="cart-line-name"]').should('contain.text', 'Dans la forêt');
             })
    it('ajout au panier d\'une quantité superieur au stock', () => {
        cy.login();
        cy.get('[data-cy="nav-link-logout"]').should('be.visible');
        cy.visit('/products/7');
        cy.get('[data-cy="detail-product-quantity"]')
        .clear()
        .type('3');
        cy.get('[data-cy="detail-product-add"]').click();
        cy.visit('/cart');
        cy.get('[data-cy="cart-line-name"]').should('contain.text', 'Extrait de nature');
    })
});
describe('E2E Test - gestion des produits dans le panier', () => {
    beforeEach(() => {
      window.localStorage.setItem('authToken', 'fake-token-test');
      cy.visit('/');
    });
    it('supression d\'un produit dans le panier', () => {
        cy.login();
        cy.get('[data-cy="nav-link-logout"]').should('be.visible');
        cy.visit('/products/7');
        cy.get('[data-cy="detail-product-add"]').click();
        cy.visit('/cart');
        cy.wait(1000);
        cy.contains('[data-cy="cart-line-name"]', 'Extrait de nature') // Trouve le produit par nom
        .parents('[data-cy="cart-line"]') // Remonte à l'élément parent
        .find('[data-cy="cart-line-delete"]') // Trouve la corbeille
        .click(); // Clique sur la corbeille
        cy.contains('[data-cy="cart-line-name"]', 'Extrait de nature').should('not.exist');
        })
    it('modification de la quantité', () => {
        cy.login();
        cy.get('[data-cy="nav-link-logout"]').should('be.visible');
        cy.visit('/products/7');
        cy.get('[data-cy="detail-product-quantity"]')
        .clear()
        .type('3');
        cy.get('[data-cy="detail-product-add"]').click();
        cy.visit('/cart');
        cy.wait(1000);
        cy.contains('[data-cy="cart-line-name"]', 'Extrait de nature') // Trouve le produit par nom
        .parents('[data-cy="cart-line"]') // Remonte à l'élément parent
        .find('[data-cy="cart-line-quantity"]')
        .clear()
        cy.contains('[data-cy="cart-line-name"]', 'Extrait de nature')
        .parents('[data-cy="cart-line"]')
        .find('[data-cy="cart-line-quantity"]')
        .should('have.value', '1');
        })
    it('Validation de commande', () => {
        cy.login();
        cy.get('[data-cy="nav-link-logout"]').should('be.visible');
        cy.visit('/cart');
        cy.wait(1000);
        cy.get('[data-cy="cart-input-address"]').type('10 rue du test');
        cy.get('[data-cy="cart-input-zipcode"]').type('01100');
        cy.get('[data-cy="cart-input-city"]').type('testland');
        cy.get('[data-cy="cart-submit"]').click();
        cy.url().should('include', '/confirmation'); // Vérifie l'URL
    });
});
describe('E2E Test - gestion du formulaire', () => {
    beforeEach(() => {
      window.localStorage.setItem('authToken', 'fake-token-test');
      cy.visit('/');
    });
    it('vérification de la faille XSS', () => {
        cy.login();
        cy.get('[data-cy="nav-link-logout"]').should('be.visible');
        cy.visit('/cart');
        cy.wait(1000);
        cy.get('[data-cy="cart-input-lastname"]')
        .clear()
        .type('<script>alert("XSS")</script>');
        cy.get('[data-cy="cart-input-firstname"]')
        .clear()
        .type('<script>alert("XSS")</script>');
        cy.get('[data-cy="cart-input-address"]').type('<script>alert("XSS")</script>');
        cy.get('[data-cy="cart-input-zipcode"]').type('42600');
        cy.get('[data-cy="cart-input-city"]').type('<script>alert("XSS")</script>');
        cy.get('[data-cy="cart-submit"]').click();
        cy.on('window:alert', (txt) => {
            expect(txt).to.not.include('XSS');
          });
      
          cy.get('[data-cy="error-message"]').should('not.contain', '<script>');
    });

});
