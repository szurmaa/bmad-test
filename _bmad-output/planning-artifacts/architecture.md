---
stepsCompleted: ["step-01-init", "step-02-context", "step-03-starter", "step-04-decisions", "step-05-patterns", "step-06-structure", "step-07-validation", "step-08-complete"]
inputDocuments: ["_bmad-output/planning-artifacts/prd.md", "_bmad-output/planning-artifacts/product-brief-habit-dice.md"]
workflowType: 'architecture'
project_name: 'Habit Dice'
user_name: 'aszurma'
date: '2026-04-10'
lastStep: 8
status: 'complete'
completedAt: '2026-04-10'
---

# Architecture Decision Document

_This document builds collaboratively through step-by-step discovery. Sections are appended as we work through each architectural decision together._

## Project Context Analysis

### Requirements Overview

**Functional Requirements:** 33 FRs across 8 capability areas: Onboarding, Daily Roll, Consecutive Days-Played Counter, Mood Log, Push Notifications, Offline Functionality, Data & Sync, Internal Task Library Management, and Analytics.

**Non-Functional Requirements driving architecture:**
- Performance: roll animation <= 1.5 seconds, cold start < 3 seconds on mid-range Android, no network round-trip on the roll path
- Security: user-scoped Firebase security rules, HTTPS/TLS enforced, privacy policy required
- Scalability: Firebase architecture expected to scale to 100K MAU without infrastructure redesign
- Reliability: 99.5% crash-free target, offline-first core flows, silent sync failures
- Accessibility: WCAG 2.1 AA, 44x44pt touch targets, VoiceOver/TalkBack compatibility

**Scale & Complexity:**
- Primary domain: React Native mobile app (iOS + Android)
- Complexity level: Low-to-medium
- Estimated architectural components: 5

### Technical Constraints & Dependencies

- React Native is fixed by the PRD as the primary mobile framework
- Firebase is the required backend service family: Auth, Firestore, push delivery, and Crashlytics
- Task library must support server-side hot-reload without app releases or restarts
- Core user actions must remain fully functional in airplane mode indefinitely
- Anonymous auth is the starting state; explicit auth enables cross-device sync

### Cross-Cutting Concerns Identified

- Offline/sync reconciliation between local writes and Firebase aggregates
- Local-time-based reset logic for reroll enforcement
- Anonymous-to-authenticated identity migration without data loss
- Remote task library versioning and cache safety during updates

## Starter Template Evaluation

### Primary Technology Domain

Mobile app, based on the PRD's React Native requirement, offline-first behavior, push notifications, and native mobile UX expectations.

### Starter Options Considered

**Option 1: Expo official starter**
- Current command: `npx create-expo-app@latest habit-dice --template default@sdk-55`
- Officially recommended by both Expo and React Native
- Gives a minimal, current, well-supported baseline
- Best fit for a product that needs custom architecture decisions rather than a large preloaded boilerplate

**Option 2: Ignite v11.5.0**
- Current command: `npx ignite-cli@latest new HabitDice`
- Actively maintained, battle-tested, recently upgraded to Expo SDK 55
- Includes strong defaults: TypeScript, React Navigation, Reanimated, MMKV, testing setup, generators
- More opinionated than needed for Habit Dice's initial scope
- Best fit when the team wants a fuller boilerplate with more architecture pre-decided

### Selected Starter: Expo official starter

**Rationale for Selection:**
Habit Dice needs a lightweight, current React Native foundation with minimal imposed architecture. Expo's official starter provides the cleanest base for offline-first local data modeling, Firebase integration, push notifications, custom roll animation UX, and a separate admin web tool later, without forcing shared assumptions from a heavier boilerplate.

Ignite is viable, but it introduces more preselected structure than this product currently benefits from.

**Initialization Command:**

```bash
npx create-expo-app@latest habit-dice --template default@sdk-55
```

**Architectural Decisions Provided by Starter:**

**Language & Runtime:**
- TypeScript-first Expo / React Native foundation
- Expo SDK 55 aligned with current Expo guidance

**Styling Solution:**
- Minimal default styling baseline
- Leaves UI system choice open for architecture decisions later

