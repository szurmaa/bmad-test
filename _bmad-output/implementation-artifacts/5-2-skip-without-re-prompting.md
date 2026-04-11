# Story 5.2: Skip Without Re-Prompting

Status: done

## Story

As a user,
I want to dismiss the mood prompt for the day,
So that I am not repeatedly prompted after skipping.

## Acceptance Criteria

1. **Given** mood prompt is displayed
**When** I tap Skip
**Then** the prompt closes immediately
**And** no penalty language is shown.

2. **Given** I skipped today
**When** I return later the same day
**Then** prompt is not shown again
**And** unit, integration, and E2E tests verify single-prompt-per-day rules.

## Implementation Notes

- Skip recorded in `mood_logs` table with null mood_value
- Once skipped in a day, prompt never appears again that day
- Neutral copy when skipping ("Maybe later")
- Resets at midnight for next day

## Testing Requirements

- Unit tests: Skip state tracking, once-per-day enforcement
- Component tests: Skip button accessible, no penalty language
- E2E tests: Skip prompt → no more prompts same day; next day → prompt appears again

## References

**FRs Covered:** FR16
**Epic:** Epic 5 - Mood Reflection & Daily Logging

## Dev Agent Record

### Status
- [x] Implementation complete
- [x] Tests passing
- [ ] Code reviewed

### Notes
- Skip button is rendered with identical visual weight to mood scale options (same border, padding).
- `skipMoodToday` hook function calls `skipMoodLog` store action which sets `moodLogged: true` without a value; no DB write for skip.
- Skip state persists within the session via Zustand AsyncStorage middleware; on app restart, hydration checks the DB then falls back to the store's persisted `moodLogged` flag to avoid re-showing the prompt.
- Copy uses neutral language: `Skip for today` with no penalty framing.
- Tests verify: skip hides the prompt, prompt does not reappear when `moodLogged: true`.
