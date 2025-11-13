# SmartCut Builder v1.0 – PHASE 0 Implementation Plan

## Overview

**Phase 0: Foundation & Project Setup**  
**Duration:** 1-2 weeks (Sprints 1-2)  
**Goal:** Establish production-ready development environment with all necessary tooling, infrastructure, and foundational code structure.

---

## Phase 0 Objectives

✅ **Project Infrastructure**

- Repository structure and organization
- Version control setup (Git + GitHub)
- Development environment configuration
- CI/CD pipeline foundation

✅ **Development Tooling**

- Code quality tools (ESLint, Prettier)
- Testing framework setup
- Docker containerization
- Database configuration

✅ **Core Architecture**

- Backend API skeleton (Express + TypeScript)
- Frontend application scaffold (Vue 3 + Vite + TypeScript)
- Database models and schemas (MongoDB + Mongoose)
- Authentication foundation

✅ **Documentation & Standards**

- Coding standards enforcement
- API documentation setup
- Development workflow documentation

---

## Task Checklist

### Week 1: Infrastructure & Backend Foundation

#### Day 1-2: Repository & Project Structure

- [x] Create GitHub repository with branch protection
- [x] Set up `.gitignore`, `README.md`, LICENSE
- [x] Create project directory structure (backend/, frontend/, docs/)
- [x] Initialize Git workflow (main, develop branches)
- [x] Set up GitHub issue/PR templates

#### Day 2-3: Backend Setup

- [x] Initialize Node.js backend with TypeScript
- [x] Install dependencies (Express, Mongoose, JWT, bcrypt, etc.)
- [x] Configure TypeScript (`tsconfig.json`)
- [x] Set up ESLint + Prettier
- [x] Configure Jest for testing
- [x] Create `.env.example` with all required variables
- [x] Set up Express server (`src/index.ts`)
- [x] Configure database connection (`src/config/database.ts`)
- [x] Create middleware (error handler, rate limiter, auth)
- [x] Set up package.json scripts (dev, build, test, lint)

#### Day 3-4: Database Models

- [ ] Create User model with workshop profile
- [ ] Create Project model (basic fields from schema)
- [ ] Create Template model skeleton
- [ ] Add indexes for performance
- [ ] Write model validation tests

#### Day 4-5: Authentication System

- [ ] Create auth controller (register, login, refresh)
- [ ] Implement JWT token generation/validation
- [ ] Create auth middleware
- [ ] Set up password hashing with bcrypt
- [ ] Create auth routes
- [ ] Write auth integration tests

### Week 2: Frontend Foundation & Integration

#### Day 6-7: Frontend Setup

- [ ] Initialize Vue 3 + Vite + TypeScript project
- [ ] Install dependencies (Vue Router, Pinia, Axios, etc.)
- [ ] Configure Vite (`vite.config.ts`)
- [ ] Configure TypeScript (`tsconfig.json`)
- [ ] Set up ESLint + Prettier for Vue
- [ ] Create `.env.example`
- [ ] Set up project folder structure
- [ ] Configure Vitest for testing

#### Day 7-8: Frontend Core

- [ ] Set up Vue Router with basic routes
- [ ] Configure Pinia stores (auth, project, ui)
- [ ] Create API service with Axios interceptors
- [ ] Create basic layout components
- [ ] Create authentication views (Login, Register)
- [ ] Implement auth flow with JWT
- [ ] Write component unit tests

#### Day 8-9: Docker & CI/CD

- [ ] Create backend Dockerfile
- [ ] Create frontend Dockerfile
- [ ] Create docker-compose.yml (MongoDB, backend, frontend)
- [ ] Test Docker setup locally
- [ ] Create GitHub Actions CI workflow (lint, test)
- [ ] Create GitHub Actions build workflow
- [ ] Set up environment secrets in GitHub

#### Day 9-10: Documentation & Testing

- [ ] Write comprehensive README with setup instructions
- [ ] Document API endpoints (Swagger/OpenAPI)
- [ ] Create development setup guide
- [ ] Write contribution guidelines
- [ ] Create architecture documentation
- [ ] Run full test suite and fix issues
- [ ] Perform code review and cleanup

---

## Detailed Implementation Guide

### 1. Repository Setup

