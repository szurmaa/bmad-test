# Story 5.1: Optional Post-Completion Mood Prompt

Status: in-progress

## Story

As a user,
I want an optional mood prompt after completion,
So that I can reflect quickly without friction.

## Acceptance Criteria

1. **Given** I complete today's task
**When** completion moment ends
**Then** a 1-5 mood scale prompt is displayed
**And** skip is equally prominent.

2. **Given** I submit a mood score
**When** data is saved
**Then** mood is stored locally with timestamp
**And** unit, integration, and E2E tests verify prompt and save.

## Implementation Notes

- Mood prompt appears post-celebration (after micro-celebration)
- 1-5 scale displayed (emoji or numeric)
- Skip button equal visual weight to answer buttons
- Store only once per day (on first completion)
- Stored in `mood_logs` table

## Testing Requirements

- Unit tests: Mood logging, once-per-day prompt logic, skip handling
- Component tests: Skip button accessible and prominent, mood scale visible
- E2E tests: Complete task → prompt appears → log mood or skip

## References

**FRs Covered:** FR15, FR17
**Epic:** Epic 5 - Mood Reflection & Daily Logging

## Dev Agent Record

### Status
- [x] Implementation complete
- [x] Tests passing
- [ ] Code reviewed

### Notes
- Added `MoodPrompt` component showing a 1-5 emoji scale (😔–😊) with equal-weight skip button.
- Mood prompt appears after the 1.4s completion moment animation clears, gated by `completed && !moodLogged`.
- Mood value written to `mood_logs` SQLite table via `logMoodToday` hook function.
- Store `logMood` action sets `moodLogged: true` with `moodValue` for same-day persistence via AsyncStorage.
- Added `getMoodLogForRoll` DB helper; hydration now correctly restores mood state on app restart.
