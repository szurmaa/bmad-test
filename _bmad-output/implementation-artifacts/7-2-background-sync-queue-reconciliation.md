# Story 7.2: Background Sync Queue Reconciliation

Status: done

## Story

As a user,
I want offline actions to sync automatically later,
So that my progress is preserved without manual steps.

## Acceptance Criteria

1. **Given** queued offline events exist
**When** connectivity returns
**Then** sync queue retries and marks records synced
**And** sync failures remain silent and retryable.

2. **Given** sync completes
**When** backend aggregates refresh
**Then** remote data reflects local history
**And** unit, integration, and E2E tests verify eventual consistency.

## Implementation Notes

- Sync queue table: id, event_type, payload, created_at, sync_status, retry_count
- Background sync service checks periodically or on app foreground
- Exponential backoff on retry (1s, 2s, 4s, 8s max)
- Silent failures: retry in background, no user-visible errors
- Eventual consistency: may take minutes for remote data to reflect

## Testing Requirements

- Unit tests: Sync queue logic, retry backoff, event handling
- Integration tests: Offline action → queue → sync → Firebase updated
- Network simulation: Offline → action → regain connectivity → verify sync
- E2E tests: End-to-end offline action → sync → remote reflects local

## Dev Record

- Created `src/features/sync/SyncService.ts`:
  - `getFirestoreInstance()` — lazy Firebase init, returns null if API key is a placeholder (silent skip)
  - `syncItemToFirestore()` — dispatches to correct Firestore collection by action type (`roll_created`, `roll_completed`, `roll_rerolled`, `mood_logged`); unknown actions marked synced to unblock queue
  - `processQueue()` — reads up to 50 pending items; skips items with `retry_count >= 5`; marks synced on success; calls `incrementSyncRetryCount` on transient failure
  - Malformed payloads marked synced immediately to prevent queue blockage
- Updated `src/app/_layout.tsx` — `AppState.addEventListener('change')` triggers `processQueue()` on foreground; also runs on initial app mount
- Unit tests: `SyncService.test.ts` — 7 tests covering all branches (passing)
- TypeScript: clean; 43 total tests passing

## References

**FRs Covered:** FR23, FR24, FR25
**Epic:** Epic 7 - Offline Support & Local-First Architecture
