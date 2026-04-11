# Microservices Methods, Relations, and Postman Checklist

## 1) Methods and relations by microservice

### Commande

**REST methods**

- `POST /commandes`
- `GET /commandes`
- `GET /commandes/{id}`
- `PUT /commandes/{id}/{status}`
- `DELETE /commandes/{id}`
- `GET /commandes/plats`
- `GET /commandes/plats/{id}`
- `GET /commandes/users/{userId}`
- `POST /commandes/deliveries`
- `POST /commandes/complaints`

**Relations**

- `Commande -> gestion-plat-service` via OpenFeign (`GET /plats`, `GET /plats/{id}`)
- `Commande -> USER-SERVICE` via OpenFeign (`GET /api/users/{id}`)
- `Commande -> microserviceLivraison` via OpenFeign (`POST /api/deliveries`)
- `Commande -> reviews` via OpenFeign (`POST /api/complaints`)
- `gestion-plat-service -> Commande` via RabbitMQ (`platQueue`)

### gestion-plat-service

**REST methods (consumed externally)**

- `GET /plats`
- `GET /plats/{id}`

**Relations**

- Feign inbound from `Commande`
- RabbitMQ producer to `Commande`

### reviews

**REST methods**

- `POST /api/complaints`
- `GET /api/complaints`
- `GET /api/complaints/user/{userId}`
- `PUT /api/complaints/resolve/{id}`

**Relations**

- `reviews -> USER-SERVICE` via OpenFeign (`GET /api/users/{id}`)
- `reviews -> Commande` via OpenFeign (`GET /commandes/{id}`)
- inbound Feign from `Commande`
- inbound Feign from `USER-SERVICE`
- inbound HTTP from `blog`

### USER-SERVICE

**REST methods**

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/users`
- `GET /api/users/{id}`
- `GET /api/users/{id}/complaints`
- `PUT /api/users/{id}`
- `DELETE /api/users/{id}`

**Relations**

- `USER-SERVICE -> reviews` via OpenFeign (`GET /api/complaints/user/{userId}`)
- inbound Feign from `Commande`
- inbound Feign from `reviews`

### microserviceLivraison

**REST methods**

- `POST /api/deliveries`
- `PUT /api/deliveries/{id}/assign/{deliveryPersonId}`
- `PUT /api/deliveries/{id}/status`
- `GET /api/deliveries`
- `GET /api/deliveries/welcome`
- `POST /api/deliveries/user/add`
- `DELETE /api/deliveries/admin/{id}`

**Relations**

- inbound Feign from `Commande`
- `microserviceLivraison -> Commande` via OpenFeign (`GET /commandes/{id}`)

### blog (NestJS)

**REST methods**

- `GET /blogs/simple`
- `GET /blogs`
- `GET /blogs/search/:term`
- `GET /blogs/author/:author`
- `GET /blogs/tag/:tag`
- `GET /blogs/:id`
- `POST /blogs`
- `PUT /blogs/:id/publish`
- `PUT /blogs/:id/archive`
- `PUT /blogs/:id`
- `DELETE /blogs/author/:author`
- `DELETE /blogs/:id`
- `GET /blogs/reviews/user/:userId`

**Relations**

- `blog -> reviews` via HttpModule (`GET /api/complaints/user/{userId}`)

---

## 2) Postman test order (one by one)

Use these base URLs:

- `USER-SERVICE`: `http://localhost:8086`
- `reviews`: `http://localhost:8084`
- `blog`: `http://localhost:3002`

### Step 1 - Create a user (USER-SERVICE)

- Method: `POST`
- URL: `http://localhost:8086/api/auth/register`
- Body (JSON):

```json
{
  "nom": "Postman",
  "prenom": "Tester",
  "email": "postman.tester@example.com",
  "password": "Pass1234",
  "role": "CLIENT"
}
```

Expected:

- `200 OK`
- Response contains `email` and `role`

### Step 2 - Get user list and copy one `id`

- Method: `GET`
- URL: `http://localhost:8086/api/users`

Expected:

- `200 OK`
- Array of users with `id`

### Step 3 - Test reviews endpoint by user id

- Method: `GET`
- URL: `http://localhost:8084/api/complaints/user/{{userId}}`

Expected:

- `200 OK`
- Array (can be empty)

### Step 4 - Test USER-SERVICE Feign to reviews

- Method: `GET`
- URL: `http://localhost:8086/api/users/{{userId}}/complaints`

