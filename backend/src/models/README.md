# SmartCut Builder - Database Models

This directory contains all Mongoose models for the SmartCut Builder application.

## Models

### User Model (`User.ts`)
Handles user authentication and workshop profile management.

**Key Features:**
- Secure password hashing with bcrypt
- Workshop tool tracking
- Email validation and uniqueness
- Password comparison for authentication

**Usage:**
```typescript
import { User } from './models';

// Create a new user
const user = await User.create({
  email: 'user@example.com',
  password_hash: 'plainPassword', // Will be hashed automatically
  name: 'John Doe',
  workshop_profile: {
    table_saw: true,
    router: true,
    // ... other tools
  }
});

// Verify password
const isValid = await user.comparePassword('plainPassword');
```

### Project Model (`Project.ts`)
Comprehensive project/cabinet design storage.

**Key Features:**
- Support for multiple project types (Base Cabinet, Wall Cabinet, etc.)
- Material specifications
- Drawer and door configurations (arrays)
- Custom features (tops, legs, accents)
- Cut list and assembly instructions
- AI guidance integration

**Usage:**
```typescript
import { Project } from './models';

const project = await Project.create({
  user_id: userId,
  name: 'Kitchen Cabinet',
  project_type: 'Base Cabinet',
  units: 'imperial',
  material: {
    type: 'plywood',
    thickness: 0.75,
    grade: 'cabinet-grade'
  },
  dimensions: {
    width: 36,
    height: 30,
    depth: 24
  },
  drawers: [{
    quantity: 3,
    type: 'overlay',
    slide_type: 'undermount'
  }]
});
```

### Template Model (`Template.ts`)
Marketplace templates for reusable project designs.

**Key Features:**
- Category-based organization
- Download and rating tracking
- Public/private visibility
- Popularity scoring (virtual field)
- Project data validation

**Usage:**
```typescript
import { Template } from './models';

const template = await Template.create({
  name: 'Basic Kitchen Cabinet',
  description: 'A standard base cabinet with two doors',
  category: 'kitchen',
  author_id: userId,
  project_data: {
    project_type: 'Base Cabinet',
    dimensions: { width: 36, height: 30, depth: 24 },
    material: { type: 'plywood', thickness: 0.75 }
  },
  is_public: true
});

// Increment downloads
await template.incrementDownloads();
```

## Indexes

All models include optimized indexes for common query patterns:

- **User**: `email`, `created_at`
- **Project**: `user_id + created_at`, `user_id + project_type`, text search on `name`
- **Template**: `category + is_public`, `downloads`, `rating`, text search on `name + description`

## Validation

All models include comprehensive validation:
- Required field enforcement
- Type checking (enums for categorical data)
- Range validation (positive numbers, min/max values)
- Custom validators (email format, URL format, etc.)

## Testing

Each model has comprehensive test coverage in `/tests/models/`:
- `User.test.ts` - 17 tests
- `Project.test.ts` - 19 tests
- `Template.test.ts` - 20 tests

Run tests with:
```bash
npm test -- --testPathPatterns=models
```

## Type Safety

All models are fully typed with TypeScript interfaces exported from each model file. Import interfaces alongside models:

```typescript
import { User, IUser } from './models';
import { Project, IProject, IMaterial, IDimensions } from './models';
import { Template, ITemplate } from './models';
```

## Schema Alignment

Models align with:
- `/planning-docs/SCHEMA.md` - JSON Schema specification
- `/planning-docs/API_SPECIFICATION.md` - API requirements
- `/planning-docs/TECHNICAL_ARCHITECTURE.md` - Architecture design
