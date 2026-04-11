# Story 13.1: Create Dockerfiles and Health Endpoints

Status: done

## Story

As a developer,
I want production-ready Dockerfiles and health endpoints,
So that frontend and backend services can be built and monitored reliably.

## Acceptance Criteria

1. **Given** frontend and backend services
**When** Dockerfiles are implemented
**Then** each image uses multi-stage builds
**And** containers run as non-root users.

2. **Given** container observability needs
**When** services are running
**Then** health check endpoints respond successfully
**And** container health status can be consumed by orchestration.

## Implementation Notes

- Build optimized images for mobile-web/frontend and backend service
- Add liveness/readiness health routes as appropriate

## Testing Requirements

- Build test for both Dockerfiles
- Endpoint checks for health routes in running containers

## References

**Requested Step:** Step 3 - Dockerfiles + Health Checks
**Epic:** Epic 13 - Docker Compose Containerization

## Implementation Summary

- Added a backend service at `apps/backend` with `/healthz` and `/readyz` endpoints.
- Added multi-stage, non-root Dockerfile for backend service: `apps/backend/Dockerfile`.
- Added multi-stage, non-root Dockerfile for mobile frontend service: `apps/mobile/Dockerfile`.
- Added mobile container gateway with orchestration-friendly health endpoints: `apps/mobile/scripts/container-server.mjs`.
- Added Docker context exclusions: `apps/backend/.dockerignore`, `apps/mobile/.dockerignore`.

## Verification Evidence

- Backend endpoint tests passed via `npm test` in `apps/backend`.
- Backend image build passed: `docker build -f apps/backend/Dockerfile ...`.
- Mobile image build passed: `docker build -f apps/mobile/Dockerfile ...`.
- Runtime probe checks passed for backend and mobile containers:
	- `GET /healthz` returned 200.
	- `GET /readyz` returned 200.