Expected:

- `200 OK`
- Same complaint array shape as step 3

### Step 5 - Test blog HTTP relation to reviews

- Method: `GET`
- URL: `http://localhost:3002/blogs/reviews/user/{{userId}}`

Expected:

- `200 OK`
- Array from reviews

### Step 6 - Create a complaint in reviews

- Method: `POST`
- URL: `http://localhost:8084/api/complaints`
- Body (JSON):

```json
{
  "userId": 1,
  "orderId": 1,
  "message": "Delivery delay"
}
```

Expected:

- `200 OK`
- Complaint created with `status` and `createdAt`

### Step 7 - Resolve a complaint in reviews

- Method: `PUT`
- URL: `http://localhost:8084/api/complaints/resolve/{{complaintId}}`

Expected:

- `200 OK`
- Complaint status becomes `RESOLVED`

### Step 8 - Create a commande

- Method: `POST`
- URL: `http://localhost:8081/commandes`
- Body (JSON):

```json
{
  "description": "Commande test",
  "commandeStatus": "EN_ATTENTE"
}
```

Expected:

- `200 OK`
- Commande created with an `id`

### Step 9 - Get commandes list

- Method: `GET`
- URL: `http://localhost:8081/commandes`

Expected:

- `200 OK`
- Array of commandes

### Step 10 - Get commande by id

- Method: `GET`
- URL: `http://localhost:8081/commandes/{{commandeId}}`

Expected:

- `200 OK`
- One commande object

### Step 11 - Test Commande -> USER-SERVICE relation

- Method: `GET`
- URL: `http://localhost:8081/commandes/users/{{userId}}`

Expected:

- `200 OK`
- User object returned from `USER-SERVICE`

### Step 12 - Test Commande -> gestion-plat-service relation

- Method: `GET`
- URL: `http://localhost:8081/commandes/plats`

Expected:

- `200 OK`
- Array of plats returned from `gestion-plat-service`

Repeat with:

- Method: `GET`
- URL: `http://localhost:8081/commandes/plats/1`

Expected:

- `200 OK`
- One plat object

### Step 13 - Test Commande -> microserviceLivraison relation

- Method: `POST`
- URL: `http://localhost:8081/commandes/deliveries`
- Body (JSON):

```json
{
  "orderId": 1,
  "deliveryAddress": "Tunis",
  "estimatedTime": 30
}
```

Expected:

- `200 OK`
- Delivery created in `microserviceLivraison`

### Step 14 - Test microserviceLivraison direct endpoint

- Method: `POST`
- URL: `http://localhost:8060/api/deliveries`
- Body (JSON):

```json
{
  "orderId": 1,
  "deliveryAddress": "Ariana",
  "estimatedTime": 25
}
```

Expected:

- `200 OK`
- Delivery created after command validation

### Step 15 - Test microserviceLivraison status update

- Method: `PUT`
- URL: `http://localhost:8060/api/deliveries/{{deliveryId}}/status?status=DELIVERED`

Expected:

- `200 OK`
- Status becomes `DELIVERED`

### Step 16 - Test blog -> reviews again

- Method: `GET`
- URL: `http://localhost:3002/blogs/reviews/user/{{userId}}`

Expected:

- `200 OK`
- Array from `reviews`

---

## 3) Optional relation integrity checks

### reviews create complaint (depends on existing user and order)

- Method: `POST`
- URL: `http://localhost:8084/api/complaints`
- Body (JSON):

```json
{
  "userId": 1,
  "orderId": 1,
  "message": "Delivery delay"
}
```

Expected:

- `200 OK` if user and order exist
- `4xx/5xx` if dependencies not found

### RabbitMQ relation check (plat -> commande)

- Trigger a plat event from `gestion-plat-service` flow (producer)
- Check `Commande` logs for consumer reception (`platQueue`)

### Commande status update

- Method: `PUT`
- URL: `http://localhost:8081/commandes/{{commandeId}}/{{status}}`

Example:

- `http://localhost:8081/commandes/1/EN_PREPARATION`

Expected:

- `200 OK`
- Commande status updated

---

## 4) Troubleshooting quick notes

- `404` on `/api/complaints/user/{userId}`: ensure updated `reviews` app is running.
- `blog` startup fails with axios error: run `npm install` in `blog`.
- Feign call errors: verify Eureka is running and service names match (`USER-SERVICE`, `reviews`, `Commande`).