**Build Tooling:**
- Expo-managed workflow
- EAS-compatible path for builds and submissions

**Testing Framework:**
- Basic starter baseline; fuller testing stack should be added intentionally rather than inherited implicitly

**Code Organization:**
- Expo standard project structure
- Good fit for a deliberately designed feature/module architecture

**Development Experience:**
- Current CLI, active maintenance, React Native ecosystem alignment, straightforward onboarding for implementation agents

**Note:** Project initialization using this command should be the first implementation story.

## Core Architectural Decisions

### Decision Priority Analysis

**Critical Decisions (Block Implementation):**
- Local data architecture: expo-sqlite as the source of truth for on-device user state
- Cloud sync architecture: Firebase Auth + Firestore for identity and cross-device aggregate sync
- Navigation architecture: Expo Router
- Validation architecture: Zod 4 for runtime schemas at app boundaries
- State ownership model: local-first domain state, remote-sync state separated from UI state

**Important Decisions (Shape Architecture):**
- Repository pattern between screens and persistence
- Firestore sync model based on aggregate documents plus append-safe event records
- Query/caching layer for remote reads using TanStack Query v5
- Admin tool split into separate web app, not embedded in mobile client
- CI/CD via GitHub Actions + EAS Build/Submit

**Deferred Decisions (Post-MVP):**
- Whether the admin tool should share a monorepo with the mobile app
- Whether Cloud Functions are required beyond sync helpers
- Social sharing backend shape
- Preference-learning / task personalization model

### Data Architecture

- **Local database:** `expo-sqlite` (~55.0.15) via `SQLiteProvider`
- **Local source of truth:** SQLite for roll state, reroll usage, local task catalog cache, mood logs, completion history, and days-played event log
- **Data modeling approach:** normalized relational schema with explicit tables for `tasks`, `daily_rolls`, `task_completions`, `mood_logs`, `sync_queue`, and `user_profile`
- **Migration strategy:** SQL migrations run through startup migration pipeline with schema versioning via `PRAGMA user_version`
- **Validation strategy:** Zod 4 schemas at repository boundaries for remote payloads, local persistence inputs, and feature service outputs
- **Caching strategy:** SQLite is the durable cache; no duplicate persistence layer for domain data

### Authentication & Security

- **Authentication method:** Firebase Authentication with anonymous auth as the default entry state
- **Identity upgrade path:** anonymous account can later link to explicit auth for cross-device continuity
- **Authorization pattern:** Firebase Security Rules scoped by authenticated UID
- **Local data protection:** standard app sandbox storage in MVP; SQLCipher deferred unless the threat model changes
- **Secrets handling:** environment secrets injected through Expo/EAS environment configuration

### API & Communication Patterns

- **Primary client/backend communication:** direct SDK integration with Firebase services; no custom REST API in MVP
- **Cloud data model:** Firestore holds user aggregates and sync-safe records, not the primary live UX state
- **Error handling standard:** repository/service layer returns typed domain errors; UI renders product-safe fallbacks
- **Push approach:** Firebase-backed notification flow compatible with Expo-managed workflow
- **Admin communication pattern:** separate admin web app writes approved task library content to the shared backend datastore

### Frontend Architecture

- **Routing:** Expo Router
- **Component architecture:** feature-first modules with shared UI primitives underneath
- **State management:** local domain state via repository + SQLite-backed services, remote server state via TanStack Query v5, ephemeral UI state via React state/context
- **Animation architecture:** Reanimated-based isolated motion components for roll and completion experiences
- **Boundary rule:** screens do not talk to Firebase or SQLite directly; they call feature services and repositories

### Infrastructure & Deployment

- **Mobile delivery:** Expo managed workflow with EAS Build / Submit
- **Backend platform:** Firebase
- **CI/CD:** GitHub Actions for lint, typecheck, tests, and release workflows
- **Monitoring:** Crashlytics for crash reporting and analytics aligned to PRD metrics
- **Environment model:** separate development, preview, and production Firebase projects

### Decision Impact Analysis

