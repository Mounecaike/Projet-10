describe('Smoke Tests', () => {
  beforeEach(() => {
    window.localStorage.setItem('authToken', 'fake-token-test');
    cy.visit('/');
  });

  it('Charge la page principale avec succès', () => {
    cy.getBySel('nav-link-home-logo').should('be.visible'); // Vérifie que l'en-tête est visible
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


  it('Vérifie le contenu de la page produits', () => {
    cy.getBySel('nav-link-products').click(); // Clique sur le lien vers "À propos"
    cy.url().should('include', '/products'); // Vérifie l'URL
    cy.getBySel('product-name').should('be.visible');
    cy.getBySel('product-picture').should('be.visible');
    cy.getBySel('product-ingredients').should('be.visible');
    cy.getBySel('product-price').should('be.visible');
    cy.getBySel('product-link').should('be.visible');
    });

  it('page produits', () => {
    cy.visit('/products');
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
