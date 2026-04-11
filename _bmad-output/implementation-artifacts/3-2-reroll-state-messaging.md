# Story 3.2: Reroll State Messaging

Status: done


## Story

As a user,
I want clear reroll availability messaging,
So that I understand the rule without penalty framing.

## Acceptance Criteria

1. **Given** reroll is available
**When** the task screen loads
**Then** UI shows reroll is available
**And** reset timing is clear.

2. **Given** reroll was used
**When** the screen reloads
**Then** UI states reroll resets tomorrow with neutral copy
**And** unit, integration, and E2E tests verify message states.

## Implementation Notes

- Button labels: "Reroll (1 left)" when available; "Reroll used today" when used
- No penalty framing ("You lost your chance...") - use neutral language
- Consider tooltip: "Available again at midnight local time"
- Accessible labels for screen readers

## Testing Requirements

- Unit tests: Message generation based on state
- Component tests: Labels announce correctly via screen reader
- E2E tests: Verify message states in both conditions

## References

**FRs Covered:** FR6, FR7
**Epic:** Epic 3 - Reroll Constraint & Task Customization

## Dev Agent Record

### Status
- [x] Implementation complete
- [x] Tests passing
- [ ] Code reviewed

### Notes
- Added a dedicated reroll state indicator with neutral copy for both available and used states.
- Added a reroll CTA that shows `Reroll (1 left)` when available and `Reroll used today` after use.
- Messaging avoids penalty framing and clearly communicates `Ready again tomorrow.` after the reroll is spent.
- Jest test infrastructure repaired; focused test suite passes.
