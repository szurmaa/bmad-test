# Story 13.2: Orchestrate Services with Docker Compose

Status: done

## Story

As a development team,
I want Docker Compose orchestration for the application stack,
So that local and test environments are reproducible.

## Acceptance Criteria

1. **Given** containerized services
**When** `docker compose up` runs
**Then** application services (and database if needed) start with proper networking
**And** logs are accessible via `docker compose logs`.

2. **Given** multiple runtime contexts
**When** compose profiles/env configuration are defined
**Then** dev/test environments can be switched via profiles
**And** environment variables are applied correctly.

## Implementation Notes

- Add compose file with service dependencies and health-aware startup
- Configure volume mounts for local development where needed

## Testing Requirements

- Compose boot test for dev profile
- Compose boot test for test profile

## References

**Requested Step:** Step 3 - Docker Compose + Environment Config
**Epic:** Epic 13 - Docker Compose Containerization

## Implementation Summary

- Added stack orchestration file: `docker-compose.yml`.
- Added profile/env switching inputs:
	- `docker/compose.dev.env`
	- `docker/compose.test.env`
- Added shared and profile-specific service env files:
	- `docker/env/common.env`
	- `docker/env/dev.env`
	- `docker/env/test.env`
- Added compose usage documentation: `docker/README.md`.

## Verification Evidence

- Dev profile boot test passed:
	- `docker compose --profile dev --env-file docker/compose.dev.env up -d --build`
	- Service health endpoints reachable on mapped ports.
	- `docker compose logs` returned service logs.
- Test profile boot test passed:
	- `docker compose --profile test --env-file docker/compose.test.env up -d --build`
	- Service health endpoints reachable on profile-specific mapped ports.
	- Stack tear-down succeeded with `docker compose ... down -v`.
