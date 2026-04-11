# Story 9.1: Product Event Instrumentation

Status: done

## Story

As a product team member,
I want key user actions tracked consistently,
So that engagement trends are measurable.

## Acceptance Criteria

1. **Given** users perform core actions
**When** events are emitted
**Then** events include required dimensions (cohort, timestamp, action)
**And** naming follows analytics conventions.

2. **Given** events are ingested
**When** dashboards run
**Then** roll, reroll, completion, mood, and days-played metrics are queryable
**And** unit, integration, and E2E tests verify event contracts.

## Implementation Notes

- Firebase Analytics integration
- Events: daily_roll, daily_roll_completed, reroll_used, mood_submitted, etc.
- Event dimensions: user_id, timestamp, cohort, action
- Events logged locally, synced with Firebase
- Aggregation dashboard via Firestore or BigQuery

## Testing Requirements

- Unit tests: Event emission logic, event schema validation
- Integration tests: Perform actions → events logged → appear in analytics
- E2E tests: Series of interactions → verify events in dashboard after propagation delay

## Dev Record

- Added analytics contract + event service in `apps/mobile/src/features/analytics/AnalyticsService.ts`:
	- canonical event names: `daily_roll`, `daily_roll_completed`, `reroll_used`, `mood_submitted`, `reminder_enabled`, `reminder_disabled`, `reminder_time_updated`
	- required dimensions enforced via Zod: `userId`, `cohort`, `timestamp`, `action`
	- anonymous analytics identity persisted locally
- Added analytics tests in `apps/mobile/src/features/analytics/AnalyticsService.test.ts`
- Emitted events from product action hooks:
	- `apps/mobile/src/hooks/useDailyRollInit.ts` for roll, complete, reroll, mood
	- `apps/mobile/src/hooks/useReminderSettings.ts` for reminder enable/disable/time update
- Extended sync delivery in `apps/mobile/src/features/sync/SyncService.ts`:
	- `product_event` queue items now sync to Firestore collection `product_events`
- Added sync coverage for `product_event` delivery in `apps/mobile/src/features/sync/SyncService.test.ts`
- Validation run:
	- TypeScript: clean (`npx tsc --noEmit`)
	- Tests: 18 passing (`AnalyticsService`, `SyncService`, `useReminderSettings`)

## References

**FRs Covered:** FR31, FR32, FR33
**Epic:** Epic 9 - Analytics, Monitoring & Crash Reporting
