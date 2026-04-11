# Testing Guide

## Prerequis

- `eureka-server` actif
- `reviews` actif sur `8084`
- `USER-SERVICE` actif sur `8086`
- `blog` actif sur `3002`

## Scenarios Postman (equivalents executes en curl)

### 1) reviews -> endpoint par utilisateur

- Method: `GET`
- URL: `http://localhost:8084/api/complaints/user/5`
- Expected: `200 OK` + liste JSON (vide ou non)

### 2) USER-SERVICE -> reviews via Feign

- Method: `GET`
- URL: `http://localhost:8086/api/users/5/complaints`
- Expected: `200 OK` + meme structure que reviews

### 3) blog -> reviews via HttpModule

- Method: `GET`
- URL: `http://localhost:3002/blogs/reviews/user/5`
- Expected: `200 OK` + liste JSON renvoyee par reviews

## Commandes curl utilisees

```zsh
curl -sS "http://localhost:8084/api/complaints/user/5"
curl -sS "http://localhost:8086/api/users/5/complaints"
curl -sS "http://localhost:3002/blogs/reviews/user/5"
```

## Resultat de la session

- Les 3 routes repondent `200` avec `[]` dans l'etat actuel des donnees.

