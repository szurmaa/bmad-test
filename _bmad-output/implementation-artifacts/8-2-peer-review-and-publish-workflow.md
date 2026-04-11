# Story 8.2: Peer Review and Publish Workflow

Status: done

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

## Dev Record

- Added review workflow persistence in `apps/mobile/src/db/schema.ts`:
	- `task_review_events` table (status history + reviewer metadata)
	- `app_settings` table usage for `task_catalog_version`
	- New APIs: `createTaskReviewEvent`, `getLatestTaskReviewEvent`, `getTaskCatalogVersion`, `setTaskCatalogVersion`
- Added workflow state machine service in `apps/mobile/src/features/admin-review-workflow/ReviewPublishService.ts`:
	- Allowed transitions: `draft -> in_review -> approved/rejected -> published`
	- API: `submitTaskForReview`, `approveTaskReview`, `rejectTaskReview`, `publishApprovedTask`
	- Publish action bumps `task_catalog_version` for client refresh detection
- Added unit tests in `apps/mobile/src/features/admin-review-workflow/ReviewPublishService.test.ts` (6 tests)
- Validation run:
	- TypeScript: clean (`npx tsc --noEmit`)
	- Tests: 12 passing (`ReviewPublishService`, `TaskCatalogService`)
- Added mobile task-catalog hot refresh service in `apps/mobile/src/features/task-catalog-refresh/TaskCatalogRefreshService.ts`:
	- Reads remote `app_meta/task_catalog` version from Firestore
	- Imports remote `tasks` collection into local catalog via `upsertTaskCatalogItem`
	- Updates local version with `setTaskCatalogVersion`
- Wired refresh execution in `apps/mobile/src/app/_layout.tsx`:
	- Runs on app mount and app foreground (`AppState` active)
	- Enables propagation without app restart
- Expanded admin peer review UI in `apps/mobile/src/app/admin-tasks.tsx`:
	- Submit for review (draft/rejected)
	- Approve / reject (in_review) with reviewer ID and notes
	- Publish (approved) with catalog version bump notice
	- Displays current review status + latest reviewer metadata
- Added unit tests `apps/mobile/src/features/task-catalog-refresh/TaskCatalogRefreshService.test.ts` (2 tests)
- Validation run update:
	- TypeScript: clean (`npx tsc --noEmit`)
	- Tests: 14 passing (`TaskCatalogRefreshService`, `ReviewPublishService`, `TaskCatalogService`)

## References

**FRs Covered:** FR28, FR30
**Epic:** Epic 8 - Admin Task Library Management & Curation
