import { faker } from '@faker-js/faker'

describe('Appel API', () => {
  let RandomUser;
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

    // LOGIN //

  it('connexion basique', () => {
    cy.visit('/login');
    cy.getBySel ('login-input-username').type('test2@test.fr'); // Saisit l'email
    cy.getBySel('login-input-password').type('testtest'); // Saisit le mot de passe
    cy.intercept('POST', '/login').as('loginRequest');
    cy.getBySel('login-submit').click(); // Clique sur le bouton de connexion
    cy.wait('@loginRequest').then((interception) => {
      expect(interception.response.statusCode).to.eq(200);
    });
  });

    // COMMANDES //

  it('récupère le panier', () => {
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
        expect(interception.response.statusCode).to.eq(200); // Vérifie le statut 200
    });
  });


  it('ajout d\'un produit au panier', () => {
    cy.login();
    cy.getBySel('nav-link-logout').should('be.visible');
    cy.intercept('PUT', '/orders/add').as('PutOrders');
    cy.visit('/products/8');
    cy.getBySel('detail-product-add').click();
    cy.wait(1000);
    cy.getBySel('nav-link-cart').click();
    cy.wait(1000);
    cy.wait('@PutOrders').then((interception) => {
      expect(interception.response.statusCode).to.eq(200); // Vérifie le code 200
    });
  });

  it('supression d\'un produit dans le panier', () => {
    cy.login();
    cy.getBySel('nav-link-logout').should('be.visible');
    cy.intercept('DELETE', '/orders/*/delete').as('Deleted');
    cy.visit('/products/7');
    cy.getBySel('detail-product-add').click();
    cy.wait(1000);
    cy.getBySel('nav-link-cart').click();
    cy.wait(1000);
    cy.getBySel('cart-line')        
    .find('[data-cy="cart-line-delete"]') // Trouve la corbeille
    .click(); // Clique sur la corbeille
    cy.wait('@Deleted').then((interception) => {
      expect(interception.response.statusCode).to.eq(200); // Vérifie le statut 200
    });
  })

  it('modification de la quantité', () => {
    cy.login();
    cy.getBySel('nav-link-logout').should('be.visible');
    cy.intercept('PUT', '/orders/*/change-quantity').as('quantity'); 
    cy.visit('/products/7');
    cy.getBySel('detail-product-quantity')
    .clear()
    .type('3');
    cy.getBySel('detail-product-add').click();
    cy.visit('/cart');
    cy.wait(1000);
    cy.getBySel('cart-line')        
    .find('[data-cy="cart-line-quantity"]') 
    .clear() 
    cy.getBySel('cart-line')        
    .find('[data-cy="cart-line-quantity"]') 
    .should('have.value', '1'); // Vérifie que la quantité est bien mise à 1
    cy.wait('@quantity').then((interception) => {
      expect(interception.response.statusCode).to.eq(200); // Vérifie le statut 200
    });
  })

  // PRODUITS //

  it('Récupère la liste des produits', () => {
  cy.intercept('GET', '/products').as('getProducts');
  cy.visit('/products');
  cy.wait(1000)
  cy.wait('@getProducts').then((interception) => { //verifier que l'on l'api renvoi bien la liste des produits
    expect(interception.response.statusCode).to.eq(200);
    expect(interception.response.body).to.be.an('array');
  });
});

  it('recupere la page produit', () => {
    cy.login();
    cy.getBySel('nav-link-logout').should('be.visible');
    cy.intercept('GET', '/products/7').as('getCart');
    cy.visit('/products/7');
    cy.wait('@getCart').then((interception) => {
      expect(interception.response.statusCode).to.eq(200); // Vérifie le statut 200
    });
  });


    // AVIS //

