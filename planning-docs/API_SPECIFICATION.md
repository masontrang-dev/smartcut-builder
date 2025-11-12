# SmartCut Builder v1.0 – API Specification

## Base URL

```
Development: http://localhost:3000/api
Production: https://api.smartcutbuilder.com/api
```

## Authentication

All authenticated endpoints require a JWT token in the Authorization header:

```
Authorization: Bearer <token>
```

---

## Authentication Endpoints

### Register User

**POST** `/auth/register`

Create a new user account.

**Request Body:**

```json
{
  "email": "user@example.com",
  "password": "SecurePassword123!",
  "name": "John Doe"
}
```

**Response:** `201 Created`

```json
{
  "success": true,
  "data": {
    "user": {
      "id": "507f1f77bcf86cd799439011",
      "email": "user@example.com",
      "name": "John Doe"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### Login

**POST** `/auth/login`

Authenticate a user and receive tokens.

**Request Body:**

```json
{
  "email": "user@example.com",
  "password": "SecurePassword123!"
}
```

**Response:** `200 OK`

```json
{
  "success": true,
  "data": {
    "user": {
      "id": "507f1f77bcf86cd799439011",
      "email": "user@example.com",
      "name": "John Doe"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### Refresh Token

**POST** `/auth/refresh`

Get a new access token using a refresh token.

**Request Body:**

```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response:** `200 OK`

```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### Get Profile

**GET** `/auth/profile`

Get current user profile. Requires authentication.

**Response:** `200 OK`

```json
{
  "success": true,
  "data": {
    "id": "507f1f77bcf86cd799439011",
    "email": "user@example.com",
    "name": "John Doe",
    "workshop_profile": {
      "saw": true,
      "router": true,
      "jig_saw": false,
      "table_saw": true,
      "miter_saw": true,
      "planer": false,
      "jointer": false
    },
    "created_at": "2024-11-12T10:00:00.000Z"
  }
}
```

---

## Project Endpoints

### List Projects

**GET** `/projects`

Get all projects for the authenticated user. Requires authentication.

**Query Parameters:**

- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10, max: 100)
- `sort` (optional): Sort field (default: -updated_at)
- `type` (optional): Filter by type ("furniture" or "cabinet")

**Response:** `200 OK`

```json
{
  "success": true,
  "data": {
    "projects": [
      {
        "id": "507f1f77bcf86cd799439011",
        "name": "Kitchen Cabinet",
        "type": "cabinet",
        "dimensions": {
          "width": 36,
          "height": 30,
          "depth": 24
        },
        "created_at": "2024-11-12T10:00:00.000Z",
        "updated_at": "2024-11-12T15:30:00.000Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 25,
      "pages": 3
    }
  }
}
```

### Create Project

**POST** `/projects`

Create a new project. Requires authentication.

**Request Body:**

```json
{
  "name": "Kitchen Cabinet",
  "project_type": "Base Cabinet",
  "units": "imperial",
  "material": {
    "type": "plywood",
    "thickness": 0.75,
    "grade": "cabinet-grade",
    "sheet_size": "4x8"
  },
  "joinery": "dado",
  "back_panel": "recessed",
  "dimensions": {
    "width": 36,
    "height": 30,
    "depth": 24,
    "material_thickness": 0.75,
    "back_panel_thickness": 0.25,
    "frame": {
      "has_face_frame": true,
      "stile_width": 1.5,
      "rail_width": 2
    }
  },
  "drawers": [
    {
      "quantity": 3,
      "type": "overlay",
      "slide_type": "undermount",
      "gap_between_drawers": 0.125,
      "construction": "dovetail"
    }
  ],
  "doors": [
    {
      "quantity": 2,
      "type": "inset",
      "panel_type": "shaker",
      "gap_between_doors": 0.125,
      "hinge_type": "concealed",
      "swing_direction": "left"
    }
  ],
  "interior": {
    "adjustable_shelves": 2,
    "dividers": 0,
    "cable_management": false
  }
}
```

**Response:** `201 Created`

```json
{
  "success": true,
  "data": {
    "id": "507f1f77bcf86cd799439011",
    "name": "Kitchen Cabinet",
    "project_type": "Base Cabinet",
    "units": "imperial",
    "material": {
      "type": "plywood",
      "thickness": 0.75,
      "grade": "cabinet-grade"
    },
    "dimensions": {
      /* ... */
    },
    "drawers": [
      /* ... */
    ],
    "doors": [
      /* ... */
    ],
    "interior": {
      /* ... */
    },
    "cut_list": [],
    "assembly_instructions": [],
    "ai_guidance": {
      "warnings": [],
      "suggestions": [],
      "rule_validation_passed": true
    },
    "created_at": "2024-11-12T10:00:00.000Z",
    "updated_at": "2024-11-12T10:00:00.000Z"
  }
}
```

### Get Project

**GET** `/projects/:id`

Get a specific project by ID. Requires authentication.

**Response:** `200 OK`

```json
{
  "success": true,
  "data": {
    "id": "507f1f77bcf86cd799439011",
    "name": "Kitchen Cabinet",
    "project_type": "Base Cabinet",
    "units": "imperial",
    "material": {
      "type": "plywood",
      "thickness": 0.75,
      "grade": "cabinet-grade",
      "sheet_size": "4x8"
    },
    "joinery": "dado",
    "back_panel": "recessed",
    "dimensions": {
      /* ... */
    },
    "drawers": [
      /* array of drawer configs */
    ],
    "doors": [
      /* array of door configs */
    ],
    "hardware": {
      /* ... */
    },
    "finish": {
      "color": "natural oak",
      "gloss": "satin"
    },
    "custom_features": {
      /* ... */
    },
    "interior": {
      "adjustable_shelves": 2,
      "dividers": 1,
      "cable_management": false
    },
    "cut_list": [
      {
        "part_name": "Left Side Panel",
        "quantity": 1,
        "width": 24,
        "height": 30,
        "thickness": 0.75,
        "material": "plywood"
      }
    ],
    "assembly_instructions": [
      "Cut all pieces according to cut list",
      "Apply wood glue to dado joints"
    ],
    "estimated_cost": 245.5,
    "output": {
      "cut_list": true,
      "assembly_instructions": true,
      "3d_preview": true,
      "ar_preview": false,
      "export_formats": ["pdf", "csv"]
    },
    "ai_guidance": {
      "warnings": [],
      "suggestions": ["Consider adding a center support for the 36-inch span"],
      "rule_validation_passed": true
    },
    "created_at": "2024-11-12T10:00:00.000Z",
    "updated_at": "2024-11-12T15:30:00.000Z"
  }
}
```

### Update Project

**PUT** `/projects/:id`

Update an existing project. Requires authentication.

**Request Body:** (partial updates allowed)

```json
{
  "name": "Updated Kitchen Cabinet",
  "dimensions": {
    "width": 38
  },
  "interior": {
    "adjustable_shelves": 3
  }
}
```

**Response:** `200 OK`

```json
{
  "success": true,
  "data": {
    /* updated project */
  }
}
```

### Delete Project

**DELETE** `/projects/:id`

Delete a project. Requires authentication.

**Response:** `200 OK`

```json
{
  "success": true,
  "message": "Project deleted successfully"
}
```

### Duplicate Project

**POST** `/projects/:id/duplicate`

Create a copy of an existing project. Requires authentication.

**Request Body:** (optional)

```json
{
  "name": "Copy of Kitchen Cabinet"
}
```

**Response:** `201 Created`

```json
{
  "success": true,
  "data": {
    /* new project */
  }
}
```

---

## AI Assistant Endpoints

### Validate Design

**POST** `/ai/validate`

Validate a project design for feasibility and structural integrity. Requires authentication.

**Request Body:**

```json
{
  "project_id": "507f1f77bcf86cd799439011"
}
```

**Response:** `200 OK`

```json
{
  "success": true,
  "data": {
    "is_valid": true,
    "warnings": ["Drawer height may be too shallow for standard slides"],
    "errors": [],
    "suggestions": ["Consider adding a center support for spans over 36 inches"]
  }
}
```

### Get Design Suggestions

**POST** `/ai/suggest`

Get AI-powered design suggestions. Requires authentication.

**Request Body:**

```json
{
  "project_id": "507f1f77bcf86cd799439011",
  "context": "I want to maximize storage space"
}
```

**Response:** `200 OK`

```json
{
  "success": true,
  "data": {
    "suggestions": [
      {
        "type": "drawer_configuration",
        "description": "Add one more drawer by reducing drawer heights to 6 inches",
        "impact": "Increases storage compartments by 33%"
      },
      {
        "type": "material",
        "description": "Use 0.5-inch plywood for drawer bottoms to save cost",
        "impact": "Reduces material cost by $15"
      }
    ]
  }
}
```

### Optimize Cut List

**POST** `/ai/optimize`

Optimize the cut list to minimize material waste. Requires authentication.

**Request Body:**

```json
{
  "project_id": "507f1f77bcf86cd799439011",
  "sheet_size": {
    "width": 48,
    "height": 96
  }
}
```

**Response:** `200 OK`

```json
{
  "success": true,
  "data": {
    "sheets_required": 2,
    "waste_percentage": 12.5,
    "layout": [
      {
        "sheet": 1,
        "pieces": [
          {
            "part_name": "Left Side Panel",
            "x": 0,
            "y": 0,
            "width": 24,
            "height": 30
          }
        ]
      }
    ]
  }
}
```

---

## Export Endpoints

### Export PDF

**GET** `/export/:id/pdf`

Generate and download a PDF cut list. Requires authentication.

**Response:** `200 OK` (application/pdf)

### Export CSV

**GET** `/export/:id/csv`

Generate and download a CSV cut list. Requires authentication.

**Response:** `200 OK` (text/csv)

### Export DXF

**GET** `/export/:id/dxf`

Generate and download a DXF file for CAD software. Requires authentication.

**Response:** `200 OK` (application/dxf)

### Export SketchUp

**GET** `/export/:id/sketchup`

Generate and download a SketchUp file. Requires authentication.

**Response:** `200 OK` (application/vnd.sketchup.skp)

---

## Template Endpoints

### Browse Templates

**GET** `/templates`

Get public templates from the marketplace.

**Query Parameters:**

- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 20)
- `category` (optional): Filter by category
- `sort` (optional): Sort by "popular", "recent", "rating" (default: popular)

**Response:** `200 OK`

```json
{
  "success": true,
  "data": {
    "templates": [
      {
        "id": "507f1f77bcf86cd799439011",
        "name": "Basic Kitchen Cabinet",
        "description": "Standard base cabinet with 2 doors",
        "category": "kitchen",
        "author": {
          "id": "507f1f77bcf86cd799439012",
          "name": "John Doe"
        },
        "thumbnail_url": "https://...",
        "downloads": 1523,
        "rating": 4.7,
        "created_at": "2024-11-12T10:00:00.000Z"
      }
    ],
    "pagination": {
      /* ... */
    }
  }
}
```

### Get Template Details

**GET** `/templates/:id`

Get detailed information about a specific template.

**Response:** `200 OK`

```json
{
  "success": true,
  "data": {
    "id": "507f1f77bcf86cd799439011",
    "name": "Basic Kitchen Cabinet",
    "description": "Standard base cabinet with 2 doors",
    "category": "kitchen",
    "author": {
      /* ... */
    },
    "project_data": {
      /* template project configuration */
    },
    "thumbnail_url": "https://...",
    "downloads": 1523,
    "rating": 4.7,
    "created_at": "2024-11-12T10:00:00.000Z"
  }
}
```

### Create Template

**POST** `/templates`

Create a new template from a project. Requires authentication.

**Request Body:**

```json
{
  "project_id": "507f1f77bcf86cd799439011",
  "name": "My Custom Cabinet Template",
  "description": "A versatile cabinet design",
  "category": "kitchen",
  "is_public": true
}
```

**Response:** `201 Created`

```json
{
  "success": true,
  "data": {
    /* new template */
  }
}
```

### Use Template

**POST** `/templates/:id/use`

Create a new project from a template. Requires authentication.

**Request Body:** (optional)

```json
{
  "name": "My Kitchen Cabinet"
}
```

**Response:** `201 Created`

```json
{
  "success": true,
  "data": {
    /* new project created from template */
  }
}
```

---

## Error Responses

All endpoints may return the following error responses:

### 400 Bad Request

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input data",
    "details": [
      {
        "field": "dimensions.width",
        "message": "Width must be a positive number"
      }
    ]
  }
}
```

### 401 Unauthorized

```json
{
  "success": false,
  "error": {
    "code": "UNAUTHORIZED",
    "message": "Authentication required"
  }
}
```

### 403 Forbidden

```json
{
  "success": false,
  "error": {
    "code": "FORBIDDEN",
    "message": "You don't have permission to access this resource"
  }
}
```

### 404 Not Found

```json
{
  "success": false,
  "error": {
    "code": "NOT_FOUND",
    "message": "Resource not found"
  }
}
```

### 429 Too Many Requests

```json
{
  "success": false,
  "error": {
    "code": "RATE_LIMIT_EXCEEDED",
    "message": "Too many requests. Please try again later.",
    "retry_after": 900
  }
}
```

### 500 Internal Server Error

```json
{
  "success": false,
  "error": {
    "code": "INTERNAL_ERROR",
    "message": "An unexpected error occurred"
  }
}
```

---

## Rate Limiting

- **General API:** 100 requests per 15 minutes per IP
- **AI Endpoints:** 20 requests per hour per user
- **Export Endpoints:** 10 requests per hour per user

Rate limit headers are included in all responses:

```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1699876543
```

---

## Pagination

List endpoints support pagination with the following query parameters:

- `page`: Page number (default: 1)
- `limit`: Items per page (default: 10, max: 100)

Pagination metadata is included in the response:

```json
{
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 125,
    "pages": 13
  }
}
```

---

## Versioning

The API uses URL versioning. The current version is `v1` and is included in the base URL:

```
/api/v1/projects
```

Future versions will be available at:

```
/api/v2/projects
```
