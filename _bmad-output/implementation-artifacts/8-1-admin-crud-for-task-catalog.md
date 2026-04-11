# Story 8.1: Admin CRUD for Task Catalog

Status: backlog

## Story

As an internal curator,
I want to create, edit, and deactivate tasks,
So that the library remains fresh and relevant.

## Acceptance Criteria

1. **Given** I am in the admin tool
**When** I create or edit a task
**Then** category, effort, and active state are required fields
**And** validation errors are explicit.

2. **Given** I deactivate a task
**When** changes are published
**Then** task is removed from active roll pool but retained in analytics
**And** unit, integration, and E2E tests verify CRUD and status behavior.

## Implementation Notes

- Admin web app (separate from mobile)
- Task fields: name, description, category (Mind/Body/Life/Work), effort, active state
- Deactivation: marks inactive but preserves data for analytics
- Firestore collection: `tasks`
- Publishing updates task version for client-side hot-reload

## Testing Requirements

- Unit tests: CRUD operations, validation logic, status transitions
- Integration tests: Create task → persisted; deactivate → removed from active pool
- E2E tests (admin): Create task → edit → publish → appears/disappears from rolls

## References

**FRs Covered:** FR26, FR27, FR29
**Epic:** Epic 8 - Admin Task Library Management & Curation
