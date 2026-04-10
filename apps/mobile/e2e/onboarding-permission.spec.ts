const { test, expect } = require('@playwright/test');

test('notification permission step is non-blocking when skipped', async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => {
    localStorage.clear();
  });
  await page.reload();

  await expect(page.getByTestId('notification-step')).toBeVisible();
  await page.getByTestId('not-now-button').click();
  await expect(page.getByTestId('app-entry-card')).toBeVisible();
  await expect(page.getByText('Your reminder choice is saved.')).toBeVisible();
});

test('notification permission step is non-blocking when allow is chosen', async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => {
    localStorage.clear();
  });
  await page.reload();

  await expect(page.getByTestId('notification-step')).toBeVisible();
  await page.getByTestId('allow-button').click();
  await expect(page.getByTestId('app-entry-card')).toBeVisible();
  await expect(page.getByText('Your reminder choice is saved.')).toBeVisible();
});
