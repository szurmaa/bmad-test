# Security Review and Remediation Log

Date: 2026-04-11
Epic: 14
Story: 14.4

## Scope

AI-assisted security review using dependency scanning plus targeted pattern review of application code.

## Evidence Commands

Dependency scans:
```bash
cd apps/mobile && npm audit --json > _bmad-output/test-artifacts/mobile-npm-audit.json
cd apps/backend && npm audit --json > _bmad-output/test-artifacts/backend-npm-audit.json
```

Pattern review:
```bash
rg -n "dangerouslySetInnerHTML|eval\(|new Function\(|child_process|exec\(|spawn\(" apps
```

Raw artifacts:
- `_bmad-output/test-artifacts/mobile-npm-audit.json`
- `_bmad-output/test-artifacts/backend-npm-audit.json`
- `_bmad-output/test-artifacts/mobile-audit-packages.json`
- `_bmad-output/test-artifacts/security-audit-summary.txt`

## Findings by Severity

High
1. `undici` vulnerability chain in mobile dependency graph (via Firebase stack)
- Type: Multiple advisories including websocket and smuggling-related issues.
- Affected area: `apps/mobile` dependency tree.
- Remediation: Upgrade dependency chain via Firebase/related package updates to versions pulling fixed `undici`.

Moderate
2. Firebase dependency set includes moderate vulnerabilities transitively linked to `undici`.
- Affected packages include `@firebase/auth`, `@firebase/firestore`, `@firebase/functions`, `@firebase/storage` compat and core variants.
- Remediation: Planned package refresh and lockfile update with regression tests.

Low
3. Test-tooling transitive vulnerabilities (`jest-expo` chain via `jsdom`, `http-proxy-agent`, `@tootallnate/once`).
- Scope: Primarily test/runtime tooling, still should be tracked.
- Remediation: Upgrade test stack where semver-major changes are acceptable.

Info / Code Pattern Review
4. Dynamic execution patterns were not detected in app code (`eval`, `new Function`, `dangerouslySetInnerHTML`).
- Observed process-spawn usage in `apps/mobile/scripts/container-server.mjs` is expected for container runtime orchestration.
- No direct XSS sink usage found in scanned app sources.

## Remediation Log

| ID | Finding | Severity | Owner | Action | Status |
|---|---|---|---|---|---|
| SEC-14-001 | `undici` high vulnerability chain in mobile deps | High | Developer | Upgrade Firebase/dependent packages and regenerate lockfile | Open |
| SEC-14-002 | Firebase transitive moderate vulnerabilities | Moderate | Developer | Validate upgraded dependency graph with test run and smoke checks | Open |
| SEC-14-003 | Jest toolchain low vulnerabilities | Low | QA/Developer | Plan controlled major upgrade for jest-expo path | Open |
| SEC-14-004 | Add dependency audit gate in CI | Medium | Tech Lead | Add pipeline job to fail on high/critical vulnerabilities | Open |

## Residual Risk Statement

- Residual risk is Medium-High for `apps/mobile` until high-severity dependency advisories are remediated.
- `apps/backend` currently reports zero known npm audit vulnerabilities.
