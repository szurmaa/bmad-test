# Story 1.1: Set Up Initial Project from Starter Template

Status: done

## Story

As a developer,
I want to initialize the app using the selected Expo SDK 55 starter template,
so that implementation starts from the approved architecture baseline.

## Acceptance Criteria

1. Given architecture specifies Expo official starter, when project setup begins, then the repository is initialized with `npx create-expo-app@latest habit-dice --template default@sdk-55` and initial dependencies install successfully.
2. Given the starter project is created, when baseline checks run, then app boots to default screen without runtime errors and unit/integration/E2E pipeline scaffolding commands are available.

## Tasks / Subtasks

- [x] Initialize the mobile app from approved starter (AC: 1)
  - [x] Run `npx create-expo-app@latest habit-dice --template default@sdk-55`.
  - [x] Confirm TypeScript project generation and dependency installation complete with no errors.
- [x] Align starter with architecture guardrails (AC: 1, 2)
  - [x] Ensure Expo Router baseline remains active.
  - [x] Add placeholder module boundaries for `features`, `lib/firebase`, and `db` to match architecture direction.
  - [x] Add baseline environment config placeholders for dev/preview/prod Firebase projects.
- [x] Establish test command scaffolding (AC: 2)
  - [x] Add `test`, `test:watch`, and `test:e2e` scripts in package config.
  - [x] Add minimal placeholder setup files for unit/integration and Playwright E2E to verify command execution path.
- [x] Validate starter runtime and command path (AC: 2)
  - [x] Run app boot check.
  - [x] Run test command dry-runs to ensure scaffold is executable.

## Dev Notes

- Use the exact starter command mandated by architecture; do not substitute alternate templates.
- Preserve the architecture boundaries from day one: screen composition only in routes, data access in repositories/services.
- This story is foundation for FR1-FR3 onboarding work and should not implement onboarding UX yet.

### Technical Requirements

- Starter command: `npx create-expo-app@latest habit-dice --template default@sdk-55`
- Stack baseline to preserve: Expo SDK 55, Expo Router, Firebase integration path, `expo-sqlite`, Zod 4, TanStack Query v5
- Environment model: separate dev, preview, and production Firebase projects

### Architecture Compliance

- Follow feature-first project organization.
- Enforce boundary rule early: screens/routes do not call SQLite or Firebase directly.
- Keep SQLite as intended local source of truth in upcoming stories.

### Library / Framework Requirements

- React Native via Expo SDK 55 starter
- Expo Router for navigation baseline
- Firebase SDK path planned for auth/sync/push/crash reporting
- `expo-sqlite` reserved for local-first domain data layer
- Zod 4 validation at boundaries
- TanStack Query v5 only for remote/server state

### File Structure Requirements

- Mobile app target location: `apps/mobile/` (or equivalent canonical location adopted in repo)
- Planned modules:
  - `apps/mobile/src/features/`
  - `apps/mobile/src/lib/firebase/`
  - `apps/mobile/src/db/`

### Testing Requirements

- Unit tests: command scaffolding and baseline runner invocation
- Integration tests: starter app boots and core modules resolve
- E2E tests: initial Playwright command scaffold executes

### Project Structure Notes

- No prior implementation story exists, so there are no inherited code constraints yet.
- This story must create the baseline used by all subsequent stories and should avoid adding feature logic.

### References

- Source: `_bmad-output/planning-artifacts/epics.md` (Epic 1, Story 1.1)
- Source: `_bmad-output/planning-artifacts/architecture.md` (starter selection, stack decisions, boundaries)
- Source: `_bmad-output/planning-artifacts/prd.md` (FR1-FR3 onboarding foundation)
- Source: `_bmad-output/planning-artifacts/ux-design-specification.md` (low-friction onboarding intent)

## Dev Agent Record

### Agent Model Used

GPT-5.3-Codex

### Debug Log References

- create-expo-app scaffold command completed successfully in `apps/habit-dice`, then moved to `apps/mobile`.
- Validation commands: `npm run test`, `npm run test:watch`, `npm run test:e2e`, `CI=1 npx expo start --offline --port 8089`.

### Implementation Plan

- Scaffold Expo SDK 55 baseline using the mandated template command.
- Move app to canonical `apps/mobile` location and preserve Expo Router entrypoint.
- Add architecture boundary placeholders for feature, firebase, and database layers.
- Add baseline environment placeholders for development, preview, and production Firebase projects.
- Add minimal executable test-path scaffolding for unit/integration and E2E.
- Validate command execution and starter runtime boot path.

### Completion Notes List

- Expo SDK 55 starter template created successfully with TypeScript and Expo Router baseline.
- Project moved to `apps/mobile` to align with architecture file structure requirements.
- Module boundary placeholders created at `src/features`, `src/lib/firebase`, and `src/db`.
- Firebase environment placeholders created for dev/preview/prod and `firebaseConfigFromEnv` helper added.
- Test scripts (`test`, `test:watch`, `test:e2e`) now execute successfully via placeholder runners.
- Boot validation completed with Metro startup in CI/offline mode at `http://localhost:8089`.

### File List

- `_bmad-output/implementation-artifacts/1-1-set-up-initial-project-from-starter-template.md`
- `apps/mobile/`
- `apps/mobile/package.json`
- `apps/mobile/.env.development`
- `apps/mobile/.env.preview`
- `apps/mobile/.env.production`
- `apps/mobile/src/features/README.md`
- `apps/mobile/src/lib/firebase/README.md`
- `apps/mobile/src/lib/firebase/config.ts`
- `apps/mobile/src/db/README.md`
- `apps/mobile/scripts/run-unit-integration-placeholder.mjs`
- `apps/mobile/scripts/run-e2e-placeholder.mjs`
- `apps/mobile/playwright.config.js`
- `apps/mobile/e2e/smoke.spec.ts`

## Change Log

- 2026-04-10: Completed Story 1.1 implementation, validated runtime startup, and enabled baseline test command scaffolding.
