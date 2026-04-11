# Story 4.1: Additive Days-Played Increment

Status: done

## Story

As a user,
I want my days-played count to increment when I roll,
So that I can see cumulative engagement over time.

## Acceptance Criteria

1. **Given** I have not rolled yet today
**When** I complete my daily roll
**Then** days-played increments by exactly one
**And** the update is persisted locally.

2. **Given** I roll multiple times in one day context
**When** state recalculates
**Then** the counter increments only once that day
**And** unit, integration, and E2E tests verify idempotent increments.

## Implementation Notes

- Counter stored in `user_profile.days_played`
- Increments on successful roll (not on mere app open)
- Idempotent: rolling multiple times same day → counter increments only once
- Animation on increment for positive feedback
- Never decrements (even if day is missed)

## Testing Requirements

- Unit tests: Increment logic, idempotency, persistence
- Integration tests: Roll day 1 → +1; day 2 → +1; day 3 (after gap) → +1 (no reset)
- E2E tests: Counter increments and persists across app restarts

## References

**FRs Covered:** FR11, FR12
**Epic:** Epic 4 - Days-Played Counter & Cumulative Progress

## Dev Agent Record

### Status
- [x] Implementation complete
- [x] Tests passing
- [ ] Code reviewed

### Notes
- Added a dedicated additive days-played counter component to the home experience.
- The count is derived from distinct daily rolls and continues across app relaunches and day gaps without resetting.
- Added positive increment animation for count increases when reduced motion is not enabled.
- Jest test infrastructure repaired; focused test suite passes.