#### 1.1 Directory Structure

```
smartcut-builder/
├── .github/
│   └── workflows/
│       ├── ci.yml
│       └── build.yml
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── utils/
│   │   ├── types/
│   │   └── index.ts
│   ├── tests/
│   ├── .env.example
│   ├── .eslintrc.json
│   ├── .prettierrc.js
│   ├── jest.config.ts
│   ├── tsconfig.json
│   ├── package.json
│   └── Dockerfile
├── frontend/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── views/
│   │   ├── stores/
│   │   ├── services/
│   │   ├── router/
│   │   ├── types/
│   │   ├── App.vue
│   │   └── main.ts
│   ├── public/
│   ├── tests/
│   ├── .env.example
│   ├── vite.config.ts
│   ├── package.json
│   └── Dockerfile
├── docs/
├── planning-docs/
├── docker-compose.yml
└── README.md
```

### 2. Backend Configuration Files

#### 2.1 Backend Dependencies

```json
{
  "dependencies": {
    "express": "^4.18.2",
    "mongoose": "^8.0.0",
    "dotenv": "^16.3.1",
    "cors": "^2.8.5",
    "helmet": "^7.1.0",
    "express-validator": "^7.0.1",
    "bcrypt": "^5.1.1",
    "jsonwebtoken": "^9.0.2",
    "express-rate-limit": "^7.1.5"
  },
  "devDependencies": {
    "typescript": "^5.3.3",
    "@types/node": "^20.10.6",
    "@types/express": "^4.17.21",
    "@types/mongoose": "^5.11.97",
    "@types/bcrypt": "^5.0.2",
    "@types/jsonwebtoken": "^9.0.5",
    "@types/cors": "^2.8.17",
    "ts-node": "^10.9.2",
    "nodemon": "^3.0.2",
    "jest": "^29.7.0",
    "ts-jest": "^29.1.1",
    "@types/jest": "^29.5.11",
    "supertest": "^6.3.3",
    "@types/supertest": "^6.0.2",
    "eslint": "^8.56.0",
    "@typescript-eslint/parser": "^6.17.0",
    "@typescript-eslint/eslint-plugin": "^6.17.0",
    "eslint-config-airbnb-base": "^15.0.0",
    "eslint-config-airbnb-typescript": "^17.1.0",
    "eslint-config-prettier": "^9.1.0",
    "prettier": "^3.1.1"
  }
}
```

#### 2.2 Backend .env.example

```bash
# Database
MONGO_URI=mongodb://localhost:27017/smartcut-builder
MONGO_URI_TEST=mongodb://localhost:27017/smartcut-builder-test

# Authentication
JWT_SECRET=your-secret-key-here-change-in-production
JWT_EXPIRES_IN=7d
JWT_REFRESH_SECRET=your-refresh-secret-here-change-in-production
JWT_REFRESH_EXPIRES_IN=30d

# OpenAI (for future phases)
OPENAI_API_KEY=sk-your-api-key-here
OPENAI_MODEL=gpt-4
OPENAI_MAX_TOKENS=2000

# Server
NODE_ENV=development
PORT=3000
FRONTEND_URL=http://localhost:5173

# File Storage (for future phases)
S3_BUCKET=smartcut-exports
S3_REGION=us-east-1
S3_ACCESS_KEY=your-access-key
S3_SECRET_KEY=your-secret-key

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
AI_RATE_LIMIT_PER_HOUR=20
```

#### 2.3 Backend Scripts (package.json)

```json
{
  "scripts": {
    "dev": "nodemon --exec ts-node src/index.ts",
    "build": "tsc",
    "start": "node dist/index.js",
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "lint": "eslint src/**/*.ts",
    "lint:fix": "eslint src/**/*.ts --fix",
    "format": "prettier --write \"src/**/*.ts\""
  }
}
```

### 3. Frontend Configuration Files

#### 3.1 Frontend Dependencies

