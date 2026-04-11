# Story 6.1: Reminder Scheduling and Settings

Status: backlog

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

## References

**FRs Covered:** FR18, FR19
**Epic:** Epic 6 - Push Reminders & Daily Re-engagement
