# Performance Testing Report

Date: 2026-04-11
Epic: 14
Story: 14.2

## Scope

Performance profiling of containerized web entrypoint and readiness stack behavior.

## Reproducible Commands

```bash
cd /Users/aszurma/Desktop/bmad
docker compose --profile dev --env-file docker/compose.dev.env up -d --build
node apps/mobile/scripts/run-performance-audit.mjs
```

Raw artifacts:
- `_bmad-output/test-artifacts/performance-metrics.json`
- `apps/mobile/scripts/run-performance-audit.mjs`

## Captured Metrics

From `performance-metrics.json`:
- HTTP status: 502 (Bad Gateway)
- Navigation-to-load: 11 ms
- Synthetic interaction latency: 158 ms
- DOMContentLoaded: 8.7 ms
- Load event: 9.2 ms
- JS heap used: 1,013,624 bytes
- Layout duration: 0.010881 s

## Key Bottleneck and Severity

1. Critical
- Bottleneck: Frontend root route (`/`) is not renderable in the current containerized web path.
- Evidence: Mobile gateway returns `{"error":"upstream_unavailable"}` and upstream Expo logs show bundling failure.
- Root cause: `expo-sqlite` web worker cannot resolve `./wa-sqlite/wa-sqlite.wasm`.
- Effect: User-facing performance metrics for real journeys are blocked; measured metrics currently describe error-page behavior rather than core product flow.

2. Medium
- Bottleneck: Mobile runtime startup is tightly coupled to Expo dev-server behavior in container mode.
- Effect: Higher variability and non-deterministic response behavior under audit tooling.

## Recommendations and Trackable Follow-ups

1. P0: Unblock web render path
- Add a web-compatible storage strategy or conditional import boundary to avoid `expo-sqlite` web wasm resolution failure on web runtime path.
- Confirm `/` returns 200 before any performance gate.

2. P1: Add explicit performance precondition check
- In performance script, fail fast with a dedicated "application-not-renderable" status when HTTP status is >= 500.

3. P1: Expand metric set after render-path fix
- Re-run metrics on real journeys (onboarding shell, roll flow, settings) and include percentile-based interaction latency.

## Residual Risk

- High until render-path blocker is fixed. Current profile cannot claim acceptable user-flow responsiveness because meaningful page rendering is unavailable in audited environment.
