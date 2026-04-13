# Test Automation Summary

## Framework
**WebdriverIO 9 + Appium 2** — real-device / emulator mobile E2E tests.
- Android: UiAutomator2 driver
- iOS: XCUITest driver
- All locators use `accessibility id` (React Native `testID`)

## Setup Prerequisites
```bash
# Install Appium drivers (run once)
npx appium driver install uiautomator2
npx appium driver install xcuitest

# Start Appium server (separate terminal)
npx appium

# Run tests
npm run test:e2e:android   # Android emulator/device
npm run test:e2e:ios       # iOS simulator/device
```

## Generated Tests

### API Tests
- [ ] No API E2E tests added in this pass (mobile UI flow focus)

### E2E Tests
- [x] `apps/mobile/e2e/onboarding.spec.ts` — Notification permission prompt, skip/allow paths, no re-prompt after completion
- [x] `apps/mobile/e2e/daily-roll.spec.ts` — Roll a task, reroll (one-time), complete task, mood prompt skip, task persists on relaunch
- [x] `apps/mobile/e2e/settings.spec.ts` — Settings screen reachable, reminder toggle, appearance options
- [x] `apps/mobile/e2e/helpers.ts` — Shared helpers: `findById`, `tapById`, `isDisplayed`, `waitForAny`, `relaunchApp`, `scrollDown`

## Coverage
- Onboarding: skip path, allow path, re-launch persistence
- Daily roll: first roll, reroll enforcement, complete, mood prompt, persistence across relaunches
- Settings: navigation, reminder toggle, appearance picker
- API endpoints: not covered in this pass

## Config
- `apps/mobile/wdio.config.ts` — WDIO config with Appium service, Android/iOS capability switching via `PLATFORM` env var

## Next Steps
- Add admin task catalog E2E coverage (`admin-tasks.tsx`: CRUD/review/publish workflow)
- Add offline scenario: toggle airplane mode, verify offline banner → perform action → reconnect → verify sync
- Wire into CI: start Appium server, set `ANDROID_APP_PATH` / `IOS_APP_PATH` to pre-built `.apk`/`.app`
