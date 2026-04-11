# Story 2.1: Daily Roll Eligibility and Task Selection

Status: done

## Story

As a user,
I want to roll once per day and receive one random active task,
So that the app gives me a clear daily action.

## Acceptance Criteria

1. **Given** I have not rolled today
**When** I tap Roll
**Then** exactly one active task is selected at random
**And** the roll is persisted with timestamp and task id.

2. **Given** I already rolled today
**When** I reopen the app
**Then** the same daily task is shown
**And** unit, integration, and E2E tests verify once-per-day enforcement.

## Implementation Notes

- Uses local device time for "today" boundary
- Integrates with task library (Firestore-backed, SQLite-cached)
- Roll state stored in SQLite: `daily_rolls` table
- Random selection uses cryptographic-quality randomness
- No UI shown for roll selection process (instant reveal for UX)

## Testing Requirements

- Unit tests: Roll eligibility (once/day), random selection algorithm, timezone edge cases
- Integration tests: Roll → task persisted; reopen app → same task returned
- E2E tests: Roll → observe task; close and reopen → same task; next day → new roll available

## References

**FRs Covered:** FR4, FR10
**Epic:** Epic 2 - Core Daily Roll & Task Execution
**Architecture:** [See architecture.md](../planning-artifacts/architecture.md)

## Dev Agent Record

### Status
- [x] Implementation complete
- [x] Tests passing
- [ ] Code reviewed

### Notes
- Implemented SQLite-backed once-per-day roll flow in the mobile app shell.
- Fixed the earlier bug where a roll was created automatically on app launch; rolls now start only when the user taps the roll control.
- Added persistence hydration so reopening the app on the same day shows the same task.
- Jest test infrastructure repaired (aligned jest-expo 55 with Jest 29 toolchain); focused test suite passes.
