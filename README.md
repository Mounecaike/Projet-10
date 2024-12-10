Pour le lancement du projet, vous aurez besoin de Docker, Node.js, NPM, cypress et d'un navigateur (chrome ou firefox sont recommandés)

## Procédure de lancement du projet

1- cloner le repo github ou télécharger le zip *[https://github.com/OpenClassrooms-Student-Center/TesteurLogiciel_Automatisez_des_tests_pour_une_boutique_en_ligne.git]*

2 - Lancer le backend
    - Lancer docker desktop
    - Lancer votre terminal de commande dans le dossier racine du projet
       - Saisir *docker-compose up* et appuyer sur entrée pour lancer la commande.
    
    - Le site est maintenant accessible a l'adresse : http://localhost:8080

    - Pour fermer le docker, saisir *docker-compose down*

3 - Lancer le front-end
    - Ouvrir un terminal de commande
    - Accédez au repertoire du projet
    - tapez les commandes suivantes
        - *npm install* attendez ensuite que l'installation ce termine
        - *npm start* pour le lancer


## Procédure pour lancer les tests

1- installer cypress
    - Installer la librairie Cypress en saisissant la commande suivante dans votre terminal (toujours à la racine du projet) :
        *npm install cypress --save-dev*

2- Installer Faker
    - Ouvrir un terminal de commande
    - Accédez au repertoire du projet
    - Saisir la commande : 
        *npm install @faker-js/faker*

3- ouvrir cypress : 
    - Lancer l'interface de Cypress avec la commande : 
        *npx cypress open*
    - Sélectionner ensuite votre navigateur (chrome par exemple), il installera tout seul les pré requis pour des E2E

## Procédure pour la génération de rapport

Pour exécuter les tests et générer un rapport de résultats, suivez les étapes ci-dessous : 

1- Ouvrir un terminal de commande
    - Assurez vous que Node.js est installé sur votre machine et que cypress est configurer dans le projet, si ce n'est pas le cas vous pouvez telecharger le fichier d'installation ici 
        [https://nodejs.org/en]

2- Accédez au répertoire du projet

3- Saisir la commande suivante
    *npx cypress run*

## Infos login

Identifiant: test2@test.fr
Mot de passe: testtest

## Infos API

Le swagger du projet se trouve à l'adresse suivante: [http://localhost:8081/api/doc]

## Auteur

Lachaume Jordan
Email: rezok42@gmail.com

## Version utilisé

"cypress": "^13.15.2"

"@faker-js/faker": "^9.2.0"
