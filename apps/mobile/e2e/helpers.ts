/**
 * Shared helpers for WDIO mobile E2E tests.
 *
 * All locators use the `accessibility id` (testID) strategy, which maps directly
 * to `testID` props in React Native on both Android and iOS:
 *   - Android → content-description
 *   - iOS      → accessibilityIdentifier
 */

/** Wait for an element by testID, throw if it never appears */
export async function findById(testId: string, timeout = 15000) {
  const el = await $(`~${testId}`);
  await el.waitForDisplayed({ timeout, timeoutMsg: `Element '${testId}' not visible after ${timeout}ms` });
  return el;
}

/** Find element by testID without waiting */
export async function $id(testId: string) {
  return $(`~${testId}`);
}

/** Wait for an element by testID and tap it */
export async function tapById(testId: string, timeout = 15000) {
  const el = await findById(testId, timeout);
  await el.click();
}

/** Check whether an element by testID is currently displayed (no throw) */
export async function isDisplayed(testId: string): Promise<boolean> {
  try {
    const el = await $(`~${testId}`);
    return el.isDisplayed();
  } catch {
    return false;
  }
}

/** Wait for either of two elements to be visible, returns whichever appeared */
export async function waitForAny(testIds: string[], timeout = 20000) {
  const deadline = Date.now() + timeout;
  while (Date.now() < deadline) {
    for (const id of testIds) {
      if (await isDisplayed(id)) {
        return id;
      }
    }
    await browser.pause(500);
  }
  throw new Error(`None of [${testIds.join(', ')}] became visible within ${timeout}ms`);
}

/** Assert an element is visible */
export async function assertVisible(testId: string, timeout = 15000) {
  const el = await findById(testId, timeout);
  const displayed = await el.isDisplayed();
  if (!displayed) {
    throw new Error(`Expected '${testId}' to be visible but it was not`);
  }
  return el;
}

/** Assert an element is NOT visible */
export async function assertNotVisible(testId: string) {
  const el = await $(`~${testId}`);
  const displayed = await el.isDisplayed().catch(() => false);
  if (displayed) {
    throw new Error(`Expected '${testId}' to NOT be visible but it was`);
  }
}

/** Terminate and relaunch the app to reset its state */
export async function relaunchApp() {
  await driver.terminateApp(
    process.env.PLATFORM === 'ios'
      ? 'org.reactjs.native.example.habitdice'
      : 'host.exp.exponent'
  );
  await browser.pause(500);
  await driver.activateApp(
    process.env.PLATFORM === 'ios'
      ? 'org.reactjs.native.example.habitdice'
      : 'host.exp.exponent'
  );
}

/** Scroll down on the current screen (useful to reveal offscreen elements) */
export async function scrollDown() {
  const { width, height } = await driver.getWindowSize();
  await driver.touchAction([
    { action: 'press', x: width / 2, y: height * 0.7 },
    { action: 'moveTo', x: width / 2, y: height * 0.3 },
    { action: 'release' },
  ]);
}
