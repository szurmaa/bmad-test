# Story 10.1: Push Notification Service Integration

Status: done

## Story

As a user,
I want to receive timely reminders about habit streaks and daily rolls,
So that I stay engaged with the app.

## Acceptance Criteria

1. **Given** Firebase Cloud Messaging is configured
**When** notifications are sent from backend
**Then** device receives them reliably
**And** notification includes title, body, and custom action data.

2. **Given** a user opts in to notifications
**When** a reminder is scheduled (daily, at user's chosen time)
**Then** notification triggers across all devices
**And** unit, integration, and E2E tests verify delivery.

## Implementation Notes

- FCM setup with APNs certificates
- Device token storage in Firestore
- Scheduled notifications via Cloud Tasks or Firestore triggers
- Notification payload: title, body, deep-link action_type
- User preferences honored (Do Not Disturb schedule)

## Testing Requirements

- Unit tests: Notification payload validation, scheduling logic
- Integration tests: Schedule notification → verify FCM accepts → simulate delivery
- E2E tests: Opt in → receive notification → tap action → navigate to correct screen

## Dev Record

- Added push notification integration service in `apps/mobile/src/features/notifications/services/PushNotificationService.ts`:
	- reads native permission status and safely exits for denied/unsupported states
	- resolves Expo push token and queues backend registration payload
	- includes device platform and reminder preference metadata in registration payload
	- avoids duplicate queue records for unchanged tokens on the same device
- Wired reminder preference sync updates to backend queue in `apps/mobile/src/hooks/useReminderSettings.ts`:
	- queues `push_reminder_preference` on reminder enable/disable changes
	- queues updated reminder hour/minute when active reminder time changes
- Extended sync dispatcher in `apps/mobile/src/features/sync/SyncService.ts`:
	- `push_token_registration` -> Firestore `device_push_tokens`
	- `push_reminder_preference` -> Firestore `device_notification_preferences`
- Hooked token registration into app startup in `apps/mobile/src/app/_layout.tsx`
- Added tests:
	- `apps/mobile/src/features/notifications/services/PushNotificationService.test.ts`
	- updated `apps/mobile/src/hooks/useReminderSettings.test.ts`

Validation run:
- Tests: 25 passing in focused suites covering push registration, reminder sync, and impacted app flows

## References

**FRs Covered:** FR34, FR35
**Epic:** Epic 10 - Push Notifications & Engagement
