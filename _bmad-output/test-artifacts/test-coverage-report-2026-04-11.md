# Test Coverage Report and Gap Plan

Date: 2026-04-11
Epic: 14
Story: 14.1

## Scope

Coverage analysis for `apps/mobile` test suite using Jest coverage instrumentation.

## Reproducible Command

```bash
cd apps/mobile
npm test -- --coverage --coverageReporters=json-summary --coverageReporters=text-summary
```

Raw artifacts:
- `_bmad-output/test-artifacts/coverage-run.log`
- `apps/mobile/coverage/coverage-summary.json`
- `_bmad-output/test-artifacts/coverage-analysis.json`

## Coverage Summary

- Statements: 67.52%
- Lines: 68.31%
- Functions: 62.44%
- Branches: 47.41%

Threshold check (70% meaningful coverage):
- Result: Not met (line and statement coverage are below 70%)

## Critical-Path vs Peripheral Observations

Higher-confidence modules:
- `apps/mobile/src/features/analytics/AnalyticsService.ts` (lines 90.47%)
- `apps/mobile/src/features/settings/DataPrivacyService.ts` (lines 94.11%)
- `apps/mobile/src/features/sync/SyncService.ts` (lines 80.70%)

Higher-risk low-coverage modules:
- `apps/mobile/src/features/onboarding/repository/OnboardingProfileRepository.ts` (lines 0.00%)
- `apps/mobile/src/db/local-profile-storage.ts` (lines 18.42%)
- `apps/mobile/src/features/notifications/services/NotificationPermissionService.ts` (lines 19.51%)
- `apps/mobile/src/features/engagement/InAppCampaignService.ts` (lines 26.02%)
- `apps/mobile/src/db/schema.ts` (lines 43.56%, branches 8.10%)

## Test Infrastructure Finding

One suite fails during coverage runs:
- `src/features/onboarding/components/OnboardingFlowGate.test.tsx`
- Failure class: Expo runtime initialization mismatch (`globalThis.expo` EventEmitter undefined)
- Impact: Coverage command exits non-zero despite producing coverage summaries.

## Prioritized Gap Plan

1. Priority P0
- Add focused tests for `src/db/schema.ts` queueing/migrations and error handling branches.
- Add tests for `src/db/local-profile-storage.ts` read/write/fallback paths.

2. Priority P1
- Add tests for onboarding repository and permission edge cases.
- Add tests for campaign eligibility negative branches in `InAppCampaignService`.

3. Priority P1
- Stabilize `OnboardingFlowGate` suite by isolating Expo-global dependencies in test harness.
- Gate CI on successful coverage command execution, not only summary output.

4. Priority P2
- Improve branch assertions in store/hooks (`dailyRollStore`, `useReminderSettings`, `useInAppCampaigns`).

## Exit Criteria for Remediation

- Coverage command exits 0 in CI/local.
- Statements and lines reach >= 70%.
- Branch coverage reaches >= 55% with no zero-covered critical-path modules.
