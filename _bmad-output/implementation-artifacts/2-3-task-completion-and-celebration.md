# Story 2.3: Task Completion and Celebration

Status: in-progress

## Story

As a user,
I want to mark my daily task complete and receive encouragement,
So that I feel positive reinforcement.

## Acceptance Criteria

1. **Given** I have an active daily task
**When** I tap Complete
**Then** completion is stored locally
**And** a micro-celebration appears for 1-2 seconds.

2. **Given** completion is recorded
**When** I return later that day
**Then** the task remains marked completed
**And** unit, integration, and E2E tests validate completion persistence and feedback.

## Implementation Notes

- Micro-celebration: brief visual feedback (confetti, badge, or brief animation)
- Must respect `prefers-reduced-motion`
- Completion stored in SQLite: `task_completions` table
- Triggers days-played counter increment (Epic 4)
- Triggers optional mood prompt (Epic 5)
- No blocking states or error states

## Testing Requirements

- Unit tests: Completion persistence, micro-celebration logic, motion preference handling
- Component tests: Celebration animation skips if motion reduced, completion button accessible
- E2E tests: Complete task → celebration shown → persists; later reopen → completion persisted

##References

**FRs Covered:** FR8, FR9
**Epic:** Epic 2 - Core Daily Roll & Task Execution
**Architecture:** [See architecture.md](../planning-artifacts/architecture.md)

## Dev Agent Record

### Status
- [x] Implementation complete
- [ ] Tests passing
- [ ] Code reviewed

### Notes
- Added task completion persistence through the daily roll table update path and wired the complete action into the home shell.
- Added a lightweight completion moment overlay that respects reduced-motion settings.
- Completion state now persists across same-day returns and updates the task CTA accordingly.
- Targeted Jest execution is still blocked by repo-level Expo/Jest runtime issues unrelated to the new completion flow.
