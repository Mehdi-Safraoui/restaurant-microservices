# Restaurant Microservices

Plateforme de gestion de restaurant en ligne construite sur une architecture microservices. Elle couvre la gestion des utilisateurs, des plats, des commandes, des livraisons, des événements, des avis/réclamations et d'un blog.

---

## Architecture générale

```
Frontend (React/Vite)
        │
        ▼
  API Gateway :8077   ◄──── Keycloak :8080 (Auth/JWT)
        │
        ├── USER-SERVICE        :8086  (MySQL)
        ├── Commande            :8081  (MySQL + RabbitMQ)
        ├── microserviceLivraison :8060 (H2)
        ├── gestion-plat-service :8085  (H2 + RabbitMQ )
        ├── reviews             :8084  (MySQL)
        ├── EVENEMENT-SERVICE   :8082  (H2)
        └── blog-service        :3002  (MongoDB)

Eureka Server   :8761  (Service Discovery)
Config Server   :8888  (Configuration centralisée)
RabbitMQ        :5672  / UI :15672
```

---

## Services

| Service | Dossier | Port | Stack | Base de données |
|---|---|---|---|---|
| API Gateway | `api-gateway/` | 8077 | Spring Cloud Gateway | — |
| Eureka Server | `eureka-server/` | 8761 | Spring Cloud Netflix | — |
| Config Server | `config-server/` | 8888 | Spring Cloud Config | — |
| User Service | `USER-SERVICE/` | 8086 | Spring Boot + Keycloak | MySQL (`user_db`) |
| Commande | `Commande/` | 8081 | Spring Boot | MySQL (`commande_db`) |
| Livraison | `microserviceLivraison/` | 8060 | Spring Boot | H2 (fichier) |
| Gestion Plat | `gestion-plat-service/` | 8085 | Spring Boot | H2 (fichier) |
| Reviews & Complaints | `reviews/` | 8084 | Spring Boot | MySQL (`review_db`) |
| Evenement | `evenement-service/` | 8082 | Spring Boot | H2 (mémoire) |
| Blog | `blog/` | 3002 | NestJS + Mongoose | MongoDB |
| Frontend | `frontend/` | 5173 | React 18 + Vite + Tailwind | — |

---

## Prérequis

- Docker & Docker Compose
- Java 17+
- Node.js 18+ / Bun
- Keycloak (lancé séparément sur `:8080`)

---

## Lancer le projet

### Tout en Docker (recommandé)

```bash
docker compose -f docker-compose.core.yml up --build
```

Tous les services démarrent dans le réseau `restaurant-net`. L'ordre de démarrage est géré par les `depends_on`.

### En local (dev)

Démarrer dans cet ordre :

1. **Eureka Server**
   ```bash
   cd eureka-server && ./mvnw spring-boot:run
   ```

2. **Config Server**
   ```bash
   cd config-server && ./mvnw spring-boot:run
   ```

3. **Bases de données** — MySQL sur `:3306`, MongoDB sur `:27017`, RabbitMQ sur `:5672`

4. **Microservices** (dans n'importe quel ordre après les étapes 1-3)
   ```bash
   cd USER-SERVICE && ./mvnw spring-boot:run
   cd Commande && ./mvnw spring-boot:run
   cd microserviceLivraison && ./mvnw spring-boot:run
   cd gestion-plat-service && ./mvnw spring-boot:run
   cd reviews && ./mvnw spring-boot:run
   cd evenement-service && ./mvnw spring-boot:run
   cd blog && npm run start:dev   # ou: bun run start:dev
   ```

5. **API Gateway**
   ```bash
   cd api-gateway && ./mvnw spring-boot:run
   ```

6. **Frontend**
   ```bash
   cd frontend && bun install && bun run dev
   ```

---

## Sécurité

L'authentification est gérée par **Keycloak** (realm `Delivery_Board_Realm`).

- Le frontend stocke le JWT dans le `localStorage` et l'envoie via `Authorization: Bearer <token>`
- L'API Gateway valide le JWT sur chaque requête (sauf `/api/auth/**`)
- Le User Service gère l'inscription/connexion et délègue à Keycloak

### Routes publiques (sans token)
```
POST /api/auth/login
POST /api/auth/register
```

Toutes les autres routes nécessitent un JWT valide.

---

## Routes API Gateway

Toutes les requêtes passent par `http://localhost:8077`.

| Préfixe frontend | Service cible | Exemple |
|---|---|---|
| `/api/users/**` | USER-SERVICE | `GET /api/users` |
| `/api/auth/**` | USER-SERVICE | `POST /api/auth/login` |
| `/api/plats/**` | gestion-plat-service | `GET /api/plats` |
| `/api/ingredients/**` | gestion-plat-service | `GET /api/ingredients` |
| `/api/commandes/**` | Commande | `POST /api/commandes` |
| `/api/deliveries/**` | microserviceLivraison | `GET /api/deliveries` |
| `/api/reviews/**` | reviews | `GET /api/reviews` |
| `/api/complaints/**` | reviews | `POST /api/complaints` |
| `/api/events/**` | EVENEMENT-SERVICE | `GET /api/events` |
| `/api/blogs/**` | blog-service | `GET /api/blogs` |

---

## Blog Service — Endpoints

| Méthode | Route | Description |
|---|---|---|
| `GET` | `/api/blogs` | Liste paginée (`?page=1&limit=10`) |
| `GET` | `/api/blogs/simple` | Liste complète sans pagination |
| `GET` | `/api/blogs/:id` | Blog par ID |
| `GET` | `/api/blogs/author/:author` | Blogs d'un auteur |
| `GET` | `/api/blogs/tag/:tag` | Blogs par tag |
| `GET` | `/api/blogs/search/:term` | Recherche dans titre/contenu |
| `POST` | `/api/blogs` | Créer un blog |
| `PUT` | `/api/blogs/:id` | Modifier un blog |
| `PUT` | `/api/blogs/:id/publish` | Publier (`status: PUBLISHED`) |
| `PUT` | `/api/blogs/:id/archive` | Archiver (`status: ARCHIVED`) |
| `DELETE` | `/api/blogs/:id` | Supprimer par ID |
| `DELETE` | `/api/blogs/author/:author` | Supprimer tous les blogs d'un auteur |

Body pour `POST`/`PUT` :
```json
{
  "title": "Titre de l'article",
  "content": "Contenu...",
  "author": "Nom Auteur",
  "tags": ["tag1", "tag2"]
}
```

---

## Variables d'environnement Frontend

Fichier `frontend/.env` :

```env
VITE_API_GATEWAY_URL=http://localhost:8077

VITE_USERS_API_URL=/api/users
VITE_PLATS_API_URL=/api/plats
VITE_COMMANDES_API_URL=/api/commandes
VITE_REVIEWS_API_URL=/api/reviews
VITE_COMPLAINTS_API_URL=/api/complaints
VITE_DELIVERIES_API_URL=/api/deliveries
VITE_EVENTS_API_URL=/api/events
VITE_BLOGS_API_URL=/api/blogs

VITE_KEYCLOAK_URL=http://localhost:8080
VITE_KEYCLOAK_REALM=Delivery_Board_Realm
```

En développement, Vite proxie tous les `/api/*` vers l'API Gateway (`localhost:8077`).

---

## Dashboards utiles

| URL | Description |
|---|---|
| `http://localhost:8761` | Eureka — liste des services enregistrés |
| `http://localhost:8888` | Config Server |
| `http://localhost:15672` | RabbitMQ Management (guest/guest) |
| `http://localhost:8080` | Keycloak Admin Console |
| `http://localhost:5173` | Frontend (dev) |
