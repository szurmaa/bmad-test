# Story 2.2: Task Reveal Experience

Status: in-progress

## Story

As a user,
I want to see category and full task details after rolling,
So that I understand what to do next.

## Acceptance Criteria

1. **Given** a roll has completed
**When** task reveal is shown
**Then** category, task description, and effort indicator are visible
**And** the layout is screen-reader friendly.

2. **Given** reduced-motion is enabled
**When** task reveal runs
**Then** animation is minimized appropriately
**And** unit, integration, and E2E tests verify reveal content and accessibility.

## Implementation Notes

- Task reveal can have animation (< 1.5s target per NFRs) but respects `prefers-reduced-motion`
- Displays: task name, category (Mind/Body/Life/Work), description, effort badge
- Semantic HTML for screen reader compatibility
- No animation artifacts if motion is reduced

## Testing Requirements

- Unit tests: `prefers-reduced-motion` media query handling, render logic
- Component tests: VoiceOver/TalkBack announces all fields, animation respects motion preference
- E2E tests: Perform roll → task details visible; enable reduced motion → animation skipped

## References

**FRs Covered:** FR5
**Epic:** Epic 2 - Core Daily Roll & Task Execution
**Architecture:** [See architecture.md](../planning-artifacts/architecture.md)

## Dev Agent Record

### Status
- [x] Implementation complete
- [x] Tests passing
- [ ] Code reviewed

### Notes
- Added a dedicated task reveal card with category badge, description, and effort badge.
- Added a dice roll interaction that respects reduced-motion preferences for reveal animation behavior.
- Hooked the reveal state into the existing home shell so task details are visible after the daily roll and after app relaunch.
- Jest test infrastructure repaired; focused test suite passes.
