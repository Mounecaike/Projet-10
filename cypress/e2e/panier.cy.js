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
        cy.visit('/products/3');
        cy.get('[data-cy="detail-product-add"]').click();
        cy.visit('/cart');
        cy.get('[data-cy="cart-line-quantity"]').should('have.length', 50); // Vérifie que le panier contient un élément  
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
        cy.get('[data-cy="cart-line-quantity"]').should('have.length', 3); // Vérifie que le panier contient un élément  
    })

});