**Implementation Sequence:**
1. Initialize Expo SDK 55 app with Expo Router
2. Establish folder/module architecture
3. Add Firebase Auth / Firestore / Crashlytics configuration
4. Add SQLite provider, schema, and migration pipeline
5. Implement repository layer and sync queue
6. Build roll flow on top of local-first services
7. Add notifications and deep linking
8. Build admin tool against the shared content backend

**Cross-Component Dependencies:**
- Reroll and days-played logic depend on the local database schema and midnight-reset service
- Cross-device continuity depends on anonymous-to-auth identity linking
- Task hot-reload depends on remote content versioning plus local cache reconciliation
- Analytics correctness depends on repository-level event emission, not screen-level ad hoc tracking

## Implementation Patterns & Consistency Rules

### Pattern Categories Defined

**Critical Conflict Points Identified:** 10 areas where AI agents could make incompatible choices: database schema naming, file/module naming, route naming, repository/service boundaries, Firestore document naming, error object shapes, sync queue formats, analytics event naming, loading-state handling, and test placement.

### Naming Patterns

**Database Naming Conventions:**
- Tables use `snake_case` plural nouns: `tasks`, `daily_rolls`, `mood_logs`
- Columns use `snake_case`: `task_id`, `rolled_at`, `completed_at`
- Primary key is always `id`
- Foreign keys use `<referenced_table_singular>_id`: `task_id`, `user_id`
- Boolean columns use positive names: `is_completed`, `is_active`
- Indexes use `idx_<table>_<column_list>`

**Firestore Naming Conventions:**
- Collections use lowercase plural nouns or explicit aggregate/event names: `users`, `task_catalog_versions`, `sync_events`
- Aggregate documents use explicit names under scoped paths, e.g. `users/{uid}/aggregates/current`

**Route Naming Conventions:**
- Expo Router file segments use lowercase filenames
- Dynamic route segments use camelCase param names in brackets: `[taskId].tsx`

**Code Naming Conventions:**
- React components, repositories, services, and types use `PascalCase`
- Hooks use `useXxx`
- Variables and functions use `camelCase`
- Constants use `SCREAMING_SNAKE_CASE` only for true constants

### Structure Patterns

**Project Organization:**
- Organize mobile app code by feature first, then by layer inside the feature
- Shared primitives live in shared folders, not feature folders
- Screens/routes stay thin; business logic lives in repositories, services, and use-cases
- Admin web app is a separate app root, not mixed into the mobile app tree

**Feature Module Shape:**
- `components/`
- `hooks/`
- `repository/`
- `services/`
- `schemas/`
- `types/`
- `__tests__/`

**Shared Structure:**
- `src/lib/` for framework integrations and low-level adapters
- `src/ui/` for shared design-system primitives
- `src/config/` for typed configuration
- `src/analytics/` for event definitions and emitters
- `src/db/` for schema, migrations, and provider setup

### Format Patterns

**Repository Result Formats:**
- Repositories return typed domain objects, never raw SQLite rows or Firestore snapshots
- No repository exposes SDK-specific shapes directly to screens

**Error Format:**
- Domain/application errors use a shared typed shape with `code`, `message`, `recoverable`, and `context`
- User-facing copy is mapped from domain errors in the UI layer

**Date & Time Format:**
- Persist UTC timestamps as ISO 8601 strings
- Persist local-date concepts separately where product semantics depend on local day boundaries, e.g. `rolled_for_local_date`

**JSON/Data Naming:**
- TypeScript and app-level objects use `camelCase`
- SQLite schema uses `snake_case`
- Conversion happens at repository boundaries only

### Communication Patterns

**Analytics Event Patterns:**
- Event names use `snake_case` action style: `daily_roll_started`, `daily_roll_completed`, `mood_log_submitted`
- Event payloads include timestamp and source context
- Events are emitted from use-cases/services, not directly from UI components where avoidable

**Sync Queue Patterns:**
- Local sync queue records are append-only
- Each sync item includes `id`, `event_type`, `payload`, `created_at`, `sync_status`, and `retry_count`
- Sync processors must be idempotent

