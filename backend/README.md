# SmartCut Builder - Backend API

Express + TypeScript backend API for SmartCut Builder.

## 🚀 Quick Start

### Prerequisites

- Node.js >= 20.0.0
- MongoDB (local or Atlas)
- npm >= 10.0.0

### Installation

```bash
# Install dependencies
npm install

# Copy environment variables
cp .env.example .env
# Edit .env with your configuration
```

### Development

```bash
# Start development server with hot reload
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

### Testing

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

### Code Quality

```bash
# Run linter
npm run lint

# Fix linting issues
npm run lint:fix

# Format code
npm run format
```

## 📁 Project Structure

```
backend/
├── src/
│   ├── config/          # Configuration files (database, etc.)
│   ├── controllers/     # Route controllers
│   ├── middleware/      # Express middleware
│   ├── models/          # Mongoose models
│   ├── routes/          # API routes
│   ├── services/        # Business logic
│   ├── utils/           # Helper functions
│   ├── types/           # TypeScript types/interfaces
│   └── index.ts         # Application entry point
├── tests/
│   ├── unit/            # Unit tests
│   ├── integration/     # Integration tests
│   └── fixtures/        # Test data
├── .env.example         # Environment variables template
├── tsconfig.json        # TypeScript configuration
├── jest.config.ts       # Jest configuration
├── .eslintrc.json       # ESLint configuration
└── .prettierrc.js       # Prettier configuration
```

## 🔧 Environment Variables

See `.env.example` for all available environment variables.

Key variables:
- `MONGO_URI` - MongoDB connection string
- `JWT_SECRET` - Secret key for JWT tokens
- `PORT` - Server port (default: 3000)
- `NODE_ENV` - Environment (development/production)

## 📚 API Documentation

API documentation will be available at `/api/docs` once Swagger is configured.

### Health Check

```bash
GET /health
```

Returns server health status.

## 🧪 Testing

Tests are written using Jest and Supertest.

```bash
# Run all tests
npm test

# Run specific test file
npm test -- health.test.ts

# Run with coverage
npm run test:coverage
```

## 🔒 Security

- JWT-based authentication
- Password hashing with bcrypt
- Rate limiting on all endpoints
- Input validation with express-validator
- CORS configured for frontend domain only
- Helmet.js for security headers

## 📝 Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build TypeScript to JavaScript
- `npm start` - Start production server
- `npm test` - Run tests
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier

## 🤝 Contributing

See [CONTRIBUTING.md](../CONTRIBUTING.md) for contribution guidelines.

---

**Status:** Phase 0 - Day 2-3 Complete ✅
