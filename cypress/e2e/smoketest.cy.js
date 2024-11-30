describe('Smoke Tests', () => {
  beforeEach(() => {
    window.localStorage.setItem('authToken', 'fake-token-test');
    cy.visit('/');
  });

  it('Charge la page principale avec succès', () => {
    cy.getBySel('header').should('be.visible'); // Vérifie que l'en-tête est visible
    cy.title().should('include', 'EcoBlissBath'); // Vérifie le titre de la page
  });

  it('vérifie la présence des boutons', () => {
    cy.visit('/');
    cy.getBySel('nav-link-home').should('be.visible');
    cy.getBySel('nav-link-products').should('be.visible');
    cy.getBySel('nav-link-reviews').should('be.visible');
    cy.getBySel('nav-link-home-logo').should('be.visible');
    cy.getBySel('nav-link-login').should('be.visible');
    cy.getBySel('nav-link-register').should('be.visible');
  })

  it('Permet la connexion d\'un utilisateur', () => {
    cy.visit('/login');
    cy.getBySel('login-input-username').type('test2@test.fr'); // Saisit l'email
    cy.getBySel('login-input-password').type('testtest'); // Saisit le mot de passe
    cy.getBySel('login-submit').click(); // Clique sur le bouton de connexion
    cy.url().should('include', '/'); // Vérifie la redirection
    cy.window().its('localStorage.authToken').should('exist');
  });


  it('Vérifie la navigation vers une page principale', () => {
    cy.getBySel('nav anav-link-products').click(); // Clique sur le lien vers "À propos"
    cy.url().should('include', '/products'); // Vérifie l'URL
    cy.getBySel('product-name').should('be.visible');
    cy.getBySel('product-picture').should('be.visible');
    cy.getBySel('product-ingredients').should('be.visible');
    cy.getBySel('product-price').should('be.visible');
    cy.getBySel('product-link').should('be.visible');
    });

       
  it('Laissez un avis', () => {
    cy.login();
    cy.getBySel('nav-link-logout').should('be.visible');
    cy.visit('/reviews');
    cy.getBySel('review-input-rating-images img') // Sélectionne les étoiles
      .eq(4) // Cinquième étoile (index 4)
      .click();
    const reviewTitle = 'super produit!';
    const reviewComment = 'Que des produits de qualité, je recommande!';
    cy.getBySel('review-input-title').type(reviewTitle);
    cy.getBySel('review-input-comment').type(reviewComment);
    cy.getBySel('review-submit').click();
    cy.wait(1000)
    cy.wait('@loginRequest').then((interception) => {
      expect(interception.response.statusCode).to.eq(401);
      expect(interception.response.body.message).to.eq('Invalid credentials.');
    });

    cy.contains(reviewTitle).should('be.visible');
    cy.contains(reviewComment).should('be.visible');
    });

  it('page produits', () => {
    cy.intercept('GET', '/api/products').as('getProducts');
    cy.visit('/products');
    cy.wait(1000)
    cy.wait('@getProducts').then((interception) => { //verifier que l'on l'api renvoi bien la liste des produits
      expect(interception.response.statusCode).to.eq(200);
      expect(interception.response.body).to.be.an('array');
    });
    cy.getBySel('product-link').eq(0).click();
    cy.url().should('include', '/products');
    const selectors = [
      'detail-product-img',
      'detail-product-name',
      'detail-product-description',
      'detail-product-skin',
      'detail-product-aromas',
      'detail-product-ingredients',
      'detail-product-form',
      'detail-product-price',
      'detail-product-stock',
      'detail-product-quantity',
      'detail-product-add',
    ];
    selectors.forEach((selectors) => {
      cy.getBySel(selectors).should('be.visible');
    });
  })
});
