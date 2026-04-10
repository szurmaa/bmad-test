---
project_name: Habit Dice
user_name: aszurma
date: 2026-04-10
workflow: epic-and-story-creation
inputDocuments: 
  - _bmad-output/planning-artifacts/prd.md
  - _bmad-output/planning-artifacts/architecture.md
  - _bmad-output/planning-artifacts/ux-design-specification.md
  - _bmad-output/planning-artifacts/product-brief-habit-dice.md
stepsCompleted: ["step-01-validate-prerequisites", "step-02-design-epics", "step-03-create-stories", "step-04-final-validation"]
status: complete
completedAt: 2026-04-10
---

# Habit Dice: Epics & Stories

**Extracted Requirements for Implementation Planning**

---

## Functional Requirements (FRs)

### Onboarding
- **FR1:** New users can complete initial app setup in 4 or fewer taps with no pre-commitment, habit selection, or consistency goal required
- **FR2:** Users can grant or decline push notification permission during onboarding without blocking app access
- **FR3:** Users can begin using the app immediately after onboarding without creating an account (anonymous auth supported)

### Daily Roll
- **FR4:** Users can roll the dice once per day to receive a randomly selected micro-habit task from the active task library
- **FR5:** Users can see the task's category (Mind, Body, Life, or Work) and full task description after rolling
- **FR6:** Users can reroll once per day to receive a different randomly selected task; the reroll opportunity resets at midnight local device time
- **FR7:** The reroll option is unavailable after it has been used; it cannot be used more than once per day
- **FR8:** Users can mark their daily task as complete
- **FR9:** Users receive a micro-celebration acknowledgment upon marking a task complete
- **FR10:** Users can view today's task at any time after rolling, including after marking it complete

### Consecutive Days-Played Counter
- **FR11:** Users can view their total days-played count on the home screen
- **FR12:** The days-played counter increments by one each day the user opens the app and rolls, regardless of task completion
- **FR13:** The days-played counter never decrements; missed days do not subtract from or reset the count
- **FR14:** The app displays no messaging referencing missed days, broken streaks, or time since last session

### Mood Log
- **FR15:** Users are prompted once per day to log their mood via a lightweight scale (no free-text journaling required)
- **FR16:** Users can dismiss the mood log prompt without penalty or repeated re-prompting
- **FR17:** Mood log data is stored locally and synced to Firebase when connectivity is available

### Push Notifications
- **FR18:** Users can configure a daily reminder notification at a time of their choosing
- **FR19:** Users can disable push notifications from within app settings after onboarding
- **FR20:** Push notifications deep-link directly to the roll screen

### Offline Functionality
- **FR21:** Users can roll, reroll, complete tasks, and log mood with no network connectivity
- **FR22:** The app does not display error states or degraded experiences when offline
- **FR23:** All local data syncs to Firebase automatically when connectivity is restored, without user action

### Data & Sync
- **FR24:** User days-played data persists across app reinstalls via Firebase sync (for authenticated users)
- **FR25:** The task library can be updated server-side without requiring an app store release or app restart

### Internal Task Library Management
- **FR26:** Admins can create, edit, and deactivate tasks via an internal web tool
- **FR27:** Admins can assign each task a category (Mind, Body, Life, Work), effort estimate, and active/inactive status
- **FR28:** Admins can view per-task completion rate analytics to inform library curation decisions
- **FR29:** Tasks marked inactive are removed from the active roll pool but retained in the database for analytics
- **FR30:** Admins can submit new tasks for peer review before they are activated in the live library

### Analytics (Internal)
- **FR31:** The system tracks daily roll rate, reroll rate, task completion rate, and mood log submission rate per user cohort
- **FR32:** The system tracks days-played distribution across the active user base
- **FR33:** The system tracks task repeat exposure rate per user to inform library expansion decisions

---

## Non-Functional Requirements (NFRs)

### Performance
- Roll animation (dice to task reveal): ≤ 1.5 seconds on a mid-range Android device (2022 or newer, e.g. Galaxy A53)
- App cold start to interactive state: < 3 seconds on mid-range Android
- Task library loads from local cache — no network round-trip on the critical roll path
- Mood log prompt and completion response: < 500ms

### Security
- All data in transit encrypted via HTTPS/TLS (Firebase SDK enforced)
- Firebase security rules scope all user data to the authenticated user; no cross-user data access
- Anonymous auth users have data scoped to their device session; explicit auth enables cross-device sync
- No PII collected beyond optional email; privacy policy required at both stores before launch
- Firebase security rules reviewed and tested before production deployment

### Scalability
- Firebase architecture scales to 100K MAU without infrastructure changes
- Task library updates via Firestore propagate to all active users within 5 minutes of admin publish
- Analytics pipeline supports cohort queries across 12 months of data without performance degradation

### Accessibility
- All interactive elements have accessible labels (VoiceOver / TalkBack compatible)
- Minimum touch target size: 44×44pt
- Color is never the sole means of conveying information
- App respects system font size settings
- WCAG 2.1 AA color contrast ratio (4.5:1) for all body text and interactive labels

### Reliability
- Crash-free session rate ≥ 99.5% (Firebase Crashlytics)
- Core functions (roll, complete, mood log) available 100% of the time in offline mode
- Firebase sync failures are silent and non-blocking
- Push notification delivery rate ≥ 95% within 5 minutes of configured time

---

## Architecture & Technical Requirements

### Starter Template
- **Starter:** Expo official starter with React Native Expo SDK 55
- **Command:** `npx create-expo-app@latest habit-dice --template default@sdk-55`
- **Implementation Impact:** Sets TypeScript, React Native foundation, Expo tooling baseline

### Data Architecture
- **Local Database:** `expo-sqlite` (~55.0.15) as the source of truth
- **Schema:** Normalized relational with tables for tasks, daily_rolls, task_completions, mood_logs, sync_queue, user_profile
- **Validation:** Zod 4 at repository boundaries
- **Migration Strategy:** SQL migrations with schema versioning

### Backend & Auth
- **Authentication:** Firebase Authentication (anonymous default → explicit auth upgrade)
- **Cloud Data:** Firestore for user aggregates and sync-safe records
- **Push Notifications:** Firebase Cloud Messaging
- **Crash Reporting:** Firebase Crashlytics

### Frontend Architecture
- **Routing:** Expo Router
- **State Management:** Local domain state via SQLite-backed repositories + TanStack Query v5 for remote state + React state for ephemeral UI state
- **Animation:** Reanimated v2 for roll and completion interactions
- **Boundary Rule:** Screens do not call Firebase or SQLite directly; only feature services and repositories

