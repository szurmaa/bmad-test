# Story 1.3: Complete Onboarding in Four Taps

Status: in-progress

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a new user,
I want onboarding to finish in four or fewer taps,
so that I can reach the daily roll quickly.

## Acceptance Criteria

1. Given a first-time user starts onboarding, when they complete the guided steps, then the app transitions to the home/roll screen within four taps and no habit pre-commitment is required.
2. Given onboarding is complete, when the user lands on home, then roll controls are immediately available and unit, integration, and E2E tests cover tap-count and navigation behavior.

## Tasks / Subtasks

- [x] Rework first-launch routing so onboarding is linear and starter navigation does not leak into the flow (AC: 1, 2)
  - [x] Replace or refactor the current starter tab shell in apps/mobile/src/app/_layout.tsx and apps/mobile/src/components/app-tabs.tsx so first-time users are not dropped into the Expo starter tabs.
  - [x] Remove or repurpose apps/mobile/src/app/explore.tsx so starter tutorial content is no longer reachable from the onboarding path.
  - [x] Keep the route layer thin: routing may read onboarding state through feature services/repositories, but must not talk directly to persistence.

- [x] Extend onboarding state to support explicit completion and first-run gating (AC: 1)
  - [x] Add the minimum local profile fields needed to know whether onboarding is complete, e.g. onboardingCompletedAt or equivalent state, in apps/mobile/src/db/.
  - [x] Extend apps/mobile/src/features/onboarding/repository/OnboardingProfileRepository.ts to expose domain-friendly onboarding read/write operations.
  - [x] Preserve Story 1.2 notification choice data and do not introduce a parallel local state store.

- [x] Implement the <=4 tap onboarding path with zero pre-commitment (AC: 1)
  - [x] Build the onboarding sequence on top of the existing notification permission gate in apps/mobile/src/features/onboarding/components/NotificationPermissionGate.tsx or a closely related onboarding flow component.
  - [x] Ensure the flow contains no habit planning, category selection, account creation, commitment slider, or any equivalent pre-commitment UI.
  - [x] Define and document the tap budget in code/tests so the onboarding path from first launch to home stays within four taps for both permission branches.

- [x] Introduce a home/roll landing screen with immediately available roll controls (AC: 2)
  - [x] Create a post-onboarding home screen or route shell with a visible primary Roll for Today control ready on arrival.
  - [x] Keep Story 2.1 boundaries intact: do not implement full daily roll persistence/random task selection yet unless strictly required as a lightweight shell for this acceptance criterion.
  - [x] Make the home screen legible and accessible on first landing, with the roll control visible without setup detours.

- [x] Add automated coverage for tap-count and navigation behavior (AC: 1, 2)
  - [x] Add unit tests for whichever onboarding state helper, reducer, or tap-budget logic is introduced.
  - [x] Add integration tests proving first-time users reach the home/roll screen within the allowed tap budget for both Allow and Not Now permission branches.
  - [x] Add E2E coverage that exercises first launch through onboarding completion and asserts the home screen exposes the roll control immediately.

- [ ] Validate the final onboarding experience (AC: 1, 2)
  - [ ] Run unit/integration/E2E tests covering the onboarding completion flow.
  - [ ] Run a boot check after routing changes to confirm the app still starts without runtime errors.

## Dev Notes

- Story 1.2 already implemented the optional notification permission choice and local persistence. Reuse that work; do not rebuild the permission flow from scratch.
- The critical job in this story is routing and onboarding completion behavior, not the full daily-roll engine. Keep Story 2.1 logic out unless a minimal roll-screen shell is required to satisfy visible home controls.
- The UX intent is explicit: onboarding must feel frictionless, safe, and setup-light. No account wall, no habit planning, no category preferences, no commitment ceremony.
- The current app still carries Expo starter structure in apps/mobile/src/app/_layout.tsx, apps/mobile/src/components/app-tabs.tsx, and apps/mobile/src/app/explore.tsx. Expect to simplify or replace those pieces.

### Technical Requirements

- Maintain the mobile baseline: Expo SDK 55, Expo Router entrypoint, expo-notifications, expo-sqlite, Zod 4, TanStack Query v5.
- Use the existing local-first persistence layer in apps/mobile/src/db/ as the only source of truth for onboarding completion state.
- The onboarding path must work for both notification permission outcomes already implemented in Story 1.2.
- Roll controls must be visible on the home screen immediately after onboarding completes.

### Architecture Compliance

