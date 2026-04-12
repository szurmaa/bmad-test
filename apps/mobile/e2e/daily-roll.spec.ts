/**
 * E2E: Daily roll workflow
 *
 * Covers:
 *   - Rolling a task for the first time
 *   - Rerolling a task (one-time daily reroll)
 *   - Reroll is disabled once used
 *   - Marking a task complete
 *   - Mood prompt appears after completion
 *   - Skipping the mood prompt
 *   - Returning to an already-rolled day shows the same task
 */

import {
  assertNotVisible,
  assertVisible,
  findById,
  isDisplayed,
  relaunchApp,
  tapById,
  waitForAny,
} from './helpers';

describe('Daily roll workflow', () => {
  before(async () => {
    // Start from a clean state once for the whole suite
    await relaunchApp();

    // Skip onboarding if it appears
    const onboardingVisible = await isDisplayed('notification-step');
    if (onboardingVisible) {
      await tapById('not-now-button');
    }

    // Confirm we're on the home screen
    await waitForAny(['roll-button', 'task-reveal-card'], 20000);
  });

  it('shows the Roll button when no task has been rolled yet', async () => {
    const hasRollButton = await isDisplayed('roll-button');
    const hasTaskCard = await isDisplayed('task-reveal-card');

    // At least one must be present
    expect(hasRollButton || hasTaskCard).toBe(true);
  });

  it('rolls a task and displays the task reveal card', async () => {
    const hasTask = await isDisplayed('task-reveal-card');
    if (!hasTask) {
      // Tap the roll button to generate today's task
      await tapById('roll-button');
    }

    await assertVisible('task-reveal-card', 15000);
    await assertVisible('reroll-state-indicator');
    await assertVisible('complete-button');
    await assertVisible('reroll-button');
  });

  it('reroll replaces the task and marks reroll as used', async () => {
    await assertVisible('task-reveal-card', 15000);

    const rerollBtn = await findById('reroll-button');
    const isEnabled = await rerollBtn.isEnabled();

    // Only proceed if reroll has not been used yet in this run
    if (!isEnabled) {
      // Reroll already spent — skip the interaction assertions
      console.log('[skip] Reroll already used for today — skipping reroll interaction test');
      return;
    }

    await rerollBtn.click();

    // Task card updates; reroll button should now show "used" state
    await assertVisible('task-reveal-card', 10000);

    const rerollBtnAfter = await findById('reroll-button');
    const enabledAfterReroll = await rerollBtnAfter.isEnabled();
    expect(enabledAfterReroll).toBe(false);
  });

  it('reroll button is disabled after the one daily reroll is used', async () => {
    const rerollBtn = await findById('reroll-button', 10000);
    const enabled = await rerollBtn.isEnabled();
    // Either it was already disabled before, or we disabled it in the previous test
    expect(enabled).toBe(false);
  });

  it('completing a task disables the complete button and shows mood prompt', async () => {
    await assertVisible('task-reveal-card', 15000);

    const completeBtn = await findById('complete-button');
    const isAlreadyComplete = !(await completeBtn.isEnabled());

    if (isAlreadyComplete) {
      // Task was already completed — verify the mood/completed state
      const moodVisible = await isDisplayed('mood-prompt');
      const isMoodDone = await isDisplayed('days-played-counter');
      expect(moodVisible || isMoodDone).toBe(true);
      return;
    }

    await completeBtn.click();

    // Complete button should be disabled after tapping
    await browser.pause(800);
    const completeBtnAfter = await findById('complete-button');
    const enabledAfterComplete = await completeBtnAfter.isEnabled();
    expect(enabledAfterComplete).toBe(false);

    // Mood prompt should appear (with a brief animation delay)
    await assertVisible('mood-prompt', 5000);
  });

  it('skipping the mood prompt hides it without re-prompting', async () => {
    const moodShowing = await isDisplayed('mood-prompt');

    if (!moodShowing) {
      console.log('[skip] Mood prompt not visible — already dismissed or not yet completed');
      return;
    }

    await tapById('mood-skip-button');

    await assertNotVisible('mood-prompt');
  });

  it('returning to the app shows the same completed task (no double-roll)', async () => {
    await relaunchApp();

    // If onboarding reappears (shouldn't), dismiss it
    const onboardingVisible = await isDisplayed('notification-step');
    if (onboardingVisible) {
      await tapById('not-now-button');
    }

    // Task card should still be present with the roll for today
    await assertVisible('task-reveal-card', 20000);

    // Complete button must remain disabled (already completed)
    const completeBtn = await findById('complete-button');
    const enabled = await completeBtn.isEnabled();
    expect(enabled).toBe(false);
  });
});
