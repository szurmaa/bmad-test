---
stepsCompleted: ["step-01-init", "step-02-discovery", "step-02b-vision", "step-02c-executive-summary", "step-03-success", "step-04-journeys", "step-05-domain", "step-06-innovation", "step-07-project-type", "step-08-scoping", "step-09-functional", "step-10-nonfunctional", "step-11-polish"]
inputDocuments: ["_bmad-output/planning-artifacts/product-brief-habit-dice.md"]
workflowType: 'prd'
classification:
  projectType: mobile_app
  domain: general
  complexity: low
  projectContext: greenfield
---

# Product Requirements Document - Habit Dice

**Author:** aszurma
**Date:** 2026-04-10

## Executive Summary

Habit Dice is a React Native mobile app (iOS + Android) that delivers one randomly-selected micro-habit task per day across four wellness categories — Mind, Body, Life, and Work. It targets Gen Z users (18–25), the ADHD community, and anyone who has previously abandoned a habit app, by eliminating the two failure modes endemic to existing tools: decision pressure and punishment-on-miss.

The core product insight is a format mismatch problem, not a motivation problem. Habit trackers fail because they impose planning and commitment overhead that exceeds users' available cognitive bandwidth — especially for ADHD users and those with variable energy. Habit Dice eliminates that overhead entirely: the dice decides, not the user. Completion is encouraged but never required; the daily roll itself is the engagement mechanism.

### What Makes This Special

The randomized daily delivery mechanic — borrowed from Wordle, tarot, and game loot drops — is unexploited territory in habit/wellness apps. No current competitor combines randomized micro-habit selection with a consecutive-days-played model that celebrates showing up without punishing absence. The one-reroll-per-day constraint preserves user autonomy while keeping the interaction intentional. A longitudinal mood log creates a mid-term retention signal ("you feel better on roll days") that deepens engagement after initial novelty fades.

The task library — 100–150 curated tasks at launch — is itself a content moat: long enough that users don't see repeats in their first month, varied enough that category balance feels genuine. Offline-first architecture (SQLite/Realm with Firebase sync) ensures the experience works regardless of connectivity.

### Project Classification

- **Project Type:** Mobile App — React Native, cross-platform (iOS + Android)
- **Domain:** Consumer wellness / habit tracking (no regulatory requirements)
- **Complexity:** Low — established tech stack, no regulated data, standard mobile patterns
- **Project Context:** Greenfield

## Success Criteria

### User Success

The primary user success signal is **daily re-engagement without guilt** — the user opens the app on days they didn't plan to, not out of fear of breaking a streak, but because the roll is something they look forward to.

- User completes their first roll within 60 seconds of first launch (activation)
- User returns on Day 2 and Day 7 without a push notification trigger (organic re-engagement)
- User uses the reroll at least once in their first week (mechanic trust)
- User submits at least one mood log in their first 7 days (engagement depth)
- At D30, user recalls a task they actually completed and felt benefit from

### Business Success

MVP phase (months 1–6) success validates the retention mechanic before monetization. The product is working if the consecutive-days-played curve beats the category average (typical habit app D30 ~10%).

| Metric | Target (6 months post-launch) |
|--------|-------------------------------|
| D7 retention | > 35% |
| D30 retention | > 15% |
| Daily dice roll rate (active users) | > 70% |
| Mood log completion rate | > 40% on roll days |
| App Store / Play Store rating | ≥ 4.3 |

Secondary tracking: days-played distribution, reroll frequency, task repeat exposure rate, and category balance. D30 retention > 15% with roll rate > 70% is the threshold to greenlight Phase 2.

### Measurable Outcomes

**Core hypothesis validation metric:** A user who has played 14+ consecutive days has a D30 retention rate > 50%. If the consecutive-days mechanic drives retention — not just novelty — this will be materially higher than the D30 baseline for new users.