### Infrastructure & Deployment
- **Mobile Delivery:** Expo managed workflow with EAS Build/Submit
- **CI/CD:** GitHub Actions (lint, typecheck, tests, release workflows)
- **Environment Model:** Development, preview, production Firebase projects

### Naming & Consistency Patterns
- **Database:** snake_case tables/columns (tasks, daily_rolls, task_id, rolled_at)
- **Firestore:** lowercase plural collections (users, task_catalog_versions)
- **Routes:** lowercase Expo Router file segments, camelCase params
- **Code:** PascalCase components/services, camelCase functions/variables, SCREAMING_SNAKE_CASE for constants
- **Sync Queue:** append-only records with id, event_type, payload, created_at, sync_status, retry_count
- **Analytics Events:** snake_case action style (daily_roll_started, daily_roll_completed, mood_log_submitted)

### Project Structure
- **Mobile**: Feature-first organization under `apps/mobile/src/features/`
- **Admin:** Separate web app under `apps/admin/` (Next.js)
- **Shared:** Design tokens, config, utilities in shared folders, not feature-scoped
- **Testing:** Jest/Vitest for unit, Playwright for E2E, collocated (__tests__)

---

## UX Design Requirements

### Design System & Components
- **System Choice:** Custom lightweight design system on React Native primitives
- **Design Tokens:** Color palette (primary teal, warm neutrals, semantic success/warning/error), typography scale (Display/H1/H2/Body/Caption), 8pt spacing system
- **Core Primitives:** Screen, Text, Button, Card, IconButton, Modal/BottomSheet, Counter, Notification/Banner

### Custom Components (6 Signature)
1. **DiceRoll** — Animated dice rotation (1.5–2s deceleration easing), satisfying but not casino-like, respects prefers-reduced-motion
2. **TaskRevealCard** — Task presentation with category badge, clear wording (8–16 words), effort indicator, clear CTAs
3. **CompletionMoment** — Warm color wash + checkmark (1–2s), affirming copy, auto-advance to mood log
4. **MoodLogPrompt** — 1–5 emoji/text scale, optional, skip equally prominent, no investigation tone
5. **DaysPlayedCounter** — Additive-only display (never decrements), no streak language, animation on increment
6. **RerollStateIndicator** — Clear available/used state, no penalty language, always explains when it resets

### Visual Design Direction
- **Base:** Direction 01 - Soft Ritual (warm neutrals, centered hierarchy, calm tone)
- **Structure:** Direction 03 - Clear Compass (stronger card framing, clearer state chips)
- **Color System:** Soft daylight palette, warm off-white background, stone/mist neutrals, primary teal, warm amber, soft green success, quiet rose error
- **Typography:** Clean readable sans-serif, readable at 12pt minimum, generous line height
- **Spacing:** 8pt base system, generous vertical rhythm, one-handed usability priority

### UX Patterns & Consistency
- **Button Hierarchy:** Primary (teal, 44x44pt+), Secondary (warm neutral), Tertiary/Skip (text-only, no penalty language)
- **Feedback:** Completion affirms (1–2s), errors are clear + recoverable, loading is subtle, offline is factual (no shame)
- **Navigation:** Linear flows (Home → Roll → Task → Complete → Mood → Home), graceful skip/dismiss without penalty
- **Disabled States:** Always include explanatory text ("Reroll used today. Ready tomorrow."), no lock icons or penalty framing
- **Copy Tone:** Permission-granting, warm, no urgency language, no shame-adjacent messaging
- **Accessibility:** 4.5:1 contrast (WCAG 2.1 AA), 44x44pt touch targets, VoiceOver/TalkBack tested, prefers-reduced-motion respected

### Responsive & Accessibility
- **Platform:** Mobile-first (React Native, iOS 15+, Android 8.0+)
- **Device Strategy:** Single-column layout, one-handed use default, no multi-column complexity, safe area handling
- **Accessibility Target:** WCAG 2.1 AA compliance, full offline functionality, cognitive accessibility for ADHD users
- **Testing:** Screen reader (VoiceOver, TalkBack), keyboard navigation, color contrast, touch targets, zoom support (200%), dark mode

---

## Test Strategy & QA Integration

### Unit Tests (Jest/Vitest)
- **Scope:** Individual functions, utilities, repositories, services
- **Coverage Target:** ≥ 80% for business logic
- **Examples:**
  - Reroll reset logic (midnight local time calculation)
  - Days-played counter increment (idempotent, never decrements)
  - Mood log dismissal (no re-prompt penalty)
  - Firebase sync queue processing
  - Zod validation at boundaries
  - Analytics event emission

### Integration Tests
- **Scope:** Repository + SQLite integration, Firebase Auth flow, sync queue reconciliation
- **Examples:**
  - Roll creation → task reveal → completion → days-played increment
  - Offline roll → background sync → Firebase aggregate update
  - Anonymous auth → explicit auth identity linking
  - Task library hot-reload from Firestore
  - Reroll reset at midnight
  - Mood log local storage + Firebase sync

### Component Tests (React Testing Library / Vitest)
- **Scope:** UI component behavior, accessibility, state management
- **Examples:**
  - DiceRoll animation skips on reduce-motion
  - TaskRevealCard displays category + effort correctly
  - CompletionMoment announces to screen reader
  - MoodLogPrompt skip button is equally prominent
  - DaysPlayedCounter never shows negative or reset
  - RerollStateIndicator shows correct label based on state

### E2E Tests (Playwright)
- **Scope:** Full user journeys on real devices/browsers
- **Coverage:**
  - **Onboarding:** App opens → permissions prompt → first roll → task reveal → completion
  - **Daily Happy Path:** Send notification → open app → roll → view task → complete → mood log
  - **Skip/Return:** Miss 4 days → return on day 5 → no guilt messaging → roll normally
  - **Reroll Flow:** Roll task → reroll once → can't reroll again → complete or skip
  - **Offline:** Roll offline → complete offline → sync when online → verify days-played persisted
  - **Edge Cases:** App crash mid-roll → reopen → recover gracefully; timezone travel → reroll resets correctly
  - **Accessibility:** Navigate with keyboard only → all controls reachable → screen reader announces all content

### Test Infrastructure
- **Unit/Integration:** Jest or Vitest with ts-jest/swc preset
- **E2E:** Playwright with @playwright/test in headless + headed modes
- **Test Commands:**
  - `npm run test` — unit + integration tests
  - `npm run test:watch` — watch mode during development
  - `npm run test:e2e` — Playwright E2E in CI
  - `npm run test:coverage` — coverage report
