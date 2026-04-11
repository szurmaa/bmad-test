# Story 12.1: User Preferences and Settings Screen

Status: backlog

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

## References

**FRs Covered:** FR40
**Epic:** Epic 12 - Settings, Preferences & Privacy
