# Story 1.2: Permission Choice Without Blocking

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a new user,
I want to grant or decline notifications during onboarding,
so that I can keep control while still entering the app.

## Acceptance Criteria

1. Given onboarding is in progress, when notification permission is requested, then both Allow and Not Now options are shown and neither option blocks app entry.
2. Given the user selects either option, when onboarding advances, then the choice is persisted in local profile settings and unit, integration, and E2E tests verify the non-blocking flow.

## Tasks / Subtasks

- [x] Add notification-permission feature scaffolding and platform adapter (AC: 1, 2)
  - [x] Install and configure `expo-notifications` for the mobile app.
  - [x] Create `apps/mobile/src/features/notifications/` service code that wraps Expo permission APIs and returns app-level permission states instead of raw SDK objects.
  - [x] Ensure Android creates a notification channel before requesting notification permission so Android 13+ can present the OS permission prompt.
  - [x] Normalize iOS permission handling using `settings.ios?.status` so provisional and denied states are interpreted correctly.
- [x] Persist the onboarding permission choice locally without blocking entry (AC: 1, 2)
  - [x] Add the minimum local profile persistence needed under `apps/mobile/src/db/` for notification permission choice and prompt timestamp.
  - [x] Expose persistence through a repository/service boundary; route components must not call SQLite or Expo Notifications directly.
  - [x] Persist both Allow and Not Now outcomes so the app can honor the user choice and avoid immediate re-prompt behavior.
- [x] Replace the starter home screen with the onboarding permission step entry point (AC: 1)
  - [x] Update `apps/mobile/src/app/index.tsx` to render a first-use permission choice screen instead of Expo starter copy.
  - [x] Show Allow and Not Now with equal clarity and accessible labels; no copy may imply punishment, urgency, or mandatory opt-in.
  - [x] Advance to the app entry experience after either choice, while keeping room for Story 1.3 to finish the broader four-tap onboarding flow.
- [x] Add automated tests for the non-blocking permission flow (AC: 2)
  - [x] Replace the placeholder unit/integration runner with a real test setup suitable for Expo React Native component and service tests.
  - [x] Add unit tests for permission-state normalization and persisted choice handling.
  - [x] Add integration tests proving both Allow and Not Now continue into the app and write local profile state.
  - [x] Add one executable E2E scenario for the onboarding permission step that verifies the flow remains non-blocking.
- [x] Validate the story end-to-end (AC: 1, 2)
  - [x] Run the new unit/integration/E2E tests successfully.
  - [x] Run a boot check after the onboarding screen replacement to confirm the app still starts without runtime errors.

## Dev Notes

- This story is only about the notification permission choice during onboarding. Do not implement reminder scheduling, push token registration, deep-link handling, or settings management yet; those belong to later notification stories.
- Keep the implementation non-blocking: the user must be able to continue whether the OS permission is granted, denied, dismissed, or unavailable.
- Persist the choice locally in the app's profile/settings layer. Do not introduce AsyncStorage as a parallel source of truth; architecture requires SQLite as the local source of truth.
- The onboarding step should replace the Expo starter content, but it should not yet attempt to complete the entire onboarding journey from Story 1.3.
- Use service and repository boundaries from the start: route -> feature hook/service -> repository -> persistence / platform adapter.

### Technical Requirements

- Mobile baseline remains Expo SDK 55 with Expo Router entrypoint in `apps/mobile/package.json`.
- Notification permission implementation should use `expo-notifications` (Expo docs show bundled version `~55.0.18` for the current SDK line).
- Local persistence should use `expo-sqlite` in `apps/mobile/src/db/` with only the minimum schema needed to store notification permission choice for this story.
- The app-level permission state should distinguish at least: `undetermined`, `granted`, and `denied`.
- On Android 13+, create a notification channel before requesting permission so the OS prompt can appear.
- On iOS, interpret `settings.ios?.status` rather than only the root permission status to avoid mishandling provisional/denied states.
- Do not fetch Expo push tokens in this story; token registration depends on later notification infrastructure and development-build setup.

### Architecture Compliance

- Put onboarding UI and orchestration under `apps/mobile/src/features/onboarding/`.
- Put notification permission platform code under `apps/mobile/src/features/notifications/` or `apps/mobile/src/lib/` only if it is truly infrastructure-level and reused.
- Keep SQLite as the local source of truth and expose domain-friendly `camelCase` objects to UI code.
- Screens/routes must stay thin. They may invoke onboarding hooks/services, but must not call Expo Notifications or SQLite directly.
- Maintain the repo's naming conventions: persistence layer in `snake_case`, app/domain objects in `camelCase`, components/services/repositories in `PascalCase` filenames.

### Library / Framework Requirements

- `expo-notifications` for permission APIs and Android notification channel setup.
- `expo-sqlite` for local persistence aligned with architecture.
- Expo Router for the route entry point.
- A real React Native test stack for component/integration coverage in this story; use an Expo-compatible setup rather than the placeholder script from Story 1.1.
- Keep Playwright in the E2E path only if the resulting scenario is actually executable from this repo; do not leave a fake passing test.

### File Structure Requirements

