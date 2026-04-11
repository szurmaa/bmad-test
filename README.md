# bmad

This repository contains the Habit Dice implementation workspace with BMAD planning/implementation artifacts plus app code for:

- Mobile app: Expo + React Native + TypeScript
- Backend service: Node.js HTTP service with health/readiness endpoints
- Containerized local stack: Docker Compose (mobile-web + backend + Postgres)

## Quick start

1. Install mobile dependencies:

```bash
cd apps/mobile
npm install
```

2. Install backend dependencies:

```bash
cd ../backend
npm install
```

3. Run backend:

```bash
npm run start
```

4. Run mobile app in a separate terminal:

```bash
cd ../mobile
npm run start
```

For web preview:

```bash
npm run web
```

## Tests

- Mobile unit/integration tests:

```bash
cd apps/mobile
npm test
```

- Mobile E2E tests:

```bash
cd apps/mobile
npm run test:e2e
```

- Backend tests:

```bash
cd apps/backend
npm test
```

## QA / Reports

Recent QA outputs are written to:

- `_bmad-output/test-artifacts/`

Key reports include coverage, performance, accessibility, and security artifacts generated during Epic 14.

## Containerized development (Docker)

Start development profile:

```bash
docker compose --profile dev --env-file docker/compose.dev.env up -d --build
```

Start test profile:

```bash
docker compose --profile test --env-file docker/compose.test.env up -d --build
```

Stop stack and remove volumes:

```bash
docker compose --profile dev --env-file docker/compose.dev.env down -v
```

Service endpoints (dev profile defaults):

- Mobile web: http://localhost:8080
- Backend: http://localhost:3000
- Backend health: http://localhost:3000/healthz
- Backend readiness: http://localhost:3000/readyz
- Mobile health: http://localhost:8080/healthz
- Mobile readiness: http://localhost:8080/readyz

## Project structure

- `_bmad/`: BMAD module/workflow definitions
- `_bmad-output/planning-artifacts/`: PRD, architecture, epics, UX outputs
- `_bmad-output/implementation-artifacts/`: story files, sprint status, retrospectives
- `_bmad-output/test-artifacts/`: QA evidence reports and raw outputs
- `apps/mobile/`: Expo mobile app
- `apps/backend/`: backend service
- `docker/`: compose env and docker documentation

## Notes

- Node.js 20+ is required for the backend and tooling used in this workspace.
- Sprint/source-of-truth status is tracked in `_bmad-output/implementation-artifacts/sprint-status.yaml`.
