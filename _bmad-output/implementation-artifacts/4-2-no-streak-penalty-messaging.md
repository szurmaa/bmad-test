# Story 4.2: No Streak-Penalty Messaging

Status: done

## Story

As a user,
I want progress messaging to avoid shame or streak-loss language,
So that missed days do not feel punitive.

## Acceptance Criteria

1. **Given** I return after missed days
**When** I view home
**Then** counter remains unchanged from last play day
**And** no broken-streak language is shown.

2. **Given** I play again after gaps
**When** I roll today
**Then** counter increments from prior value
**And** unit, integration, and E2E tests verify no decrement behavior.

## Implementation Notes

- Counter displays only positive numbers, never resets
- No "Streak broken" or "You missed X days" messaging
- Simply resume from where left off
- Days-played is cumulative and never decreases
- Neutral, encouraging tone throughout

## Testing Requirements

- Unit tests: No decrement logic, counter persistence
- Component tests: Verify messaging is non-penalizing
- E2E tests: Miss days → counter doesn't reset; return → increments from prior

## References

**FRs Covered:** FR13, FR14
**Epic:** Epic 4 - Days-Played Counter & Cumulative Progress

## Dev Agent Record

### Status
- [x] Implementation complete
- [x] Tests passing
- [ ] Code reviewed

### Notes
- Reworked progress messaging to use additive language such as `days played` and `You've shown up X times.`
- Avoided any missed-day or broken-streak language in the current home shell experience.
- Added test assertions to guard against streak-oriented wording in the Epic 4 UI path.
- Jest test infrastructure repaired; focused test suite passes.