```json
{
  "dependencies": {
    "vue": "^3.4.0",
    "vue-router": "^4.2.5",
    "pinia": "^2.1.7",
    "axios": "^1.6.5"
  },
  "devDependencies": {
    "@vitejs/plugin-vue": "^5.0.0",
    "typescript": "^5.3.3",
    "vite": "^5.0.10",
    "vitest": "^1.1.0",
    "@vue/test-utils": "^2.4.3",
    "jsdom": "^23.0.1",
    "eslint": "^8.56.0",
    "eslint-plugin-vue": "^9.19.2",
    "@typescript-eslint/parser": "^6.17.0",
    "@typescript-eslint/eslint-plugin": "^6.17.0",
    "eslint-config-prettier": "^9.1.0",
    "prettier": "^3.1.1"
  }
}
```

#### 3.2 Frontend .env.example

```bash
VITE_API_URL=http://localhost:3000/api
VITE_APP_NAME=SmartCut Builder
```

#### 3.3 Frontend Scripts (package.json)

```json
{
  "scripts": {
    "dev": "vite",
    "build": "vue-tsc && vite build",
    "preview": "vite preview",
    "test": "vitest",
    "test:ui": "vitest --ui",
    "lint": "eslint src/**/*.{ts,vue}",
    "lint:fix": "eslint src/**/*.{ts,vue} --fix",
    "format": "prettier --write \"src/**/*.{ts,vue}\""
  }
}
```

### 4. Docker Configuration

#### 4.1 Backend Dockerfile

```dockerfile
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
```

#### 4.2 Frontend Dockerfile

```dockerfile
FROM node:20-alpine as build

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

#### 4.3 docker-compose.yml

```yaml
version: "3.8"

services:
  mongodb:
    image: mongo:7
    container_name: smartcut-mongo
    ports:
      - "27017:27017"
    volumes:
      - mongo-data:/data/db
    environment:
      MONGO_INITDB_DATABASE: smartcut-builder

  backend:
    build: ./backend
    container_name: smartcut-backend
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=development
      - MONGO_URI=mongodb://mongodb:27017/smartcut-builder
      - JWT_SECRET=dev-secret-change-in-production
      - JWT_REFRESH_SECRET=dev-refresh-secret-change-in-production
      - FRONTEND_URL=http://localhost:5173
    depends_on:
      - mongodb
    volumes:
      - ./backend:/app
      - /app/node_modules
    command: npm run dev

  frontend:
    build: ./frontend
    container_name: smartcut-frontend
    ports:
      - "5173:5173"
    environment:
      - VITE_API_URL=http://localhost:3000/api
    volumes:
      - ./frontend:/app
      - /app/node_modules
    command: npm run dev

volumes:
  mongo-data:
```

### 5. CI/CD Configuration

#### 5.1 GitHub Actions CI Workflow (.github/workflows/ci.yml)

```yaml
name: CI Pipeline

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

jobs:
  backend-lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: "20"
      - name: Install dependencies
        working-directory: ./backend
        run: npm ci
      - name: Run linter
        working-directory: ./backend
        run: npm run lint

  backend-test:
    runs-on: ubuntu-latest
    services:
      mongodb:
        image: mongo:7
        ports:
          - 27017:27017
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: "20"
      - name: Install dependencies
        working-directory: ./backend
        run: npm ci
      - name: Run tests
        working-directory: ./backend
        run: npm test
        env:
          MONGO_URI_TEST: mongodb://localhost:27017/smartcut-builder-test

  frontend-lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: "20"
      - name: Install dependencies
        working-directory: ./frontend
        run: npm ci
      - name: Run linter
        working-directory: ./frontend
        run: npm run lint

  frontend-test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: "20"
      - name: Install dependencies
        working-directory: ./frontend
        run: npm ci
      - name: Run tests
        working-directory: ./frontend
        run: npm test

  build:
    runs-on: ubuntu-latest
    needs: [backend-lint, backend-test, frontend-lint, frontend-test]
    steps:
      - uses: actions/checkout@v3
      - name: Build Docker images
        run: docker-compose build
