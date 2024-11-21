describe('Smoke Tests', () => {
  beforeEach(() => {
    window.localStorage.setItem('authToken', 'fake-token-test');
    cy.visit('/');
  });

  it('Charge la page principale avec succès', () => {
    cy.get('header').should('be.visible'); // Vérifie que l'en-tête est visible
    cy.title().should('include', 'EcoBlissBath'); // Vérifie le titre de la page
  });

  it('vérifie la présence des boutons', () => {
    cy.visit('/');
    cy.get('[data-cy="nav-link-home"]').should('be.visible');
    cy.get('[data-cy="nav-link-products"]').should('be.visible');
    cy.get('[data-cy="nav-link-reviews"]').should('be.visible');
    cy.get('[data-cy="nav-link-home-logo"]').should('be.visible');
    cy.get('[data-cy="nav-link-login"]').should('be.visible');
    cy.get('[data-cy="nav-link-register"]').should('be.visible');
  })

  it('Permet la connexion d\'un utilisateur', () => {
    cy.visit('/login');
    cy.get('[data-cy="login-input-username"]').type('test2@test.fr'); // Saisit l'email
    cy.get('[data-cy="login-input-password"]').type('testtest'); // Saisit le mot de passe
    cy.get('[data-cy="login-submit"]').click(); // Clique sur le bouton de connexion
    cy.url().should('include', '/'); // Vérifie la redirection
    cy.window().its('localStorage.authToken').should('exist');
  });


  it('Vérifie la navigation vers une page principale', () => {
    cy.get('nav a[data-cy="nav-link-products"]').click(); // Clique sur le lien vers "À propos"
    cy.url().should('include', '/products'); // Vérifie l'URL
    cy.get('[data-cy="product-name"]').should('be.visible');
    cy.get('[data-cy="product-picture"]').should('be.visible');
    cy.get('[data-cy="product-ingredients"]').should('be.visible');
    cy.get('[data-cy="product-price"]').should('be.visible');
    cy.get('[data-cy="product-link"]').should('be.visible');
    });

       
  it('Laissez un avis', () => {
    cy.login();
    cy.get('[data-cy="nav-link-logout"]').should('be.visible');
    cy.visit('/reviews');
    cy.get('[data-cy="review-input-rating-images"] img') // Sélectionne les étoiles
      .eq(4) // Cinquième étoile (index 4)
      .click();
    const reviewTitle = 'super produit!';
    const reviewComment = 'Que des produits de qualité, je recommande!';
    cy.get('[data-cy="review-input-title"]').type(reviewTitle);
    cy.get('[data-cy="review-input-comment"]').type(reviewComment);
    cy.get('[data-cy="review-submit"]').click();
    cy.contains(reviewTitle).should('be.visible');
    cy.contains(reviewComment).should('be.visible');
    });

  it('page produits', () => {
    cy.visit('/products');
    cy.get('[data-cy="product-link"]').eq(0).click();
    cy.url().should('include', '/products');
    const selectors = [
      '[data-cy="detail-product-img"]',
      '[data-cy="detail-product-name"]',
      '[data-cy="detail-product-description"]',
      '[data-cy="detail-product-skin"]',
      '[data-cy="detail-product-aromas"]',
      '[data-cy="detail-product-ingredients"]',
      '[data-cy="detail-product-form"]',
      '[data-cy="detail-product-price"]',
      '[data-cy="detail-product-stock"]',
      '[data-cy="detail-product-quantity"]',
      '[data-cy="detail-product-add"]',
    ];
    selectors.forEach((selectors) => {
      cy.get(selectors).should('be.visible');
    });
  })
});
