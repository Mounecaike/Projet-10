describe('E2E Test - Ajouter un produit au panier', () => {
  beforeEach(() => {
    window.localStorage.setItem('authToken', 'fake-token-test');
    cy.visit('/');
  });

  it('Ajoute un produit via l\'UI et vérifie l\'appel API', () => {
    cy.login(); // Commande personnalisée pour se connecter

    cy.intercept('PUT', '/orders/add').as('addProductAPI'); // Interception de l'API
    cy.url().should('not.include', '/login'); // Vérifie que tu n'es plus sur la page login
    cy.window().its('localStorage.authToken').should('exist'); // Vérifie que le token est bien présent

    cy.visit('/products');
    cy.get('[data-cy="product-link"]').eq(0).click();
    cy.get('[data-cy="detail-product-add"]').click();

    // Intercepte et vérifie la requête API
    cy.wait(1000);
    cy.wait('@addProductAPI').then((interception) => {
      expect(interception.response.statusCode).to.eq(200); // Statut de succès attendu

      // Vérification des propriétés dans la requête
      expect(interception.request.body).to.have.property('product');
      expect(interception.request.body.product).to.eq(3); // Vérifie l'ID du produit
      expect(interception.request.body.quantity).to.eq(1); // Quantité par défaut
    });

    cy.visit('/cart');
    cy.get('[data-cy="cart-line-quantity"]').should('have.length', 1); // Vérifie que le panier contient un élément
  });
});
