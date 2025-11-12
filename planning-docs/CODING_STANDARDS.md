# SmartCut Builder v1.0 – Coding Standards

## General Guidelines

| Item                | Standard                                                                          |
| ------------------- | --------------------------------------------------------------------------------- |
| **Language**        | TypeScript (frontend & backend)                                                   |
| **Framework**       | Vue 3 (Composition API + Pinia), Express (Node 20)                                |
| **Database**        | MongoDB (Mongoose or Prisma); consider PostgreSQL if heavy relational data arises |
| **Package Manager** | npm (>= 10) or yarn (preferred for consistency)                                   |
| **Linting**         | ESLint (airbnb-base + typescript), Prettier                                       |
| **Formatting**      | Prettier (single‑quote, 2 spaces)                                                 |
| **Testing**         | Jest (unit/integration) + Vue Test Utils, Supertest (API), AI stubs               |
| **CI/CD**           | GitHub Actions / GitLab CI                                                        |
| **Branching**       | GitFlow (feature/…, develop, main)                                                |
| **Commit Messages** | Conventional Commits (`feat:`, `fix:`, `docs:`, etc.)                             |
| **Code Reviews**    | Minimum 1 reviewer, automated lint & test check                                   |
| **Documentation**   | Markdown in `docs/`, automatic API docs with Swagger or GraphQL introspection     |
| **Environment**     | `.env.example`, secrets via GitHub Secrets / GitLab CI variables                  |
| **Docker**          | Dockerfile for backend + Vue CLI dev server; `docker-compose` for local dev       |

## Naming Conventions

| Category          | Style              | Example                  |
| ----------------- | ------------------ | ------------------------ |
| Files             | `kebab-case.md`    | `architecture.md`        |
| Components        | `PascalCase.vue`   | `CustomFeaturePanel.vue` |
| Vue Props         | `camelCase`        | `maxDrawers`             |
| Vue State (Pinia) | `camelCase`        | `projectStore`           |
| DB Fields         | `snake_case`       | `material_thickness`     |
| Constants         | `UPPER_SNAKE_CASE` | `DEFAULT_THICKNESS`      |

## Security & Compliance

- Use `helmet` & `cors` on Express.
- Sanitize all user input before persisting.
- Rate‑limit AI requests to avoid token over‑use.
- Store sensitive data (API keys) in environment variables only.

## Performance Tips

- Use `async/await` consistently; avoid callback hell.
- Cache expensive AI responses in Redis (optional).
- Debounce UI inputs to reduce computation load.