- **Debugging Tools:**
  - Chrome DevTools for component inspection
  - Playwright Inspector for E2E step-through
  - Logcat / Xcode logs for native issues
- **CI/CD Integration:**
  - GitHub Actions runs all test suites on PR
  - Blocks merge if coverage < 70% or E2E fails
  - Produces JUnit XML for artifact storage

---

## User Journeys (From UX Spec)

1. **Onboarding & First Roll:** Discover → download → 4-tap setup → first roll → task reveal → completion
2. **Daily Happy Path (D11):** Notification → open → roll → task reveal → complete → mood log
3. **Edge Case (Skip/Return D14→D18):** Miss 4 days → return → no guilt messaging → roll normally
4. **Reroll Constraint:** First roll → task reveal → decide → reroll (if available) → new task → do/skip
5. **Mood Logging:** Post-completion → mood prompt → answer or skip (both valid) → dismiss
6. **Admin Task Library:** Browser-based internal tool → create/edit/delete tasks → peer review → publish to production

---

## Epic List

### Epic 1: User Signup, Authentication & Onboarding
**User Outcome:** New users can complete a frictionless 4-tap setup and take their first daily roll—with no pre-commitment, habit selection, or account creation required.

**User Journey Covered:** Onboarding → First Roll

**FRs Covered:** FR1, FR2, FR3

**Technical Scope:**
- Firebase anonymous authentication
- Optional push notification permission flow
- Immediate app access without account creation
- Initial task library pre-load from Firestore
- Local profile setup in SQLite

**Test Integration:**
- Unit tests: Permission flow logic, auth state transitions
- Integration tests: Anonymous auth → task library load
- E2E tests: Onboarding flow (4 taps) → first roll execute
- Component tests: Permission cards, skip button equal prominence

**Standalone Value:** Users can use the app immediately; future epics add features on top of this foundation.

---

### Epic 2: Core Daily Roll & Task Execution  
**User Outcome:** Users experience the product's core mechanic—rolling once per day to receive a randomized micro-habit task, viewing its details, and marking it complete with encouragement.

**User Journey Covered:** Daily Happy Path (Roll → Task Reveal → Completion Celebration)

**FRs Covered:** FR4, FR5, FR8, FR9, FR10

**Technical Scope:**
- Daily roll state management (once per day reset via midnight local time)
- Random task selection from active library
- Task details presentation (category, description, effort)
- Completion marking and celebration UX
- Task history storage in SQLite (daily_rolls, task_completions tables)

**Test Integration:**
- Unit tests: Roll eligibility logic (once/day), random selection fairness, midnight reset calculation
- Integration tests: Roll creation → task reveal → completion → days-played increment
- Component tests: DiceRoll animation (respects prefers-reduced-motion), TaskRevealCard layout + accessibility, CompletionMoment announces success
- E2E tests: Roll → complete → verify days-played incremented; multiple days show correct count

**Standalone Value:** Core product experience; reroll, mood logging, and notifications are optional enhancements.

---

### Epic 3: Reroll Constraint & Task Customization  
**User Outcome:** Users can reroll once per day to receive a different task if the initial roll doesn't fit their available time or mood—but can't reroll again that day.

**User Journey Covered:** Reroll Constraint Flow

**FRs Covered:** FR6, FR7

**Technical Scope:**
- Reroll state tracking (available/used per day)
- Persistent reroll counter in SQLite (daily_rolls table)
- Midnight reset of reroll availability
- UI state management showing available/used status
- No penalty language for used reroll

**Test Integration:**
- Unit tests: Reroll eligibility (once per day), midnight reset, idempotent UI updates
- Integration tests: Roll → reroll → new task displayed; reroll used → can't reroll again same day
- Component tests: RerollStateIndicator label correct based on state; no penalty framing
- E2E tests: Roll day 1, reroll, verify new task; next day reroll available again

**Standalone Value:** Enhances core experience without blocking daily rolls; works independently.

---

### Epic 4: Days-Played Counter & Cumulative Progress  
**User Outcome:** Users see their total days-played count accumulating on the home screen—a never-decrementing measure of habit engagement—without any guilt messaging about missed days.

**User Journey Covered:** Progress Motivation (Additive counter across usage)

**FRs Covered:** FR11, FR12, FR13, FR14

**Technical Scope:**
- Days-played counter logic (increments once per day user opens app + rolls)
- Never-decrement constraint (no streak resets)
- Counter display on home screen with animation on increment
- Local SQLite storage (days_played in user_profile table)
- Explicit absence of streak-guilt messaging

**Test Integration:**
- Unit tests: Counter increment (idempotent, once/day), never-decrement logic, missing day handling
- Integration tests: Roll 5 days in a row → counter = 5; skip day 6 → day 7 roll → counter = 6 (no decrement)
- Component tests: DaysPlayedCounter never shows negative, animation triggers on increment, no "streak broken" text
- E2E tests: Open app day N → counter increments; close app → reopen → counter unchanged; miss days → return → counter continues

**Standalone Value:** Adds motivation layer without requiring other epics.

---

### Epic 5: Mood Reflection & Daily Logging  
**User Outcome:** After completing a task, users are invited (never pressured) to log their mood on a simple 1–5 scale—with no judgment, no free-text journaling, and a clear ability to skip without re-prompting.

**User Journey Covered:** Mood Logging Flow (post-completion optional reflection)

**FRs Covered:** FR15, FR16, FR17

**Technical Scope:**
- Post-completion mood prompt (once per day, optional)
- Simple 1–5 emoji/text scale interaction
- Skip button equal prominence to response buttons
- Local mood log storage in SQLite (mood_logs table)
- Firestore sync of mood aggregates for analytics
- No re-prompt penalty if skipped

**Test Integration:**
- Unit tests: Mood prompt eligibility (once/day), skip dismissal (no re-prompt), Firestore sync queue logic
- Integration tests: Complete task → mood prompt appears; skip mood → never appears again today; mood answer → logged locally + queued for sync
- Component tests: MoodLogPrompt emoji/text scale accessible, skip button visually equal to answer buttons, animations optional
- E2E tests: Complete task → respond to mood → verify stored; complete task next day → mood prompt appears again; offline mood → records locally, syncs when online

**Standalone Value:** Reflection layer enhances user understanding; works independently from other epics.

---

