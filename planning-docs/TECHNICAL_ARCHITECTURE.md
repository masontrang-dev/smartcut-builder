# SmartCut Builder v1.0 – Technical Architecture

## 5.1 High‑Level Stack

| Layer                | Tech                              | Rationale                                                                                          |
| -------------------- | --------------------------------- | -------------------------------------------------------------------------------------------------- |
| **Frontend**         | Vue 3 + TypeScript + Vite         | Reactive UI, fast build, Composition API for modularity                                            |
| **State**            | Pinia (Vue store)                 | Simple, Vue‑native, SSR‑friendly                                                                   |
| **Backend**          | Node.js 20 + Express + TypeScript | Mature ecosystem, async I/O, easy to integrate with OpenAI, simpler than NestJS for MVP            |
| **Database**         | MongoDB Atlas (document‑store)    | Flexible schema for projects & custom features; can migrate to PostgreSQL if relational data grows |
| **AI Service**       | OpenAI GPT‑4 via REST             | Plug‑and‑play inference; costs managed via rate‑limits                                             |
| **File Storage**     | S3 (or GridFS)                    | Exported PDFs, DXFs, STL, user media                                                               |
| **CI/CD**            | GitHub Actions                    | Automated lint, tests, Docker build, deploy                                                        |
| **Containerisation** | Docker + Docker‑Compose           | Consistent dev & prod environments                                                                 |
| **Reverse Proxy**    | Nginx                             | Static file hosting, SSL termination                                                               |

## 5.2 Data Model (MongoDB)

### Collections

#### `users`

```javascript
{
  _id: ObjectId,
  email: String (unique, indexed),
  password_hash: String,
  name: String,
  workshop_profile: {
    saw: Boolean,
    router: Boolean,
    jig_saw: Boolean,
    table_saw: Boolean,
    miter_saw: Boolean,
    planer: Boolean,
    jointer: Boolean
  },
  created_at: Date,
  updated_at: Date
}
```

#### `projects`

```javascript
{
  _id: ObjectId,
  user_id: ObjectId (ref: users, indexed),
  name: String,
  project_type: String (enum: ["Base Cabinet", "Wall Cabinet", "Tall Cabinet", "Furniture", "Custom"]),
  units: String (enum: ["imperial", "metric"], default: "imperial"),
  material: {
    type: String,
    thickness: Number,
    grade: String,
    sheet_size: String
  },
  joinery: String (enum: ["rabbet", "dado", "butt", "mortise-tenon", "dowel", "pocket-hole", "biscuit"]),
  back_panel: String (enum: ["recessed", "flush", "none"]),
  dimensions: {
    width: Number,
    height: Number,
    depth: Number,
    material_thickness: Number,
    back_panel_thickness: Number,
    toe_kick_height: Number,
    frame: {
      has_face_frame: Boolean,
      stile_width: Number,
      rail_width: Number
    }
  },
  drawers: [{
    quantity: Number,
    type: String (enum: ["overlay", "inset", "full-overlay"]),
    slide_type: String (enum: ["undermount", "side-mount", "center-mount", "euro"]),
    gap_between_drawers: Number,
    construction: String (enum: ["dovetail", "box-joint", "rabbet", "dado"])
  }],
  doors: [{
    quantity: Number,
    type: String (enum: ["inset", "overlay", "full-overlay"]),
    panel_type: String (enum: ["shaker", "flat-panel", "raised-panel", "slab", "glass", "louvered"]),
    gap_between_doors: Number,
    hinge_type: String (enum: ["concealed", "butt", "european", "piano", "inset"]),
    swing_direction: String (enum: ["left", "right", "up", "down", "bi-fold"])
  }],
  hardware: {
    hinges: { type: String, count: Number, overlay: Number },
    drawer_slides: { type: String, extension: String, soft_close: Boolean },
    handles: { type: String, position: String, finish: String, center_to_center: Number },
    latches: { type: String, count: Number }
  },
  finish: {
    color: String,
    gloss: String
  },
  custom_features: {
    top: { height: Number, thickness: Number, float: Boolean, overhang: Number, edge_style: String },
    front: { panel_type: String, thickness: Number },
    accents: { spline: Object, groove: Boolean, inlay: String },
    legs: { has_legs: Boolean, type: String, height: Number, material: String }
  },
  interior: {
    adjustable_shelves: Number,
    dividers: Number,
    cable_management: Boolean
  },
  cut_list: Array,
  assembly_instructions: Array,
  estimated_cost: Number,
  output: {
    cut_list: Boolean,
    assembly_instructions: Boolean,
    3d_preview: Boolean,
    ar_preview: Boolean,
    export_formats: Array
  },
  ai_guidance: {
    warnings: Array,
    suggestions: Array,
    rule_validation_passed: Boolean
  },
  created_at: Date,
  updated_at: Date,
  version: Number
}
```

