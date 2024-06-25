![banner.jpg](art/banner.jpg)

# Information

Métacafé est un projet scolaire dont l'objectif est de réaliser un projet avec Vue.js et Typescript, en utilisant
Express.js. Le projet est réalisé par [Sofiane Lasri](https://sofianelasri.fr).

Le projet est accessible à l'adresse [metacafe.sl-projects.com](https://metacafe.sl-projects.com) (ne mettez pas de 
vrais mots de passe, le site n'est pas sécurisé).

# Fonctionnalités

Voici la liste des fonctionnalité que possède ce projet :

- Pouvoir envoyer des messages textuels à ses contacts
- C'est tout :D

# Installation

Copiez l'env d'exemple et lancez la commande `docker compose up -d` pour créer le container docker.

**Note:** En raison des règles CORS, il est **fortement** recommandé d'accéder au site via l'adresse
`http://localhost:5173`. La liste des adresses autorisées est disponible dans le fichier environnement. La
variable `CORS_ALLOWED_ORIGINS` peut contenir plusieurs adresses, séparées par des virgules. La
variable `VITE_BACKEND_URL` doit contenir l'adresse du backend, sans le slash final. Pas de liste.

**Note 2:** À la date du 8 décembre 2023, l'utilisation des images au format AVIF rend le site incompatible avec le
navigateur Microsoft Edge. Veuillez vour référer au site [caniuse.com](https://caniuse.com/avif) pour plus
d'informations sur l'état de son support.