# SmartCut Builder v1.0 – Development Setup Guide

## Required Configuration Files

This document outlines the essential configuration files needed for the SmartCut Builder project.

### Environment Configuration

#### `.env.example`

Template for environment variables. Copy to `.env` for local development.

```bash
# Database
MONGO_URI=mongodb://localhost:27017/smartcut-builder
MONGO_URI_TEST=mongodb://localhost:27017/smartcut-builder-test

# Authentication
JWT_SECRET=your-secret-key-here
JWT_EXPIRES_IN=7d
JWT_REFRESH_SECRET=your-refresh-secret-here
JWT_REFRESH_EXPIRES_IN=30d

# OpenAI
OPENAI_API_KEY=sk-your-api-key-here
OPENAI_MODEL=gpt-4
OPENAI_MAX_TOKENS=2000

# Server
NODE_ENV=development
PORT=3000
FRONTEND_URL=http://localhost:5173

# File Storage
S3_BUCKET=smartcut-exports
S3_REGION=us-east-1
S3_ACCESS_KEY=your-access-key
S3_SECRET_KEY=your-secret-key

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
AI_RATE_LIMIT_PER_HOUR=20
```

### Docker Configuration

#### `Dockerfile` (Backend)

```dockerfile
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .

EXPOSE 3000

CMD ["npm", "start"]
```

#### `docker-compose.yml`

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
    depends_on:
      - mongodb
    volumes:
      - ./backend:/app
      - /app/node_modules

  frontend:
    build: ./frontend
    container_name: smartcut-frontend
    ports:
      - "5173:5173"
    volumes:
      - ./frontend:/app
      - /app/node_modules
    command: npm run dev

volumes:
  mongo-data:
```

### Testing Configuration

#### `jest.config.ts`

```typescript
import type { Config } from "@jest/types";

const config: Config.InitialOptions = {
  preset: "ts-jest",
  testEnvironment: "node",
  roots: ["<rootDir>/src", "<rootDir>/tests"],
  testMatch: ["**/__tests__/**/*.ts", "**/?(*.)+(spec|test).ts"],
  collectCoverageFrom: [
    "src/**/*.ts",
    "!src/**/*.d.ts",
    "!src/**/*.interface.ts",
  ],
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70,
    },
  },
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
  },
};

export default config;
```

### Code Quality Configuration

#### `.eslintrc.json`

```json
{
  "extends": [
    "airbnb-base",
    "airbnb-typescript/base",
    "plugin:@typescript-eslint/recommended",
    "prettier"
  ],
  "parser": "@typescript-eslint/parser",
  "parserOptions": {
    "project": "./tsconfig.json"
  },
  "plugins": ["@typescript-eslint"],
  "rules": {
    "no-console": "warn",
    "import/prefer-default-export": "off",
    "@typescript-eslint/no-unused-vars": [
      "error",
      { "argsIgnorePattern": "^_" }
    ]
  }
}
```

#### `prettier.config.js`

```javascript
module.exports = {
  semi: true,
  trailingComma: "es5",
  singleQuote: true,
  printWidth: 100,
  tabWidth: 2,
  useTabs: false,
};
```

### CI/CD Configuration

#### `.github/workflows/ci.yml`

```yaml
name: CI/CD Pipeline

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

jobs:
  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: "20"
      - run: npm ci
      - run: npm run lint

  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: "20"
      - run: npm ci
      - run: npm test

  build:
    runs-on: ubuntu-latest
    needs: [lint, test]
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: "20"
      - run: npm ci
      - run: npm run build
      - uses: docker/build-push-action@v4
        with:
          context: .
          push: false
          tags: smartcut-builder:latest
```

## Getting Started

### Initial Setup

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd smartcut-builder
   ```

2. **Create environment file**

   ```bash
   cp .env.example .env
   # Edit .env with your actual values
   ```

3. **Install dependencies**

   ```bash
   # Backend
   cd backend && npm install

   # Frontend
   cd ../frontend && npm install
   ```

4. **Start development environment**

   ```bash
   # Using Docker Compose (recommended)
   docker-compose up

   # Or manually
   # Terminal 1: Start MongoDB
   mongod

   # Terminal 2: Start backend
   cd backend && npm run dev

   # Terminal 3: Start frontend
   cd frontend && npm run dev
   ```

### Development Workflow

1. Create a feature branch: `git checkout -b feature/your-feature-name`
2. Make your changes following the coding standards
3. Run tests: `npm test`
4. Run linter: `npm run lint`
5. Commit using conventional commits: `git commit -m "feat: add new feature"`
6. Push and create a pull request

---