### Epic 6: Push Reminders & Daily Re-engagement  
**User Outcome:** Users can set a daily reminder notification at their preferred time, which opens the app directly to the roll screen—and can disable notifications anytime without impact to core features.

**User Journey Covered:** Reminder Notification Path (optional daily trigger)

**FRs Covered:** FR18, FR19, FR20

**Technical Scope:**
- Daily reminder notification scheduling (configurable time)
- Firebase Cloud Messaging integration
- Deep-link to roll screen on notification tap
- Settings UI for enable/disable and time adjustment
- Local notification permission state in SQLite
- Optional feature; core app works with notifications disabled

**Test Integration:**
- Unit tests: Time-based notification scheduling, deep-link URI generation, permission state transitions
- Integration tests: Schedule notification at 8 AM → fires at 8 AM; disable notifications → no more fires; change time → fires at new time
- Component tests: Time picker accessible, enable/disable toggle clear, all copy permission-granting (not pushy)
- E2E tests: Enable notifications at 8 AM → notification fires → tap → opens to roll screen; disable → no more notifications

**Standalone Value:** Optional enhancement; core product fully functional without notifications.

---

### Epic 7: Offline Support & Local-First Architecture  
**User Outcome:** Users can roll, reroll, complete tasks, and log mood without internet connectivity—and all data automatically syncs to Firebase when connection is restored, with no network errors shown to the user.

**User Journey Covered:** All journeys (with offline reliability layer)

**FRs Covered:** FR21, FR22, FR23, FR24, FR25

**Technical Scope:**
- SQLite as source of truth (tasks, rolls, completions, mood, sync_queue)
- Offline-first domain state (all core features in local repo)
- Background sync queue (append-only records of pending updates)
- Firebase Firestore async reconciliation (aggregate sync, not row-level)
- No network error states shown to user
- Automatic retry with exponential backoff
- Cold-start task library load from cache

**Test Integration:**
- Unit tests: Sync queue logic, offline state detection, retry backoff calculation, conflict resolution (read-only on client)
- Integration tests: Offline roll → complete → mood log; go online → all synced to Firebase; Firebase task library update → pulled into local cache
- Component tests: No error banners for offline state, offline affordance minimal/factual
- E2E tests: Simulate offline (DevTools) → perform rolls/completions → go online → verify Firebase shows updated data; network toggle multiple times → verify eventual consistency

**Standalone Value:** Enables all previous epics to work offline; foundation for reliable product experience.

---

### Epic 8: Admin Task Library Management & Curation  
**User Outcome:** Administrators can create, edit, deactivate, and review task completion analytics via a separate web tool—enabling ongoing library curation without app store releases or user app restarts.

**User Journey Covered:** Admin Task Library Management Flow

**FRs Covered:** FR26, FR27, FR28, FR29, FR30

**Technical Scope:**
- Separate web app (Next.js-style admin interface)
- Firestore task library collection (tasks, versions, active status)
- CRUD operations on tasks (create, edit, deactivate, publish)
- Peer-review workflow for new tasks
- Admin dashboard showing per-task completion analytics
- Deployment path: GitHub Actions → web hosting
- Client-side task library hot-reload from Firestore (no app restart required)

**Test Integration:**
- Unit tests: Task publish workflow, analytics aggregation, version management
- Integration tests: Admin creates task → published to Firestore → mobile app fetches new task within 5 min; admin deactivates task → app removes from roll pool
- Component tests: Admin UI forms accessible, analytics charts readable, confirmation dialogs clear
- E2E tests (Admin): Create task → submit for review → peer approves → task appears in mobile roll within 5 min; deactivate task → gone from mobile within 5 min

**Standalone Value:** Core mobile app functions without admin tool; admin tool grows library over time without blocking user access.

---

### Epic 9: Analytics, Monitoring & Crash Reporting  
**User Outcome:** Product team can monitor daily roll rates, completion rates, reroll patterns, task popularity, and user retention—and receive crash reports via Firebase Crashlytics—to inform product decisions and catch critical issues.

**User Journey Covered:** Cross-all-journeys telemetry

**FRs Covered:** FR31, FR32, FR33 + NFR Reliability (99.5% crash-free)

**Technical Scope:**
- Firebase Analytics event tracking (daily_roll_started, daily_roll_completed, mood_log_submitted, reroll_used, etc.)
- Custom events for product metrics (task_completion_rate per task, days_played_distribution, reroll_frequency)
- Firebase Crashlytics integration (automatic + manual breadcrumbs)
- Cloud Firestore aggregation pipeline (background sync of daily snapshots)
- Analytics dashboard (BigQuery / Firestore export)
- Crash alert notifications to Slack or email

**Test Integration:**
- Unit tests: Event emission logic, event payload validation, breadcrumb attachment
- Integration tests: Roll event → logged to Analytics; crash detected → Crashlytics records + notifies team
- E2E tests: Perform series of actions (rolls, completions, skips) → verify events appear in Analytics dashboard after short delay

**Standalone Value:** Optional for MVP; enables post-launch learning and issue detection without blocking core features.

---

### Epic 10: Accessibility & Polish (WCAG 2.1 AA Compliance)  
**User Outcome:** All users, including those with visual, motor, cognitive, and auditory disabilities, can fully use the app—with screen reader support, keyboard navigation, color contrast compliance, accessible touch targets, and support for reduced motion.

**User Journey Covered:** All journeys (accessibility layer)

**FRs Covered:** NFR Accessibility + all journeys

**Technical Scope:**
- VoiceOver (iOS) and TalkBack (Android) full compatibility
- 44×44pt minimum touch targets (all interactive elements)
- 4.5:1 color contrast ratio (WCAG 2.1 AA) for all text + interactive labels
- Semantic HTML/a11y labels on all components
- `prefers-reduced-motion` support (DiceRoll animation skip, transition removal)
- Keyboard navigation (tab order, focus indicators)
- Accessibility testing workflow (screen reader, contrast, keyboard, motor, user testing)

**Test Integration:**
- Unit tests: Contrast ratio validation, semantic label generation
- Component tests: All components tested with screen reader (assertions on aria-labels), prefers-reduced-motion switch, keyboard focus indicators visible
- E2E tests (Accessibility): Screen reader navigation → all content reachable; keyboard-only → all controls accessible; zoom 200% → layout readable; dark mode → still 4.5:1 contrast
- Manual testing: Users with disabilities validate full workflows

**Standalone Value:** Quality/polish layer; core features must work accessibly from day 1.

---

