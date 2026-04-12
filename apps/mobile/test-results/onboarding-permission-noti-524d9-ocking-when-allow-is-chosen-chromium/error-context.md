# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: onboarding-permission.spec.ts >> notification permission step is non-blocking when allow is chosen
- Location: e2e/onboarding-permission.spec.ts:16:5

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: getByTestId('notification-step')
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for getByTestId('notification-step')

```

# Page snapshot

```yaml
- generic [ref=e7]:
  - progressbar [ref=e8]:
    - img [ref=e10]
  - generic [ref=e13]: Loading your first step...
```

# Test source

```ts
  1  | import { test, expect, Page } from '@playwright/test';
  2  | 
  3  | test('notification permission step is non-blocking when skipped', async ({ page }: { page: Page }) => {
  4  |   await page.goto('/');
  5  |   await page.evaluate(() => {
  6  |     localStorage.clear();
  7  |   });
  8  |   await page.reload();
  9  | 
  10 |   await expect(page.getByTestId('notification-step')).toBeVisible();
  11 |   await page.getByTestId('not-now-button').click();
  12 |   await expect(page.getByTestId('roll-button')).toBeVisible();
  13 |   await expect(page.getByText('Roll for Today')).toBeVisible();
  14 | });
  15 | 
  16 | test('notification permission step is non-blocking when allow is chosen', async ({ page }: { page: Page }) => {
  17 |   await page.goto('/');
  18 |   await page.evaluate(() => {
  19 |     localStorage.clear();
  20 |   });
  21 |   await page.reload();
  22 | 
> 23 |   await expect(page.getByTestId('notification-step')).toBeVisible();
     |                                                       ^ Error: expect(locator).toBeVisible() failed
  24 |   await page.getByTestId('allow-button').click();
  25 |   await expect(page.getByTestId('roll-button')).toBeVisible();
  26 |   await expect(page.getByText('Roll for Today')).toBeVisible();
  27 | });
  28 | 
```