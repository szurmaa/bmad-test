# Story 8.2: Peer Review and Publish Workflow

Status: backlog

## Story

As an internal curator,
I want tasks to pass peer review before activation,
So that quality and consistency are maintained.

## Acceptance Criteria

1. **Given** a draft task is submitted
**When** reviewer approves
**Then** task becomes publishable to active pool
**And** audit metadata records reviewer and timestamp.

2. **Given** a task is published
**When** mobile apps refresh library version
**Then** updates are available without app restart
**And** unit, integration, and E2E tests verify review and propagation flow.

## Implementation Notes

- Draft → Review → Published workflow
- Peer review UI: approve/reject with comments
- Audit log: who reviewed, when, any notes
- Mobile apps detect version change and reload task library
- No app restart required (hot-reload from Firestore)

## Testing Requirements

- Unit tests: Workflow state transitions, audit logging
- Integration tests: Submit draft → review → publish → mobile sees update
- E2E tests (admin): Create task → submit for review → reviewer approves → task available on mobile

## References

**FRs Covered:** FR28, FR30
**Epic:** Epic 8 - Admin Task Library Management & Curation
