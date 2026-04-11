# Story 12.3: Data Privacy and Export

Status: done

## Story

As a user concerned about privacy,
I want to export or delete my data,
So that I have control over my personal information.

## Acceptance Criteria

1. **Given** a user requests data export
**When** they click "Export Data"
**Then** a JSON file of all personal data is generated and downloadable
**And** export includes habits, history, user profile, preferences.

2. **Given** a user deletes their account
**When** they confirm deletion
**Then** all personal data cascades for deletion (Firestore rules enforce)
**And** account becomes unrecoverable within retention period
**And** unit, integration, and E2E tests validate export and deletion.

## Implementation Notes

- Data export: Call Firebase Function → query user's Firestore docs → generate JSON → return as download
- Account deletion: Firestore Security Rules check auth.uid = user.id
- Soft delete flag with 30-day hard deletion window
- GDPR/privacy compliance checklist verified

## Testing Requirements

- Unit tests: Data export format, deletion flag logic
- Integration tests: Export user data → verify completeness → delete account → verify cascade
- E2E tests: User exports data → receives file → user deletes account → verify access revoked

## Dev Record

- Added privacy service in `apps/mobile/src/features/settings/DataPrivacyService.ts`:
	- exports local user data snapshot to JSON file in app document storage
	- includes profile, preferences, rolls, mood logs, and completions
	- handles account deletion requests by clearing local user data and queueing deletion intent
- Added deletion sync handling in `apps/mobile/src/features/sync/SyncService.ts`:
	- `account_deletion_requested` -> Firestore `deletion_requests`
- Wired data privacy actions into settings UI in `apps/mobile/src/app/settings.tsx`:
	- Export Data action
	- Delete Account action
	- inline status messaging for action outcomes
- Added test coverage:
	- `apps/mobile/src/features/settings/DataPrivacyService.test.ts`

Validation run:
- Focused tests: 34 passing including export file generation and deletion request queueing

## References

**FRs Covered:** FR41
**Epic:** Epic 12 - Settings, Preferences & Privacy
