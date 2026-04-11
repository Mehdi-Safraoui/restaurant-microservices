# Evenement Service Workshop Setup

Cette branche complète les deux ateliers demandés autour de `evenement-service` :

- un `config-server` Spring Cloud Config en mode `native`
- une sécurisation Keycloak-compatible via Spring Security OAuth2 Resource Server

## Ordre de démarrage

1. Lancer `eureka-server` sur `http://localhost:8761`
2. Lancer `config-server` sur `http://localhost:8888`
3. Lancer Keycloak sur `http://localhost:8080`
4. Lancer `evenement-service` sur `http://localhost:8082`

## Configuration centralisée

Le serveur de configuration charge le fichier centralisé suivant :

- `config-server/src/main/resources/config/EVENEMENT-SERVICE.properties`

La propriété de démonstration de l'atelier est exposée via :

- `GET /evenements/config/message`

Après modification du fichier centralisé, rafraîchir le service avec :

```bash
curl -X POST http://localhost:8082/actuator/refresh
```

## Keycloak

Créer dans Keycloak :

- un realm `restaurant-realm`
- un client `evenement-service`
- un rôle `USER`
- un rôle `ADMIN`
- un utilisateur avec le rôle `USER`
- un utilisateur avec le rôle `ADMIN`

Le service vérifie les JWT via :

- `${keycloak.server-url}/realms/${keycloak.realm}/protocol/openid-connect/certs`

## Règles d'accès

- `GET /evenements/**` : utilisateur authentifié
- `POST /evenements` : rôle `USER`
- `PUT /evenements/{id}` : rôle `ADMIN`
- `DELETE /evenements/{id}` : rôle `ADMIN`
- `POST /actuator/refresh` : rôle `ADMIN`

## Test rapide

Exemple de récupération de token depuis Keycloak :

```bash
curl -X POST "http://localhost:8080/realms/restaurant-realm/protocol/openid-connect/token" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "grant_type=password" \
  -d "client_id=evenement-service" \
  -d "username=event-user" \
  -d "password=event-user-password"
```

Puis utiliser le token :

```bash
curl http://localhost:8082/evenements \
  -H "Authorization: Bearer <access_token>"
```
