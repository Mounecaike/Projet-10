describe('E2E Test - Ajouter un produit au panier', () => {
  beforeEach(() => {
    // Configuration initiale
    window.localStorage.setItem('authToken', 'fake-token-test');
    cy.visit('/');
  });

  it('ajout d\'un produit au panier', () => {
    cy.login();
    cy.getBySel('nav-link-logout').should('be.visible');
    cy.intercept('GET', '/orders').as('getCart'); // vérifie la récuperation du panier en cours
    cy.visit('/products/8');
    cy.getBySel('detail-product-add').click();
    cy.visit('/cart');
    cy.wait(1000);
    cy.wait('@getCart').then((interception) => {
      expect(interception.response.statusCode).to.eq(200); // Vérifie le statut 200
    });
  });

  it('récuperer les avis', () => {
    cy.login();
    cy.getBySel('nav-link-logout').should('be.visible');
    cy.intercept('GET', '/reviews').as('Getreviews');
    cy.visit('/reviews');
    cy.wait(1000)
    cy.wait('@Getreviews').then((interception) => {
      expect(interception.response.statusCode).to.eq(200);
    });
  });

    it('page produits', () => {
    cy.intercept('GET', '/products').as('getProducts');
    cy.visit('/products');
    cy.wait(1000)
    cy.wait('@getProducts').then((interception) => { //verifier que l'on l'api renvoi bien la liste des produits
      expect(interception.response.statusCode).to.eq(200);
      expect(interception.response.body).to.be.an('array');
    });
  })

});