### Epic 11: Containerization & Docker Orchestration  
**User Outcome:** Development, testing, and production environments are standardized, repeatable, and portable via Docker containers—enabling consistent behavior across machines and simplifying deployment via Docker Compose.

**User Journey Covered:** Infrastructure / DevOps / Deployment Enablement

**FRs Covered:** Infrastructure support for all FRs

**Technical Scope:**
- Multi-stage Dockerfiles for mobile app (frontend) and admin web app (backend)
- Non-root user execution in containers (security)
- Health check endpoints for liveness and readiness probes
- Docker Compose orchestration (app services, database, Redis cache if needed)
- Environment variable management (dev, test, staging, production profiles)
- Volume mounts for local development (hot reload)
- Network isolation between services
- Logs aggregation and accessibility via `docker-compose logs`
- Integration with GitHub Actions for building and pushing images

**Test Integration:**
- Unit tests: Health check endpoint response validation, environment variable parsing
- Integration tests: Docker build succeeds with various configurations; containers start and pass health checks; services communicate across Docker network
- E2E tests (Containerization): Build images → spin up compose stack → verify all containers healthy → run E2E tests inside containers → tear down cleanly
- Performance tests: Verify no significant latency from containerization (cold start still <3s)

**Standalone Value:** Infrastructure layer enabling reproducible development and deployment; non-blocking for feature development but essential before production release.

---

### Epic 12: Quality Assurance Activities & Compliance Verification  
**User Outcome:** Development team has comprehensive visibility into test coverage, performance bottlenecks, accessibility compliance, and security vulnerabilities—enabling data-driven quality decisions before release.

**User Journey Covered:** Cross-all-journeys QA verification layer

**FRs Covered:** All FRs (quality validation)

**Technical Scope:**

**Test Coverage Analysis & Gap Identification:**
- Automated test coverage reporting (Jest/Vitest → human-readable coverage reports)
- Coverage trend tracking (commit-by-commit)
- Identified gaps: untested error paths, edge cases, offline sync recovery scenarios
- Coverage targets: ≥70% overall, ≥85% for critical paths (roll logic, offline sync, auth)
- CI gate: Blocks merge if coverage drops below threshold

**Performance Testing & Profiling:**
- Chrome DevTools MCP integration for app performance analysis
- Metrics: cold start time (<3s target), roll animation (≤1.5s target), task library load time, sync queue processing time
- Profiling: React component render performance, memory leaks detection, battery impact
- Lighthouse audits (PWA if web version, performance score, accessibility score)
- Documented baseline + benchmarks for regression detection

**Accessibility Audit & Automation:**
- Automated axe-core audits integrated into Playwright E2E tests
- Manual screen reader testing (VoiceOver iOS, TalkBack Android)
- WCAG 2.1 AA compliance checklist (color contrast, touch targets, labels, focus management, motion)
- Lighthouse accessibility audit (target ≥90 score)
- Known issues log + remediation plan
- User testing with accessibility testers (if budget allows)

**Security Code Review & Vulnerability Scanning:**
- Automated scanning: Dependabot for dependency vulnerabilities, ESLint + security plugins for code patterns
- Manual review focus areas: XSS prevention (input sanitization, React prop handling), injection attacks (Firebase rules, Firestore/SQL queries), authentication/authorization boundaries, data exposure in logs/errors, API key / secret management
- OWASP Top 10 checklist walkthrough
- Remediation plan for discovered issues
- Security documentation (auth flow, data flow, threat model)

**Test Integration:**
- Unit tests: Coverage metrics calculation, test report generation
- Integration tests: All test suites run successfully in CI; coverage reports generated; vulnerable dependencies detected and logged
- Performance test: Automated performance test suite runs on every commit; regressions flagged
- E2E tests (QA): Full test suite runs; axe-core audits embedded in Playwright tests; accessibility report generated
- Manual QA: Dedicated QA engineer reviews security findings, accessibility issues, performance report before release gate

**Standalone Value:** Quality assurance layer; non-blocking for development but essential before launch to app stores (app store review requirements include accessibility, security, crash stability).

---

## Pre-Development Foundation Work (Parallel/Gating)

**Not separate epics, but essential before story work begins:**

1. **Project Setup & Dev Environment**
   - Repository structure (feature-first mobile, separate admin app)
   - TypeScript/React Native environment (Expo SDK 55)
   - Git workflow, branch protection, PR templates
   - Firebase project setup (dev, preview, prod)
   - Local SQLite schema + migrations

2. **Test Infrastructure & CI/CD**
   - Jest/Vitest unit test setup with ts-jest
   - Playwright E2E test scaffold
   - GitHub Actions CI pipeline (lint, typecheck, unit tests, E2E)
   - Code coverage thresholds (≥70%)
   - EAS Build/Submit configuration

3. **Design System & Component Library**
   - Figma design tokens export (colors, typography, spacing)
   - Base components (Screen, Text, Button, Card, Icon, Modal)
   - Storybook (React Native or similar) for component preview
   - Accessibility checklist for components

---

## Epic Coverage Summary

| Epic | User Value | FRs Covered | dependencies | Status |
| --- | --- | --- | --- | --- |
| Epic 1: Onboarding | New users 4-tap setup + first roll | FR1–3 | Foundation | Ready |
| Epic 2: Daily Roll | Core experience (roll, task, complete) | FR4–5, 8–10 | Ep 1, Foundation | Ready |
| Epic 3: Reroll | Task customization (once/day) | FR6–7 | Ep 1–2 | Ready |
| Epic 4: Days Counter | Progress tracking (never decrements) | FR11–14 | Ep 1–2 | Ready |
| Epic 5: Mood Logging | Reflection (optional, post-complete) | FR15–17 | Ep 1–2 | Ready |
| Epic 6: Notifications | Daily reminders (optional) | FR18–20 | Ep 1–2 | Ready |
| Epic 7: Offline Support | All features work offline, auto-sync | FR21–25 | Ep 1–6 | Ready |
| Epic 8: Admin Tool | Task library curation (web app) | FR26–30 | Ep 7 | Ready |
| Epic 9: Analytics | Product metrics + crash reporting | FR31–33 | All | Ready |
| Epic 10: Accessibility | WCAG 2.1 AA compliance | NFR Accessibility | All | Ready |
| Epic 11: Reliable Delivery Experience | Reliable availability and predictable updates | NFR Reliability, NFR Security, NFR Performance | Foundation | Ready |
| Epic 12: Trusted Product Quality Experience | Consistent accessibility, performance, and security confidence | NFR Performance, NFR Accessibility, NFR Security, NFR Reliability | All | Ready |