- Keep screens/routes thin and move onboarding logic into feature components, services, and repositories.
- Keep SQLite/persistence naming in snake_case at the storage boundary and camelCase in app/domain objects.
- Do not call SQLite directly from route files.
- Treat the home/roll screen in this story as a shell for future roll mechanics, not the place to implement Story 2.1 business logic.

### Library / Framework Requirements

- Expo Router remains the routing baseline.
- expo-notifications remains the permission integration from Story 1.2.
- expo-sqlite remains the local source of truth for onboarding/profile state.
- Jest + Testing Library remain the unit/integration stack.
- Playwright remains the E2E path.

### File Structure Requirements

- Route shell: apps/mobile/src/app/_layout.tsx
- Entry route: apps/mobile/src/app/index.tsx
- Starter cleanup target: apps/mobile/src/app/explore.tsx
- Tab shell cleanup target: apps/mobile/src/components/app-tabs.tsx
- Onboarding feature: apps/mobile/src/features/onboarding/
- Local profile persistence: apps/mobile/src/db/

### Testing Requirements

- Verify the onboarding path completes in <=4 taps for a first-time user.
- Verify both Allow and Not Now branches can still complete onboarding.
- Verify no account creation or habit pre-commitment UI is introduced.
- Verify the home screen exposes a visible Roll for Today control immediately after onboarding.
- Verify app boot remains healthy after routing changes.

### Previous Story Intelligence

- Story 1.1 established the canonical app root at apps/mobile, Expo Router baseline, environment placeholders, and baseline dependency expectations.
- Story 1.2 replaced the starter home content with NotificationPermissionGate, introduced local onboarding-profile persistence, and proved the permission choice is non-blocking.
- Story 1.2 also revealed a continuity issue for this story: the route shell still includes Expo starter tabs and tutorial content, so 1.3 should consolidate onboarding and home navigation rather than layering more logic onto the starter shell.

### Project Structure Notes

- The current project tree still resembles the Expo starter more than the target architecture in a few route-level spots. This story is the right place to normalize first-launch navigation toward the Habit Dice flow.
- Prefer a minimal, direct route structure that can later host Story 2.x daily-roll behavior without another major reroute.

### References

- Source: _bmad-output/planning-artifacts/epics.md (Epic 1, Story 1.3)
- Source: _bmad-output/planning-artifacts/prd.md (Journey 1, FR1, FR3, Onboarding <= 4 taps, zero pre-commitment)
- Source: _bmad-output/planning-artifacts/ux-design-specification.md (Journey 1: Onboarding & First Roll, no setup burden, instant comprehension)
- Source: _bmad-output/planning-artifacts/architecture.md (Expo Router baseline, feature-first routing boundaries, local-first state)
- Source: _bmad-output/implementation-artifacts/1-2-permission-choice-without-blocking.md (permission flow continuity and current route constraints)

## Dev Agent Record

### Agent Model Used

GPT-5.4

### Debug Log References

### Completion Notes List

- Added explicit onboarding completion persistence and a thin onboarding gate that routes first launch into the notification choice flow and returning users into the home roll shell.
- Replaced the Expo starter shell with a minimal container so onboarding and home no longer leak through starter tabs or tutorial content.
- Added tap-budget unit coverage, onboarding flow integration coverage for both permission branches, and updated E2E expectations to land on the roll shell.
- Attempted to run targeted Jest coverage, but the terminal returned no output in this environment, so execution validation remains open.

### File List

- apps/mobile/src/app/_layout.tsx
- apps/mobile/src/app/explore.tsx
- apps/mobile/src/app/index.tsx
- apps/mobile/src/components/app-tabs.tsx
- apps/mobile/src/components/app-tabs.web.tsx
- apps/mobile/src/db/local-profile-storage.ts
- apps/mobile/src/features/onboarding/components/HomeRollShell.tsx
- apps/mobile/src/features/onboarding/components/NotificationPermissionGate.test.tsx
- apps/mobile/src/features/onboarding/components/NotificationPermissionGate.tsx
- apps/mobile/src/features/onboarding/components/OnboardingFlowGate.test.tsx
- apps/mobile/src/features/onboarding/components/OnboardingFlowGate.tsx
- apps/mobile/src/features/onboarding/onboardingTapBudget.test.ts
- apps/mobile/src/features/onboarding/onboardingTapBudget.ts
- apps/mobile/src/features/onboarding/repository/OnboardingProfileRepository.ts
- apps/mobile/e2e/onboarding-permission.spec.ts
