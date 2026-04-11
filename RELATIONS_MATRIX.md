# Matrice des relations microservices

| Source | Target | Protocole | Endpoint cible | Statut |
|---|---|---|---|---|
| `Commande` | `gestion-plat-service` | OpenFeign | `GET /plats`, `GET /plats/{id}` | OK |
| `gestion-plat-service` | `Commande` | RabbitMQ | Queue `platQueue` (producer -> consumer) | OK |
| `Commande` | `USER-SERVICE` | OpenFeign | `GET /api/users/{id}` | OK |
| `Commande` | `reviews` | OpenFeign | `POST /api/complaints` | OK |
| `Commande` | `microserviceLivraison` | OpenFeign | `POST /api/deliveries` | OK |
| `reviews` | `USER-SERVICE` | OpenFeign | `GET /api/users/{id}` | OK |
| `reviews` | `Commande` | OpenFeign | `GET /commandes/{id}` | OK |
| `USER-SERVICE` | `reviews` | OpenFeign | `GET /api/complaints/user/{userId}` | AJOUTE |
| `blog` | `reviews` | HTTP (`HttpModule`) | `GET /api/complaints/user/{userId}` | AJOUTE |

## Decision RabbitMQ plats <-> user

Relation **non obligatoire** actuellement.

- Le flux metier existant est `gestion-plat-service -> Commande` pour la synchronisation plats.
- `USER-SERVICE` est consomme en lecture via OpenFeign (consultation utilisateur).
- Ajouter RabbitMQ `plats <-> user` sans cas metier explicite augmenterait le couplage et la complexite operationnelle.

## Endpoints REST ajoutes dans ce lot

- `reviews`: `GET /api/complaints/user/{userId}`
- `USER-SERVICE`: `GET /api/users/{id}/complaints`
- `blog`: `GET /blogs/reviews/user/{userId}`