---

**All 33 FRs + NFRs mapped. All user journeys covered. All 12 epics are standalone, value-focused, with comprehensive QA integration throughout.**

---

## Requirements Coverage Mapping

| FR/NFR | Coverage | Epic/Story |
| --- | --- | --- |
| FR1–FR3 | Onboarding flow | Epic 1: Project Setup + Epic 2: Onboarding |
| FR4–FR10 | Daily roll interaction | Epic 3: Daily Roll & Task System |
| FR11–FR14 | Days-played counter | Epic 3: Daily Roll & Task System |
| FR15–FR17 | Mood logging | Epic 4: Mood Logging & Reflection |
| FR18–FR20 | Push notifications | Epic 5: Notifications & Re-engagement |
| FR21–FR23 | Offline functionality | Epic 6: Local-First Architecture & Sync |
| FR24–FR25 | Data sync to Firebase | Epic 6: Local-First Architecture & Sync |
| FR26–FR30 | Task library management | Epic 7: Admin Tool for Task Curation |
| FR31–FR33 | Analytics tracking | Epic 8: Analytics & Instrumentation |
| NFR (Performance) | <1.5s roll, <3s cold start | Epic 3: Daily Roll & Task System |
| NFR (Security) | Firebase rules, HTTPS, auth | Epic 1: Project Setup + Epic 6 |
| NFR (Accessibility) | WCAG 2.1 AA | Epic 9: Accessibility & Polish |
| NFR (Reliability) | 99.5% crash-free | Epic 6 + Epic 8 |

---

*This requirements extraction is complete. Epic design and story generation are now completed.*

---

## Epic 1: User Signup, Authentication & Onboarding

New users can complete a frictionless 4-tap setup and take their first daily roll with anonymous access.

### Story 1.1: Set Up Initial Project from Starter Template

As a developer,
I want to initialize the app using the selected Expo SDK 55 starter template,
So that implementation starts from the approved architecture baseline.

**Acceptance Criteria:**

**Given** architecture specifies Expo official starter
**When** project setup begins
**Then** the repository is initialized with `npx create-expo-app@latest habit-dice --template default@sdk-55`
**And** initial dependencies install successfully.

**Given** the starter project is created
**When** baseline checks run
**Then** app boots to default screen without runtime errors
**And** unit, integration, and E2E pipeline scaffolding commands are available.

### Story 1.1 FR/NFR Reference

- FRs: Foundation for FR1-FR3 implementation
- NFRs: Reliability, Scalability

### Story 1.2: Permission Choice Without Blocking

As a new user,
I want to grant or decline notifications during onboarding,
So that I can keep control while still entering the app.

**Acceptance Criteria:**

**Given** onboarding is in progress
**When** notification permission is requested
**Then** both Allow and Not Now options are shown
**And** neither option blocks app entry.

**Given** the user selects either option
**When** onboarding advances
**Then** the choice is persisted in local profile settings
**And** unit, integration, and E2E tests verify the non-blocking flow.

### Story 1.2 FR/NFR Reference

- FRs: FR2
- NFRs: Accessibility

### Story 1.3: Complete Onboarding in Four Taps

As a new user,
I want onboarding to finish in four or fewer taps,
So that I can reach the daily roll quickly.

**Acceptance Criteria:**

**Given** a first-time user starts onboarding
**When** they complete the guided steps
**Then** the app transitions to the home/roll screen within four taps
**And** no habit pre-commitment is required.

**Given** onboarding is complete
**When** the user lands on home
**Then** roll controls are immediately available
**And** unit, integration, and E2E tests cover tap-count and navigation behavior.

### Story 1.3 FR/NFR Reference

- FRs: FR1, FR3
- NFRs: Performance, Accessibility

## Epic 2: Core Daily Roll & Task Execution

Users can roll once per day, receive a task, and complete it with a positive confirmation moment.

### Story 2.1: Daily Roll Eligibility and Task Selection

As a user,
I want to roll once per day and receive one random active task,
So that the app gives me a clear daily action.

**Acceptance Criteria:**

**Given** I have not rolled today
**When** I tap Roll
**Then** exactly one active task is selected at random
**And** the roll is persisted with timestamp and task id.

**Given** I already rolled today
**When** I reopen the app
**Then** the same daily task is shown
**And** unit, integration, and E2E tests verify once-per-day enforcement.

### Story 2.2: Task Reveal Experience

As a user,
I want to see category and full task details after rolling,
So that I understand what to do next.

**Acceptance Criteria:**

**Given** a roll has completed
**When** task reveal is shown
**Then** category, task description, and effort indicator are visible
**And** the layout is screen-reader friendly.

**Given** reduced-motion is enabled
**When** task reveal runs
**Then** animation is minimized appropriately
**And** unit, integration, and E2E tests verify reveal content and accessibility.

### Story 2.3: Task Completion and Celebration

As a user,
I want to mark my daily task complete and receive encouragement,
So that I feel positive reinforcement.

**Acceptance Criteria:**

**Given** I have an active daily task
**When** I tap Complete
**Then** completion is stored locally
**And** a micro-celebration appears for 1-2 seconds.

**Given** completion is recorded
**When** I return later that day
**Then** the task remains marked completed
**And** unit, integration, and E2E tests validate completion persistence and feedback.

## Epic 3: Reroll Constraint & Task Customization

Users can reroll once per day and clearly see when reroll is no longer available.

### Story 3.1: One-Time Daily Reroll

As a user,
I want one reroll per day,
So that I can replace one unsuitable task without endless retries.

**Acceptance Criteria:**

**Given** I rolled today and reroll is unused
**When** I tap Reroll
**Then** a different task is selected
**And** reroll state is marked used for the day.

**Given** reroll is already used today
**When** I tap Reroll again
**Then** no new task is assigned
**And** unit, integration, and E2E tests verify one-time enforcement.

### Story 3.2: Reroll State Messaging

As a user,
I want clear reroll availability messaging,
So that I understand the rule without penalty framing.

**Acceptance Criteria:**

**Given** reroll is available
**When** the task screen loads
**Then** UI shows reroll is available
**And** reset timing is clear.

**Given** reroll was used
**When** the screen reloads
**Then** UI states reroll resets tomorrow with neutral copy
**And** unit, integration, and E2E tests verify message states.

## Epic 4: Days-Played Counter & Cumulative Progress

