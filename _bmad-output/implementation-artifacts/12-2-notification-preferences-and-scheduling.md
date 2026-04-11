# Story 12.2: Notification Preferences and Scheduling

Status: done

## Story

As a user,
I want to control notification frequency and timing,
So that I'm not overwhelmed.

## Acceptance Criteria

1. **Given** a user opens Notification Settings
**When** they set Do Not Disturb hours or toggle notification types
**Then** preferences are saved
**And** future notifications respect these settings.

2. **Given** notification preferences change
**When** a scheduled notification would fire
**Then** schedule is recalculated
**And** unit, integration, and E2E tests verify honor of preferences.

## Implementation Notes

- Notification settings in userProfile: notifications_enabled, do_not_disturb_start/end, reminder_type
- Enum: daily, weekly, or email_only
- DND schedule stored as ISO time strings
- Notification job checks preferences before sending

## Testing Requirements

- Unit tests: DND logic, preference evaluation, scheduling math
- Integration tests: Set DND → trigger would-be notification → verify suppression
- E2E tests: Toggle notifications → set DND hours → verify behavior across devices

## Dev Record

- Extended reminder preference contract in `apps/mobile/src/db/local-profile-storage.ts`:
	- `reminderType`: `daily | weekly | email_only`
	- DND window: `doNotDisturbStart` / `doNotDisturbEnd`
- Upgraded scheduler logic in `apps/mobile/src/features/notifications/services/NotificationSchedulerService.ts`:
	- supports DAILY and WEEKLY local scheduling
	- suppresses local scheduling for `email_only`
- Upgraded settings behavior in `apps/mobile/src/hooks/useReminderSettings.ts`:
	- recalculates scheduling whenever enabled/time/type/DND changes
	- includes DND suppression logic for reminder times inside quiet hours
	- syncs profile-level notification preferences to queue
- Expanded UI controls in `apps/mobile/src/features/notifications/components/ReminderSettingsCard.tsx`:
	- frequency toggles
	- DND start/end time inputs with validation
	- save actions for schedule and DND windows
- Added test coverage:
	- updated `apps/mobile/src/hooks/useReminderSettings.test.ts`
	- updated `apps/mobile/src/features/notifications/services/NotificationSchedulerService.test.ts`
	- updated `apps/mobile/src/features/sync/SyncService.test.ts`

Validation run:
- Focused tests: 34 passing including scheduler frequency handling and DND-aware preference updates

## References

**FRs Covered:** FR40, FR34, FR35
**Epic:** Epic 12 - Settings, Preferences & Privacy
