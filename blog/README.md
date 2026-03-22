# Blog Microservice - NestJS

Simple blog service built with **NestJS**.

## 🚀 Quick Start

```bash
npm install
npm run start:dev
```

Visit: `http://localhost:3002`

## 📚 API Endpoints

```
GET    /blogs              Get all (with pagination: ?page=1&limit=10)
GET    /blogs/simple       Get all (no pagination)
GET    /blogs/:id          Get one blog
GET    /blogs/search/:term Search blogs
GET    /blogs/author/:author Get by author
GET    /blogs/tag/:tag    Get by tag

POST   /blogs              Create
PUT    /blogs/:id          Update
PUT    /blogs/:id/publish  Publish
PUT    /blogs/:id/archive  Archive
DELETE /blogs/:id          Delete
DELETE /blogs/author/:author Delete all by author
```

## 📁 Structure

```
src/
├── controllers/blog.controller.ts
├── services/blog.service.ts
├── modules/blog.module.ts
├── app.module.ts
├── app.controller.ts
├── main.ts
```

## 📝 Environment

```env
PORT=3002
NODE_ENV=development
EUREKA_HOST=localhost
EUREKA_PORT=8761
EUREKA_APP_NAME=blog-service
SERVICE_HOST=192.168.100.19 # optional override
SERVICE_IP=192.168.100.19   # optional override
```

Set `SERVICE_HOST` / `SERVICE_IP` only if the default hostname/IP should be overridden, and make sure the Eureka server (Spring Netflix stack) is running on the configured host/port before starting this service.

## 🛠️ Scripts

```bash
npm run start:dev       # Dev mode
npm run build          # Compile
npm run start:prod     # Production
npm run lint           # Lint
```

**Version**: 1.0.0 | NestJS
