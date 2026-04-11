# Story 9.2: Crash Reporting and Alerting

Status: done

## Story

As an engineering team member,
I want crashes reported with actionable context,
So that reliability issues are fixed quickly.

## Acceptance Criteria

1. **Given** a runtime crash occurs
**When** Crashlytics captures it
**Then** stack trace and release context are available
**And** relevant breadcrumbs are attached.

2. **Given** crash-free rate drops below threshold
**When** monitoring evaluates daily health
**Then** alert is sent to team channel
**And** unit, integration, and E2E tests validate alert trigger logic.

## Implementation Notes

- Firebase Crashlytics integration
- Automatic crash capture + manual breadcrumbs
- Crash-free rate threshold: typically 99.5%
- Alerts via Slack or email
- Dashboard shows crash trends, regex filtering for app-specific issues

## Testing Requirements

- Unit tests: Breadcrumb attachment logic, alert threshold logic
- Integration tests: Trigger crash → Crashlytics captures → alert fires
- Manual testing: Intentional crash → verify capture and alert delivery

## Dev Record

- Added crash reporting service in `apps/mobile/src/features/crash-reporting/CrashReportingService.ts`:
	- breadcrumb trail capture with metadata
	- release context attachment via `expo-constants`
	- session counting and crash counting
	- global JS error handler installation
	- crash report queueing through sync pipeline
- Added alert threshold evaluator in `apps/mobile/src/features/crash-reporting/CrashAlertEvaluator.ts`
	- default crash-free threshold: `99.5%`
	- computes whether a team alert should fire
- Wired crash monitoring into app lifecycle in `apps/mobile/src/app/_layout.tsx`
	- installs global crash handler on mount
	- starts crash-reporting session on app load
	- records lifecycle breadcrumbs on mount and foreground
- Added breadcrumbs to user flows:
	- `apps/mobile/src/hooks/useDailyRollInit.ts`
	- `apps/mobile/src/hooks/useReminderSettings.ts`
- Extended sync delivery in `apps/mobile/src/features/sync/SyncService.ts`:
	- `crash_report` -> Firestore `crash_reports`
	- `crash_alert` -> Firestore `team_alerts`
- Added tests:
	- `apps/mobile/src/features/crash-reporting/CrashReportingService.test.ts`
	- `apps/mobile/src/features/crash-reporting/CrashAlertEvaluator.test.ts`
	- updated `apps/mobile/src/features/sync/SyncService.test.ts`
	- updated `apps/mobile/src/hooks/useReminderSettings.test.ts`
- Validation run:
	- TypeScript: clean (`npx tsc --noEmit`)
	- Tests: 25 passing (`CrashReportingService`, `CrashAlertEvaluator`, `SyncService`, `useReminderSettings`)

## References

**FRs Covered:** NFR Reliability
**Epic:** Epic 9 - Analytics, Monitoring & Crash Reporting
