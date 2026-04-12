/**
 * E2E: Settings screen
 *
 * Covers:
 *   - Settings screen is reachable from the home screen
 *   - Reminder toggle exists and is interactive
 *   - Appearance options are present
 */

import { assertVisible, isDisplayed, tapById } from './helpers';

describe('Settings screen', () => {
  before(async () => {
    // Dismiss onboarding if present
    const onboardingVisible = await isDisplayed('notification-step');
    if (onboardingVisible) {
      await tapById('not-now-button');
    }
  });

  it('renders the reminder settings card', async () => {
    // Navigate to settings via the tab bar (label-based for native accessibility)
    const settingsTab = await $('~Settings');
    await settingsTab.waitForDisplayed({ timeout: 10000 });
    await settingsTab.click();

    await assertVisible('reminder-settings-card', 10000);
  });

  it('reminder toggle is tappable', async () => {
    await assertVisible('reminder-toggle', 10000);
    await tapById('reminder-toggle');
    // Toggle state change — just verify no crash; state assertions are in unit tests
    await assertVisible('reminder-toggle', 5000);
  });

  it('appearance options are displayed', async () => {
    await assertVisible('appearance-light', 10000);
    await assertVisible('appearance-dark');
    await assertVisible('appearance-system');
  });
});
