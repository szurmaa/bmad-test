# Sprint Stories Index

Complete list of 31 stories across 14 epics, organized by implementation phase.

## Phase 1: Foundation (Epic 1)
- [1.1: Set up initial project from starter template](1-1-set-up-initial-project-from-starter-template.md)
- [1.2: Permission choice without blocking](1-2-permission-choice-without-blocking.md)
- [1.3: Complete onboarding in four taps](1-3-complete-onboarding-in-four-taps.md)

## Phase 2: Core Features (Epics 2–5)

### Epic 2: Daily Habit Dice
- [2.1: Daily Habit Dice display and roll mechanics](2-1-daily-habit-dice-display-and-roll-mechanics.md)
- [2.2: Reroll and replacement mechanics](2-2-reroll-and-replacement-mechanics.md)

### Epic 3: Mood Tracking
- [3.1: Daily mood submission UI](3-1-daily-mood-submission-ui.md)
- [3.2: Mood history and long-term mood trends](3-2-mood-history-and-long-term-mood-trends.md)

### Epic 4: Streak Management
- [4.1: Streak calculation and display logic](4-1-streak-calculation-and-display-logic.md)
- [4.2: Streak preservation and milestone rewards](4-2-streak-preservation-and-milestone-rewards.md)

### Epic 5: Dashboard Overview
- [5.1: Dashboard summary cards and metrics](5-1-dashboard-summary-cards-and-metrics.md)
- [5.2: Habit filtering and history visualization](5-2-habit-filtering-and-history-visualization.md)

## Phase 3: Polish and Flexibility (Epics 6–7, 9)

### Epic 6: Habit Customization
- [6.1: Habit creation and basic properties](6-1-habit-creation-and-basic-properties.md)
- [6.2: Emoji selection and UI personalization](6-2-emoji-selection-and-ui-personalization.md)

### Epic 7: Multi-Language & Localization
- [7.1: Localization framework and language selection](7-1-localization-framework-and-language-selection.md)
- [7.2: String externalization and RTL support](7-2-string-externalization-and-rtl-support.md)

### Epic 9: Analytics & Monitoring
- [9.1: Product event instrumentation](9-1-product-event-instrumentation.md)
- [9.2: Crash reporting and alerting](9-2-crash-reporting-and-alerting.md)

## Phase 4: Admin, Infrastructure, Quality (Epics 8, 10–14)

### Epic 8: Admin & Moderation
- [8.1: Admin dashboard and moderation tools](8-1-admin-dashboard-and-moderation-tools.md)
- [8.2: Content policy enforcement and detection](8-2-content-policy-enforcement-and-detection.md)

### Epic 10: Push Notifications & Engagement
- [10.1: Push notification service integration](10-1-push-notification-service-integration.md)
- [10.2: In-app engagement campaigns](10-2-in-app-engagement-campaigns.md)

### Epic 11: Offline Support
- [11.1: Offline data persistence](11-1-offline-data-persistence.md)
- [11.2: Offline functionality & graceful degradation](11-2-offline-functionality-graceful-degradation.md)

### Epic 12: Settings, Preferences & Privacy
- [12.1: User preferences and settings screen](12-1-user-preferences-and-settings-screen.md)
- [12.2: Notification preferences and scheduling](12-2-notification-preferences-and-scheduling.md)
- [12.3: Data privacy and export](12-3-data-privacy-and-export.md)

### Epic 13: Docker Compose Containerization
- [13.1: Create Dockerfiles and health endpoints](13-1-create-dockerfiles-and-health-endpoints.md)
- [13.2: Orchestrate services with Docker Compose](13-2-orchestrate-services-with-docker-compose.md)

### Epic 14: QA Validation and Compliance Reports
- [14.1: Generate test coverage report and gap plan](14-1-generate-test-coverage-report-and-gap-plan.md)
- [14.2: Run performance testing and document findings](14-2-run-performance-testing-and-document-findings.md)
- [14.3: Run accessibility audit and WCAG AA report](14-3-run-accessibility-audit-and-wcag-aa-report.md)
- [14.4: Perform security review and remediation log](14-4-perform-security-review-and-remediation-log.md)

## Phase 5: Final Testing and Launch Prep
- Quality gate review and cross-epic integration tests
- Launch checklist validation
- Beta release coordination

---

## Story Status Summary

Total Stories: 31
- **Backlog:** 0
- **In Progress:** 0
- **Completed:** 31
- **Blocked:** 0

## Implementation Sequence Recommendation

1. **Start with Phase 1** (Stories 1.1–1.3) for project setup and onboarding
2. **Parallelize Phase 2** (Stories 2.1–5.2) with 2–3 teams if possible
3. **Follow with Phase 3** (Stories 6.1–9.2) once core features are stable
4. **Phase 4** (Stories 8.1–12.3) can run in parallel with Phase 3 polish
5. **Phase 5** is conducted once all epics reach integration stage

## Testing Strategy

- **Unit tests:** Functional logic for each story
- **Integration tests:** Cross-component interactions within epic
- **E2E tests:** Full user flows per epic
- **Regression tests:** Run after each phase completion
- **Performance & reliability NFR tests:** Throughout all phases

---

*Last updated: 2026-04-11*