- Route entry point: `apps/mobile/src/app/index.tsx`
- Root providers/layout if needed: `apps/mobile/src/app/_layout.tsx`
- Onboarding feature: `apps/mobile/src/features/onboarding/`
- Notifications feature/service: `apps/mobile/src/features/notifications/`
- Local persistence: `apps/mobile/src/db/`
- Tests should live near the code they verify or in the existing E2E location under `apps/mobile/e2e/`

### Testing Requirements

- Unit tests must verify permission status mapping and the branching logic for Allow vs Not Now.
- Integration tests must verify that both choices persist local profile state and allow app entry without blocking.
- E2E coverage must execute one real onboarding permission-flow scenario, not a placeholder.
- Boot validation must still pass after replacing the starter screen.
- Mock OS permission responses in automated tests; do not rely on real device prompts in CI.

### Previous Story Intelligence

- Story 1.1 established the canonical app root at `apps/mobile/`, kept Expo Router active, and added placeholder folders for `src/features`, `src/lib/firebase`, and `src/db`.
- Story 1.1 validated `npm run test`, `npm run test:watch`, and `npm run test:e2e` only as placeholders. This story must introduce real tests for the first implemented behavior.
- Current route shell still contains Expo starter screens (`src/app/index.tsx`, `src/app/explore.tsx`) and native tabs (`src/components/app-tabs.tsx`). Replace only what is needed for the permission step and avoid broad route refactors.
- Firebase environment placeholder files already exist, but Firebase auth/sync is not part of this story.

### Latest Technical Information

- Expo Notifications documentation for the current SDK line notes that push notifications are unavailable in Expo Go on Android; real push behavior requires a development build. Use mocks for automated tests and avoid coupling this story to full device-token registration.
- Expo recommends creating an Android notification channel before permission/token flows so Android 13+ can display the notification permission prompt.
- Expo Notifications `requestPermissionsAsync()` and `getPermissionsAsync()` are the correct APIs for onboarding permission state, and iOS authorization should be interpreted through `Notifications.IosAuthorizationStatus` values.

### Project Structure Notes

- The current app is still starter-template shaped. This story is the first feature story and should begin migrating the route entry point toward the Habit Dice onboarding flow without trying to finish all onboarding requirements.
- If a minimal database bootstrap is introduced here, keep it tightly scoped to local profile settings so later stories can extend the schema rather than replace it.
- Avoid introducing parallel configuration or state systems that would need to be ripped out once the full local-first architecture is added.

### References

- Source: `_bmad-output/planning-artifacts/epics.md` (Epic 1, Story 1.2)
- Source: `_bmad-output/planning-artifacts/prd.md` (FR2, Device Permissions, Push Notifications, Onboarding)
- Source: `_bmad-output/planning-artifacts/architecture.md` (Requirements to Structure Mapping, Service Boundaries, Data Boundaries, Integration Points)
- Source: `_bmad-output/planning-artifacts/ux-design-specification.md` (Journey 1: Onboarding & First Roll, permission-granting tone)
- Source: `https://docs.expo.dev/versions/latest/sdk/notifications/` (Expo Notifications permission/channel guidance)

## Dev Agent Record

### Agent Model Used

GPT-5.3-Codex

### Debug Log References

- Installed dependencies: `expo-notifications`, `expo-sqlite`, `jest`, `jest-expo`, `@testing-library/react-native`, `@playwright/test`.
- Validation commands executed: `npm run test`, `npm run test:e2e`, and `CI=1 npx expo start --offline --port 8091` from `apps/mobile`.

### Completion Notes List

- Replaced the starter `src/app/index.tsx` experience with a non-blocking notification permission onboarding gate.
- Added notification permission service with Android channel creation and iOS authorization-status normalization.
- Added SQLite-backed local onboarding profile persistence via `expo-sqlite/localStorage/install` abstraction.
- Added onboarding repository/service boundaries so routes do not call platform or persistence APIs directly.
- Added real test scaffolding (Jest + Testing Library + Playwright) and onboarding permission tests.

### File List

- `_bmad-output/implementation-artifacts/1-2-permission-choice-without-blocking.md`
- `apps/mobile/app.json`
- `apps/mobile/package.json`
- `apps/mobile/jest.config.ts`
- `apps/mobile/jest.setup.ts`
- `apps/mobile/playwright.config.js`
- `apps/mobile/src/app/index.tsx`
- `apps/mobile/src/db/local-profile-storage.ts`
- `apps/mobile/src/features/notifications/services/NotificationPermissionService.ts`
- `apps/mobile/src/features/notifications/services/NotificationPermissionService.test.ts`
- `apps/mobile/src/features/onboarding/repository/OnboardingProfileRepository.ts`
- `apps/mobile/src/features/onboarding/components/NotificationPermissionGate.tsx`
- `apps/mobile/src/features/onboarding/components/NotificationPermissionGate.test.tsx`
- `apps/mobile/e2e/onboarding-permission.spec.ts`
- `apps/mobile/tsconfig.json`

## Change Log

- 2026-04-10: Implemented Story 1.2 notification permission gate with local persistence, non-blocking onboarding flow, and executable unit/integration/E2E scaffolding.