#### `templates`

```javascript
{
  _id: ObjectId,
  name: String,
  description: String,
  category: String,
  author_id: ObjectId (ref: users),
  project_data: Object (project schema subset),
  thumbnail_url: String,
  downloads: Number,
  rating: Number,
  created_at: Date,
  is_public: Boolean
}
```

#### `ai_cache`

```javascript
{
  _id: ObjectId,
  prompt_hash: String (indexed),
  response: Object,
  model: String,
  created_at: Date,
  ttl: Date (TTL index for auto-deletion)
}
```

## 5.3 API Structure

### REST Endpoints

#### Authentication

- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login (returns JWT)
- `POST /api/auth/refresh` - Refresh JWT token
- `GET /api/auth/profile` - Get current user profile

#### Projects

- `GET /api/projects` - List user's projects
- `POST /api/projects` - Create new project
- `GET /api/projects/:id` - Get project details
- `PUT /api/projects/:id` - Update project
- `DELETE /api/projects/:id` - Delete project
- `POST /api/projects/:id/duplicate` - Clone project

#### AI Assistant

- `POST /api/ai/validate` - Validate design feasibility
- `POST /api/ai/suggest` - Get design suggestions
- `POST /api/ai/optimize` - Optimize cut list

#### Export

- `GET /api/export/:id/pdf` - Generate PDF cut list
- `GET /api/export/:id/csv` - Generate CSV cut list
- `GET /api/export/:id/dxf` - Generate DXF file
- `GET /api/export/:id/sketchup` - Generate SketchUp file

#### Templates

- `GET /api/templates` - Browse public templates
- `GET /api/templates/:id` - Get template details
- `POST /api/templates` - Create template from project
- `POST /api/templates/:id/use` - Create project from template

## 5.4 Frontend Architecture

### Vue 3 Component Structure

```
src/
├── components/
│   ├── common/
│   │   ├── Button.vue
│   │   ├── Input.vue
│   │   └── Modal.vue
│   ├── project/
│   │   ├── ProjectWizard.vue
│   │   ├── DimensionInput.vue
│   │   ├── DrawerConfig.vue
│   │   ├── DoorConfig.vue
│   │   └── HardwareSelector.vue
│   ├── custom-features/
│   │   ├── CustomFeaturePanel.vue
│   │   ├── TopDesigner.vue
│   │   ├── FrontDesigner.vue
│   │   └── LegDesigner.vue
│   ├── visualization/
│   │   ├── Preview3D.vue
│   │   └── ARPreview.vue
│   └── export/
│       └── CutListViewer.vue
├── views/
│   ├── Home.vue
│   ├── Dashboard.vue
│   ├── ProjectEditor.vue
│   └── Templates.vue
├── stores/
│   ├── auth.ts
│   ├── project.ts
│   └── ui.ts
├── services/
│   ├── api.ts
│   ├── ai.ts
│   └── export.ts
└── utils/
    ├── calculations.ts
    ├── validators.ts
    └── formatters.ts
```

## 5.5 Security & Authentication

- **JWT-based authentication** with refresh tokens
- **Password hashing** using bcrypt (12 rounds)
- **Rate limiting** on all API endpoints (100 req/15min per IP)
- **AI rate limiting** (20 req/hour per user)
- **Input sanitization** using express-validator
- **CORS** configured for frontend domain only
- **Helmet.js** for security headers
- **HTTPS only** in production

## 5.6 Deployment Architecture

```
┌─────────────┐
│   Nginx     │ (SSL termination, static files)
└──────┬──────┘
       │
┌──────▼──────┐
│  Vue App    │ (Static SPA)
│  (Vite)     │
└─────────────┘

┌─────────────┐
│   Nginx     │ (Reverse proxy)
└──────┬──────┘
       │
┌──────▼──────┐
│  Node.js    │ (Express API)
│  Backend    │
└──────┬──────┘
       │
┌──────▼──────┐
│  MongoDB    │ (Atlas or self-hosted)
│  Atlas      │
└─────────────┘

┌─────────────┐
│  OpenAI API │ (External service)
└─────────────┘

┌─────────────┐
│  S3/GridFS  │ (File storage)
└─────────────┘
```

---