Users can view additive progress that increments on play days and never resets due to missed days.

### Story 4.1: Additive Days-Played Increment

As a user,
I want my days-played count to increment when I roll,
So that I can see cumulative engagement over time.

**Acceptance Criteria:**

**Given** I have not rolled yet today
**When** I complete my daily roll
**Then** days-played increments by exactly one
**And** the update is persisted locally.

**Given** I roll multiple times in one day context
**When** state recalculates
**Then** the counter increments only once that day
**And** unit, integration, and E2E tests verify idempotent increments.

### Story 4.2: No Streak-Penalty Messaging

As a user,
I want progress messaging to avoid shame or streak-loss language,
So that missed days do not feel punitive.

**Acceptance Criteria:**

**Given** I return after missed days
**When** I view home
**Then** counter remains unchanged from last play day
**And** no broken-streak language is shown.

**Given** I play again after gaps
**When** I roll today
**Then** counter increments from prior value
**And** unit, integration, and E2E tests verify no decrement behavior.

## Epic 5: Mood Reflection & Daily Logging

Users can optionally log daily mood after completion and skip without penalty.

### Story 5.1: Optional Post-Completion Mood Prompt

As a user,
I want an optional mood prompt after completion,
So that I can reflect quickly without friction.

**Acceptance Criteria:**

**Given** I complete today's task
**When** completion moment ends
**Then** a 1-5 mood scale prompt is displayed
**And** skip is equally prominent.

**Given** I submit a mood score
**When** data is saved
**Then** mood is stored locally with timestamp
**And** unit, integration, and E2E tests verify prompt and save.

### Story 5.2: Skip Without Re-Prompting

As a user,
I want to dismiss the mood prompt for the day,
So that I am not repeatedly prompted after skipping.

**Acceptance Criteria:**

**Given** mood prompt is displayed
**When** I tap Skip
**Then** the prompt closes immediately
**And** no penalty language is shown.

**Given** I skipped today
**When** I return later the same day
**Then** prompt is not shown again
**And** unit, integration, and E2E tests verify single-prompt-per-day rules.

## Epic 6: Push Reminders & Daily Re-engagement

Users can configure daily reminder notifications and deep-link back to the roll screen.

### Story 6.1: Reminder Scheduling and Settings

As a user,
I want to enable, disable, and set my reminder time,
So that reminders match my routine.

**Acceptance Criteria:**

**Given** notification permissions are granted
**When** I open settings
**Then** I can enable reminders and pick a time
**And** settings persist across app restarts.

**Given** reminders are enabled
**When** I disable them
**Then** scheduled reminders are canceled
**And** unit, integration, and E2E tests verify schedule lifecycle.

### Story 6.2: Notification Deep Link to Roll

As a user,
I want reminder taps to open directly to the roll screen,
So that I can act quickly.

**Acceptance Criteria:**

**Given** a reminder is delivered
**When** I tap the notification
**Then** the app opens to roll screen context
**And** daily state is correctly loaded.

**Given** app is terminated
**When** notification opens the app
**Then** deep-link routing still lands at roll
**And** unit, integration, and E2E tests verify cold-start deep-link behavior.

## Epic 7: Offline Support & Local-First Architecture

Core user actions work offline and reconcile automatically when connectivity returns.

### Story 7.1: Offline Action Reliability

As a user,
I want roll, completion, reroll, and mood logging to work offline,
So that connectivity does not block daily use.

**Acceptance Criteria:**

**Given** device is offline
**When** I roll, complete, reroll, and log mood
**Then** all actions succeed locally
**And** no blocking network error is shown.

**Given** offline actions were recorded
**When** I relaunch offline
**Then** local state is preserved
**And** unit, integration, and E2E tests validate offline continuity.

### Story 7.2: Background Sync Queue Reconciliation

As a user,
I want offline actions to sync automatically later,
So that my progress is preserved without manual steps.

**Acceptance Criteria:**

**Given** queued offline events exist
**When** connectivity returns
**Then** sync queue retries and marks records synced
**And** sync failures remain silent and retryable.

**Given** sync completes
**When** backend aggregates refresh
**Then** remote data reflects local history
**And** unit, integration, and E2E tests verify eventual consistency.

## Epic 8: Admin Task Library Management & Curation

Admins can curate task inventory and publish changes without requiring mobile app updates.

### Story 8.1: Admin CRUD for Task Catalog

As an internal curator,
I want to create, edit, and deactivate tasks,
So that the library remains fresh and relevant.

**Acceptance Criteria:**

**Given** I am in the admin tool
**When** I create or edit a task
**Then** category, effort, and active state are required fields
**And** validation errors are explicit.

**Given** I deactivate a task
**When** changes are published
**Then** task is removed from active roll pool but retained in analytics
**And** unit, integration, and E2E tests verify CRUD and status behavior.

### Story 8.2: Peer Review and Publish Workflow

As an internal curator,
I want tasks to pass peer review before activation,
So that quality and consistency are maintained.

**Acceptance Criteria:**

**Given** a draft task is submitted
**When** reviewer approves
**Then** task becomes publishable to active pool
**And** audit metadata records reviewer and timestamp.

**Given** a task is published
**When** mobile apps refresh library version
**Then** updates are available without app restart
**And** unit, integration, and E2E tests verify review and propagation flow.

## Epic 9: Analytics, Monitoring & Crash Reporting

Team can observe engagement metrics and crash health for product decisions and reliability.

### Story 9.1: Product Event Instrumentation

As a product team member,
I want key user actions tracked consistently,
So that engagement trends are measurable.

**Acceptance Criteria:**

**Given** users perform core actions
**When** events are emitted
**Then** events include required dimensions (cohort, timestamp, action)
**And** naming follows analytics conventions.

**Given** events are ingested
**When** dashboards run
**Then** roll, reroll, completion, mood, and days-played metrics are queryable
**And** unit, integration, and E2E tests verify event contracts.

### Story 9.2: Crash Reporting and Alerting

As an engineering team member,
I want crashes reported with actionable context,
So that reliability issues are fixed quickly.

**Acceptance Criteria:**

**Given** a runtime crash occurs
**When** Crashlytics captures it
**Then** stack trace and release context are available
**And** relevant breadcrumbs are attached.

**Given** crash-free rate drops below threshold
**When** monitoring evaluates daily health
**Then** alert is sent to team channel
**And** unit, integration, and E2E tests validate alert trigger logic.

## Epic 10: Accessibility & Polish

All key flows are accessible and compliant with WCAG AA expectations.

