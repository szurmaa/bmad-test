# Docker Compose Profiles

## Profiles

- `dev`: local development defaults
- `test`: isolated test stack with alternate host ports

## Commands

Start development profile:

```bash
docker compose --profile dev --env-file docker/compose.dev.env up -d --build
```

Start test profile:

```bash
docker compose --profile test --env-file docker/compose.test.env up -d --build
```

Check logs:

```bash
docker compose --profile dev --env-file docker/compose.dev.env logs --tail 100
```

Stop and remove stack:

```bash
docker compose --profile dev --env-file docker/compose.dev.env down -v
```

## Health Endpoints

- Backend: `/healthz`, `/readyz`
- Mobile web gateway: `/healthz`, `/readyz`
