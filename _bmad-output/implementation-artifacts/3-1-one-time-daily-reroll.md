# Story 3.1: One-Time Daily Reroll

Status: in-progress


## Story

As a user,
I want one reroll per day,
So that I can replace one unsuitable task without endless retries.

## Acceptance Criteria

1. **Given** I rolled today and reroll is unused
**When** I tap Reroll
**Then** a different task is selected
**And** reroll state is marked used for the day.

2. **Given** reroll is already used today
**When** I tap Reroll again
**Then** no new task is assigned
**And** unit, integration, and E2E tests verify one-time enforcement.

## Implementation Notes

- Reroll stored in `daily_rolls.reroll_used` flag
- Once per day: resets at midnight local device time
- If all tasks paused/deleted, handle gracefully (show error or fallback task)
- Button disabled if reroll already used

## Testing Requirements

- Unit tests: Reroll eligibility (once/day), midnight reset, edge cases
- Integration tests: Reroll → new task; attempt second reroll → fails
- E2E tests: Reroll day 1; next day reroll available again

## References

**FRs Covered:** FR6, FR7
**Epic:** Epic 3 - Reroll Constraint & Task Customization

## Dev Agent Record

### Status
- [x] Implementation complete
- [ ] Tests passing
- [ ] Code reviewed

### Notes
- Added one-time reroll behavior to the mobile daily roll flow with state persisted through `daily_rolls.reroll_used`.
- Reroll now selects a different task than the original one when an alternate active task exists.
- The reroll action is blocked after one use per day and also blocked after task completion.
- Automated Jest execution remains limited by existing Expo test-runtime infrastructure issues in this repo.
