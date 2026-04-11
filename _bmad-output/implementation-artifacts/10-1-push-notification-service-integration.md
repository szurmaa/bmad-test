# Story 10.1: Push Notification Service Integration

Status: backlog

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

## References

**FRs Covered:** FR34, FR35
**Epic:** Epic 10 - Push Notifications & Engagement
