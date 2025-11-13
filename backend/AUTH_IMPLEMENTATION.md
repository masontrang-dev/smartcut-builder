# Authentication System Implementation

## Overview

Complete JWT-based authentication system for SmartCut Builder backend API.

## Components Implemented

### 1. JWT Utilities (`src/utils/jwt.ts`)

- **generateAccessToken**: Creates short-lived access tokens (7 days default)
- **generateRefreshToken**: Creates long-lived refresh tokens (30 days default)
- **generateTokens**: Generates both tokens at once
- **verifyAccessToken**: Validates and decodes access tokens
- **verifyRefreshToken**: Validates and decodes refresh tokens
- **decodeToken**: Decodes token without verification (for debugging)

**Interfaces:**
- `IJwtPayload`: Token payload structure (userId, email)
- `ITokenResponse`: Token response structure

### 2. Auth Middleware (`src/middleware/auth.ts`)

- **authenticate**: Protects routes requiring authentication
  - Extracts Bearer token from Authorization header
  - Verifies token validity
  - Attaches user data to request object
  - Returns 401 for invalid/missing tokens

- **optionalAuthenticate**: Allows optional authentication
  - Attaches user data if valid token provided
  - Continues without error if no token

**Interface:**
- `AuthRequest`: Extended Express Request with optional user property

### 3. Validation Middleware (`src/middleware/validate.ts`)

- **validate**: Processes express-validator results
  - Returns 400 with validation errors if present
  - Continues to next middleware if validation passes

### 4. Auth Controller (`src/controllers/authController.ts`)

#### Endpoints:

**register** - `POST /api/auth/register`
- Creates new user account
- Validates email, password, name
- Hashes password using bcrypt (via User model pre-save hook)
- Generates JWT tokens
- Returns user data and tokens
- Status: 201 (success), 400 (validation), 409 (duplicate email)

**login** - `POST /api/auth/login`
- Authenticates existing user
- Validates credentials
- Compares password hash
- Generates new JWT tokens
- Returns user data and tokens
- Status: 200 (success), 400 (validation), 401 (invalid credentials)

**refresh** - `POST /api/auth/refresh`
- Refreshes access token using refresh token
- Verifies refresh token validity
- Checks user still exists
- Generates new token pair
- Returns new tokens
- Status: 200 (success), 400 (missing token), 401 (invalid token)

**getProfile** - `GET /api/auth/me`
- Returns current user profile
- Requires authentication
- Returns user data without sensitive fields
- Status: 200 (success), 401 (not authenticated), 404 (user not found)

**updateProfile** - `PUT /api/auth/profile`
- Updates user profile (name, workshop_profile)
- Requires authentication
- Validates input data
- Returns updated user data
- Status: 200 (success), 400 (validation), 401 (not authenticated)

### 5. Auth Routes (`src/routes/authRoutes.ts`)

All routes include express-validator validation chains and validation middleware.

**Public Routes:**
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/refresh` - Token refresh

**Protected Routes:**
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update profile

### 6. Integration Tests (`tests/integration/auth.test.ts`)

Comprehensive test suite covering:

**Registration Tests (9 tests):**
- Successful registration
- Registration with workshop profile
- Missing required fields (email, password, name)
- Invalid email format
- Short password
- Duplicate email
- Email normalization

**Login Tests (6 tests):**
- Successful login
- Case-insensitive email
- Incorrect password
- Non-existent email
- Missing email/password

**Token Refresh Tests (3 tests):**
- Successful token refresh
- Missing refresh token
- Invalid refresh token

**Get Profile Tests (4 tests):**
- Successful profile retrieval
- Missing authorization header
- Invalid token
- Malformed authorization header

**Update Profile Tests (5 tests):**
- Update name
- Update workshop profile
- Update both fields
- Unauthorized access
- Invalid name length

**Total: 27 comprehensive integration tests**

## Security Features

1. **Password Hashing**: bcrypt with salt rounds of 12
2. **JWT Tokens**: Separate access and refresh tokens with different expiration times
3. **Token Verification**: Validates signature and expiration
4. **Authorization Headers**: Bearer token format required
5. **Input Validation**: express-validator for all inputs
6. **Sensitive Data Protection**: Password hash excluded from JSON responses
7. **Email Normalization**: Lowercase and trimmed

## Environment Variables Required

```bash
JWT_SECRET=your-secret-key-here
JWT_EXPIRES_IN=7d
JWT_REFRESH_SECRET=your-refresh-secret-here
JWT_REFRESH_EXPIRES_IN=30d
```

## API Response Format

### Success Response
```json
{
  "success": true,
  "message": "Operation successful",
  "data": {
    "user": { ... },
    "accessToken": "...",
    "refreshToken": "...",
    "expiresIn": "7d"
  }
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error description",
  "errors": [ ... ] // Optional validation errors
}
```

## Testing

### Prerequisites
- MongoDB running on localhost:27017
- Environment variables set (use .env.test)

### Run Tests
```bash
npm test -- tests/integration/auth.test.ts
```

### Test Coverage
All authentication flows are covered with integration tests ensuring:
- Proper status codes
- Correct response structure
- Data validation
- Error handling
- Security measures

## Usage Example

### Register
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123",
    "name": "John Doe"
  }'
```

### Login
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123"
  }'
```

### Get Profile
```bash
curl -X GET http://localhost:3000/api/auth/me \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

### Update Profile
```bash
curl -X PUT http://localhost:3000/api/auth/profile \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Jane Doe",
    "workshop_profile": {
      "saw": true,
      "router": true
    }
  }'
```

### Refresh Token
```bash
curl -X POST http://localhost:3000/api/auth/refresh \
  -H "Content-Type: application/json" \
  -d '{
    "refreshToken": "YOUR_REFRESH_TOKEN"
  }'
```

## Next Steps

1. Install and start MongoDB for testing
2. Run integration tests to verify implementation
3. Consider adding:
   - Password reset functionality
   - Email verification
   - Rate limiting per user
   - Session management
   - OAuth integration (Google, GitHub, etc.)
   - Two-factor authentication

## Files Created/Modified

### Created:
- `src/utils/jwt.ts`
- `src/middleware/auth.ts`
- `src/middleware/validate.ts`
- `src/controllers/authController.ts`
- `src/routes/authRoutes.ts`
- `tests/integration/auth.test.ts`
- `tests/setup.ts`
- `.env.test`
- `AUTH_IMPLEMENTATION.md`

### Modified:
- `src/index.ts` - Added auth routes
- `jest.config.ts` - Added setup file
- `tests/tsconfig.json` - Fixed rootDir for imports

## Compliance with Phase 0 Plan

✅ **Day 4-5: Authentication System - COMPLETED**

- ✅ Create auth controller (register, login, refresh)
- ✅ Implement JWT token generation/validation
- ✅ Create auth middleware
- ✅ Set up password hashing with bcrypt
- ✅ Create auth routes
- ✅ Write auth integration tests

All requirements from the Phase 0 plan have been successfully implemented.
