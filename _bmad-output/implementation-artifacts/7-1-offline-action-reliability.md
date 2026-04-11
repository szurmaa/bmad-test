# Story 7.1: Offline Action Reliability

Status: done

## Story

As a user,
I want roll, completion, reroll, and mood logging to work offline,
So that connectivity does not block daily use.

## Acceptance Criteria

1. **Given** device is offline
**When** I roll, complete, reroll, and log mood
**Then** all actions succeed locally
**And** no blocking network error is shown.

2. **Given** offline actions were recorded
**When** I relaunch offline
**Then** local state is preserved
**And** unit, integration, and E2E tests validate offline continuity.

## Implementation Notes

- SQLite is source of truth (all data written locally first)
- Network errors do not block UI or show error states
- Sync happens asynchronously in background
- No "offline mode" indicator (just works)
- Task library pre-cached locally

## Testing Requirements

- Unit tests: Offline state detection, local persistence
- Integration tests: Offline actions → persisted locally
- Simulated offline tests: Disable network → perform actions → re-enable → verify state
- E2E tests: Complete workflow offline, relaunch offline, verify state preserved

## Dev Record

- SQLite (`schema.ts`) was already the source of truth for all writes — roll, complete, reroll, mood
- Added `queueForSync` calls to `src/hooks/useDailyRollInit.ts` after each action (`roll_created`, `roll_completed`, `roll_rerolled`, `mood_logged`) — fire-and-forget (`.catch(() => {})`), never blocks UI
- Added `incrementSyncRetryCount` to `src/db/schema.ts`
- All actions already work fully offline via SQLite — no blocking network calls in any user-facing path

## References

**FRs Covered:** FR21, FR22
**Epic:** Epic 7 - Offline Support & Local-First Architecture
