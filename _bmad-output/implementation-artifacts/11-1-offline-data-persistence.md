# Story 11.1: Offline Data Persistence

Status: done

## Story

As a user,
I want to roll the dice and interact with my habit when offline,
So that I don't lose progress without connectivity.

## Acceptance Criteria

1. **Given** a user is offline
**When** they perform actions (roll, reroll, submit mood)
**Then** data is persisted locally
**And** timestamp and action type are stored.

2. **Given** local data is pending sync
**When** connectivity returns
**Then** queued actions sync automatically to Firestore
**And** unit, integration, and E2E tests verify persistence and sync.

## Implementation Notes

- Local SQLite or Expo SQLite for mobile
- Queue table: id, action_type, payload, synced_at, created_at, retry_count
- Sync logic triggered by connectivity listener (NetInfo)
- Conflict resolution: local timestamp + server-side logic
- Offline detection and UI state management

## Testing Requirements

- Unit tests: Queue insertion, local storage read/write logic
- Integration tests: Write offline → toggle connectivity → verify sync
- E2E tests: Work offline → go online → verify data persists and syncs

## Dev Record

- Reused and validated existing SQLite-first action persistence in `apps/mobile/src/db/schema.ts` and `apps/mobile/src/hooks/useDailyRollInit.ts`:
	- roll, reroll, completion, and mood actions are persisted locally
	- queued sync records include action type, payload, created timestamp, and retry metadata
- Added explicit connectivity detection and reconnect triggers:
	- new hook `apps/mobile/src/hooks/useConnectivityStatus.ts` provides online/offline state
	- app lifecycle now listens to network restore in `apps/mobile/src/app/_layout.tsx`
	- on connectivity restoration, app automatically runs `processQueue()` and task-catalog refresh
- Added test coverage for connectivity state transitions:
	- `apps/mobile/src/hooks/useConnectivityStatus.test.ts`

Validation run:
- Focused tests: 21 passing across sync queue, connectivity hook, and impacted UI/hook flows

## References

**FRs Covered:** FR39, NFR Offline
**Epic:** Epic 11 - Offline Support