**State Management Patterns:**
- SQLite-backed domain state and remote Firebase state must not be merged into one ad hoc global store
- TanStack Query is only for remote/server state
- React local state/context is only for ephemeral UI state

### Process Patterns

**Error Handling Patterns:**
- Repositories never swallow errors silently
- Infrastructure errors are translated into typed domain errors
- Offline is treated as an expected state, not an exceptional one

**Loading State Patterns:**
- Route-level blocking load only for first-mount critical bootstrapping
- Feature actions use local pending states scoped to the action
- Background sync never blocks the primary roll flow

**Validation Patterns:**
- External inputs are validated with Zod at boundaries: Firebase payloads, route params, admin submissions, environment config
- Internal trusted domain objects are not repeatedly revalidated

### Enforcement Guidelines

**All AI Agents MUST:**
- Keep screens/routes thin and move business logic into feature services, repositories, and use-cases
- Convert between `snake_case` persistence and `camelCase` domain models only at repository boundaries
- Treat SQLite as the local source of truth for user-facing flows and Firebase as asynchronous sync infrastructure

### Pattern Examples

**Good Examples:**
- `src/features/daily-roll/repository/RollRepository.ts`
- SQLite row `{ rolled_for_local_date, task_id }` -> domain object `{ rolledForLocalDate, taskId }`
- Analytics event `daily_roll_completed`
- Route file `app/settings.tsx`

**Anti-Patterns:**
- Screens importing Firestore directly
- Mixed naming in the same layer, e.g. `task_id` in React components
- Storing canonical roll state in React context instead of SQLite-backed repositories
- Feature-specific helpers dumped into a global `utils.ts`

## Project Structure & Boundaries

### Complete Project Directory Structure

```text
habit-dice/
├── README.md
├── package.json
├── pnpm-workspace.yaml
├── turbo.json
├── tsconfig.base.json
├── .gitignore
├── .npmrc
├── .env.example
├── .github/
│   └── workflows/
│       ├── mobile-ci.yml
│       ├── admin-ci.yml
│       └── release.yml
├── apps/
│   ├── mobile/
│   │   ├── app.json
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   ├── babel.config.js
│   │   ├── metro.config.js
│   │   ├── app/
│   │   │   ├── _layout.tsx
│   │   │   ├── index.tsx
│   │   │   ├── settings.tsx
│   │   │   ├── history.tsx
│   │   │   └── tasks/
│   │   │       └── [taskId].tsx
│   │   ├── src/
│   │   │   ├── analytics/
│   │   │   ├── config/
│   │   │   ├── db/
│   │   │   │   ├── schema/
│   │   │   │   └── migrations/
│   │   │   ├── features/
│   │   │   │   ├── daily-roll/
│   │   │   │   ├── task-completion/
│   │   │   │   ├── mood-log/
│   │   │   │   ├── days-played/
│   │   │   │   ├── onboarding/
│   │   │   │   ├── notifications/
│   │   │   │   ├── task-catalog/
│   │   │   │   ├── auth/
│   │   │   │   └── sync/
│   │   │   ├── lib/
│   │   │   │   ├── firebase/
│   │   │   │   ├── query/
│   │   │   │   └── errors/
│   │   │   ├── ui/
│   │   │   └── types/
│   │   ├── assets/
│   │   │   ├── fonts/
│   │   │   ├── icons/
│   │   │   └── animations/
│   │   └── tests/
│   │       ├── integration/
│   │       └── e2e/
│   └── admin/
│       ├── package.json
│       ├── tsconfig.json
│       ├── next.config.ts
│       ├── app/
│       │   ├── layout.tsx
│       │   ├── page.tsx
│       │   ├── tasks/
│       │   │   ├── page.tsx
│       │   │   └── [taskId]/
│       │   │       └── page.tsx
│       │   └── reviews/
│       │       └── page.tsx
│       ├── src/
│       │   ├── features/
│       │   │   ├── task-management/
│       │   │   ├── review-queue/
│       │   │   └── analytics/
│       │   ├── lib/
│       │   ├── ui/
│       │   └── config/
│       └── tests/
│           ├── integration/
│           └── e2e/
├── packages/
│   ├── shared-schemas/
│   │   └── src/
│   ├── firebase-contracts/
│   │   └── src/
│   └── eslint-config/
└── docs/
	└── architecture-notes/
```

