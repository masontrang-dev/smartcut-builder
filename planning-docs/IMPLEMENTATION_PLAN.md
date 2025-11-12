# SmartCut Builder v1.0 – Developer Implementation Plan

## High‑Level Phases

| Phase                        | Focus                                                         | Duration    | Key Deliverables                                     | Owner     |
| ---------------------------- | ------------------------------------------------------------- | ----------- | ---------------------------------------------------- | --------- |
| **0.0 – Kick‑off**           | Project set‑up, tooling, repo config                          | 1‑2 weeks   | Repo, CI/CD, Docker, ESLint, Prettier                | DevOps    |
| **1 – Core Engine**          | Box geometry, drawers/doors, rule engine                      | 4‑8 weeks   | `BoxEngine`, `RuleEngine`, cut‑list API              | Backend   |
| **2 – AI Assistant**         | Smart defaults, feasibility checks, custom‑feature validation | 6‑10 weeks  | `AIEngine`, prompt library, workshop‑profile adapter | AI        |
| **3 – Custom‑Feature Layer** | Optional design wizard, constraints, UI components            | 10‑14 weeks | `CustomFeatureEngine`, UI tabs, schema migration     | Frontend  |
| **4 – Visualization**        | 3‑D preview & AR                                              | 14‑18 weeks | Three.js/GLTF loader, Vue components                 | Frontend  |
| **5 – Export & Integration** | DXF/SketchUp, PDF cut‑lists, versioning                       | 18‑22 weeks | Export services, project manager                     | Backend   |
| **6 – Marketplace & Growth** | Template store, voice‑assistant, AR room preview              | 22‑30 weeks | Marketplace APIs, AR services, V3 features           | Full team |
| **7 – QA & Beta**            | Unit/integration/UX testing                                   | 30‑36 weeks | Test suites, beta release                            | QA        |

## Technical Roadmap by Sprint (2‑week sprints)

### Sprint 1–2 (0‑4 weeks)

- Repo bootstrap, Dockerfile, `.gitignore`
- MongoDB connection, Mongoose models (`Project`, `CustomFeatures`)
- Basic CRUD API for projects

### Sprint 3–4 (4‑8 weeks)

- Implement `BoxEngine` and geometry maths (fixed‑point, decimals)
- `RuleEngine` for gaps, clearances, joinery
- Unit tests for dimension calculations

### Sprint 5–6 (8‑12 weeks)

- AI integration (OpenAI API wrapper)
- Project wizard in Vue 3 (Vite + TS)
- Cut‑list PDF/CSV generation

### Sprint 7–8 (12‑16 weeks)

- Custom‑Feature wizard (tabs for tops, panels, splines, legs)
- AI validation layer for custom features
- Store schema migration and defaults

### Sprint 9–10 (16‑20 weeks)

- 3‑D preview component (Three.js)
- DXF export module
- Tool‑profile adapter (toolset → build guidance)

### Sprint 11–12 (20‑24 weeks)

- AR preview (WebXR)
- Marketplace API skeleton
- Voice‑assistant stub (optional)

### Sprint 13–14 (24‑28 weeks)

- Full end‑to‑end integration testing
- Beta release, feedback loop
- Documentation build (MkDocs/Docsify)

### Sprint 15–16 (28‑32 weeks)

- Performance optimisations
- CI/CD pipeline finalize
- Release v1.0

## Team Roles

- **Backend Lead** – API design, database schema, rule engine.
- **Frontend Lead** – Vue components, state management (Pinia).
- **AI Engineer** – Prompt design, inference integration, rule‑set versioning.
- **QA Lead** – Unit, integration, UI, AI validation tests.
- **DevOps** – Docker, CI/CD, monitoring.

## Dependencies & External Services

- **OpenAI GPT‑4** – for AI Assistant (cost‑tracked).
- **MongoDB Atlas** – primary data store (can switch to PostgreSQL if complex relational data needed).
- **Three.js + GLTF‑Loader** – 3‑D rendering.
- **Docker Compose** – local dev stack.
- **Vite + Vue 3 + TypeScript** – frontend.
- **Node.js 20 + Express** – backend.

---
