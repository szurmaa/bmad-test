# Story 6.2: Notification Deep Link to Roll

Status: backlog

## Story

As a user,
I want reminder taps to open directly to the roll screen,
So that I can act quickly.

## Acceptance Criteria

1. **Given** a reminder is delivered
**When** I tap the notification
**Then** the app opens to roll screen context
**And** daily state is correctly loaded.

2. **Given** app is terminated
**When** notification opens the app
**Then** deep-link routing still lands at roll
**And** unit, integration, and E2E tests verify cold-start deep-link behavior.

## Implementation Notes

- Deep-link URI scheme: `habit-dice://roll`
- Cold-start handling: launch app and navigate to roll screen
- Preserves roll state (today's task, days-played count, etc.)
- Notification payload includes deep-link target

## Testing Requirements

- Unit tests: Deep-link URI generation and parsing
- Integration tests: Notification tap → app navigates to roll
- E2E tests: From terminated state, notification tap → roll screen loads with correct state

## References

**FRs Covered:** FR20
**Epic:** Epic 6 - Push Reminders & Daily Re-engagement