### Architectural Boundaries

**API Boundaries:**
- Mobile app talks directly to Firebase SDKs for auth, sync, analytics, and notifications
- Admin app talks directly to Firebase/Firestore for catalog management
- No custom API layer in MVP
- All external service access goes through `src/lib/` adapters, never directly from routes/screens

**Component Boundaries:**
- Expo Router route files are composition shells only
- Feature components call feature hooks
- Feature hooks call services/use-cases
- Services/use-cases call repositories
- Repositories are the only layer allowed to touch SQLite and Firestore payload conversion

**Service Boundaries:**
- One service per business action where practical: roll task, reroll task, complete task, submit mood log, sync pending events
- Shared infra services stay in `src/lib/`
- No cross-feature imports that bypass service/repository contracts

**Data Boundaries:**
- SQLite is the local source of truth for user-facing flows
- Firestore is remote sync/storage and aggregate backing store
- Shared schema contracts live in `packages/shared-schemas`
- `snake_case` only at persistence boundary; `camelCase` everywhere else

### Requirements to Structure Mapping

**FR Category Mapping:**
- Onboarding -> `apps/mobile/src/features/onboarding/`
- Daily Roll -> `apps/mobile/src/features/daily-roll/`
- Consecutive Days-Played Counter -> `apps/mobile/src/features/days-played/`
- Mood Log -> `apps/mobile/src/features/mood-log/`
- Push Notifications -> `apps/mobile/src/features/notifications/`
- Offline Functionality -> `apps/mobile/src/features/sync/` + `apps/mobile/src/db/`
- Data & Sync -> `apps/mobile/src/features/sync/`, `apps/mobile/src/lib/firebase/`, `apps/mobile/src/db/`
- Internal Task Library Management -> `apps/admin/src/features/task-management/`
- Analytics -> `apps/mobile/src/analytics/` + `apps/admin/src/features/analytics/`

**Cross-Cutting Concerns:**
- Authentication -> `apps/mobile/src/features/auth/` and `apps/mobile/src/lib/firebase/`
- Error model -> `apps/mobile/src/lib/errors/`
- Shared schemas -> `packages/shared-schemas/`
- Environment/config -> `apps/*/src/config/`

### Integration Points

**Internal Communication:**
- Route -> hook -> service/use-case -> repository -> persistence/backend
- Analytics emitted from service/use-case boundary
- Sync queue consumed by sync feature, not by unrelated feature modules

**External Integrations:**
- Firebase Auth for anonymous/authenticated identity
- Firestore for aggregates, task catalog versioning, and admin-authored content
- Crashlytics for crash reporting
- Notification provider through Expo/Firebase-compatible setup

**Data Flow:**
- User action writes to SQLite first
- Repository records sync event into local queue
- Sync feature pushes remote-safe events/aggregates to Firestore
- Remote task catalog updates reconcile into local cache
- UI reads from local-first repositories for primary flows

### File Organization Patterns

**Configuration Files:**
- Root-level workspace config at repo root
- App-specific config inside each app
- Typed env loaders in each app's `src/config/`

**Source Organization:**
- Feature-first within apps
- Shared infra in `lib/`
- Shared UI in `ui/`
- Shared contracts in `packages/`

**Test Organization:**
- Unit/integration tests close to owning feature or app
- E2E tests at app-level test roots
- No central catch-all test folder for unrelated features

**Asset Organization:**
- Mobile-only assets stay in `apps/mobile/assets/`
- No feature-specific assets hidden in random component folders unless tightly scoped

### Development Workflow Integration

**Development Server Structure:**
- Mobile app and admin app run independently
- Shared packages build/watch through workspace tooling

**Build Process Structure:**
- Mobile builds through Expo/EAS
- Admin builds independently through its web framework
- Shared packages consumed as internal workspace packages

**Deployment Structure:**
- Mobile deployed through app stores
- Admin deployed as separate web app
- Firebase backend shared across both surfaces with environment isolation by project

## Architecture Validation Results