```

---

## Core Files to Create

### Backend Core Files

1. **src/index.ts** - Express server entry point
2. **src/config/database.ts** - MongoDB connection
3. **src/middleware/errorHandler.ts** - Global error handling
4. **src/middleware/rateLimiter.ts** - Rate limiting
5. **src/middleware/auth.ts** - JWT authentication middleware
6. **src/models/User.ts** - User model with workshop profile
7. **src/models/Project.ts** - Project model (basic schema)
8. **src/controllers/authController.ts** - Auth logic (register, login)
9. **src/routes/authRoutes.ts** - Auth endpoints
10. **src/utils/jwt.ts** - JWT helper functions
11. **tests/auth.test.ts** - Auth integration tests

### Frontend Core Files

1. **src/main.ts** - Vue app entry point
2. **src/App.vue** - Root component
3. **src/router/index.ts** - Vue Router configuration
4. **src/stores/auth.ts** - Auth state management
5. **src/stores/project.ts** - Project state management
6. **src/services/api.ts** - Axios API client
7. **src/views/Home.vue** - Home page
8. **src/views/Login.vue** - Login page
9. **src/views/Register.vue** - Registration page
10. **src/views/Dashboard.vue** - User dashboard
11. **src/components/common/Button.vue** - Reusable button component
12. **tests/components/Button.test.ts** - Component tests

---

## Success Criteria

### Phase 0 is complete when:

✅ **Infrastructure**

- [ ] Repository is set up with proper branch protection
- [ ] Docker Compose runs all services successfully
- [ ] CI/CD pipeline passes all checks

✅ **Backend**

- [ ] Express server runs on port 3000
- [ ] MongoDB connection is established
- [ ] User registration and login work
- [ ] JWT authentication is functional
- [ ] All backend tests pass (>70% coverage)
- [ ] Linting passes with no errors

✅ **Frontend**

- [ ] Vue app runs on port 5173
- [ ] User can register and login
- [ ] Auth state persists across page refreshes
- [ ] API calls include JWT token
- [ ] All frontend tests pass
- [ ] Linting passes with no errors

✅ **Documentation**

- [ ] README has clear setup instructions
- [ ] API endpoints are documented
- [ ] Environment variables are documented
- [ ] Development workflow is documented

✅ **Testing**

- [ ] Can run `docker-compose up` and access both apps
- [ ] Can register a new user
- [ ] Can login with credentials
- [ ] Can access protected routes with JWT
- [ ] All automated tests pass

---

## Next Steps (Phase 1)

After Phase 0 is complete, Phase 1 will focus on:

1. **Core Engine Development**

   - Box geometry calculator
   - Drawer/door dimension calculator
   - Rule engine for gaps and clearances
   - Cut list generation

2. **Project CRUD Operations**

   - Create, read, update, delete projects
   - Project validation
   - Project versioning

3. **Basic UI Components**
   - Project wizard
   - Dimension input forms
   - Material selector
   - Hardware selector

---

## Resources & References

- **Planning Documents**: `/planning-docs/`
- **Schema Definition**: `/planning-docs/SCHEMA.md`
- **API Specification**: `/planning-docs/API_SPECIFICATION.md`
- **Technical Architecture**: `/planning-docs/TECHNICAL_ARCHITECTURE.md`
- **Coding Standards**: `/planning-docs/CODING_STANDARDS.md`
- **Development Setup**: `/planning-docs/DEVELOPMENT_SETUP.md`

---

## Team Responsibilities

| Role              | Responsibilities                                        |
| ----------------- | ------------------------------------------------------- |
| **DevOps**        | Docker, CI/CD, MongoDB setup, environment configuration |
| **Backend Lead**  | Express setup, models, auth system, middleware, tests   |
| **Frontend Lead** | Vue setup, router, stores, components, tests            |
| **Full Team**     | Code reviews, documentation, testing, bug fixes         |

---

## Timeline

| Week       | Focus               | Key Deliverables                                |
| ---------- | ------------------- | ----------------------------------------------- |
| **Week 1** | Backend foundation  | Express server, MongoDB, auth system, models    |
| **Week 2** | Frontend foundation | Vue app, router, stores, auth UI, Docker, CI/CD |

---

## Notes

- **Keep it simple**: Phase 0 is about foundation, not features
- **Test everything**: Aim for >70% test coverage
- **Document as you go**: Don't leave documentation for the end
- **Use the planning docs**: Reference existing specifications
- **Follow standards**: Adhere to coding standards from day one
- **Security first**: Never commit secrets, use environment variables

---

**Last Updated**: November 12, 2025  
**Status**: Ready for Implementation  
**Next Review**: After Week 1 completion