it('Laissez un avis', () => {
  cy.login();
  cy.getBySel('nav-link-logout').should('be.visible');
  cy.visit('/reviews');
  cy.intercept('POST', '/reviews').as('Postreviews');
  cy.getBySel('review-form')
  .find('[data-cy="review-input-rating-images"] img') // Sélectionne les étoiles
  .eq(4) // Cinquième étoile (index 4)
    .click();
  const reviewTitle = 'super produit!';
  const reviewComment = 'Que des produits de qualité, je recommande!';
  cy.getBySel('review-input-title').type(reviewTitle);
  cy.getBySel('review-input-comment').type(reviewComment);
  cy.getBySel('review-submit').click();
  cy.wait(1000)
  cy.wait('@Postreviews').then((interception) => {
    expect(interception.response.statusCode).to.eq(200);
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

    // UTILISATEUR //

  it('essais inscription', () => {
    cy.intercept('POST', '/register').as('registerRequest');
    cy.visit('/register');
    cy.getBySel('register-input-lastname').type(RandomUser.lastName); // Saisit le nom
    cy.getBySel('register-input-firstname').type(RandomUser.firstName); // Saisit le prenom
    cy.getBySel('register-input-email').type(RandomUser.email); // Saisit l'email
    cy.getBySel('register-input-password').type(RandomUser.password); // Saisit le mot de passe
    cy.getBySel('register-input-password-confirm').type(RandomUser.confirmPassword); // Saisit la confirmation du mot de passe
    cy.getBySel('register-submit').click();
    cy.wait(1000)
    cy.wait('@registerRequest').then((interception) => {
      // Vérifie que la requête a bien été envoyée
      expect(interception.response.statusCode).to.eq(200); // Vérifie le statut 200 
    });
    cy.url().should('include', '/'); // Vérifie la redirection
    cy.getBySel('nav-link-logout').should('be.visible');
});
     // TEST FAILLE XSS //
     it('Test de faille sur le formulaire d\'inscription', () => {
      cy.visit('/register');
  
      // Injection XSS dans chaque champ
      cy.getBySel('register-input-lastname').type(XssTest);
      cy.getBySel('register-input-firstname').type(XssTest);
      cy.getBySel('register-input-email').type(RandomUser.email);
      cy.getBySel('register-input-password').type(XssTest);
      cy.getBySel('register-input-password-confirm').type(XssTest);
      cy.getBySel('register-submit').click();
      cy.wait(1000)
      cy.get('body').should('not.contain', '<script>');

      cy.on('window:alert', (txt) => {
        expect(txt).to.not.include('<script>');  // Vérifie qu'il n'y a pas de script dans l'alerte
      });
        
    });
    it('Test de faille sur le login', () => {
        cy.visit('/login');
    
        // Injection XSS dans chaque champ
        cy.getBySel('login-input-username').type(RandomUser.email); 
        cy.getBySel('login-input-password').type(XssTest); 
        cy.getBySel('login-submit').click(); 
        cy.wait(1000)
        cy.get('body').should('not.contain', '<script>');
  
        cy.on('window:alert', (txt) => {
          expect(txt).to.not.include('<script>');  // Vérifie qu'il n'y a pas de script dans l'alerte
        });
      
      });
  
    it('Test de faille sur le mot de passe', () => {
        cy.visit('/login');

        // Injection XSS dans chaque champ
        cy.getBySel('login-input-username').type('test2@test.fr'); 
        cy.getBySel('login-input-password').type(XssTest); 
        cy.getBySel('login-submit').click(); 
        cy.wait(1000)
        cy.get('body').should('not.contain', '<script>');
        cy.on('window:alert', (txt) => {
          expect(txt).to.not.include('<script>'); 
        });
    })
    it('Test de faille sur les avis', () => {
        cy.login();
        cy.getBySel('nav-link-logout').should('be.visible');
        cy.visit('/reviews');
        cy.getBySel('review-form')
        .find('[data-cy="review-input-rating-images"] img') // Sélectionne les étoiles
        .eq(4) // Cinquième étoile (index 4)
        .click();
        cy.getBySel('review-input-title').type(XssTest);
        cy.getBySel('review-input-comment').type(XssTest);
        cy.getBySel('review-submit').click();
        cy.wait(1000)
        cy.get('body').should('not.contain', '<script>');
        cy.on('window:alert', (txt) => {
          expect(txt).to.not.include('<script>'); 
        });
    });
    it('vérification de la faille XSS', () => {
      cy.login();
      cy.getBySel('nav-link-logout').should('be.visible');
      cy.visit('/products/8');
      cy.getBySel('detail-product-add').click();
      cy.wait(1000);
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
      cy.get('body').should('not.contain', '<script>');

      cy.on('window:alert', (txt) => {
        expect(txt).to.not.include('<script>');  // Vérifie qu'il n'y a pas de script dans l'alerte
      });
    });

  });

