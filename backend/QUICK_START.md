# Authentication System - Quick Start Guide

## Prerequisites

1. **MongoDB** - Install and start MongoDB
   ```bash
   # macOS (if not installed)
   brew tap mongodb/brew
   brew install mongodb-community
   
   # Start MongoDB
   brew services start mongodb-community
   
   # Or run manually
   mongod --config /usr/local/etc/mongod.conf
   ```

2. **Environment Variables** - Create `.env` file
   ```bash
   cp .env.example .env
   # Edit .env and set your JWT secrets
   ```

## Running the Server

```bash
# Install dependencies
npm install

# Development mode
npm run dev

# Production build
npm run build
npm start
```

Server will start on `http://localhost:3000`

## Testing the API

### 1. Health Check
```bash
curl http://localhost:3000/health
```

Expected response:
```json
{
  "status": "ok",
  "timestamp": "2025-11-12T...",
  "environment": "development"
}
```

### 2. Register a User
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "name": "Test User",
    "workshop_profile": {
      "saw": true,
      "router": true,
      "table_saw": true
    }
  }'
```

Expected response:
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": "...",
      "email": "test@example.com",
      "name": "Test User",
      "workshop_profile": { ... },
      "created_at": "..."
    },
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expiresIn": "7d"
  }
}
```

### 3. Login
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

### 4. Get Profile (Protected Route)
```bash
# Save your access token from register/login response
export TOKEN="your_access_token_here"

curl -X GET http://localhost:3000/api/auth/me \
  -H "Authorization: Bearer $TOKEN"
```

### 5. Update Profile (Protected Route)
```bash
curl -X PUT http://localhost:3000/api/auth/profile \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Updated Name",
    "workshop_profile": {
      "saw": true,
      "router": true,
      "table_saw": true,
      "planer": true
    }
  }'
```

### 6. Refresh Token
```bash
# Save your refresh token from register/login response
export REFRESH_TOKEN="your_refresh_token_here"

curl -X POST http://localhost:3000/api/auth/refresh \
  -H "Content-Type: application/json" \
  -d '{
    "refreshToken": "'$REFRESH_TOKEN'"
  }'
```

## Running Tests

```bash
# Run all tests
npm test

# Run auth tests only
npm test -- tests/integration/auth.test.ts

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage
```

## Common Issues

### MongoDB Connection Error
```
Error: connect ECONNREFUSED 127.0.0.1:27017
```
**Solution**: Start MongoDB
```bash
brew services start mongodb-community
```

### JWT_SECRET not defined
```
Error: JWT_SECRET is not defined in environment variables
```
**Solution**: Create `.env` file with JWT secrets
```bash
cp .env.example .env
# Edit .env and set JWT_SECRET and JWT_REFRESH_SECRET
```

### Port already in use
```
Error: listen EADDRINUSE: address already in use :::3000
```
**Solution**: Kill process on port 3000 or change PORT in `.env`
```bash
lsof -ti:3000 | xargs kill -9
# Or change PORT in .env
```

## API Response Codes

| Code | Meaning | When |
|------|---------|------|
| 200 | OK | Successful request |
| 201 | Created | User registered successfully |
| 400 | Bad Request | Validation error or missing fields |
| 401 | Unauthorized | Invalid/missing token or credentials |
| 404 | Not Found | User not found |
| 409 | Conflict | Email already exists |
| 500 | Server Error | Internal server error |

## Workshop Profile Fields

The `workshop_profile` object tracks available tools:

```typescript
{
  saw: boolean;         // Hand saw
  router: boolean;      // Router
  jig_saw: boolean;     // Jig saw
  table_saw: boolean;   // Table saw
  miter_saw: boolean;   // Miter saw
  planer: boolean;      // Planer
  jointer: boolean;     // Jointer
}
```

All fields default to `false` if not specified.

## Token Lifecycle

1. **Register/Login**: Receive both access and refresh tokens
2. **API Calls**: Use access token in Authorization header
3. **Token Expires**: Access token expires after 7 days (default)
4. **Refresh**: Use refresh token to get new access token
5. **Refresh Expires**: Refresh token expires after 30 days (default)
6. **Re-login**: User must login again after refresh token expires

## Development Tips

### Using Postman/Insomnia

1. Create a collection for SmartCut Builder API
2. Set base URL: `http://localhost:3000`
3. Create environment variables:
   - `base_url`: `http://localhost:3000`
   - `access_token`: (set after login)
   - `refresh_token`: (set after login)
4. Use `{{access_token}}` in Authorization header

### Using VS Code REST Client

Create a `.http` file:

```http
### Register
POST http://localhost:3000/api/auth/register
Content-Type: application/json

{
  "email": "test@example.com",
  "password": "password123",
  "name": "Test User"
}

### Login
POST http://localhost:3000/api/auth/login
Content-Type: application/json

{
  "email": "test@example.com",
  "password": "password123"
}

### Get Profile
GET http://localhost:3000/api/auth/me
Authorization: Bearer YOUR_TOKEN_HERE
```

## Next Steps

1. ✅ Authentication system is complete
2. ⏭️ Next: Frontend setup (Vue 3 + Vite)
3. ⏭️ Then: Project CRUD operations
4. ⏭️ Then: Core calculation engine

See `PHASE_0_PLAN.md` for full roadmap.
