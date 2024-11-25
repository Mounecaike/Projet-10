describe('E2E Test - Ajouter un produit au panier', () => {
  beforeEach(() => {
    // Configuration initiale
    window.localStorage.setItem('authToken', 'fake-token-test');
    cy.visit('/');
  });

  it('Ajoute un produit via l\'UI et vérifie l\'appel API', () => {

    // Interception de l'API avec vérification
    cy.intercept('PUT', 'http://localhost:8081/orders/add').as('addProductAPI');
    cy.login(); // Commande personnalisée pour se connecter
       
    // Vérifications préliminaires
    cy.url().should('not.include', '/login'); // Vérifie qu'on n'est pas sur la page de login
    cy.window().its('localStorage.authToken').should('exist'); // Vérifie que le token existe

    // Navigation vers la page produit et ajout au panier
    cy.visit('/products');
    cy.get('[data-cy="product-link"]').eq(0).click();
    cy.get('[data-cy="detail-product-add"]').click();

    // Petit délai pour attendre la requête
    cy.wait(1000);

    // Intercepte et vérifie la requête API
    cy.wait('@addProductAPI').then((interception) => {
      // Ajout de logs pour vérifier ce qui est intercepté
      cy.log('Interception : ', interception);

      // Vérifications de l'API
      expect(interception.response.statusCode).to.eq(200); // Vérifie le code réponse
      expect(interception.request.body).to.have.property('product'); // Vérifie le body de la requête
      expect(interception.request.body.product).to.eq(3); // Vérifie l'ID du produit
      expect(interception.request.body.quantity).to.eq(1); // Vérifie la quantité
    });

    // Vérification du panier
    cy.visit('/cart');
    cy.get('[data-cy="cart-line-quantity"]').should('have.length', 3); // Vérifie qu'il y a un seul élément
  });
});
