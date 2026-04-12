/**
 * E2E: Onboarding flow
 *
 * Covers:
 *   - Notification permission prompt is shown on first launch
 *   - Tapping "Not Now" dismisses the prompt and reaches the home screen
 *   - Tapping "Allow" triggers the native permission dialog; dismissing it still
 *     proceeds to the home screen (non-blocking onboarding)
 */

import { assertNotVisible, assertVisible, relaunchApp, tapById, waitForAny } from './helpers';

describe('Onboarding flow', () => {
  beforeEach(async () => {
    // Fresh app state before each test
    await relaunchApp();
  });

  it('shows the notification permission prompt on first launch', async () => {
    await assertVisible('notification-step', 20000);
  });

  it('skipping notification permission reaches the home screen', async () => {
    await assertVisible('notification-step', 20000);

    await tapById('not-now-button');

    // After skipping, either the roll button or a previously-rolled task card appears
    const reached = await waitForAny(['roll-button', 'task-reveal-card'], 20000);
    expect(['roll-button', 'task-reveal-card']).toContain(reached);
  });

  it('choosing Allow on the permission prompt still proceeds to the home screen', async () => {
    await assertVisible('notification-step', 20000);

    await tapById('allow-button');

    // On Android the system permission dialog may appear — dismiss it
    if (process.env.PLATFORM !== 'ios') {
      try {
        // UiAutomator2: accept or dismiss native dialog if present
        const allowBtn = await $('android=new UiSelector().text("Allow")');
        const isDlgVisible = await allowBtn.isDisplayed().catch(() => false);
        if (isDlgVisible) {
          await allowBtn.click();
        }
      } catch {
        // No system dialog — continue
      }
    }

    const reached = await waitForAny(['roll-button', 'task-reveal-card'], 20000);
    expect(['roll-button', 'task-reveal-card']).toContain(reached);
  });

  it('onboarding prompt is not shown again after it has been completed', async () => {
    // Skip onboarding once
    await assertVisible('notification-step', 20000);
    await tapById('not-now-button');
    await waitForAny(['roll-button', 'task-reveal-card'], 20000);

    // Relaunch simulates returning to the app
    await relaunchApp();

    // Prompt must NOT reappear
    await waitForAny(['roll-button', 'task-reveal-card'], 20000);
    await assertNotVisible('notification-step');
  });
});
