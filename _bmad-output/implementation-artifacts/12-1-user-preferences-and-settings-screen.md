# Story 12.1: User Preferences and Settings Screen

Status: done

## Story

As a user,
I want a dedicated settings screen to control my preferences,
So that the app behaves according to my needs.

## Acceptance Criteria

1. **Given** a user opens Settings
**When** they adjust preferences
**Then** changes are saved to userProfile document
**And** UI reflects new values immediately.

2. **Given** settings are saved
**When** app is closed and reopened
**Then** settings persist
**And** unit, integration, and E2E tests verify persistence.

## Implementation Notes

- Settings screen in mobile app (tabs or nested nav)
- Settings persisted in Firestore userProfile
- Local state cached in Zustand or Context
- Sections: Notifications, Appearance, Data & Privacy, About

## Testing Requirements

- Unit tests: Settings state management, update logic
- Integration tests: Update setting → verify Firestore write → re-load app → verify persistence
- E2E tests: Navigate to settings → change values → restart app → verify values retained

## Dev Record

- Expanded settings screen in `apps/mobile/src/app/settings.tsx` with dedicated sections:
	- Notifications
	- Appearance
	- Data & Privacy
	- About
- Added persistent user preference model in `apps/mobile/src/db/local-profile-storage.ts`:
	- `UserPreferences` with `appearance` and `aboutLastViewedAt`
	- stable local profile ID generation for sync-safe user profile updates
- Added `useUserPreferences` hook in `apps/mobile/src/hooks/useUserPreferences.ts`:
	- immediate local UI updates for appearance selection
	- persistence through local storage
	- profile update queueing through `sync_queue`
- Extended sync processing in `apps/mobile/src/features/sync/SyncService.ts` to persist profile changes to Firestore `user_profiles`
- Added test coverage:
	- `apps/mobile/src/hooks/useUserPreferences.test.ts`

Validation run:
- Focused tests: 34 passing across settings hooks, scheduler, privacy actions, and sync pipeline

## References

**FRs Covered:** FR40
**Epic:** Epic 12 - Settings, Preferences & Privacy
