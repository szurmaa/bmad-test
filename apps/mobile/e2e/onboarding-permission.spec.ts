import { test, expect, Page } from '@playwright/test';

test('notification permission step is non-blocking when skipped', async ({ page }: { page: Page }) => {
  await page.goto('/');
  await page.evaluate(() => {
    localStorage.clear();
  });
  await page.reload();

  await expect(page.getByTestId('notification-step')).toBeVisible();
  await page.getByTestId('not-now-button').click();
  await expect(page.getByTestId('roll-button')).toBeVisible();
  await expect(page.getByText('Roll for Today')).toBeVisible();
});

test('notification permission step is non-blocking when allow is chosen', async ({ page }: { page: Page }) => {
  await page.goto('/');
  await page.evaluate(() => {
    localStorage.clear();
  });
  await page.reload();

  await expect(page.getByTestId('notification-step')).toBeVisible();
  await page.getByTestId('allow-button').click();
  await expect(page.getByTestId('roll-button')).toBeVisible();
  await expect(page.getByText('Roll for Today')).toBeVisible();
});
