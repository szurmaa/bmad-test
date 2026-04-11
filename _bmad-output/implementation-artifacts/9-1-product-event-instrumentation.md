# Story 9.1: Product Event Instrumentation

Status: backlog

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

## References

**FRs Covered:** FR31, FR32, FR33
**Epic:** Epic 9 - Analytics, Monitoring & Crash Reporting
