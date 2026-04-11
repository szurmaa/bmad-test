# Story 5.2: Skip Without Re-Prompting

Status: backlog

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