Technical performance targets and reliability requirements are defined in [Non-Functional Requirements](#non-functional-requirements).

## User Journeys

### Journey 1: Maya — The Burned-Out Beginner (Happy Path)

**Persona:** Maya, 22, college junior, ADHD diagnosis at 19. She's tried Habitica, Streaks, and Fabulous — each lasted about two weeks before she deleted them in a shame spiral. She's not lazy; she's exhausted by apps that treat her like a project manager for her own life.

**Opening Scene:** It's 9 PM on a Tuesday. Maya is scrolling TikTok when a creator posts a 30-second clip rolling a digital die: "this is the only habit app I've kept for 60 days." She downloads it. The whole onboarding is four taps and a notification permission ask. No habit-setting. No commitment slider. No "how many days a week?"

**Rising Action:** She rolls. Gets "drink a full glass of water right now." Does it while still in bed. Marks it complete. A small animation plays — not a trophy parade, just a quiet nod. The next morning the app sends: "Your dice are ready." She opens it without dread. Rolls: "Take a 5-minute walk before lunch." She actually does it.

**Climax:** Day 11. She gets "write one journal sentence." Rerolls. Gets "clear your phone's home screen of unused apps." Done in four minutes. The mood log prompt appears. She taps "pretty good." Eleven days in and she hasn't felt guilty about this app once.

**Resolution:** At D30, Maya has played 24 of 30 days. The app shows "24 days played" with no comment on the 6 she missed. She's recommended it to two friends in her ADHD Discord server. She doesn't think of herself as someone who "does habits" — she just rolls most days.

**Requirements Revealed:** Frictionless onboarding, animated roll with category display, one-tap completion, quiet celebration UX, reroll with daily hard limit, additive days-played counter, no missed-day penalty framing, mood log, non-pressuring push notification copy.

---

### Journey 2: Maya — Edge Case (Skip Days + Return)

**Opening Scene:** Day 14. Brutal exam week. Maya doesn't open the app for four days. Every other app she's used would greet her with a broken streak, a reset counter, a guilt message.

**Climax:** She opens it. Counter says "14 days played." Not "you broke your streak." Not "welcome back after 4 days." Just her cumulative count, exactly where she left it. A new roll is waiting.

**Resolution:** She rolls, completes the task, logs her mood. Re-entry cost: zero. She continues.

**Requirements Revealed:** Days-played counter is purely additive (never decremented); no "days since last session" display; no missed-day messaging in UI or push notifications; app state on re-open is identical whether it's been 1 day or 5.

---

### Journey 3: Jordan — The Wellness Content Creator

**Persona:** Jordan, 26, TikTok wellness creator, 180K followers. Posts micro-habit and ADHD-friendly routine content. Needs a product to demonstrate, not just a philosophy to evangelize.

**Rising Action:** Jordan downloads Habit Dice, rolls, and films the interaction in under 10 minutes. The dice animation is inherently captivating on video. The reroll choice ("I got journaling but I rerolled to tidying") adds authentic narrative tension. Posts a 45-second clip.

**Resolution:** 2.3M views. Jordan's followers flood the App Store. No paid partnership needed — the core loop is the content. Jordan becomes an organic advocate.

**Requirements Revealed:** Roll animation visually compelling, completes within a filmable timeframe (< 2s), task reveal readable on screen recording, completion animation reads well at phone-camera distance. No creator-specific mode needed for MVP.

---

### Journey 4: Internal Task Library Curator

**Persona:** A Habit Dice team member responsible for maintaining the task library across categories.

**Opening Scene:** Post-launch analytics show Body tasks have a 15% higher completion rate than Work tasks. The curator wants to retire two low-performing Work tasks and add five new ones.

**Rising Action:** Opens the internal admin web tool (simple CRUD). Filters by category = Work, sorts by completion rate ascending. Marks two tasks inactive (soft delete — retained in DB for analytics, not served). Drafts five new tasks with category, effort estimate, and "pending review" status.

**Resolution:** A second team member approves the new tasks. They go live via server-side content update — no app store release required.

**Requirements Revealed:** Internal admin web tool with task CRUD, category tagging, effort estimation, active/inactive status, peer approval workflow; server-side library updates; per-task completion rate analytics visible to admins.

### Journey Requirements Summary

| Capability | Revealed By |
|---|---|
| Frictionless 4-tap onboarding, no pre-commitment | Journey 1 |
| Animated dice roll (< 2s, visually compelling) | Journeys 1 & 3 |
| Task display by category with completion tap | Journeys 1 & 3 |
| One reroll per day (hard limit, midnight reset) | Journeys 1 & 2 |
| Quiet completion micro-celebration | Journey 1 |
| Consecutive days-played counter (additive only, never decremented) | Journeys 1 & 2 |
| No missed-day penalty messaging anywhere in app | Journey 2 |
| End-of-day mood log prompt (lightweight scale) | Journeys 1 & 2 |
| Push notifications with non-pressuring copy | Journeys 1 & 2 |
| Offline-first: all core actions work without connectivity | Journeys 1 & 2 |
| Internal admin web tool: task CRUD, category/status/approval | Journey 4 |
| Server-side task library updates (no app release required) | Journey 4 |
| Per-task completion rate analytics for internal use | Journey 4 |

## Innovation & Novel Patterns

### Detected Innovation Areas

**Randomization as decision elimination.** No current habit app uses randomized daily selection as the primary engagement mechanic. Existing randomization in wellness apps is additive (varied tips, optional challenges); Habit Dice makes it the entire interaction model — using surprise to remove the user's most common failure point: choosing what to do.

**Consecutive-days-played without loss aversion.** The dominant retention mechanic in streak apps (Duolingo, Streaks, Habitica) is loss aversion — the streak has value because breaking it hurts. Habit Dice inverts this: the counter only increments, never decrements, and missing days costs the user nothing visible. This bets that positive reinforcement alone sustains better long-term retention for the burnout-prone demographic.

**Cross-domain mechanic transfer.** The roll interaction borrows simultaneously from daily puzzle games (Wordle), contemplative randomization (tarot), and game reward systems (loot drops). None of these mechanics have been applied to personal wellness habit formation. The bet: the emotional experience of a loot drop — anticipation, surprise, delight — transfers meaningfully to a wellness context.

### Validation Approach

- **Reroll rate** as mechanic trust proxy: target < 30% at D30. If > 60%, randomization is creating decision fatigue, not eliminating it.
- **D14+ cohort retention** as core hypothesis test: users with 14+ days played should retain at > 50% to D30 — materially above the new-user baseline.
- **Mood log correlation**: no positive correlation between roll days and mood at 60+ days invalidates the core behavioral claim.

### Risk Mitigation

- **If randomization frustrates**: The one-reroll-per-day is the safety valve. High reroll rates signal the library needs rebalancing or a soft category preference signal in a growth phase — without abandoning the core mechanic.
- **If no-punishment framing feels hollow**: The days-played counter must feel meaningful on its own, not like a consolation prize. Copy and celebration design are load-bearing elements of this mechanic.

## Mobile App Specific Requirements

### Technical Architecture

- **React Native** (Expo or bare workflow TBD) — single codebase for iOS and Android
- **Local-first data layer**: SQLite or Realm for task library, roll history, days-played counter, and mood logs; all writes happen locally first
- **Firebase**: anonymous/email auth, Firestore sync for days-played aggregates, Cloud Messaging for push notifications, Crashlytics for crash reporting
- **Server-side task library**: task content served from Firestore or a lightweight CMS to enable library updates without app store releases
- **Push delivery**: OneSignal or Firebase Cloud Messaging

### Platform Support

| Platform | Minimum OS | Target |
|---|---|---|
| iOS | iOS 15+ | iOS 16+ |
| Android | Android 8.0 (API 26) | Android 10+ |

No web or desktop version in scope.

### Device Permissions

| Permission | Required | Purpose |
|---|---|---|
| Push notifications | Optional (prompted at onboarding) | Daily roll reminder |
| Local storage | Implicit | SQLite/Realm local data |
| Network access | Implicit | Firebase sync, content updates |

No camera, location, contacts, microphone, or biometric permissions required.

### Offline Mode

Full offline capability required for all core functions:

- Daily roll: served from locally-cached task library
- Reroll: locally enforced limit (midnight reset by device local time)
- Task completion: written to local DB immediately
- Days-played counter: calculated locally
- Mood log: written to local DB, synced to Firebase when online

Firebase sync failures must be silent and non-blocking. The app must be fully functional with airplane mode enabled indefinitely.

### Push Notifications

- Daily reminder at user-configured time (default: 9:00 AM local)
- Copy must be low-pressure — e.g., "Your dice are ready 🎲" not "Don't break your streak!"
- Users can opt out during onboarding or in settings; no re-prompt if declined
- Notifications deep-link directly to the roll screen

### Store Compliance

- iOS and Android: no medical claims in listing or in-app copy
- Content rating: Everyone (Google Play), 4+ (App Store)
- Privacy policy required at both stores disclosing Firebase analytics and crash reporting
- No in-app purchases at MVP; no StoreKit / Google Play Billing integration needed

### Key Implementation Constraints

- Roll animation: native-feeling (React Native Reanimated or equivalent) — not a WebView or GIF
- Task library: supports hot-reload from server without app restart
- Reroll reset: uses device local time, not UTC
- Days-played counter: idempotent against clock changes and timezone travel

## Project Scoping & Phased Development

### MVP Strategy

**Approach:** Experience MVP — validate the core roll mechanic and no-punishment retention model with real users before monetization or social features. Success is a retention curve that beats the category average.

**Team:** 1–2 React Native engineers, 1 designer, 1 PM/founder. Firebase is serverless; no dedicated backend engineer required. Task library curation is a part-time editorial function.

### MVP Feature Set

**Journeys supported:** All four (burned-out beginner happy path, skip/return, content creator organic use, internal library management).

| Capability | Rationale |
|---|---|
| Animated dice roll (4 categories) | Core mechanic — without this, there is no product |
| Task library: 100–150 tasks at launch | Minimum to avoid repeats in first month |
| One reroll per day (hard limit) | Preserves mechanic integrity |
| Consecutive days-played counter (additive only) | Core retention signal; must never decrement |
| Task completion with micro-celebration | Closes the daily loop |
| End-of-day mood log prompt | Required for hypothesis validation |
| Push notifications (configurable, non-pressuring copy) | Re-engagement without guilt |
| Offline-first architecture throughout | Non-negotiable design principle |
| Firebase sync (background, non-blocking) | Days-played data portability |
| Onboarding: ≤ 4 taps, zero pre-commitment | Setup overhead is failure mode #1 for this demographic |
| Internal admin web tool (task CRUD, category, approval) | Library maintenance without engineering deploys |

### Phase 2 — Growth (Post-MVP)

- Mood insight surfacing: "You've felt better on days you rolled" (requires 60+ days of data)
- Expanded task library (200+ tasks, seasonal additions)
- Social sharing of days-played milestones (not individual tasks)
- Monetization: premium task packs or themed dice
- Soft category preference signal — only if reroll rate data warrants it

### Phase 3 — Expansion

- Themed / seasonal dice packs
- Creator-designed rolls (wellness influencer partnerships)
- Community challenges and group rolls
- User-created custom tasks
- Habit Dice as a platform: branded packs, creator marketplace

### Risk Mitigation

**Technical:** The local-first sync architecture is highest risk — specifically days-played counter consistency across reinstalls and device changes. Mitigation: Firebase is the source of truth for the counter aggregate; local DB is the write-ahead log. Test reinstall and multi-device scenarios before launch.

**Market:** Core hypothesis (randomization reduces friction for ADHD/burnout-prone users) is unvalidated until live. Mitigation: instrument reroll rate and D14 cohort retention from Day 1; go/no-go thresholds defined before Phase 2 investment (D30 > 15%, reroll < 30%).

**Resource:** The internal admin tool can be deferred — direct Firestore edits by a technical team member cover the first 60 days. The user-facing product ships independently.

## Functional Requirements

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

## Non-Functional Requirements

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

- Firebase architecture scales to 100K MAU without infrastructure changes (Spark → Blaze upgrade is the only required action)
- Task library updates via Firestore propagate to all active users within 5 minutes of admin publish
- Analytics pipeline supports cohort queries across 12 months of data without performance degradation

### Accessibility

- All interactive elements have accessible labels (VoiceOver / TalkBack compatible)
- Minimum touch target size: 44×44pt
- Color is never the sole means of conveying information (category indicators use icons + color)
- App respects system font size settings (Dynamic Type / Android font scale)
- WCAG 2.1 AA color contrast ratio (4.5:1) for all body text and interactive labels

### Reliability

- Crash-free session rate ≥ 99.5% (Firebase Crashlytics)
- Core functions (roll, complete, mood log) available 100% of the time in offline mode
- Firebase sync failures are silent and non-blocking; no user-visible error state from sync issues
- Push notification delivery rate ≥ 95% for opted-in users within 5 minutes of configured time