### Coherence Validation ✅

**Decision Compatibility:**
The selected stack is coherent. Expo SDK 55, Expo Router, Firebase, expo-sqlite, TanStack Query v5, and Zod 4 are compatible and fit the PRD's local-first mobile requirements. No decision conflicts were found.

**Pattern Consistency:**
The implementation patterns support the architectural decisions. Naming, structure, persistence boundaries, route conventions, and error/state handling all reinforce the chosen stack rather than fighting it.

**Structure Alignment:**
The project structure cleanly supports the architecture: a mobile app for user-facing flows, a separate admin app for internal task operations, shared packages for contracts and schemas, and an explicit repository boundary for SQLite/Firebase access.

### Requirements Coverage Validation ✅

**Feature Coverage:**
All FR categories from the PRD map to concrete architectural modules: onboarding, daily roll, task completion, mood log, days-played, notifications, sync, task catalog/admin, and analytics.

**Functional Requirements Coverage:**
All 33 functional requirements are architecturally supported. No FR requires an additional architectural capability beyond what is already documented.

**Non-Functional Requirements Coverage:**
All NFRs are addressed architecturally:
- Performance: local-first reads, thin route layer, isolated animation components
- Security: Firebase auth + rules + typed config boundaries
- Scalability: Firebase-based backend with modular app split
- Accessibility: supported by shared UI layer and component boundaries
- Reliability: local SQLite source of truth and append-safe sync queue

### Implementation Readiness Validation ✅

**Decision Completeness:**
Critical decisions are documented with current versions or current tool lines where relevant. No implementation-blocking decision gaps remain.

**Structure Completeness:**
The project tree is specific enough for multiple agents to place code consistently and respect app/shared-package boundaries.

**Pattern Completeness:**
The major conflict points that typically break multi-agent implementation are addressed: naming, routing, repository boundaries, persistence model, sync queue shape, error model, and test placement.

### Gap Analysis Results

**Critical Gaps:** None

**Important Gaps:**
- Firebase document schema could later be expanded into a dedicated data contract appendix if stricter backend governance is needed
- Admin app auth model is implied but not yet spelled out in detail; this is not blocking for MVP architecture

**Nice-to-Have Gaps:**
- Sequence diagrams for roll -> local write -> sync -> analytics emission
- Explicit analytics taxonomy appendix
- Deployment environment naming conventions for Firebase projects

### Validation Issues Addressed

No blocking issues were found. The only remaining items are future-detail enhancements, not architectural blockers.

### Architecture Completeness Checklist

**✅ Requirements Analysis**
- [x] Project context thoroughly analyzed
- [x] Scale and complexity assessed
- [x] Technical constraints identified
- [x] Cross-cutting concerns mapped

**✅ Architectural Decisions**
- [x] Critical decisions documented with versions
- [x] Technology stack fully specified
- [x] Integration patterns defined
- [x] Performance considerations addressed

**✅ Implementation Patterns**
- [x] Naming conventions established
- [x] Structure patterns defined
- [x] Communication patterns specified
- [x] Process patterns documented

**✅ Project Structure**
- [x] Complete directory structure defined
- [x] Component boundaries established
- [x] Integration points mapped
- [x] Requirements to structure mapping complete

### Architecture Readiness Assessment

**Overall Status:** READY FOR IMPLEMENTATION

**Confidence Level:** High

**Key Strengths:**
- Strong alignment with the PRD's actual complexity level
- Explicit local-first data architecture
- Clear anti-conflict implementation rules for multiple agents
- Practical separation of product app vs internal admin surface

**Areas for Future Enhancement:**
- Admin auth detail
- Firebase collection contract appendix
- Rollout and release governance details

### Implementation Handoff

**AI Agent Guidelines:**
- Follow all architectural decisions exactly as documented
- Keep screens thin and persistence behind repositories
- Treat SQLite as the user-facing source of truth
- Use Firebase as asynchronous sync and remote aggregate infrastructure
- Respect the project structure and shared-package boundaries

**First Implementation Priority:**

```bash
npx create-expo-app@latest habit-dice --template default@sdk-55
```
