# Story 11.1: Offline Data Persistence

Status: backlog

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

## References

**FRs Covered:** FR39, NFR Offline
**Epic:** Epic 11 - Offline Support
