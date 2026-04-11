# Story 6.1: Reminder Scheduling and Settings

Status: done

## Story

As a user,
I want to enable, disable, and set my reminder time,
So that reminders match my routine.

## Acceptance Criteria

1. **Given** notification permissions are granted
**When** I open settings
**Then** I can enable reminders and pick a time
**And** settings persist across app restarts.

2. **Given** reminders are enabled
**When** I disable them
**Then** scheduled reminders are canceled
**And** unit, integration, and E2E tests verify schedule lifecycle.

## Implementation Notes

- Settings UI: toggle + time picker
- Reminders optional (can be disabled)
- Stored in `user_profile.reminder_enabled` and `user_profile.reminder_time`
- Uses device notification service (Firebase Cloud Messaging for mobile)
- Time picker uses device local timezone

## Testing Requirements

- Unit tests: Settings persistence, time validation
- Integration tests: Enable reminder → scheduled; disable → cancelled
- E2E tests: Set reminder time → notification fires at that time; disable → stops

## Dev Record

- Created `src/features/notifications/services/NotificationSchedulerService.ts` — `scheduleReminderNotification`, `cancelReminderNotification`, `parseReminderDeepLink`
- Extended `src/db/local-profile-storage.ts` — `ReminderPreference` type, `readReminderPreference`, `writeReminderPreference`
- Created `src/hooks/useReminderSettings.ts` — reads/writes/applies reminder preferences; schedules or cancels notifications on change
- Created `src/features/notifications/components/ReminderSettingsCard.tsx` — toggle + HH:MM time input UI
- Created `src/app/settings.tsx` — settings screen exposing `ReminderSettingsCard`
- Unit tests: `NotificationSchedulerService.test.ts` (8 tests), `useReminderSettings.test.ts` (7 tests) — all passing
- TypeScript: clean (`npx tsc --noEmit`)

## References

**FRs Covered:** FR18, FR19
**Epic:** Epic 6 - Push Reminders & Daily Re-engagement