### Story 10.1: Screen Reader and Semantics Compliance

As a user relying on assistive tech,
I want all controls and states to be announced correctly,
So that I can complete flows independently.

**Acceptance Criteria:**

**Given** VoiceOver or TalkBack is enabled
**When** I navigate onboarding and daily flow
**Then** interactive elements expose meaningful labels and roles
**And** status changes are announced.

**Given** component audits run
**When** accessibility checks execute
**Then** missing labels fail CI checks
**And** unit, integration, and E2E tests verify semantic coverage.

### Story 10.2: Contrast, Touch Targets, and Motion Controls

As a user with visual or motor needs,
I want readable contrast, large touch targets, and reduced motion support,
So that the app is comfortable and usable.

**Acceptance Criteria:**

**Given** app UI is rendered
**When** contrast and touch targets are audited
**Then** body and control text meet 4.5:1 contrast
**And** all interactive targets meet minimum 44x44pt.

**Given** reduced-motion preference is enabled
**When** animated interactions run
**Then** motion is minimized while preserving clarity
**And** unit, integration, and E2E tests validate accessibility behavior.

## Epic 11: Reliable Delivery Experience

Users get a consistently available and stable product through reliable, repeatable deployment and runtime health behavior.

### Story 11.1: Stable Runtime Packaging for User-Facing Services

As a user,
I want core app services to run in stable and secure runtime environments,
So that releases are less likely to introduce downtime or instability.

**Acceptance Criteria:**

**Given** frontend and backend repositories
**When** Docker images are built
**Then** multi-stage Dockerfiles produce minimal runtime images
**And** containers run under non-root users.

**Given** runtime containers start
**When** health checks execute
**Then** health status is reported correctly
**And** unit, integration, and E2E tests validate build and runtime behavior.

### Story 11.1 FR/NFR Reference

- FRs: Supports all user-facing FR delivery reliability
- NFRs: Reliability, Security, Performance

### Story 11.2: Predictable Multi-Environment Service Availability

As a user,
I want releases to behave consistently across environments,
So that I experience fewer regressions between test and production.

**Acceptance Criteria:**

**Given** compose profiles for dev and test
**When** I run compose commands
**Then** required services start on a shared network with proper volume mounts
**And** environment variables load from profile-specific configuration.

**Given** the stack is running
**When** I inspect logs and health
**Then** service logs are available via docker-compose logs
**And** unit, integration, and E2E tests validate inter-service readiness.

**Given** a required environment variable is missing or invalid
**When** services start under a profile
**Then** the affected service fails fast with a failing health status
**And** actionable error logs are visible via docker-compose logs.

### Story 11.2 FR/NFR Reference

- FRs: Supports all user-facing FR delivery reliability
- NFRs: Reliability, Security

## Epic 12: Trusted Product Quality Experience

Users receive a consistently performant, accessible, and secure product because quality gates prevent regressions before release.

### Story 12.1: User-Critical Flow Test Confidence

As a user,
I want core flows to be reliably tested before release,
So that I encounter fewer defects in daily usage.

**Acceptance Criteria:**

**Given** tests run in CI
**When** coverage reports are generated
**Then** overall meaningful coverage is at least 70%
**And** critical-path modules report at least 85% target.

**Given** coverage regresses below threshold
**When** pull request checks complete
**Then** merge is blocked
**And** unit, integration, and E2E tests validate gating behavior.

**Given** a critical-path module drops below its threshold
**When** CI finishes
**Then** the check fails with module-level coverage details
**And** remediation guidance is attached in the report output.

### Story 12.1 FR/NFR Reference

- FRs: Supports FR1-FR33 stability in production
- NFRs: Reliability, Performance

### Story 12.2: Performance and Accessibility Regression Prevention

As a user,
I want the app to stay fast and accessible over time,
So that new releases do not degrade usability.

**Acceptance Criteria:**

**Given** CI test stages execute
**When** Playwright + axe-core and Lighthouse audits run
**Then** accessibility findings are published as artifacts
**And** WCAG AA blockers fail the pipeline.

**Given** performance profiling runs via Chrome DevTools tooling
**When** baseline thresholds are exceeded
**Then** regression warnings are emitted with traces
**And** unit, integration, and E2E tests verify report generation and thresholds.

**Given** accessibility or performance checks detect blocking regressions
**When** pipeline evaluation completes
**Then** release checks fail with affected journeys/components listed
**And** artifacts include reproducible evidence for fixes.

### Story 12.2 FR/NFR Reference

- FRs: Supports FR4-FR25 execution usability
- NFRs: Accessibility, Performance

### Story 12.3: Security Assurance Before Release

As a user,
I want my data and sessions protected in every release,
So that I can trust the app with daily usage.

**Acceptance Criteria:**

**Given** code and dependency scans execute
**When** high-severity findings are detected
**Then** release gate is blocked
**And** remediation items are linked to tracked tickets.

**Given** manual review is performed
**When** OWASP-focused checklist is completed
**Then** XSS, injection, auth boundary, and secret handling risks are documented
**And** unit, integration, and E2E tests verify security-sensitive paths.

**Given** high-severity security findings remain unresolved
**When** release decision is evaluated
**Then** release is blocked unless an approved exception is recorded
**And** remediation tracking links are required.

### Story 12.3 FR/NFR Reference

- FRs: Supports FR24, FR26-FR33 trust and data safety
- NFRs: Security, Reliability

## Story-to-Requirement Traceability

- Story 2.1: FR4, FR10
- Story 2.2: FR5
- Story 2.3: FR8, FR9
- Story 3.1: FR6, FR7
- Story 3.2: FR6, FR7
- Story 4.1: FR11, FR12
- Story 4.2: FR13, FR14
- Story 5.1: FR15, FR17
- Story 5.2: FR16
- Story 6.1: FR18, FR19
- Story 6.2: FR20
- Story 7.1: FR21, FR22
- Story 7.2: FR23, FR24, FR25
- Story 8.1: FR26, FR27, FR29
- Story 8.2: FR28, FR30
- Story 9.1: FR31, FR32, FR33
- Story 9.2: NFR Reliability
- Story 10.1: NFR Accessibility
- Story 10.2: NFR Accessibility
- Story 11.1: NFR Reliability, NFR Security, NFR Performance
- Story 11.2: NFR Reliability, NFR Security
- Story 12.1: NFR Reliability, NFR Performance
- Story 12.2: NFR Accessibility, NFR Performance
- Story 12.3: NFR Security, NFR Reliability
